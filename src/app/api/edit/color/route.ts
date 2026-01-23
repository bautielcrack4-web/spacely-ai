import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkPolicy, trackGeneration } from "@/lib/policy";


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Move initialization inside handler to avoid build-time errors
export const maxDuration = 60;
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
        const { image, palette, prompt } = await request.json();

        const { user, isPro, error } = await checkPolicy();
        if (error) return error;

        // 2. Construct Prompt
        // If user provided a specific prompt, use it. Otherwise build from palette.
        let finalPrompt = "";
        if (prompt && prompt.length > 3) {
            finalPrompt = `Change the color palette of this room to ${prompt}. Keep the furniture, layout, and style exactly the same, only change the colors of walls, decor, and textiles.`;
        } else {
            finalPrompt = `Change the color palette of this room to ${palette}. Keep the furniture, layout, and style exactly the same, only change the colors of walls, decor, and textiles.`;
        }

        // 3. Call Replicate (p-image-edit)
        console.log("Calling p-image-edit for Color Match...");
        const QUALITY_SUFFIX = ", photorealistic, 8k, highly detailed, architectural photography";
        const NEGATIVE_PROMPT = "text, watermark, logo, low quality, blurry, distorted";

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [image],
                    prompt: finalPrompt + QUALITY_SUFFIX,
                    negative_prompt: NEGATIVE_PROMPT,
                }
            }
        );

        // 4. Process Result
        let resultBuffer: Uint8Array | null = null;
        let finalImageUrl = "";

        if (output instanceof ReadableStream) {
            const reader = output.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
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
        }

        if (resultBuffer || finalImageUrl) {
            let publicUrl = finalImageUrl;

            if (resultBuffer) {
                const fileName = `colors/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
                const { error: uploadError } = await supabase.storage
                    .from("generations")
                    .upload(fileName, resultBuffer, { contentType: "image/png", upsert: true });

                if (uploadError) throw new Error(`Failed to save image: ${uploadError.message}`);
                publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;
            }

            // Save to DB and deduct credits using shared utility
            if (user.id && publicUrl) {
                await trackGeneration(user.id, isPro, {
                    imageUrl: publicUrl,
                    prompt: finalPrompt,
                    style: "Color Match",
                    roomType: "residential"
                });
            }

            return NextResponse.json({ result: publicUrl });
        }


        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Color Edit Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to change colors";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
