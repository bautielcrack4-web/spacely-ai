import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
    try {
        const { imageUrl, prompt } = await request.json();
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options })
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options })
                    },
                },
            }
        )

        // 1. Check User Session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Check Credits
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', session.user.id)
            .single();

        if (!profile || profile.credits < 1) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
        }

        // 3. Check Daily Limit (50 generations per day)
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
            .from('generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', session.user.id)
            .gte('created_at', startOfDay.toISOString());

        if (countError) {
            console.error("Error checking daily limit:", countError);
        } else if (count !== null && count >= 50) {
            return NextResponse.json(
                { error: "Daily limit reached (50/50). Please try again tomorrow or upgrade to PRO for unlimited." },
                { status: 429 }
            );
        }

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

        // 3. Deduct Credit and Save to Gallery
        if (output) {
            const outputUrl = Array.isArray(output) ? output[0] : output;

            // Transaction-like operations (sequential for now)
            await supabase.rpc('decrement_credits', { user_id: session.user.id });

            const { error: dbError } = await supabase
                .from('generations')
                .insert({
                    user_id: session.user.id,
                    image_url: outputUrl,
                    prompt: prompt,
                    // We could pass roomType/style if we sent them in the body, defaulting for now
                    room_type: 'residential',
                    style: 'modern'
                });

            if (dbError) console.error("Failed to save generation:", dbError);
        }

        return NextResponse.json({ result: output, remainingCredits: profile.credits - 1 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        );
    }
}
