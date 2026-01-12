import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

export const maxDuration = 60;

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Move initialization inside handler to avoid build-time errors
export async function POST(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { image, prompt, userId } = await req.json();

        if (!image || !prompt) {
            return NextResponse.json({ error: "Missing image or prompt" }, { status: 400 });
        }

        // 1. Call Replicate (p-image-edit)
        console.log("Calling p-image-edit for Magic Edit...");
        console.log("Prompt:", prompt);

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [image],
                    prompt: prompt,
                }
            }
        ).catch(err => {
            console.error("Replicate API Error (Magic):", err);
            throw err;
        });

        console.log("Replicate Output (Magic):", output);

        // 2. Process Result
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
                const fileName = `magic/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
                const { error: uploadError } = await supabase.storage
                    .from("generations")
                    .upload(fileName, resultBuffer, { contentType: "image/png", upsert: true });

                if (uploadError) {
                    console.error("Storage Upload Error:", uploadError);
                    throw new Error("Failed to save image to storage");
                }
                publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;
            }

            // Save to DB
            if (userId && publicUrl) {
                await supabase.from("generations").insert({
                    user_id: userId,
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
