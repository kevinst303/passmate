"use client";

import { motion } from "framer-motion";
import {
    Check,
    Zap,
    ArrowLeft,
    Sparkles,
    Star,
    Trophy,
    ChevronDown,
    MessageSquare,
    HelpCircle,
    ShieldCheck
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/app/actions/stripe";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

// Separate component that uses useSearchParams
function PremiumBanners() {
    const t = useTranslations("Premium.banners");
    const searchParams = useSearchParams();
    const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
    const [redirectReason, setRedirectReason] = useState<string | null>(null);

    useEffect(() => {
        const payment = searchParams.get("payment");
        const reason = searchParams.get("reason");
        requestAnimationFrame(() => {
            if (payment === "cancelled") {
                setPaymentStatus("cancelled");
            }
            if (reason) {
                setRedirectReason(reason);
            }
        });
    }, [searchParams]);

    return (
        <>
            {paymentStatus === "cancelled" && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-red-50 border-b border-red-100 p-4 text-center text-red-700 font-bold"
                >
                    {t("cancelled")}
                </motion.div>
            )}

            {redirectReason && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-b-2 border-primary/20 p-6 md:p-8"
                >
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-lg shrink-0">
                            {redirectReason === 'ai_tutor' ? "🐨" : redirectReason === 'masterclass' ? "🎓" : redirectReason === 'mock_test' ? "📝" : "🏆"}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-display font-black text-foreground mb-1">
                                {t(`${redirectReason as 'ai_tutor' | 'masterclass' | 'mock_test'}.title`)}
                            </h3>
                            <p className="text-muted-foreground font-bold">
                                {t(`${redirectReason as 'ai_tutor' | 'masterclass' | 'mock_test'}.desc`)}
                            </p>
                        </div>
                        <div className="shrink-0">
                            <span className="inline-block bg-primary text-white px-4 py-2 rounded-xl font-black text-sm">
                                {t("requires", { feature: redirectReason === 'ai_tutor' || redirectReason === 'mock_test' ? 'Test Ready' : 'Citizenship Achiever' })}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}

export default function PremiumPage() {
    const t = useTranslations("Premium");

    const PLANS = [
        {
            name: t("plans.free.name"),
            price: "$0",
            features: [
                t("plans.features.quests"),
                t("plans.features.bank"),
                t("plans.features.leagues"),
                t("plans.features.hearts5")
            ],
            cta: t("plans.free.cta"),
            variant: "outline",
            popular: false
        },
        {
            name: t("plans.ready.name"),
            price: "$9.99",
            duration: t("plans.ready.duration"),
            features: [
                t("plans.features.unlimitedHearts"),
                t("plans.features.aiTutor"),
                t("plans.features.mockExam"),
                t("plans.features.aiReview"),
                t("plans.features.adFree")
            ],
            cta: t("plans.ready.cta"),
            variant: "primary",
            popular: true
        },
        {
            name: t("plans.achiever.name"),
            price: "$24.99",
            duration: t("plans.achiever.duration"),
            features: [
                t("plans.features.unlimitedHearts"),
                t("plans.features.masterclass"),
                t("plans.features.certificate"),
                t("plans.features.updates"),
                t("plans.features.discord")
            ],
            cta: t("plans.achiever.cta"),
            variant: "accent",
            popular: false
        }
    ];

    const COMPARISON = [
        { feature: t("comparison.rows.quests"), free: true, ready: true, achiever: true },
        { feature: t("comparison.rows.bank"), free: true, ready: true, achiever: true },
        { feature: t("comparison.rows.unlimitedHearts"), free: false, ready: true, achiever: true },
        { feature: t("comparison.rows.aiTutor"), free: false, ready: true, achiever: true },
        { feature: t("comparison.rows.mockExam"), free: false, ready: true, achiever: true },
        { feature: t("comparison.rows.aiReview"), free: false, ready: true, achiever: true },
        { feature: t("comparison.rows.adFree"), free: false, ready: true, achiever: true },
        { feature: t("comparison.rows.masterclass"), free: false, ready: false, achiever: true },
        { feature: t("comparison.rows.certificate"), free: false, ready: false, achiever: true },
        { feature: t("comparison.rows.vip"), free: false, ready: false, achiever: true },
    ];

    const FAQS = [
        { q: t("faqs.q1.q"), a: t("faqs.q1.a") },
        { q: t("faqs.q2.q"), a: t("faqs.q2.a") },
        { q: t("faqs.q3.q"), a: t("faqs.q3.a") },
        { q: t("faqs.q4.q"), a: t("faqs.q4.a") }
    ];

    const TESTIMONIALS = [
        {
            name: t("testimonials.t1.name"),
            city: t("testimonials.t1.city"),
            text: t("testimonials.t1.text"),
            rating: 5
        },
        {
            name: t("testimonials.t2.name"),
            city: t("testimonials.t2.city"),
            text: t("testimonials.t2.text"),
            rating: 5
        },
        {
            name: t("testimonials.t3.name"),
            city: t("testimonials.t3.city"),
            text: t("testimonials.t3.text"),
            rating: 5
        }
    ];

    const [loading, setLoading] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleCheckout = async (tier: string) => {
        if (tier === t("plans.free.name")) return;

        const tierKey = tier === t("plans.ready.name") ? "test_ready" : "citizenship_achiever";
        setLoading(tier);

        try {
            const result = await createCheckoutSession(tierKey as 'test_ready' | 'citizenship_achiever');
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
                    <ArrowLeft className="w-5 h-5" /> <span className="font-bold">{t("backDashboard")}</span>
                </Link>
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full font-bold text-sm shadow-sm">
                    <Sparkles className="w-4 h-4 fill-yellow-600 animate-pulse" /> {t("goPremium")}
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
                        {t.rich("heroTitle", {
                            italic: (chunks) => <span className="text-primary italic">{chunks}</span>
                        })}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-bold max-w-2xl mx-auto leading-relaxed">
                        {t("heroSubtitle")}
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
                                    {t("plans.popular")}
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
                                variant={plan.variant as "primary" | "secondary" | "accent" | "outline" | "ghost"}
                                size="lg"
                                className="w-full py-7 rounded-3xl text-xl font-black shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                                disabled={plan.name === t("plans.free.name") || loading !== null}
                                onClick={() => handleCheckout(plan.name)}
                            >
                                {loading === plan.name ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{t("plans.loading")}</span>
                                    </div>
                                ) : plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Section */}
                <section className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-black mb-4">{t("comparison.title")}</h2>
                        <p className="text-muted-foreground font-bold">{t("comparison.subtitle")}</p>
                    </div>

                    <div className="bg-white rounded-[3rem] border-2 border-border overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted/50">
                                        <th className="p-8 text-xl font-black border-b border-border">{t("comparison.feature")}</th>
                                        <th className="p-8 text-center text-lg font-black border-b border-border">{t("comparison.free")}</th>
                                        <th className="p-8 text-center text-lg font-black border-b border-border text-primary">{t("comparison.ready")}</th>
                                        <th className="p-8 text-center text-lg font-black border-b border-border text-accent">{t("comparison.achiever")}</th>
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
                            <MessageSquare className="w-8 h-8 text-primary" /> {t("testimonials.title")}
                        </h2>
                        <p className="text-muted-foreground font-bold">{t("testimonials.subtitle")}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-[2.5rem] border-2 border-border shadow-md"
                            >
                                <div className="flex gap-1 mb-4 text-yellow-500">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                                </div>
                                <p className="font-bold text-muted-foreground mb-6 leading-relaxed italic">&quot;{t.text}&quot;</p>
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
                            <HelpCircle className="w-8 h-8 text-primary" /> {t("faqs.title")}
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
                        <h4 className="font-extrabold text-xl mb-3">{t("trust.secure")}</h4>
                        <p className="text-muted-foreground font-bold text-sm">{t("trust.secureDesc")}</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        </div>
                        <h4 className="font-extrabold text-xl mb-3">{t("trust.rating")}</h4>
                        <p className="text-muted-foreground font-bold text-sm">{t("trust.ratingDesc")}</p>
                    </div>
                    <div>
                        <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Trophy className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="font-extrabold text-xl mb-3">{t("trust.refund")}</h4>
                        <p className="text-muted-foreground font-bold text-sm">{t("trust.refundDesc")}</p>
                    </div>
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
