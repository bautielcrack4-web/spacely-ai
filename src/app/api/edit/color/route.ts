import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

export const maxDuration = 60;

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// Move initialization inside handler to avoid build-time errors
// const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

export async function POST(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    try {
        const { image, palette, prompt, userId } = await req.json();

        if (!image) {
            return NextResponse.json({ error: "Missing image" }, { status: 400 });
        }

        // 1. Construct Prompt
        // If user provided a specific prompt, use it. Otherwise build from palette.
        let finalPrompt = "";
        if (prompt && prompt.length > 3) {
            finalPrompt = `Change the color palette of this room to ${prompt}. Keep the furniture, layout, and style exactly the same, only change the colors of walls, decor, and textiles.`;
        } else {
            finalPrompt = `Change the color palette of this room to ${palette}. Keep the furniture, layout, and style exactly the same, only change the colors of walls, decor, and textiles.`;
        }

        // 2. Call Replicate (p-image-edit)
        console.log("Calling p-image-edit for Color Match...");
        console.log("Prompt:", finalPrompt);

        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [image],
                    prompt: finalPrompt,
                    aspect_ratio: "match_input_image",
                }
            }
        ).catch(err => {
            console.error("Replicate API Error (Color):", err);
            throw err;
        });

        console.log("Replicate Output (Color):", output);

        // 3. Process Result
        let resultUrl = "";
        if (typeof output === "string") {
            resultUrl = output;
        } else if (Array.isArray(output)) {
            resultUrl = output[0].toString();
        } else if (output && typeof (output as any).url === "function") {
            resultUrl = (output as any).url();
        } else {
            resultUrl = output.toString();
        }

        if (resultUrl) {
            // Upload to Storage
            const imageResponse = await fetch(resultUrl);
            const imageBlob = await imageResponse.blob();
            const fileName = `colors/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

            const { error: uploadError } = await supabase.storage
                .from("generations")
                .upload(fileName, imageBlob, { contentType: "image/png", upsert: true });

            if (!uploadError) {
                const publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;

                // Save to DB
                if (userId) {
                    await supabase.from("generations").insert({
                        user_id: userId,
                        image_url: publicUrl,
                        prompt: finalPrompt,
                        style: "Color Match",
                        room_type: "Custom Edit",
                        is_variation: false
                    });
                }

                return NextResponse.json({ result: publicUrl });
            }
        }

        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Color Edit Error:", error);
        return NextResponse.json({ error: "Failed to change colors" }, { status: 500 });
    }
}
