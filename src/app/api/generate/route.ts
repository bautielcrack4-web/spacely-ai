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

        // Input Validation
        if (!imageUrl || typeof imageUrl !== 'string' || !imageUrl.startsWith('data:image/')) {
            return NextResponse.json({ error: "Valid image is required" }, { status: 400 });
        }

        if (!prompt || typeof prompt !== 'string' || prompt.length < 3) {
            return NextResponse.json({ error: "Prompt is required (min 3 chars)" }, { status: 400 });
        }

        const cookieStore = await cookies();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Missing Supabase Environment Variables");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabase = createServerClient(
            supabaseUrl,
            supabaseAnonKey,
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

        // 1. Check User (getUser is more reliable than getSession on server)
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.error("Auth Error in API:", authError);
            return NextResponse.json({
                error: "Unauthorized",
                details: authError?.message || "No user found in session. Please log out and back in."
            }, { status: 401 });
        }

        const session = { user }; // For compatibility with rest of code

        // 2. Check Credits & Subscription Status
        const { data: profile } = await supabase
            .from('profiles')
            .select('credits, subscription_status')
            .eq('id', session.user.id)
            .single();

        const isPro = profile?.subscription_status === 'active';

        if (!isPro && (!profile || profile.credits < 1)) {
            return NextResponse.json({ error: "Insufficient credits" }, { status: 403 });
        }

        // 3. Check Daily Limit (50 generations per day) - Bypass for PRO
        if (!isPro) {
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
        }

        if (!imageUrl || !prompt) {
            return NextResponse.json(
                { error: "Image URL and prompt are required" },
                { status: 400 }
            );
        }

        // Using Pruna AI's model via Replicate
        // Model: prunaai/p-image-edit
        // This model returns a ReadableStream of the image file
        const output = await replicate.run(
            "prunaai/p-image-edit",
            {
                input: {
                    images: [imageUrl],
                    prompt: prompt,
                },
            }
        );

        let finalImageUrl = "";

        if (output instanceof ReadableStream) {
            // Convert ReadableStream to Buffer
            const reader = output.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            // Concatenate chunks (Uint8Array)
            const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
            const buffer = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunks) {
                buffer.set(chunk, offset);
                offset += chunk.length;
            }

            // Upload to Supabase Storage
            const fileName = `${session.user.id}/${Date.now()}-generated.png`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('generations')
                .upload(fileName, buffer, {
                    contentType: 'image/png',
                    upsert: false
                });

            if (uploadError) {
                console.error("Storage Upload Error:", uploadError);
                throw new Error("Failed to save generated image");
            }

            // Get Public URL
            const { data: publicUrlData } = supabase.storage
                .from('generations')
                .getPublicUrl(fileName);

            finalImageUrl = publicUrlData.publicUrl;

        } else if (typeof output === 'string') {
            finalImageUrl = output;
        } else if (Array.isArray(output) && output.length > 0) {
            finalImageUrl = output[0];
        }

        // 3. Deduct Credit and Save to Gallery
        if (finalImageUrl) {
            // Transaction-like operations (sequential for now)
            if (!isPro) {
                await supabase.rpc('decrement_credits', { user_id: session.user.id });
            }

            const { error: dbError } = await supabase
                .from('generations')
                .insert({
                    user_id: session.user.id,
                    image_url: finalImageUrl,
                    prompt: prompt,
                    room_type: 'residential',
                    style: 'modern'
                });

            if (dbError) console.error("Failed to save generation:", dbError);
        }

        return NextResponse.json({
            result: finalImageUrl, // Send back the URL
            remainingCredits: isPro ? 999999 : (profile?.credits || 0) - 1
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json(
            { error: "Failed to process image" },
            { status: 500 }
        );
    }
}
