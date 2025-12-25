"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
    Shield,
    Settings,
    CreditCard,
    Share2,
    LogOut,
    Flame,
    Zap,
    Trophy,
    Target,
    ChevronRight,
    Mail,
    User,
    Award,
    Edit3,
    MessageCircle
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/i18n/routing";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DashboardData } from "@/types/dashboard";
import { AchievementsData } from "@/types/achievements";

interface ProfileClientProps {
    data: DashboardData;
    achievementsData: AchievementsData;
}

export default function ProfileClient({ data, achievementsData }: ProfileClientProps) {
    const t = useTranslations("Profile");
    const tBilling = useTranslations("Billing");
    const tSecurity = useTranslations("Security");
    const tReferral = useTranslations("Referral");
    const tSupport = useTranslations("Support");
    const { profile, user } = data;
    const { achievements } = achievementsData;
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const joinedDate = new Date(profile.created_at).toLocaleDateString('en-AU', {
        month: 'long',
        year: 'numeric'
    });

    const unlockedAchievements = achievements.filter((a) => a.is_unlocked);

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8 font-sans transition-colors duration-500">
            <main className="max-w-6xl mx-auto py-8 space-y-12">
                {/* Profile Header Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card glass p-8 md:p-12 rounded-[3.5rem] md:rounded-[5rem] border-2 border-border shadow-2xl relative overflow-hidden group"
                >
                    {/* Dynamic Ambient Background */}
                    <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] animate-pulse pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px] pointer-events-none" />

                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 text-center lg:text-left">
                        {/* Avatar Column */}
                        <div className="relative shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="relative group/avatar cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-primary/20 rounded-[4.5rem] blur-2xl group-hover/avatar:bg-primary/30 transition-all duration-500" />
                                <div className="w-52 h-52 bg-gradient-to-br from-background via-background to-primary/5 rounded-[4rem] flex items-center justify-center text-8xl shadow-2xl border-[8px] border-card overflow-hidden transition-all duration-700 relative z-10">
                                    <Avatar
                                        src={profile.avatar_url}
                                        size="2xl"
                                        className="w-full h-full border-0 rounded-none bg-transparent scale-110 group-hover/avatar:scale-125 transition-transform duration-700"
                                    />
                                </div>
                                <Link href="/settings">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 15 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="absolute -bottom-2 -right-2 z-20 bg-primary p-4 rounded-2xl shadow-2xl text-white border-4 border-card hover:bg-primary-dark transition-colors"
                                    >
                                        <Edit3 className="w-6 h-6" />
                                    </motion.div>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Info Column */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-4 mb-4">
                                    <h1 className="text-4xl md:text-5xl font-display font-black text-foreground tracking-tight lg:truncate max-w-[400px]">
                                        {profile.full_name || profile.username || 'Citizen Mate'}
                                    </h1>
                                    <div className="flex gap-2 justify-center shrink-0">
                                        <motion.span
                                            whileHover={{ y: -2 }}
                                            className="px-5 py-2 rounded-2xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                                        >
                                            <Zap className="w-3.5 h-3.5 fill-white" />
                                            {t("level", { level: profile.level })}
                                        </motion.span>
                                        {profile.is_premium && (
                                            <motion.span
                                                whileHover={{ y: -2 }}
                                                className="px-5 py-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-950 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-orange-200 flex items-center gap-2"
                                            >
                                                <Trophy className="w-3.5 h-3.5 fill-yellow-950" />
                                                {t("pro")}
                                            </motion.span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-muted-foreground/60 font-bold italic">
                                    <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default group">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        {user.email}
                                    </div>
                                    <div className="flex items-center gap-2 hover:text-primary transition-colors cursor-default group">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <User className="w-4 h-4" />
                                        </div>
                                        {t("joined", { date: joinedDate })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-orange-500/10 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-3xl border-2 border-orange-500/20 font-black text-base flex items-center gap-3 shadow-xl shadow-orange-500/5 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-transform">
                                        <Flame className="w-6 h-6 fill-white text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase opacity-60 leading-none mb-1">Active Streak</p>
                                        <p className="leading-none">{t("dayStreak", { count: profile.daily_streak })}</p>
                                    </div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-blue-500/10 text-blue-600 dark:text-blue-400 px-8 py-4 rounded-3xl border-2 border-blue-500/20 font-black text-base flex items-center gap-3 shadow-xl shadow-blue-500/5 group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform">
                                        <Zap className="w-6 h-6 fill-white text-white" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase opacity-60 leading-none mb-1">Total Experience</p>
                                        <p className="leading-none">{profile.total_xp.toLocaleString()} XP</p>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Actions Column */}
                        <div className="flex flex-col gap-4 w-full lg:w-64">
                            <Link href="/settings" className="w-full">
                                <Button variant="outline" className="h-16 w-full px-8 rounded-[1.5rem] font-black text-lg border-2 border-border hover:bg-muted/50 transition-all flex items-center justify-center gap-3 group">
                                    <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform" /> {t("settings")}
                                </Button>
                            </Link>
                            <Button
                                variant="accent"
                                size="lg"
                                className="h-16 w-full rounded-[1.5rem] font-black text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 bg-rose-500 hover:bg-rose-600 text-white"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-5 h-5" /> {t("signOut")}
                            </Button>
                        </div>
                    </div>
                </motion.section>

                <div className="grid lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        {/* Interactive Stats Panel */}
                        <section className="bg-card glass p-10 rounded-[3.5rem] border-2 border-border shadow-xl grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { icon: Zap, label: t("currentXp"), value: profile.current_xp, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { icon: Flame, label: t("streak"), value: profile.daily_streak, color: "text-orange-500", bg: "bg-orange-500/10" },
                                { icon: Trophy, label: t("quizzes"), value: 24, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                                { icon: Award, label: t("badges"), value: unlockedAchievements.length, color: "text-purple-500", bg: "bg-purple-500/10" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    className="text-center space-y-3"
                                >
                                    <div className={cn("w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-inner relative group cursor-default", stat.bg)}>
                                        <stat.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", stat.color)} />
                                        <div className={cn("absolute inset-0 rounded-3xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity", stat.bg)} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-3xl font-display font-black tracking-tight">{stat.value}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </section>

                        {/* Enhanced Achievements Display */}
                        <section className="bg-card glass p-10 rounded-[3.5rem] border-2 border-border shadow-xl relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h3 className="text-3xl font-display font-black flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                                            <Award className="w-7 h-7 text-yellow-900 fill-yellow-900" />
                                        </div>
                                        {t("recentBadges")}
                                    </h3>
                                    <p className="text-muted-foreground font-bold italic ml-16">{t("unlockedCount", { unlocked: unlockedAchievements.length, total: achievements.length })} Achievements</p>
                                </div>
                                <Link href="/achievements">
                                    <Button variant="outline" className="rounded-2xl font-black gap-2 hover:bg-primary/5 border-2">
                                        {t("viewCollection")} <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                                {unlockedAchievements.slice(0, 8).map((achievement, idx) => (
                                    <motion.div
                                        key={achievement.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -8, scale: 1.05 }}
                                        className="relative group/badge"
                                    >
                                        <div className="absolute inset-0 bg-yellow-400/10 blur-2xl rounded-full opacity-0 group-hover/badge:opacity-100 transition-opacity" />
                                        <div className="aspect-square bg-gradient-to-br from-card to-muted/30 border-2 border-border group-hover/badge:border-yellow-400/50 shadow-lg rounded-[2.5rem] flex items-center justify-center text-5xl relative z-10 transition-all duration-500">
                                            {achievement.badge_url ? (
                                                achievement.badge_url.startsWith('http') || achievement.badge_url.startsWith('/') ? (
                                                    <Image
                                                        src={achievement.badge_url}
                                                        alt={achievement.name}
                                                        fill
                                                        className="object-contain p-6 group-hover/badge:scale-110 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <span role="img" aria-label={achievement.name} className="group-hover/badge:scale-125 transition-transform duration-500">{achievement.badge_url}</span>
                                                )
                                            ) : "🏆"}
                                        </div>
                                        <div className="mt-4 text-center">
                                            <span className="text-[11px] font-black uppercase text-foreground tracking-tighter line-clamp-1 block">{achievement.name}</span>
                                        </div>
                                    </motion.div>
                                ))}

                                {unlockedAchievements.length === 0 && (
                                    <div className="col-span-full py-20 text-center flex flex-col items-center gap-6">
                                        <div className="w-24 h-24 bg-muted rounded-[2rem] flex items-center justify-center text-5xl opacity-20 grayscale animate-bounce">🏆</div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-display font-black">{t("noAchievementsYet") || "Ready to excel?"}</p>
                                            <p className="text-muted-foreground font-bold italic">{t("startLearning")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="lg:col-span-4 space-y-10 flex flex-col">
                        {/* Premium Status / CTA Card */}
                        <motion.section
                            whileHover={{ scale: 1.02 }}
                            className={cn(
                                "rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group flex-1 transition-all duration-700 border-4",
                                profile.is_premium
                                    ? "bg-card glass border-primary/20 text-foreground"
                                    : "bg-slate-950 text-white border-white/5"
                            )}
                        >
                            <div className="absolute top-0 right-0 w-full h-full bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="space-y-8">
                                    <div className={cn(
                                        "w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-2xl transition-transform duration-500 group-hover:rotate-[15deg]",
                                        profile.is_premium ? "bg-primary text-white" : "bg-white/10 backdrop-blur-md"
                                    )}>
                                        {profile.is_premium ? "🌟" : "💎"}
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-display font-black mb-3 tracking-tight leading-none bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                            {profile.is_premium ? t("legendTitle") : t("goldTitle")}
                                        </h2>
                                        <p className={cn(
                                            "text-lg font-bold leading-relaxed",
                                            profile.is_premium ? "text-muted-foreground" : "text-white/40"
                                        )}>
                                            {profile.is_premium ? t("legendDesc") : t("goldDesc")}
                                        </p>
                                    </div>

                                    <div className="space-y-5">
                                        {[
                                            t("features.mockTests"),
                                            profile.is_premium ? t("features.aiTutorUnlocked") : t("features.aiTutor"),
                                            t("features.analytics"),
                                            t("features.noHearts")
                                        ].map((feature, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + (i * 0.1) }}
                                                className={cn(
                                                    "flex items-center gap-4 text-sm font-black tracking-wide",
                                                    profile.is_premium ? "text-foreground" : "text-white/80"
                                                )}
                                            >
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-[10px] text-white shadow-lg shadow-primary/20">
                                                    {profile.is_premium ? "✓" : "✨"}
                                                </div>
                                                {feature}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-12 pt-8 border-t border-white/10">
                                    {!profile.is_premium ? (
                                        <Link href="/premium">
                                            <Button size="lg" className="w-full bg-white text-black hover:bg-white/90 h-20 rounded-[2rem] font-black text-xl shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1">
                                                {t("becomePro")}
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="lg" className="w-full h-20 rounded-[2rem] font-black text-xl border-4 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all">
                                            {t("supportOllie")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* Aesthetic Quick Navigation */}
                <section className="bg-card glass rounded-[4rem] border-2 border-border shadow-2xl overflow-hidden p-4">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: CreditCard, label: tBilling("title"), href: "/billing", color: "text-green-500", bg: "bg-green-500/10", desc: "Manage subscription" },
                            { icon: Shield, label: tSecurity("title"), href: "/security", color: "text-blue-500", bg: "bg-blue-500/10", desc: "Privacy settings" },
                            { icon: Share2, label: tReferral("performance"), href: "/referral", color: "text-orange-500", bg: "bg-orange-500/10", desc: "Earn rewards" },
                            { icon: MessageCircle, label: tSupport("title"), href: "/support", color: "text-purple-500", bg: "bg-purple-500/10", desc: "Get help" }
                        ].map((opt, i) => (
                            <Link
                                key={i}
                                href={opt.href}
                                className="group p-6 rounded-[3rem] hover:bg-muted/50 transition-all relative overflow-hidden"
                            >
                                <div className="flex items-center gap-5 relative z-10 text-left">
                                    <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner", opt.bg)}>
                                        <opt.icon className={cn("w-7 h-7", opt.color)} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-black text-lg text-foreground tracking-tight leading-none mb-1 group-hover:text-primary transition-colors">
                                            {opt.label}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-bold italic truncate opacity-60">
                                            {opt.desc}
                                        </p>
                                    </div>
                                    <div className="ml-auto w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
