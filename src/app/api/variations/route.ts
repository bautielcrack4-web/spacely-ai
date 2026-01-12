import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

export const maxDuration = 60; // Allow 60 seconds for processing

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
        const { imageUrl, originalPrompt, id } = await req.json();

        if (!imageUrl || !id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Verify User (Optional: Check credits here if needed)
        // For now assuming active session is validated by middleware or client context
        // Ideally we should get session from header but we'll trust the request for this prototype
        // or better, pass the user ID. 

        // Let's get the user ID from the request headers if available or just proceed. 
        // In a real app we'd validate the session.

        // 2. Prepare Prompts & Seeds
        // We generate 4 variations with different seeds
        const seeds = Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000000));

        // 3. Call Replicate in Parallel
        const predictions = await Promise.all(
            seeds.map(async (seed) => {
                const output = await replicate.run(
                    "prunaai/p-image-edit:c5d2d0b6", // Use exact version if known, or latest
                    {
                        input: {
                            images: [imageUrl],
                            prompt: "Create a variation of this interior design with similar style but slightly different details",
                            seed: seed,
                            aspect_ratio: "custom", // Maintain aspect ratio if possible or use standard
                        }
                    }
                );
                return { seed, output };
            })
        );

        // 4. Process Results & Save to DB
        const variations = [];

        for (const pred of predictions) {
            // Output from p-image-edit is usually an array of URLs or a single URL depending on configuration
            // According to docs it returns the edited image.
            const resultUrl = Array.isArray(pred.output) ? pred.output[0] : pred.output;

            if (resultUrl) {
                // Upload to Supabase Storage (to persist it)
                const imageResponse = await fetch(resultUrl);
                const imageBlob = await imageResponse.blob();
                const fileName = `variations/${id}-${pred.seed}.png`;

                const { error: uploadError } = await supabase.storage
                    .from("generations")
                    .upload(fileName, imageBlob, { contentType: "image/png", upsert: true });

                if (!uploadError) {
                    const publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;

                    // Save to DB
                    // We need the original generation to get user_id, style, room_type
                    const { data: original } = await supabase.from("generations").select("*").eq("id", id).single();

                    if (original) {
                        const { data: newGen } = await supabase.from("generations").insert({
                            user_id: original.user_id,
                            image_url: publicUrl,
                            prompt: originalPrompt,
                            style: original.style,
                            room_type: original.room_type,
                            parent_id: id,
                            seed: pred.seed,
                            is_variation: true
                        }).select().single();

                        if (newGen) variations.push(newGen);
                    }
                }
            }
        }

        return NextResponse.json({ variations });

    } catch (error) {
        console.error("Variation Error:", error);
        return NextResponse.json({ error: "Failed to generate variations" }, { status: 500 });
    }
}
