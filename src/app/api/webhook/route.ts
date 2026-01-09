import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const hmac = crypto.createHmac(
            "sha256",
            process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || ""
        );
        const digest = Buffer.from(
            hmac.update(body).digest("hex"),
            "utf8"
        );
        const headerList = await headers();
        const signature = Buffer.from(
            headerList.get("x-signature") || "",
            "utf8"
        );

        if (!crypto.timingSafeEqual(digest, signature)) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const event = JSON.parse(body);
        const eventName = event.meta.event_name;
        const customData = event.data.attributes.custom_data; // { user_id, email }
        const userId = customData?.user_id;

        if (!userId) {
            return NextResponse.json({ message: "No user ID in webhook" }, { status: 200 });
        }

        // Initialize Supabase Admin (Bypass RLS)
        // Note: In a real app, use SERVICE_ROLE_KEY for admin tasks usually, 
        // but here we might use the standard client if RLS allows or need a separate admin client.
        // For simplicity with provided vars, using standard client but we might need to adjust policies
        // Or ideally, the user should provide SERVICE_ROLE key for webhooks.
        // Actually, we can just use the ANON key if we have a policy or function.
        // Better: Use a dedicated RPC function with security definer to update subscription.

        // For now, let's assume we have a way. We'll use the anon key but real world needs service role.
        // Wait, the user only provided ANON key. We can't use Service Role.
        // We already created a 'decrement_credits' function that is security definer.
        // We should create a 'update_subscription' function too.

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) { return null },
                    set(name: string, value: string, options: CookieOptions) { },
                    remove(name: string, options: CookieOptions) { },
                },
            }
        )

        if (eventName === "order_created" || eventName === "subscription_created" || eventName === "subscription_updated") {
            // Grant Unlimited Credits (999999) + Active Status
            // We'll call a custom RPC function 'update_subscription' (we need to create this via SQL)
            const { error } = await supabase.rpc('update_subscription', {
                p_user_id: userId,
                p_status: 'active',
                p_credits: 999999,
                p_customer_id: event.data.attributes.customer_id.toString()
            });

            if (error) {
                console.error("Error updating profile:", error);
                return NextResponse.json({ error: "Update failed" }, { status: 500 });
            }
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }
}
