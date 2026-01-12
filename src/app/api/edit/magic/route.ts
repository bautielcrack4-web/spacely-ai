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
                    aspect_ratio: "match_input_image",
                }
            }
        ).catch(err => {
            console.error("Replicate API Error (Magic):", err);
            throw err;
        });

        console.log("Replicate Output (Magic):", output);

        // 2. Process Result
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
            const fileName = `magic/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

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
                        prompt: prompt,
                        style: "Magic Edit",
                        room_type: "Custom Edit",
                        is_variation: false
                    });
                }

                return NextResponse.json({ result: publicUrl });
            }
        }

        return NextResponse.json({ error: "Generation failed" }, { status: 500 });

    } catch (error) {
        console.error("Magic Edit Error:", error);
        return NextResponse.json({ error: "Failed to perform magic edit" }, { status: 500 });
    }
}
