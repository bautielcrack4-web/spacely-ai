import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkPolicy, trackGeneration } from "@/lib/policy";

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
        const { roomImage, furnitureImage, prompt } = await request.json();

        const { user, isPro, error } = await checkPolicy();
        if (error) return error;

        // 2. Construct Prompt
        const basePrompt = "Place the furniture object from image 2 into the room in image 1. Position it naturally on the floor. Adapt lighting, shadows, and perspective to match the room perfectly.";
        const finalPrompt = prompt && prompt.length > 5 ? `${prompt}. ${basePrompt}` : basePrompt;

        // 3. Call Replicate (p-image-edit)
        const QUALITY_SUFFIX = ", photorealistic, 8k, highly detailed, architectural photography";
        const NEGATIVE_PROMPT = "text, watermark, logo, low quality, blurry, distorted";

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [roomImage, furnitureImage],
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
                const fileName = `furniture/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
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
                    style: "Furniture Placement",
                    roomType: "residential"
                });
            }

            return NextResponse.json({ result: publicUrl });
        }


        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Furniture Edit Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to place furniture";
        return NextResponse.json({ error: "Failed to process image", details: errorMessage }, { status: 500 });
    }
}
