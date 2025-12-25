"use client";

import { motion } from "framer-motion";
import {
    Users,
    Share2,
    Copy,
    Check,
    ArrowLeft,
    Zap,
    Trophy,
    Award,
    TrendingUp,
    MessageCircle,
    Twitter,
    Facebook
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

import { cn } from "@/lib/utils";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import confetti from "canvas-confetti";

interface Profile {
    id: string;
}

interface ReferralClientProps {
    data: {
        profile: Profile;
    };
}

export default function ReferralClient({ data }: ReferralClientProps) {
    const t = useTranslations("Referral");
    const { profile } = data;
    const [copied, setCopied] = useState(false);

    const referralCode = profile.id.split('-')[0].toUpperCase();
    const referralLink = `https://passmate.com.au/signup?ref=${referralCode}`;

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);

        // Blast confetti!
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        setTimeout(() => setCopied(false), 2000);
    }, [referralLink]);

    const shareStats = [
        { label: t("stats.friends"), value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: t("stats.xp"), value: "0", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
        { label: t("stats.badges"), value: "0", icon: Award, color: "text-purple-500", bg: "bg-purple-50" }
    ];

    const rewards = [
        { friends: 1, reward: t("rewards.r1"), badge: t("rewards.b1") },
        { friends: 5, reward: t("rewards.r2"), badge: t("rewards.b2") },
        { friends: 10, reward: t("rewards.r3"), badge: t("rewards.b3") }
    ];

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8 font-sans">
            <main className="max-w-5xl mx-auto py-8 px-4">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> {t("backProfile")}
                </Link>

                {/* Hero Card as Header */}
                <section className="bg-primary/95 dark:bg-primary/20 backdrop-blur-2xl rounded-[3rem] p-8 md:p-12 text-white dark:text-foreground border-2 border-primary/20 shadow-2xl relative overflow-hidden group mb-10">
                    {/* Animated Background Elements */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 dark:bg-primary/20 rounded-full blur-[100px]"
                    />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-16 h-16 bg-white/20 dark:bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl mb-6 border border-white/20 dark:border-primary/30 shadow-2xl mx-auto lg:mx-0"
                            >
                                🎁
                            </motion.div>
                            <h1 className="text-3xl md:text-5xl font-display font-black mb-4 leading-tight text-white dark:text-foreground">
                                {t("heroTitle")}
                            </h1>
                            <p className="text-lg text-white/90 dark:text-muted-foreground font-bold max-w-2xl mx-auto lg:mx-0">
                                {t("heroDesc")}
                            </p>
                        </div>

                        <div className="w-full lg:w-[400px] shrink-0">
                            <div className="bg-white/10 dark:bg-card/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-4 flex flex-col gap-4 shadow-inner">
                                <div className="px-4 py-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 dark:text-muted-foreground mb-1">{t("yourLink")}</p>
                                    <div className="text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap text-white dark:text-foreground font-bold opacity-80">
                                        {referralLink}
                                    </div>
                                </div>
                                <Button
                                    onClick={copyToClipboard}
                                    className="w-full bg-white dark:bg-primary text-primary dark:text-white hover:bg-white/90 dark:hover:bg-primary/80 h-14 rounded-2xl font-black text-base transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 group/btn shrink-0"
                                >
                                    {copied ? (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                            <Check className="w-5 h-5" /> {t("copied")}
                                        </motion.div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Copy className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" /> {t("copyLink")}
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* Rewards Progress */}
                        <section className="bg-card glass rounded-[3.5rem] border-2 border-border p-10 shadow-xl">
                            <h3 className="text-2xl font-display font-black mb-10 flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-yellow-500" /> {t("milestonesTitle")}
                            </h3>

                            <div className="space-y-8">
                                {rewards.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="relative group/reward"
                                    >
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="w-16 h-16 bg-muted/30 dark:bg-muted/10 rounded-[1.5rem] flex items-center justify-center text-3xl border-2 border-border/50 group-hover/reward:scale-110 transition-transform shadow-sm">
                                                {i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-black text-xl">{r.reward}</h4>
                                                    <span className="text-xs font-black bg-primary/10 text-primary px-3 py-1 rounded-full">{t("friendsCount", { count: r.friends })}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-bold italic opacity-80">{t("unlockBadge", { name: r.badge })}</p>
                                            </div>
                                        </div>
                                        <div className="h-4 bg-muted/30 dark:bg-muted/5 rounded-full overflow-hidden border border-border/20 shadow-inner">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "0%" }} // No actual progress yet
                                                className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                                            />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Referral Stats */}
                        <section className="bg-card glass rounded-[3rem] border-2 border-border p-10 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl" />
                            <h3 className="text-xl font-display font-black mb-8">{t("performance")}</h3>
                            <div className="space-y-6">
                                {shareStats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-5 group">
                                        <div className={cn(
                                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 border-2",
                                            stat.color === 'text-blue-500' ? "bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800 shadow-[0_0_15px_rgba(59,130,246,0.1)]" :
                                                stat.color === 'text-orange-500' ? "bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 shadow-[0_0_15px_rgba(249,115,22,0.1)]" :
                                                    "bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                                        )}>
                                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-display font-black leading-none mb-1">{stat.value}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t-2 border-dashed border-border text-center">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-5 py-2.5 rounded-full text-xs font-black mb-4 border border-green-200 dark:border-green-800 shadow-sm"
                                >
                                    <TrendingUp className="w-4 h-4" /> {t("topReferrer")}
                                </motion.div>
                                <p className="text-xs text-muted-foreground font-bold italic">{t("climbLeaderboard")}</p>
                            </div>
                        </section>

                        {/* Social Share Grid */}
                        <section className="bg-card glass rounded-[3rem] border-2 border-border p-10 shadow-xl overflow-hidden relative">
                            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />

                            <h3 className="text-xl font-display font-black mb-8 flex items-center gap-3">
                                <Share2 className="w-5 h-5 text-primary" /> {t("quickShare")}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-3 bg-[#1877F2] text-white h-14 rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-blue-500/20"
                                >
                                    <Facebook className="w-5 h-5 fill-white" /> {t("social.meta")}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-3 bg-black text-white h-14 rounded-2xl font-black hover:bg-gray-900 transition-all shadow-lg shadow-black/20"
                                >
                                    <Twitter className="w-5 h-5 fill-white" /> {t("social.x")}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="col-span-2 flex items-center justify-center gap-3 bg-[#25D366] text-white h-14 rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-green-500/20 mt-2"
                                >
                                    <MessageCircle className="w-5 h-5 fill-white" /> {t("social.whatsapp")}
                                </motion.button>
                            </div>
                        </section>

                        {/* FAQ Box */}
                        <section className="bg-muted/30 dark:bg-card/30 backdrop-blur-md rounded-[2.5rem] p-8 border-2 border-border/50 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Zap className="w-16 h-16" />
                            </div>
                            <h4 className="font-black mb-3 text-lg">{t("howItWorks.title")}</h4>
                            <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                                {t("howItWorks.desc")}
                            </p>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
