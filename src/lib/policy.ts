import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export interface PolicyResult {
    user: any;
    isPro: boolean;
    error?: NextResponse;
    credits?: number;
}

export async function checkPolicy(): Promise<PolicyResult> {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

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
    );

    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return {
            user: null,
            isPro: false,
            error: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        };
    }

    // 2. Check Profile (Credits & Subscription)
    const { data: profile } = await supabase
        .from('profiles')
        .select('credits, subscription_status')
        .eq('id', user.id)
        .single();

    const isPro = profile?.subscription_status === 'active';

    // 3. Enforce Credit Limit (3 for free users)
    if (!isPro && (!profile || profile.credits < 1)) {
        return {
            user,
            isPro,
            error: NextResponse.json({
                error: "Insufficient credits",
                details: "You've used your 3 free credits. Upgrade to PRO for unlimited designs."
            }, { status: 403 })
        };
    }

    // 4. Enforce Daily Global Limit (50/day) - Bypass for PRO
    if (!isPro) {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const { count, error: countError } = await supabase
            .from('generations')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', startOfDay.toISOString());

        if (countError) {
            console.error("Error checking daily global limit:", countError);
        } else if (count !== null && count >= 50) {
            return {
                user,
                isPro,
                error: NextResponse.json({
                    error: "Daily limit reached (50/50)",
                    details: "You've reached the daily limit for free generations. Please try again tomorrow or upgrade to PRO."
                }, { status: 429 })
            };
        }
    }

    return { user, isPro, credits: profile?.credits || 0 };
}

/**
 * Shared utility to deduct a credit and save generation metadata
 */
export async function trackGeneration(userId: string, isPro: boolean, data: {
    imageUrl: string,
    prompt: string,
    style: string,
    roomType: string,
    parentId?: string,
    isVariation?: boolean
}) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Use service role for reliable DB write

    // Create an admin client for service tasks
    const { createClient } = await import('@supabase/supabase-js');
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Deduct credit if not PRO
    if (!isPro) {
        await adminClient.rpc('decrement_credits', { user_id: userId });
    }

    // Save metadata
    await adminClient.from('generations').insert({
        user_id: userId,
        image_url: data.imageUrl,
        prompt: data.prompt,
        style: data.style,
        room_type: data.roomType,
        parent_id: data.parentId,
        is_variation: data.isVariation || false
    });
}
