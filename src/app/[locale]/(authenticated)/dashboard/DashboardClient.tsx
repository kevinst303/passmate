"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Flame,
    Zap,
    Trophy,
    Target,
    TrendingUp,
    Star,
    Award,
    CirclePlay,
    Heart,
    History,
    ChevronRight,
    Sparkles,
    Clock,
    Menu,
    X,
    MoreHorizontal,
    Settings,
    GraduationCap,
    BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";

import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { blogPosts, type BlogPost } from "@/data/blogPosts";

import { DashboardData } from "@/types/dashboard";

interface DashboardClientProps {
    data: DashboardData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
    const { profile, quests, standing, topPlayers, topicProgress, activity, nextHeartAt } = data;
    const t = useTranslations("Dashboard");
    const common = useTranslations("Common");
    const nav = useTranslations("Navigation");
    const [showMobileStats, setShowMobileStats] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [currentTime, setCurrentTime] = useState<number>(0);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
            setCurrentTime(Date.now());
        });
        const timer = setInterval(() => setCurrentTime(Date.now()), 60000);
        return () => clearInterval(timer);
    }, []);

    const safeQuests = Array.isArray(quests) ? quests : [];
    const displayQuests = safeQuests.length > 0 ? safeQuests : [
        { id: '1', quests: { title: t("defaultQuests.q1"), xp_reward: 50 }, progress: 0, requirement_value: 3, is_completed: false },
        { id: '2', quests: { title: t("defaultQuests.q2"), xp_reward: 100 }, progress: 0, requirement_value: 1, is_completed: false },
    ];

    const completedQuests = displayQuests.filter(q => q.is_completed).length;
    const totalQuests = displayQuests.length;

    const xpToNextLevel = profile.level * 1000;
    const progressPercentage = (profile.current_xp / xpToNextLevel) * 100;

    const totalTopics = 5;
    const completedTopics = topicProgress.filter((p) => p.status === 'completed').length;
    const courseProgress = (completedTopics / totalTopics) * 100;

    const getNextHeartTime = () => {
        if (!nextHeartAt) return 0;
        return Math.max(0, Math.floor((new Date(nextHeartAt).getTime() - currentTime) / (60 * 1000)));
    };

    return (
        <div className="min-h-screen bg-[#FEFEF8] pb-28 md:pb-8 md:pl-20 relative overflow-hidden">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />
            {/* Header */}
            <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <motion.div
                            whileHover={{ rotate: 15 }}
                            className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-primary/5"
                        >
                            🐨
                        </motion.div>
                        <h1 className="text-xl sm:text-2xl font-display font-black text-primary tracking-tight truncate">PassMate</h1>
                    </div>

                    {/* Desktop Stats */}
                    <div className="hidden md:flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <motion.div
                                whileHover={{ scale: 1.05, y: -2 }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm transition-all shadow-sm border",
                                    profile.is_premium
                                        ? "bg-red-50 text-red-600 border-red-100 shadow-red-50"
                                        : "bg-red-50 text-red-500 border-red-100"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 fill-current", profile.is_premium && "animate-pulse")} aria-hidden="true" />
                                <span>{profile.is_premium ? "∞" : profile.hearts}</span>
                            </motion.div>
                            {!profile.is_premium && profile.hearts < 5 && nextHeartAt && mounted && (
                                <div className="flex items-center gap-1 text-[8px] font-black text-muted-foreground/60 uppercase tracking-widest px-1 mt-0.5">
                                    <Clock className="w-2 h-2" />
                                    <span>{common("nextIn", { time: getNextHeartTime() })}</span>
                                </div>
                            )}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl font-black text-sm border border-orange-100 shadow-sm shadow-orange-50"
                        >
                            <Flame className="w-4 h-4 fill-orange-500" />
                            <span>{profile.daily_streak}</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-black text-sm border border-blue-100 shadow-sm shadow-blue-50"
                        >
                            <Zap className="w-4 h-4 fill-blue-500" />
                            <span>{profile.total_xp.toLocaleString()}</span>
                        </motion.div>
                    </div>

                    {/* Mobile Stats Toggle */}
                    <button
                        className="md:hidden flex items-center gap-1.5 p-1.5 pr-2.5 rounded-2xl bg-muted/30 border border-border/50 active:scale-95 transition-all"
                        onClick={() => setShowMobileStats(!showMobileStats)}
                        aria-label="Toggle stats"
                        aria-expanded={showMobileStats}
                    >
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/50 rounded-xl border border-white/80 shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                            <span className="text-xs font-black text-orange-600">{profile.daily_streak}</span>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 bg-white/50 rounded-xl border border-white/80 shadow-sm">
                            <Zap className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                            <span className="text-xs font-black text-blue-600">{profile.total_xp}</span>
                        </div>
                        <div className="ml-1 text-muted-foreground/60">
                            {showMobileStats ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </div>
                    </button>
                </div>

                {/* Mobile Stats Dropdown */}
                <AnimatePresence>
                    {showMobileStats && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="md:hidden mt-3 p-4 bg-muted/20 backdrop-blur-md rounded-2xl border border-border/50 flex flex-col gap-3"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">{t("status")}</span>
                                {!profile.is_premium && profile.hearts < 5 && nextHeartAt && mounted && (
                                    <div className="text-[10px] text-primary font-black flex items-center gap-1 bg-primary/5 px-2 py-0.5 rounded-full">
                                        <Clock className="w-3 h-3" />
                                        {common("nextIn", { time: getNextHeartTime() })}
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <div className={cn(
                                    "flex flex-col items-center gap-1 p-3 rounded-2xl border bg-white shadow-sm",
                                    profile.is_premium ? "border-red-100/50" : "border-border/50"
                                )}>
                                    <Heart className={cn("w-5 h-5 fill-red-500 text-red-500", profile.is_premium && "animate-pulse")} />
                                    <span className="text-sm font-black text-red-600">{profile.is_premium ? "∞" : profile.hearts}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{common("hearts")}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 p-3 rounded-2xl border border-orange-100/50 bg-white shadow-sm">
                                    <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
                                    <span className="text-sm font-black text-orange-600">{profile.daily_streak}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{common("streak")}</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 p-3 rounded-2xl border border-blue-100/50 bg-white shadow-sm">
                                    <Zap className="w-5 h-5 fill-blue-500 text-blue-500" />
                                    <span className="text-sm font-black text-blue-600">{profile.total_xp}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{common("xp")}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Welcome Section */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative p-8 sm:p-12 rounded-[3rem] sm:rounded-[4rem] border border-white/40 shadow-2xl overflow-hidden group"
                >
                    {/* Immersive Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/60 backdrop-blur-3xl transition-colors group-hover:via-white/50 -z-10" />
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:scale-125 transition-transform duration-1000 delay-150" />
                    <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center relative z-10">
                        <div className="flex items-center gap-6 sm:gap-8">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -5 }}
                                className="w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-[2.5rem] sm:rounded-[3rem] flex items-center justify-center border-8 border-white shadow-2xl shadow-primary/10 shrink-0 overflow-hidden relative group/avatar"
                            >
                                <Avatar
                                    src={profile.avatar_url}
                                    size="2xl"
                                    className="w-full h-full border-0 rounded-none bg-transparent group-hover/avatar:scale-110 transition-transform duration-700 ease-out"
                                    fallback={profile.username?.[0] || '🐨'}
                                />
                                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                            </motion.div>

                            <div className="lg:hidden flex-1 space-y-2">
                                <div className="flex items-center flex-wrap gap-2">
                                    <h2 className="text-3xl sm:text-4xl font-display font-black text-foreground tracking-tighter leading-none">
                                        {t("welcome", { name: (profile.username || "Mate").split(' ')[0] })} 👋
                                    </h2>
                                    {profile.is_premium && (
                                        <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-yellow-200">
                                            <Sparkles className="w-3 h-3 fill-current" /> {t("pro")}
                                        </div>
                                    )}
                                </div>
                                <p className="text-muted-foreground/80 font-bold text-base italic leading-snug">
                                    {profile.is_premium ? t("proMateDesc") : t("doingGreat")}
                                </p>
                            </div>
                        </div>

                        <div className="hidden lg:block flex-1 space-y-3">
                            <div className="flex items-center gap-4">
                                <h2 className="text-5xl font-display font-black text-foreground tracking-tighter leading-none">
                                    {t("welcome", { name: profile.username || "Mate" })} 👋
                                </h2>
                                {profile.is_premium && (
                                    <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-2 shadow-xl shadow-yellow-200/50">
                                        <Sparkles className="w-4 h-4 fill-white" /> {t("pro")}
                                    </div>
                                )}
                            </div>
                            <p className="text-muted-foreground font-bold text-xl leading-relaxed max-w-lg italic opacity-80">
                                {profile.is_premium ? t("proMateDesc") : t("doingGreat")}
                            </p>
                        </div>

                        <Link href="/dashboard/quiz" className="w-full lg:w-auto mt-4 lg:mt-0">
                            <Button
                                size="lg"
                                variant="primary"
                                className="w-full lg:w-auto px-10 py-8 sm:px-14 sm:py-10 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all text-xl sm:text-2xl gap-4"
                            >
                                <CirclePlay className="w-8 h-8 sm:w-10 sm:h-10 fill-white/20" aria-hidden="true" />
                                <span className="tracking-tight">{t("startPracticing")}</span>
                            </Button>
                        </Link>
                    </div>
                </motion.section>

                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="/dashboard/review" className="block">
                        <motion.div
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-border/50 flex items-center gap-4 group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all h-full"
                        >
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                                🧠
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-sm sm:text-base text-foreground tracking-tight">{t("review")}</h4>
                                <p className="text-xs text-muted-foreground/80 font-medium line-clamp-1">{t("reviewDesc")}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <ChevronRight className="w-4 h-4 text-primary" aria-hidden="true" />
                            </div>
                        </motion.div>
                    </Link>

                    <Link href="/ai-tutor" className="block">
                        <motion.div
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-border/50 flex items-center gap-4 group hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all h-full"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shrink-0 shadow-inner">
                                💬
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-sm sm:text-base text-foreground tracking-tight">{t("talkToOllie")}</h4>
                                <p className="text-xs text-muted-foreground/80 font-medium line-clamp-1">{t("ollieDesc")}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-500/5 flex items-center justify-center group-hover:bg-blue-500/10 transition-colors">
                                <ChevronRight className="w-4 h-4 text-blue-500" aria-hidden="true" />
                            </div>
                        </motion.div>
                    </Link>
                </section>

                {/* Course Progress Card */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="group relative bg-[#0F172A] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] text-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden"
                >
                    {/* Animated Glows */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors duration-1000" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-blue-500/20 transition-colors duration-1000" />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 lg:gap-14">
                        <div className="flex items-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 8 }}
                                className="w-16 h-16 sm:w-24 sm:h-24 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-3xl sm:text-5xl shadow-2xl backdrop-blur-xl group-hover:border-white/20 transition-all"
                            >
                                🎓
                            </motion.div>
                            <div>
                                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black leading-none mb-2 tracking-tighter">
                                    {t("course")}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <p className="font-bold text-primary/90 text-sm sm:text-lg">
                                        {completedTopics}/{totalTopics} {t("topicsMasteredShort", { completed: completedTopics, total: totalTopics })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div className="flex items-end justify-between font-black">
                                <span className="text-white/30 uppercase text-[10px] tracking-[0.2em]">Current Progress</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl sm:text-5xl tracking-tighter">{Math.round(courseProgress)}</span>
                                    <span className="text-lg text-white/40">%</span>
                                </div>
                            </div>
                            <div className="h-4 sm:h-6 w-full bg-white/5 rounded-full overflow-hidden p-1 sm:p-1.5 border border-white/10 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: courseProgress + "%" }}
                                    transition={{ duration: 1.5, ease: [0.34, 1.56, 0.64, 1] }}
                                    className="h-full bg-gradient-to-r from-primary via-primary to-emerald-400 rounded-full relative"
                                >
                                    <div className="absolute inset-0 overflow-hidden rounded-full">
                                        <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <Link href="/skill-trees" className="w-full md:w-auto">
                            <Button
                                size="lg"
                                variant="white"
                                className="w-full md:w-auto px-8 py-7 sm:px-10 sm:py-8 rounded-[1.5rem] sm:rounded-[2rem] text-base sm:text-lg shadow-2xl shadow-white/10"
                            >
                                {t("resumePath")}
                            </Button>
                        </Link>
                    </div>
                </motion.section>

                {/* Level Progress */}
                <section className="bg-card glass p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm">
                    <div className="flex justify-between items-end mb-3 sm:mb-4">
                        <div>
                            <p className="text-[10px] sm:text-xs uppercase font-extrabold text-muted-foreground tracking-widest mb-0.5 sm:mb-1">{t("level", { level: profile.level })}</p>
                            <h3 className="text-lg sm:text-xl font-display font-bold">
                                {profile.level < 5 ? t("rank.beginner") : profile.level < 10 ? t("rank.journeyman") : t("rank.expert")}
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-muted-foreground">{profile.current_xp} / {xpToNextLevel} XP</p>
                    </div>
                    <div className="h-3 sm:h-4 w-full bg-muted rounded-full overflow-hidden p-0.5 sm:p-1 border border-border/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                        />
                    </div>
                </section>

                {/* Quests & League Grid */}
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    {/* Quests */}
                    <section className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-200/50">
                                    <Target className="w-6 h-6 text-white" aria-hidden="true" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-black tracking-tight">{t("dailyQuests")}</h3>
                                    <p className="text-xs text-muted-foreground">{completedQuests} of {totalQuests} completed</p>
                                </div>
                            </div>
                            <Link href="/quests" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                                {t("viewAll")} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Quest Cards */}
                        <div className="space-y-3">
                            {displayQuests.slice(0, 3).map((userQuest, idx) => (
                                <motion.div
                                    key={userQuest.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                                    className={cn(
                                        "relative p-4 rounded-2xl border transition-all duration-300 group cursor-pointer",
                                        userQuest.is_completed
                                            ? "bg-gradient-to-r from-green-50 to-emerald-50/50 border-green-200/60"
                                            : "bg-white/80 border-gray-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Icon */}
                                        <div className={cn(
                                            "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                                            userQuest.is_completed
                                                ? "bg-green-500 text-white shadow-lg shadow-green-200"
                                                : "bg-gradient-to-br from-gray-100 to-gray-50 text-gray-400 group-hover:from-primary/20 group-hover:to-primary/10 group-hover:text-primary"
                                        )}>
                                            {userQuest.is_completed ? (
                                                <Award className="w-7 h-7" />
                                            ) : (
                                                <Star className="w-7 h-7" />
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className={cn(
                                                    "font-bold text-sm truncate",
                                                    userQuest.is_completed ? "text-green-700" : "text-foreground"
                                                )}>
                                                    {userQuest.quests?.title || "Daily Quest"}
                                                </h4>
                                                <div className={cn(
                                                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                                                    userQuest.is_completed
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-amber-100 text-amber-700"
                                                )}>
                                                    <Zap className="w-3 h-3" />
                                                    +{userQuest.quests?.xp_reward || 50} XP
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (userQuest.progress / (userQuest.requirement_value || 1)) * 100)}%` }}
                                                        transition={{ duration: 1, delay: 0.3 }}
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            userQuest.is_completed
                                                                ? "bg-green-500"
                                                                : "bg-gradient-to-r from-primary to-teal-400"
                                                        )}
                                                    />
                                                </div>
                                                <span className="text-xs font-bold text-muted-foreground tabular-nums">
                                                    {userQuest.progress}/{userQuest.requirement_value}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Completion Badge */}
                                        {userQuest.is_completed && (
                                            <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* League Standings */}
                    <section className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg shadow-orange-200/50">
                                    🏆
                                </div>
                                <div>
                                    <h3 className="text-xl font-display font-black tracking-tight">{standing?.leagues?.name || 'Bronze'} {nav("leagues")}</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs text-muted-foreground">{t("live")}</span>
                                    </div>
                                </div>
                            </div>
                            <Link href="/leagues" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark transition-colors">
                                {t("viewAll")} <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* League Card */}
                        <div className="bg-gradient-to-br from-amber-50 via-orange-50/50 to-yellow-50/30 rounded-2xl border border-orange-100/50 p-5 space-y-5">
                            {/* Your Rank */}
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-3xl shadow-lg">
                                    🥉
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-muted-foreground font-medium mb-1">{t("yourRank")}</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-4xl font-display font-black text-foreground">#{standing?.current_rank || 1}</p>
                                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>Promotion Zone</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Weekly XP</p>
                                    <p className="text-lg font-bold text-amber-600">{standing?.weekly_xp?.toLocaleString() || 0}</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />

                            {/* Leaderboard */}
                            <div className="space-y-2">
                                {(() => {
                                    // Always show at least 3 players
                                    const players = Array.isArray(topPlayers) && topPlayers.length > 0
                                        ? topPlayers.slice(0, 3)
                                        : [
                                            { user_id: 'mock1', weekly_xp: 450, profiles: { username: 'DingoDave', avatar_url: null } },
                                            { user_id: 'mock2', weekly_xp: 320, profiles: { username: 'KoalaKate', avatar_url: null } },
                                            { user_id: profile.id, weekly_xp: standing?.weekly_xp || 0, profiles: { username: profile.username, avatar_url: profile.avatar_url } },
                                        ];

                                    return players.map((player, idx) => (
                                        <motion.div
                                            key={player.user_id || idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl transition-all",
                                                player.user_id === profile.id
                                                    ? "bg-gradient-to-r from-amber-100 to-orange-50 border border-amber-200/50"
                                                    : "bg-white/60 hover:bg-white"
                                            )}
                                        >
                                            {/* Rank */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black",
                                                idx === 0 ? "bg-yellow-400 text-yellow-900" :
                                                    idx === 1 ? "bg-gray-300 text-gray-700" :
                                                        "bg-amber-600 text-white"
                                            )}>
                                                {idx + 1}
                                            </div>

                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center overflow-hidden border-2 border-white shadow">
                                                <Avatar
                                                    src={player.profiles?.avatar_url}
                                                    size="sm"
                                                    fallback={player.profiles?.username?.[0] || '?'}
                                                    className="w-full h-full"
                                                />
                                            </div>

                                            {/* Name */}
                                            <div className="flex-1 min-w-0">
                                                <p className={cn(
                                                    "font-bold text-sm truncate",
                                                    player.user_id === profile.id ? "text-amber-700" : "text-foreground"
                                                )}>
                                                    {player.user_id === profile.id ? t("you") : (player.profiles?.username || 'Player')}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground">
                                                    {idx === 0 ? "Leader" : idx === 1 ? "Challenger" : "Rising Star"}
                                                </p>
                                            </div>

                                            {/* XP */}
                                            <div className={cn(
                                                "flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold",
                                                player.user_id === profile.id
                                                    ? "bg-amber-500 text-white"
                                                    : "bg-blue-50 text-blue-600"
                                            )}>
                                                <Zap className="w-3 h-3" />
                                                {player.weekly_xp.toLocaleString()}
                                            </div>
                                        </motion.div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Mock Test CTA */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative bg-[#1E293B] p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[4rem] text-white shadow-2xl overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="absolute -top-10 -right-10 w-64 h-64 bg-accent/10 rounded-full blur-[80px] group-hover:bg-accent/20 transition-all duration-1000" />

                    <div className="absolute top-0 right-0 p-8 sm:p-12 opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 pointer-events-none">
                        <span className="text-[140px] sm:text-[200px] leading-none select-none">🇦🇺</span>
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 sm:gap-14">
                        <div className="max-w-xl text-center lg:text-left space-y-5 sm:space-y-6">
                            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest border border-accent/20 backdrop-blur-md">
                                <Sparkles className="w-3.5 h-3.5 fill-current" />
                                Official Simulation
                            </div>
                            <h3 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-[0.9] sm:leading-none">
                                {t("mockTest")} <span className="inline-block animate-bounce-slow">🇦🇺</span>
                            </h3>
                            <p className="font-bold text-white/60 text-base sm:text-xl leading-relaxed max-w-lg">
                                {t("mockTestDesc")}
                            </p>
                        </div>
                        <Link href="/dashboard/mock-test" className="w-full lg:w-auto shrink-0 group/btn">
                            <Button
                                variant="accent"
                                size="lg"
                                className="w-full lg:w-auto px-10 py-8 sm:px-14 sm:py-10 rounded-[1.5rem] sm:rounded-[2.5rem] text-xl sm:text-3xl shadow-[0_20px_40px_-10px_rgba(230,126,90,0.3)] flex items-center justify-center gap-4"
                            >
                                <span>{t("attemptNowShort")}</span>
                                <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover/btn:translate-x-2 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </motion.section>

                {/* Latest Insights - Blog Section */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between px-1 sm:px-2">
                        <h3 className="text-lg sm:text-xl font-display font-bold flex items-center gap-2">
                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" aria-hidden="true" />
                            <span>{nav("blog")}</span>
                        </h3>
                        <Link href="/blog" className="text-xs sm:text-sm font-bold text-primary hover:underline">{t("viewAll")}</Link>
                    </div>

                    <div className="relative -mx-4 sm:mx-0 overflow-hidden">
                        <div className="mask-horizontal-fade overflow-x-auto no-scrollbar snap-x snap-mandatory flex flex-row flex-nowrap sm:grid sm:grid-cols-2 gap-5 px-4 pb-8 sm:px-0 sm:pb-0 scroll-smooth min-h-[160px]">
                            {blogPosts.slice(0, 2).map((post: BlogPost, idx) => (
                                <Link key={post.slug} href={`/blog/${post.slug}`} className="flex-shrink-0 w-[85%] sm:w-auto snap-center">
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.1 }}
                                        whileHover={{ y: -6, scale: 1.02 }}
                                        className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white/50 p-5 flex gap-5 items-center group transition-all h-full shadow-[0_12px_40px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:border-primary/30"
                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-muted/50 rounded-[2rem] overflow-hidden shrink-0 relative shadow-inner border border-white/40">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent group-hover:opacity-60 transition-opacity" />
                                            <div className="absolute inset-0 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-700">
                                                {post.category === "Citizenship" ? "🇦🇺" : post.category === "Visas" ? "🛂" : "🌏"}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/5">{post.category}</span>
                                                <div className="flex items-center gap-1 text-muted-foreground/60">
                                                    <Clock className="w-3 h-3" />
                                                    <span className="text-[10px] font-bold uppercase tracking-tighter">{post.readTime}</span>
                                                </div>
                                            </div>
                                            <h4 className="font-black text-base sm:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 tracking-tight">
                                                {post.title}
                                            </h4>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Global Activity Feed */}
                <section className="space-y-4 sm:space-y-6">
                    <div className="flex items-center justify-between px-1 sm:px-2">
                        <h3 className="text-lg sm:text-xl font-display font-bold flex items-center gap-2">
                            <History className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" aria-hidden="true" />
                            <span>{t("recentActivity")}</span>
                        </h3>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest">{t("live")}</span>
                        </div>
                    </div>

                    <div className="relative -mx-4 sm:mx-0 overflow-hidden">
                        <div className="mask-horizontal-fade overflow-x-auto no-scrollbar snap-x snap-mandatory flex flex-row flex-nowrap sm:grid sm:grid-cols-2 gap-4 px-4 pb-8 sm:px-0 sm:pb-0 scroll-smooth min-h-[120px]">
                            {activity && activity.length > 0 ? activity.slice(0, 6).map((act, idx) => (
                                <motion.div
                                    key={act.id}
                                    initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex-shrink-0 w-[85%] sm:w-auto snap-center bg-white/50 backdrop-blur-xl p-5 rounded-[2.5rem] border border-white/50 flex items-center gap-4 group hover:shadow-2xl hover:border-blue-400/20 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-[1.25rem] overflow-hidden flex items-center justify-center text-2xl font-bold border-4 border-white shadow-xl relative group-hover:scale-105 group-hover:-rotate-3 transition-all duration-500">
                                            <Avatar
                                                src={act.avatar}
                                                size="md"
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        {act.isPremium && (
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg"
                                            >
                                                ⭐
                                            </motion.div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-black text-[15px] sm:text-base truncate tracking-tight text-foreground">{act.user}</span>
                                            {act.isPremium && (
                                                <span className="bg-gradient-to-r from-yellow-400 to-amber-600 text-[8px] font-black px-2 py-0.5 rounded-lg text-white shadow-lg shadow-yellow-200/50 uppercase shrink-0">Pro</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-[11px] sm:text-xs text-muted-foreground/80 font-black uppercase tracking-widest truncate">
                                                {t("scored", { score: act.score, total: act.total })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 space-y-1">
                                        <div className="flex items-center justify-end gap-1 text-blue-600 font-black text-base sm:text-lg">
                                            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-blue-600 drop-shadow-sm" aria-hidden="true" />
                                            <span>+{act.xp}</span>
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5">
                                            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                                            <p className="text-[9px] text-muted-foreground/60 font-black uppercase tracking-[0.1em] whitespace-nowrap" suppressHydrationWarning>
                                                {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="col-span-full w-full py-16 text-center bg-white/30 backdrop-blur-md rounded-[3.5rem] border-2 border-dashed border-border/40">
                                    <div className="text-5xl mb-4 opacity-20">🦘</div>
                                    <p className="text-muted-foreground/50 font-black italic text-xs tracking-[0.4em] uppercase">{t("quietOutback")}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
