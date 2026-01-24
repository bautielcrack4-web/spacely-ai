import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { reason, feedback, cancelAtPeriodEnd = true } = await request.json();
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
        );

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get subscription details
        const { data: subscriptionData } = await supabase
            .from('subscription_details')
            .select('lemon_squeezy_subscription_id')
            .eq('user_id', session.user.id)
            .single();

        if (!subscriptionData?.lemon_squeezy_subscription_id) {
            return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
        }

        // Cancel subscription via Lemon Squeezy REST API
        try {
            const response = await fetch(
                `https://api.lemonsqueezy.com/v1/subscriptions/${subscriptionData.lemon_squeezy_subscription_id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/vnd.api+json',
                        'Content-Type': 'application/vnd.api+json',
                        'Authorization': `Bearer ${process.env.LEMON_SQUEEZY_API_KEY}`
                    }
                }
            );

            if (!response.ok) {
                console.error("Lemon Squeezy API error:", await response.text());
            }
        } catch (lsError) {
            console.error("Lemon Squeezy cancellation error:", lsError);
            // Continue even if LS API fails - we'll update our DB
        }

        // Record cancellation in database
        const { error } = await supabase.rpc('cancel_subscription_record', {
            p_user_id: session.user.id,
            p_reason: reason || 'Not specified',
            p_feedback: feedback || '',
            p_cancel_at_period_end: cancelAtPeriodEnd
        });

        if (error) {
            console.error("Error recording cancellation:", error);
            return NextResponse.json({ error: "Failed to cancel subscription" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: cancelAtPeriodEnd
                ? "Subscription will be cancelled at the end of the billing period"
                : "Subscription cancelled immediately"
        });

    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
