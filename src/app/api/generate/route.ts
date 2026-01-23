import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";
import { checkPolicy, trackGeneration } from "@/lib/policy";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
    try {
        const { imageUrl, prompt } = await request.json();

        // Input Validation
        if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('data:image/')) {
            return NextResponse.json({ error: "Valid image is required" }, { status: 400 });
        }

        if (!prompt || typeof prompt !== 'string' || prompt.length < 3) {
            return NextResponse.json({ error: "Prompt is required (min 3 chars)" }, { status: 400 });
        }

        const cookieStore = await cookies();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing Supabase Environment Variables");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

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
        )

        const { user, isPro, error, credits } = await checkPolicy();
        if (error) return error;

        const session = { user }; // For compatibility

        // Using Pruna AI's model via Replicate
        // Model: prunaai/p-image-edit
        // This model returns a ReadableStream of the image file
        // Prompt Engineering
        const QUALITY_SUFFIX = ", photorealistic, 8k, highly detailed, architectural photography, interior design magazine style";
        const NEGATIVE_PROMPT = "text, watermark, logo, low quality, blurry, distorted, ugly, bad anatomy, bad perspective";

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [imageUrl],
                    prompt: prompt + QUALITY_SUFFIX,
                    negative_prompt: NEGATIVE_PROMPT,
                },
            }
        );

        let finalImageUrl = "";

        if (output instanceof ReadableStream) {
            // Convert ReadableStream to Buffer
            const reader = output.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            // Concatenate chunks (Uint8Array)
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const buffer = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                buffer.set(chunk, offset);
                offset += chunk.length;
            }

            // Upload to Supabase Storage
            const fileName = `${session.user.id}/${Date.now()}-generated.png`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('generations')
                .upload(fileName, buffer, {
                    contentType: 'image/png',
                    upsert: false
                });

            if (uploadError) {
                console.error("Storage Upload Error:", uploadError);
                throw new Error("Failed to save generated image");
            }

            // Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from('generations')
                .getPublicUrl(fileName);

            finalImageUrl = publicUrlData.publicUrl;

        } else if (typeof output === 'string') {
            finalImageUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            finalImageUrl = output[0];
        }

        // 3. Deduct Credit and Save to Gallery using shared utility
        if (finalImageUrl) {
            await trackGeneration(session.user.id, isPro, {
                imageUrl: finalImageUrl,
                prompt: prompt,
                style: 'modern',
                roomType: 'residential'
            });
        }

        return NextResponse.json({
            result: finalImageUrl, // Send back the URL
            remainingCredits: isPro ? 999999 : (credits || 0) - 1
        });

    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        );
    }
}
