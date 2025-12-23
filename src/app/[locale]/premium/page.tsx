"use client";

import { motion } from "framer-motion";
import {
    Check,
    Zap,
    Heart,
    Infinity as InfinityIcon,
    ShieldCheck,
    ArrowLeft,
    Sparkles,
    Star,
    Trophy,
    ChevronDown,
    MessageSquare,
    HelpCircle
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Separate component that uses useSearchParams
function PremiumBanners() {
    const searchParams = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [redirectReason, setRedirectReason] = useState<string | null>(null);

    const REDIRECT_MESSAGES: Record<string, { title: string; description: string; feature: string }> = {
        ai_tutor: {
            title: "🐨 Unlock Ollie the AI Tutor!",
            description: "Get personalized explanations for any citizenship question. Ollie is ready to help you master every topic!",
            feature: "Test Ready"
        },
        masterclass: {
            title: "🎓 Access the Citizenship Masterclass!",
            description: "Deep-dive video lessons covering Australian history, values, and the democratic system.",
            feature: "Citizenship Achiever"
        },
        mock_test: {
            title: "📝 Take the Official Mock Exam!",
            description: "Simulate the real citizenship test experience with timed questions and instant feedback.",
            feature: "Test Ready"
        },
        certificate: {
            title: "🏆 Get Your Readiness Certificate!",
            description: "Prove your preparation with an official PassMate certificate you can share.",
            feature: "Citizenship Achiever"
        }
    };

    useEffect(() => {
        const payment = searchParams.get("payment");
        const reason = searchParams.get("reason");
        if (payment === "cancelled") {
            setPaymentStatus("cancelled");
        }
        if (reason && REDIRECT_MESSAGES[reason]) {
            setRedirectReason(reason);
        }
    }, [searchParams]);

    return (
        <>
            {paymentStatus === "cancelled" && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-red-50 border-b border-red-100 p-4 text-center text-red-700 font-bold"
                >
                    Checkout was cancelled. No worries, Ollie is still here for ya!
                </motion.div>
            )}

            {redirectReason && REDIRECT_MESSAGES[redirectReason] && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b-2 border-primary/20 p-6 md:p-8"
                >
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shrink-0">
                            {REDIRECT_MESSAGES[redirectReason].title.split(' ')[0]}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-display font-black text-foreground mb-1">
                                {REDIRECT_MESSAGES[redirectReason].title.replace(/^[^\s]+\s/, '')}
                            </h3>
                            <p className="text-muted-foreground font-bold">
                                {REDIRECT_MESSAGES[redirectReason].description}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <span className="inline-block bg-primary text-white px-4 py-2 rounded-xl font-black text-sm">
                                Requires {REDIRECT_MESSAGES[redirectReason].feature}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default function PremiumPage() {
    const PLANS = [
        {
            name: "Free Mate",
            price: "$0",
            features: [
                "Daily Citizenship Quests",
                "Official 2024 Question Bank",
                "Community Leauges",
                "5 Hearts per day"
            ],
            cta: "Current Plan",
            variant: "outline",
            popular: false
        },
        {
            name: "Test Ready",
            price: "$9.99",
            duration: "/one-time",
            features: [
                "Unlimited Hearts ❤️",
                "AI Tutor Support (Ollie)",
                "Official Mock Exam Simulator",
                "Personalized AI Review",
                "Ad-free Experience"
            ],
            cta: "Get Test Ready",
            variant: "primary",
            popular: true
        },
        {
            name: "Citizenship Achiever",
            price: "$24.99",
            duration: "/lifetime",
            features: [
                "Everything in Test Ready",
                "Australian Values Masterclass",
                "Digital Certificate of Readiness",
                "Lifetime Updates",
                "VIP Discord Access"
            ],
            cta: "Go Unlimited",
            variant: "accent",
            popular: false
        }
    ];

    const COMPARISON = [
        { feature: "Daily Quests", free: true, ready: true, achiever: true },
        { feature: "Question Bank", free: true, ready: true, achiever: true },
        { feature: "Unlimited Hearts", free: false, ready: true, achiever: true },
        { feature: "AI Tutor (Ollie)", free: false, ready: true, achiever: true },
        { feature: "Mock Exam Simulator", free: false, ready: true, achiever: true },
        { feature: "AI Performance Review", free: false, ready: true, achiever: true },
        { feature: "Ad-free Experience", free: false, ready: true, achiever: true },
        { feature: "Values Masterclass", free: false, ready: false, achiever: true },
        { feature: "Readiness Certificate", free: false, ready: false, achiever: true },
        { feature: "VIP Community", free: false, ready: false, achiever: true },
    ];

    const FAQS = [
        {
            q: "How do Unlimited Hearts work?",
            a: "With a premium plan, you never have to wait for hearts to refill. If you get a question wrong, you can keep practicing without any interruptions. Perfect for intense study sessions!"
        },
        {
            q: "Is the payment a subscription?",
            a: "No! All our premium plans are one-time payments. You pay once and get access for the specified duration (or lifetime). No hidden fees or recurring charges."
        },
        {
            q: "What is the AI Tutor (Ollie)?",
            a: "Ollie is our advanced AI mascot who can explain complex Australian history, values, and law in simple terms. You can ask Ollie anything while taking a practice test."
        },
        {
            q: "Can I get a refund if I don't pass?",
            a: "Absolutely. We are so confident in PassMate that if you complete a premium study path and don't pass your official test, we'll refund your payment in full."
        }
    ];

    const [loading, setLoading] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleCheckout = async (tier: string) => {
        if (tier === "Free Mate") return;

        const tierKey = tier === "Test Ready" ? "test_ready" : "citizenship_achiever";
        setLoading(tier);

        try {
            const result = await createCheckoutSession(tierKey as any);
            if (result.url) {
                window.location.href = result.url;
            } else {
                alert(result.error || "Failed to start checkout");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 pb-24 md:pb-24 md:pl-20 overflow-x-hidden">
            <header className="bg-white/80 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" /> <span className="font-bold">Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                    <Sparkles className="w-4 h-4 fill-yellow-600 animate-pulse" /> Go Premium
                </div>
            </header>

            <Suspense fallback={null}>
                <PremiumBanners />
            </Suspense>

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-block p-4 bg-primary/10 rounded-3xl mb-8"
                    >
                        <Zap className="w-10 h-10 text-primary fill-primary" />
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">
                        Master Your <span className="text-primary italic">Aussie</span> Journey
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-bold max-w-2xl mx-auto leading-relaxed">
                        Join 10,000+ mates who passed their citizenship test on the first try with PassMate Premium.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {PLANS.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative bg-white p-8 rounded-[3.5rem] border-2 flex flex-col shadow-sm transition-all hover:shadow-2xl hover:scale-[1.02]",
                                plan.popular ? "border-primary ring-8 ring-primary/5 mt-[-10px] mb-[-10px] scale-105 z-10" : "border-border"
                            )}
                        >
                            {plan.popular && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-8 py-1.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-xl border-4 border-white">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-10">
                                <h3 className="text-2xl font-display font-black mb-3">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-display font-black tracking-tight">{plan.price}</span>
                                    {plan.duration && <span className="text-muted-foreground font-bold text-lg">{plan.duration}</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-4 h-4 text-green-600 stroke-[3px]" />
                                        </div>
                                        <span className="font-bold text-muted-foreground/80 leading-snug">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.variant as any}
                                size="lg"
                                className="w-full py-7 rounded-3xl text-xl font-black shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                disabled={plan.name === "Free Mate" || loading !== null}
                                onClick={() => handleCheckout(plan.name)}
                            >
                                {loading === plan.name ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Just a sec...</span>
                                    </div>
                                ) : plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Section */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-black mb-4">Compare Plans</h2>
                        <p className="text-muted-foreground font-bold">Pick the right mate for your journey.</p>
                    </div>

                    <div className="bg-white rounded-[3rem] border-2 border-border overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="p-8 text-xl font-black border-b border-border">Feature</th>
                                        <th className="p-8 text-center text-lg font-black border-b border-border">Free</th>
                                        <th className="p-8 text-center text-lg font-black border-b border-border text-primary">Test Ready</th>
                                        <th className="p-8 text-center text-lg font-black border-b border-border text-accent">Achiever</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {COMPARISON.map((row, i) => (
                                        <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                                            <td className="p-6 font-bold text-muted-foreground border-b border-border pl-8">{row.feature}</td>
                                            <td className="p-6 text-center border-b border-border">
                                                {row.free ? <Check className="w-6 h-6 text-green-500 mx-auto stroke-[3px]" /> : <div className="w-1.5 h-1.5 bg-muted rounded-full mx-auto" />}
                                            </td>
                                            <td className="p-6 text-center border-b border-border bg-primary/5">
                                                {row.ready ? <Check className="w-6 h-6 text-primary mx-auto stroke-[3px]" /> : <div className="w-1.5 h-1.5 bg-muted rounded-full mx-auto" />}
                                            </td>
                                            <td className="p-6 text-center border-b border-border">
                                                {row.achiever ? <Check className="w-6 h-6 text-accent mx-auto stroke-[3px]" /> : <div className="w-1.5 h-1.5 bg-muted rounded-full mx-auto" />}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-black mb-4 flex items-center justify-center gap-3">
                            <MessageSquare className="w-8 h-8 text-primary" /> Hear From Our Mates
                        </h2>
                        <p className="text-muted-foreground font-bold">Real stories from real users across Australia.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {[
                            { name: "Sarah J.", city: "Sydney", text: "PassMate was a game changer! The mock tests were exactly like the real thing. Highly recommend the Test Ready plan.", rating: 5 },
                            { name: "Ahmed K.", city: "Melbourne", text: "The AI Tutor (Ollie) helped me understand the Australian values section so much better. I passed on my first try!", rating: 5 },
                            { name: "Li W.", city: "Brisbane", text: "Lifetime access is totally worth it. The certificate of readiness gave me the confidence to finally book my test.", rating: 5 }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-[2.5rem] border-2 border-border shadow-md"
                            >
                                <div className="flex gap-1 mb-4 text-yellow-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <p className="font-bold text-muted-foreground mb-6 leading-relaxed italic">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary text-xl">
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <p className="font-black">{t.name}</p>
                                        <p className="text-sm font-bold text-muted-foreground">{t.city}, Australia</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FAQ */}
                <section className="mb-32 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-black mb-4 flex items-center justify-center gap-3">
                            <HelpCircle className="w-8 h-8 text-primary" /> Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {FAQS.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-[2rem] border-2 border-border overflow-hidden shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-8 text-left hover:bg-muted/20 transition-colors"
                                >
                                    <span className="text-lg font-black pr-8">{faq.q}</span>
                                    <ChevronDown className={cn("w-6 h-6 transition-transform stroke-[3px]", openFaq === i ? "rotate-180" : "")} />
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-8 pt-0 text-muted-foreground font-bold leading-relaxed border-t border-muted/50">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Trust Badges */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center border-t-2 border-border pt-24 mb-12">
                    <div>
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <ShieldCheck className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-extrabold text-xl mb-3">Safe & Secure</h4>
                        <p className="text-muted-foreground font-bold text-sm">Stripe-encrypted payments. We never store your card details.</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        </div>
                        <h4 className="font-extrabold text-xl mb-3">4.9/5 Rating</h4>
                        <p className="text-muted-foreground font-bold text-sm">Trusted by thousands of new Aussie citizens every year.</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-extrabold text-xl mb-3">Money-Back Period</h4>
                        <p className="text-muted-foreground font-bold text-sm">Don't pass? Get a full refund on your premium plan. No questions asked.</p>
                    </div>
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
