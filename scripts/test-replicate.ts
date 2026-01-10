import Replicate from "replicate";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load env from .env.local manually since we are running via tsx
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

async function testModel() {
    console.log("Testing Replicate Model: prunaai/p-image-edit");
    console.log("Token present:", !!process.env.REPLICATE_API_TOKEN);

    try {
        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"],
                    prompt: "modern minimalist living room, high quality, photorealistic",
                }
            }
        );
        console.log("Output Type:", typeof output);
        console.log("Is Array?", Array.isArray(output));
        console.log("Output Keys:", Object.keys(output || {}));
        if (output instanceof ReadableStream) {
            console.log("Output is a ReadableStream");
        }
        console.log("Output:", output);
    } catch (error) {
        console.error("Error:", error);
    }
}

testModel();
