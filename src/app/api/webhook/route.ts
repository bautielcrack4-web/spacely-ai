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

        // Extract user ID from custom data
        const customData = event.meta?.custom_data || event.data?.attributes?.custom_data;
        const userId = customData?.user_id;

        console.log(`[Webhook] Received ${eventName} for user ${userId || 'unknown'}`);

        if (!userId) {
            console.error("[Webhook Error] No user ID found in payload:", JSON.stringify(event.meta || {}));
            return NextResponse.json({ message: "No user ID in webhook" }, { status: 200 });
        }

        // Initialize Supabase Admin
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const attributes = event.data?.attributes;

        // Handle different subscription events
        switch (eventName) {
            case "order_created": {
                const customerId = attributes?.customer_id?.toString() || "unknown";
                const amount = attributes?.first_order_item?.price || 0;
                const planName = attributes?.first_order_item?.variant_name || "unknown";

                console.log(`[Webhook] Processing order for ${userId}`);

                // Update profile (legacy)
                await supabase.rpc('update_subscription', {
                    p_user_id: userId,
                    p_status: 'active',
                    p_credits: 999999,
                    p_customer_id: customerId
                });

                // Record transaction
                await supabase.rpc('record_transaction', {
                    p_user_id: userId,
                    p_order_id: event.data.id,
                    p_amount: amount / 100, // Convert cents to dollars
                    p_currency: attributes?.currency || 'USD',
                    p_status: 'paid',
                    p_plan_name: planName,
                    p_transaction_type: 'subscription',
                    p_receipt_url: attributes?.urls?.receipt || null
                });

                console.log(`[Webhook] Order processed for ${userId}`);
                break;
            }

            case "subscription_created":
            case "subscription_updated": {
                const subscriptionId = event.data.id;
                const planName = attributes?.variant_name || attributes?.product_name || "unknown";
                const status = attributes?.status === "active" ? "active" : attributes?.status;
                const periodStart = attributes?.renews_at ? new Date(attributes.renews_at) : null;
                const periodEnd = attributes?.ends_at ? new Date(attributes.ends_at) : null;

                console.log(`[Webhook] Updating subscription details for ${userId}`);

                // Update subscription details
                await supabase.rpc('update_subscription_details', {
                    p_user_id: userId,
                    p_subscription_id: subscriptionId,
                    p_plan_name: planName,
                    p_status: status,
                    p_period_start: periodStart?.toISOString() || null,
                    p_period_end: periodEnd?.toISOString() || null
                });

                // Also update profile for backward compatibility
                await supabase.rpc('update_subscription', {
                    p_user_id: userId,
                    p_status: 'active',
                    p_credits: 999999,
                    p_customer_id: attributes?.customer_id?.toString() || "unknown"
                });

                console.log(`[Webhook] Subscription updated for ${userId}`);
                break;
            }

            case "subscription_cancelled": {
                console.log(`[Webhook] Cancelling subscription for ${userId}`);

                // Update subscription status
                await supabase
                    .from('subscription_details')
                    .update({
                        status: 'cancelled',
                        cancelled_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);

                console.log(`[Webhook] Subscription cancelled for ${userId}`);
                break;
            }

            case "subscription_expired": {
                console.log(`[Webhook] Expiring subscription for ${userId}`);

                // Update subscription status
                await supabase
                    .from('subscription_details')
                    .update({
                        status: 'expired',
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);

                // Update profile to free tier
                await supabase.rpc('update_subscription', {
                    p_user_id: userId,
                    p_status: 'free',
                    p_credits: 3,
                    p_customer_id: attributes?.customer_id?.toString() || "unknown"
                });

                console.log(`[Webhook] Subscription expired for ${userId}`);
                break;
            }

            case "subscription_resumed": {
                console.log(`[Webhook] Resuming subscription for ${userId}`);

                // Update subscription status
                await supabase
                    .from('subscription_details')
                    .update({
                        status: 'active',
                        cancel_at_period_end: false,
                        cancelled_at: null,
                        updated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);

                // Reactivate profile
                await supabase.rpc('update_subscription', {
                    p_user_id: userId,
                    p_status: 'active',
                    p_credits: 999999,
                    p_customer_id: attributes?.customer_id?.toString() || "unknown"
                });

                console.log(`[Webhook] Subscription resumed for ${userId}`);
                break;
            }

            case "subscription_payment_success": {
                const amount = attributes?.total || 0;
                const planName = attributes?.variant_name || "unknown";

                console.log(`[Webhook] Recording payment for ${userId}`);

                // Record transaction
                await supabase.rpc('record_transaction', {
                    p_user_id: userId,
                    p_order_id: event.data.id,
                    p_amount: amount / 100,
                    p_currency: attributes?.currency || 'USD',
                    p_status: 'paid',
                    p_plan_name: planName,
                    p_transaction_type: 'subscription',
                    p_receipt_url: attributes?.urls?.receipt || null
                });

                console.log(`[Webhook] Payment recorded for ${userId}`);
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event: ${eventName}`);
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
