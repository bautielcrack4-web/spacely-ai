import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Replicate from "replicate";

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
        const { imageUrl, originalPrompt, id } = await request.json();

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
        const finalPrompt = "Create a variation of this interior design with similar style but slightly different details";

        const predictions = await Promise.all(
            seeds.map(async (seed) => {
                const output = await replicate.run(
                    "prunaai/p-image-edit",
                    {
                        input: {
                            images: [imageUrl],
                            prompt: finalPrompt,
                            seed: seed,
                        }
                    }
                );
                return { seed, output };
            })
        );

        // 4. Process Results & Save to DB
        const variations = [];

        for (const pred of predictions) {
            let resultBuffer: Uint8Array | null = null;
            let finalImageUrl = "";

            if (pred.output instanceof ReadableStream) {
                const reader = pred.output.getReader();
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
            } else if (typeof pred.output === "string") {
                finalImageUrl = pred.output;
            } else if (Array.isArray(pred.output) && pred.output.length > 0) {
                finalImageUrl = pred.output[0].toString();
            }

            if (resultBuffer || finalImageUrl) {
                let publicUrl = finalImageUrl;

                if (resultBuffer) {
                    const fileName = `variations/${id}-${pred.seed}.png`;
                    const { error: uploadError } = await supabase.storage
                        .from("generations")
                        .upload(fileName, resultBuffer, { contentType: "image/png", upsert: true });

                    if (!uploadError) {
                        publicUrl = supabase.storage.from("generations").getPublicUrl(fileName).data.publicUrl;
                    }
                }

                if (publicUrl) {
                    // Save to DB
                    const { data: original } = await supabase.from("generations").select("*").eq("id", id).single();
                    if (original) {
                        const { data: newGen } = await supabase.from("generations").insert({
                            user_id: original.user_id,
                            image_url: publicUrl,
                            prompt: finalPrompt,
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
        const errorMessage = error instanceof Error ? error.message : "Failed to generate variations";
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
