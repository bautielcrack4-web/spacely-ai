import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

export const maxDuration = 60;

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    try {
        const { roomImage, furnitureImage, prompt, userId } = await req.json();

        if (!roomImage || !furnitureImage) {
            return NextResponse.json({ error: "Missing images" }, { status: 400 });
        }

        // 1. Construct Prompt
        // If user provided a prompt, append it. Otherwise use default smart prompt.
        const finalPrompt = prompt && prompt.length > 5
            ? prompt
            : "Place the furniture object from the second image into the room shown in the first image. Ensure realistic lighting, shadows, and perspective matching.";

        // 2. Call Replicate (p-image-edit)
        const output = await replicate.run(
            "prunaai/p-image-edit:c5d2d0b6",
            {
                input: {
                    images: [roomImage, furnitureImage], // Order matters: 1=Room, 2=Item
                    prompt: finalPrompt,
                    reference_image: "1", // Room is the base
                    aspect_ratio: "custom",
                    // We can add logic to detect dimensions from base64 if needed, 
                    // but p-image-edit usually handles it well.
                }
            }
        );

        // 3. Process Result
        const resultUrl = Array.isArray(output) ? output[0] : output;

        if (resultUrl) {
            // Upload to Storage
            const imageResponse = await fetch(resultUrl);
            const imageBlob = await imageResponse.blob();
            const fileName = `furniture/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

            const { error: uploadError } = await supabase.storage
                .from("generations")
                .upload(fileName, imageBlob, { contentType: "image/png", upsert: true });

            if (!uploadError) {
                const publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;

                // Save to DB
                // We can optionally link to parent if roomImage was a previous generation
                if (userId) {
                    await supabase.from("generations").insert({
                        user_id: userId,
                        image_url: publicUrl,
                        prompt: finalPrompt,
                        style: "Furniture Placement",
                        room_type: "Custom Edit",
                        is_variation: false
                    });
                }

                return NextResponse.json({ result: publicUrl });
            }
        }

        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Furniture Edit Error:", error);
        return NextResponse.json({ error: "Failed to place furniture" }, { status: 500 });
    }
}
