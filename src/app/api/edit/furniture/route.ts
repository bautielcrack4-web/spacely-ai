import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

export const maxDuration = 60;
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Move initialization inside handler to avoid build-time errors
export const maxDuration = 60; // Allow 60 seconds (max for Hobby)
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { roomImage, furnitureImage, prompt, userId } = await req.json();

        if (!roomImage || !furnitureImage) {
            return NextResponse.json({ error: "Missing images" }, { status: 400 });
        }

        // 1. Construct Prompt
        // If user provided a prompt, append it. Otherwise use default smart prompt.
        const finalPrompt = prompt && prompt.length > 5
            ? prompt
            : "Place image 2 into image 1. Ensure realistic lighting, shadows, and perspective matching.";

        // 2. Call Replicate (p-image-edit)
        console.log("Calling p-image-edit for Furniture Placement...");
        console.log("Prompt:", finalPrompt);

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [roomImage, furnitureImage],
                    prompt: finalPrompt,
                }
            }
        ).catch(err => {
            console.error("Replicate API Error (Furniture):", err);
            throw err;
        });

        console.log("Replicate Output (Furniture):", output);

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
            console.log("Output is string:", output);
            finalImageUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            console.log("Output is array:", output);
            finalImageUrl = output[0].toString();
        } else {
            console.error("Unknown output format:", output);
            throw new Error("Received unknown output format from Replicate");
        }

        if (resultBuffer || finalImageUrl) {
            let publicUrl = finalImageUrl;

            if (resultBuffer) {
                const fileName = `furniture/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
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
            if (userId && publicUrl) {
                console.log("Saving to DB for user:", userId);
                const { error: dbError } = await supabase.from("generations").insert({
                    user_id: userId,
                    image_url: publicUrl,
                    prompt: finalPrompt,
                    style: "Furniture Placement",
                    room_type: "Custom Edit",
                    is_variation: false
                });
                if (dbError) console.error("DB Save Error:", dbError);
            }

            return NextResponse.json({ result: publicUrl });
        }

        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Furniture Edit Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to place furniture";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
