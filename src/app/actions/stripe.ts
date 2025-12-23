"use server";

import Stripe from "stripe";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2024-12-18.acacia" as any,
});

export async function createCheckoutSession(tier: 'test_ready' | 'citizenship_achiever') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required");
    }

    const origin = (await headers()).get("origin");

    const priceId = tier === 'test_ready'
        ? "price_1QU0UjH15nIshCpRE9xY8jF5" // Placeholder, should ideally be from env or dynamically fetched
        : "price_1QU0V7H15nIshCpRhYqXUqX2"; // Placeholder

    // Custom pricing based on the prompt's UI
    // Test Ready: $9.99
    // Citizenship Achiever: $24.99

    // In a real app, you'd fetch these from Stripe or config
    // For now, I'll use the tier to determine the amount if I were creating a session with line items

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "aud",
                        product_data: {
                            name: tier === 'test_ready' ? "PassMate Test Ready" : "PassMate Citizenship Achiever",
                            description: tier === 'test_ready'
                                ? "Unlimited Hearts, AI Tutor, Mock Exams"
                                : "Everything in Test Ready + Masterclass & Certificate",
                        },
                        unit_amount: tier === 'test_ready' ? 999 : 2499,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/premium/success`,
            cancel_url: `${origin}/premium?payment=cancelled`,
            metadata: {
                userId: user.id,
                tier: tier,
            },
            customer_email: user.email,
        });

        return { url: session.url };
    } catch (error: any) {
        console.error("Stripe error:", error);
        return { error: error.message };
    }
}

export async function createPortalSession() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Authentication required");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

    if (!profile?.stripe_customer_id) {
        // If no customer ID, they probably haven't bought anything yet
        // In a real app, you might want to create one or redirect to pricing
        return { error: "No billing history found. Upgrade to Premium first!" };
    }

    const origin = (await headers()).get("origin");

    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: profile.stripe_customer_id,
            return_url: `${origin}/billing`,
        });

        return { url: session.url };
    } catch (error: any) {
        console.error("Stripe Portal error:", error);
        return { error: error.message };
    }
}
