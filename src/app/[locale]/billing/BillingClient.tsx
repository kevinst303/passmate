"use client";

import { motion } from "framer-motion";
import {
    CreditCard,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    ExternalLink,
    ShieldCheck,
    Receipt,
    Clock,
    Plus,
    Gem,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";
import { createPortalSession } from "@/app/actions/stripe";

interface BillingClientProps {
    data: any;
}

export default function BillingClient({ data }: BillingClientProps) {
    const { profile } = data;
    const [isLoading, setIsLoading] = useState(false);

    const handleManageBilling = async () => {
        setIsLoading(true);
        try {
            const result = await createPortalSession();
            if ('url' in result && result.url) {
                window.location.href = result.url;
            } else if ('error' in result) {
                // @ts-ignore
                alert(result.error || "Could not open billing portal");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const plans = [
        {
            name: "Free",
            price: "$0",
            current: !profile.is_premium,
            features: [
                "Basic Study Modules",
                "Daily Practice Questions",
                "Community Support",
                "Standard Learning Path"
            ]
        },
        {
            name: "Premium",
            price: "$24.99",
            current: profile.is_premium,
            bestValue: true,
            features: [
                "Unlimited Mock Tests",
                "24/7 AI Tutor Access",
                "Masterclass Series",
                "Official Certificate",
                "Ad-free Experience"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 md:pb-8 md:pl-28 md:pr-8">
            <main className="max-w-4xl mx-auto py-8 px-4">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-display font-black tracking-tight mb-2">Billing & Subscription</h1>
                        <p className="text-muted-foreground font-bold">Manage your plan, payments and billing history.</p>
                    </div>
                </div>

                <div className="grid gap-8">
                    {/* Current Plan Card */}
                    <section className="bg-white rounded-[3rem] border-2 border-border p-8 md:p-10 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                            {profile.is_premium ? <Gem className="w-6 h-6 text-primary" /> : <Zap className="w-6 h-6 text-primary" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Current Plan</p>
                                            <h2 className="text-2xl font-display font-black">{profile.is_premium ? "Premium Achiever" : "Free Explorer"}</h2>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-xl w-fit">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Active Account
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    {profile.is_premium ? (
                                        <Button
                                            variant="outline"
                                            className="h-14 px-8 rounded-2xl font-black text-lg border-2"
                                            onClick={handleManageBilling}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Loading..." : <><CreditCard className="w-5 h-5 mr-2" /> Manage Payments</>}
                                        </Button>
                                    ) : (
                                        <Link href="/premium">
                                            <Button className="h-14 px-8 rounded-2xl font-black text-lg shadow-lg">
                                                Upgrade to Premium
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t-2 border-dashed border-border">
                                <div className="grid sm:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <ShieldCheck className="w-4 h-4" /> Your Benefits
                                        </h3>
                                        <ul className="space-y-3">
                                            {(profile.is_premium ? plans[1].features : plans[0].features).map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 font-bold text-sm">
                                                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    </div>
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-muted/30 rounded-3xl p-6 space-y-4">
                                        <h3 className="font-black text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Next Billing
                                        </h3>
                                        {profile.is_premium ? (
                                            <div>
                                                <p className="text-xl font-black">Lifetime Access</p>
                                                <p className="text-sm text-muted-foreground font-bold italic">You've got the full deck, mate! No more payments.</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-xl font-black">N/A</p>
                                                <p className="text-sm text-muted-foreground font-bold italic">Upgrade to unlock full features.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Invoicing Section (Static/Simulated) */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section className="bg-white rounded-[2.5rem] border-2 border-border p-8 shadow-lg">
                            <h3 className="text-xl font-display font-black mb-6 flex items-center gap-3">
                                <Receipt className="w-5 h-5 text-primary" /> Recent Invoices
                            </h3>

                            {profile.is_premium ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                                        <div>
                                            <p className="font-black">PassMate Premium</p>
                                            <p className="text-xs text-muted-foreground font-bold">One-time Payment</p>
                                        </div>
                                        <div className="text-right font-black">
                                            <p>$24.99</p>
                                            <Link href="#" className="text-[10px] text-primary hover:underline uppercase tracking-widest">Download PDF</Link>
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-muted-foreground font-bold italic pt-2">
                                        Need more history? Use the <button onClick={handleManageBilling} className="text-primary hover:underline">Billing Portal</button>
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
                                        <Receipt className="w-8 h-8" />
                                    </div>
                                    <p className="font-bold text-muted-foreground">No invoices yet.</p>
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-[2.5rem] border-2 border-border p-8 shadow-lg">
                            <h3 className="text-xl font-display font-black mb-6 flex items-center gap-3">
                                <ExternalLink className="w-5 h-5 text-primary" /> Helpful Links
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Pricing Details", href: "/premium" },
                                    { label: "Refund Policy", href: "/terms#refund" },
                                    { label: "Subscription FAQ", href: "/contact" },
                                    { label: "Contact Support", href: "/contact" }
                                ].map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.href}
                                        className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-2xl transition-all group font-bold border border-transparent hover:border-border"
                                    >
                                        {link.label}
                                        <Plus className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Sidebar />
        </div>
    );
}
