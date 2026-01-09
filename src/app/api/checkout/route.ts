import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { lemonSqueezyApiInstance, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

// Initialize Lemon Squeezy
lemonSqueezyApiInstance({
    apiKey: process.env.LEMON_SQUEEZY_API_KEY || "",
    onError: (error) => console.error("Lemon Squeezy Error:", error),
});

// Configure these with your actual Variant IDs from Lemon Squeezy
const PLANS = {
    weekly: "1205274",   // Spacely AI - Weekly Unlimited
    monthly: "1205283", // Spacely AI - Monthly Unlimited
    yearly: "1205302",   // Spacely AI - Yearly Unlimited
};

export async function POST(request: Request) {
    try {
        const { plan } = await request.json();
        const cookieStore = await cookies();

        // Auth Check
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

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return NextResponse.json({ error: "Please login first" }, { status: 401 });
        }

        const variantId = PLANS[plan as keyof typeof PLANS];
        if (!variantId) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        if (!process.env.LEMON_SQUEEZY_STORE_ID) {
            console.error("LEMON_SQUEEZY_STORE_ID is missing");
            return NextResponse.json({ error: "Store ID missing" }, { status: 500 });
        }

        // Create Checkout
        const newCheckout = await createCheckout(
            process.env.LEMON_SQUEEZY_STORE_ID!,
            variantId,
            {
                checkoutData: {
                    custom: {
                        user_id: session.user.id,
                        email: session.user.email,
                    },
                },
                productOptions: {
                    redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/`,
                    receiptButtonText: 'Go to Spacely AI',
                    receiptThankYouNote: 'Thank you for subscribing to Spacely AI!',
                }
            }
        );

        return NextResponse.json({ url: newCheckout.data?.data.attributes.url });

    } catch (error) {
        console.error("Checkout Creation Error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout" },
            { status: 500 }
        );
    }
}
