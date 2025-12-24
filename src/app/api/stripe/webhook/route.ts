import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as Stripe.StripeConfig["apiVersion"],
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!signature || !webhookSecret) {
            // For development without webhook secret, you might want to bypass signature verification
            // OR use stripe-cli to get a secret.
            // For now, if secret is missing, we'll try to process without verification (UNSAFE for prod)
            // But better to throw error if secret is missing in prod.
            if (process.env.NODE_ENV === 'production') {
                throw new Error("Missing Stripe Webhook Secret");
            }
            // In dev, if we don't have secret, we can't verify. 
            // We'll just parse body if we want to test manually, but Stripe usually sends verified events.
            event = JSON.parse(body) as Stripe.Event;
        } else {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        }
    } catch (err: unknown) {
        console.error(`Webhook signature verification failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const tier = session.metadata?.tier;

        if (userId && tier) {
            // Update user profile to premium
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            const { error } = await supabaseAdmin
                .from("profiles")
                .update({
                    is_premium: true,
                    premium_tier: tier,
                })
                .eq("id", userId);

            if (error) {
                console.error("Error updating user premium status:", error);
                return NextResponse.json({ error: "DB update failed" }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}
