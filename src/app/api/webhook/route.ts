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
        const eventName = event.meta?.event_name;

        // Lemon Squeezy custom data can be in event.meta.custom_data OR event.data.attributes.custom_data
        const customData = event.meta?.custom_data || event.data?.attributes?.custom_data;
        const userId = customData?.user_id;

        console.log(`[Webhook] Received ${eventName} for user ${userId || 'unknown'}`);

        if (!userId) {
            console.error("[Webhook Error] No user ID found in payload:", JSON.stringify(event.meta || {}));
            return NextResponse.json({ message: "No user ID in webhook" }, { status: 200 });
        }

        // Initialize Supabase Admin (Bypass RLS)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        if (eventName === "order_created" || eventName === "subscription_created" || eventName === "subscription_updated") {
            const customerId = event.data?.attributes?.customer_id?.toString() || "unknown";

            console.log(`[Webhook] Updating subscription for ${userId} (Customer: ${customerId})`);

            const { error } = await supabase.rpc('update_subscription', {
                p_user_id: userId,
                p_status: 'active',
                p_credits: 999999,
                p_customer_id: customerId
            });

            if (error) {
                console.error("[Webhook Error] RPC failed:", error);
                return NextResponse.json({ error: "Update failed", details: error.message }, { status: 500 });
            }

            console.log(`[Webhook] Successfully updated user ${userId} to active.`);
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
