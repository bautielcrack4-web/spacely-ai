import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Move initialization inside handler to avoid build-time errors
export const maxDuration = 60; // Allow 60 seconds (max for Hobby)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    );

    try {
        const { image, prompt } = await request.json();

        // 1. Check User
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            console.error("Auth Error in API:", authError);
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!image || !prompt) {
            return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
        }

        // 2. Call Replicate (p-image-edit)
        console.log("Calling p-image-edit for Magic Edit...");
        console.log("Prompt:", prompt);

        const QUALITY_SUFFIX = ", photorealistic, 8k, highly detailed, architectural photography";
        const NEGATIVE_PROMPT = "text, watermark, logo, low quality, blurry, distorted";

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [image],
                    prompt: prompt + QUALITY_SUFFIX,
                    negative_prompt: NEGATIVE_PROMPT,
                }
            }
        ).catch(err => {
            console.error("Replicate API Error (Magic):", err);
            throw err;
        });

        console.log("Replicate Output (Magic):", output);

        // 3. Process Result
        let resultBuffer: Uint8Array | null = null;
        let finalImageUrl = "";

        console.log("Processing Replicate output type:", typeof output);

        if (output instanceof ReadableStream) {
            console.log("Output is ReadableStream. Reading...");
            const reader = output.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            console.log("Stream read complete. Total bytes:", totalLength);

            resultBuffer = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                resultBuffer.set(chunk, offset);
                offset += chunk.length;
            }
        } else if (typeof output === "string") {
            finalImageUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            finalImageUrl = output[0].toString();
        } else {
            console.error("Unknown output format:", output);
            throw new Error("Received unknown output format from Replicate");
        }

        if (resultBuffer || finalImageUrl) {
            let publicUrl = finalImageUrl;

            if (resultBuffer) {
                const fileName = `magic/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
                console.log("Uploading to Supabase:", fileName);

                const { error: uploadError } = await supabase.storage
                    .from("generations")
                    .upload(fileName, resultBuffer, { contentType: "image/png", upsert: true });

                if (uploadError) {
                    console.error("Storage Upload Error:", uploadError);
                    throw new Error(`Failed to save image to storage: ${uploadError.message}`);
                }
                publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;
                console.log("Upload successful. Public URL:", publicUrl);
            }

            // Save to DB
            if (user.id && publicUrl) {
                console.log("Saving to DB for user:", user.id);
                await supabase.from("generations").insert({
                    user_id: user.id,
                    image_url: publicUrl,
                    prompt: prompt,
                    style: "Magic Edit",
                    room_type: "Custom Edit",
                    is_variation: false
                });
            }

            return NextResponse.json({ result: publicUrl });
        }

        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Magic Edit Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to perform magic edit";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
