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
    try {
        const { imageUrl, id } = await request.json();
        const { user, isPro, error } = await checkPolicy();
        if (error) return error;

        if (!imageUrl || !id) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Use service role for variations to ensure parents can be found, but checkPolicy validated the user session.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const { createClient: createSupbaseClient } = await import('@supabase/supabase-js');
        const adminClient = createSupbaseClient(supabaseUrl, supabaseServiceKey);

        const seeds = Array.from({ length: 4 }, () => Math.floor(Math.random() * 1000000));
        const finalPrompt = "Create a variation of this interior design with similar style but slightly different details";
        const QUALITY_SUFFIX = ", photorealistic, 8k, highly detailed, architectural photography";
        const NEGATIVE_PROMPT = "text, watermark, logo, low quality, blurry, distorted";

        const predictions = await Promise.all(
            seeds.map(async (seed) => {
                const output = await replicate.run(
                    "prunaai/p-image-edit",
                    {
                        input: {
                            images: [imageUrl],
                            prompt: finalPrompt + QUALITY_SUFFIX,
                            negative_prompt: NEGATIVE_PROMPT,
                            seed: seed,
                        }
                    }
                );
                return { seed, output };
            })
        );

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
                    const { error: uploadError } = await adminClient.storage
                        .from("generations")
                        .upload(fileName, resultBuffer, { contentType: "image/png", upsert: true });

                    if (!uploadError) {
                        publicUrl = adminClient.storage.from("generations").getPublicUrl(fileName).data.publicUrl;
                    }
                }

                if (publicUrl) {
                    await trackGeneration(user.id, isPro, {
                        imageUrl: publicUrl,
                        prompt: finalPrompt,
                        style: "Variation",
                        roomType: "residential",
                        parentId: id,
                        isVariation: true
                    });
                    variations.push({ image_url: publicUrl });
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
