import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
    try {
        const { imageUrl, prompt } = await request.json();

        if (!imageUrl || !prompt) {
            return NextResponse.json(
                { error: "Image URL and prompt are required" },
                { status: 400 }
            );
        }

        // Using Pruna AI's model via Replicate
        // Model: prunaai/p-image-edit
        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    image: imageUrl,
                    prompt: prompt,
                    // aspect_ratio: "16:9", // Optional based on requirements
                },
            }
        );

        console.log("Replicate Output:", output);

        return NextResponse.json({ result: output });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        );
    }
}
