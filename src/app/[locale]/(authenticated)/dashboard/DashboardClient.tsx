"use client";

import { motion } from "framer-motion";
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

    const displayQuests = quests.length > 0 ? quests : [
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
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl sm:text-2xl" aria-hidden="true">🐨</span>
                        <h1 className="text-lg sm:text-xl font-display font-bold text-primary truncate">PassMate</h1>
                    </div>

                    {/* Desktop Stats */}
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="flex flex-col items-end gap-1">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm transition-all shadow-sm border",
                                    profile.is_premium
                                        ? "bg-red-50 text-red-600 border-red-100 shadow-red-50"
                                        : "bg-red-50 text-red-600 border-red-100"
                                )}
                            >
                                <Heart className={cn("w-4 h-4 fill-red-600", profile.is_premium && "animate-pulse")} aria-hidden="true" />
                                <span>{profile.is_premium ? "∞" : profile.hearts}</span>
                            </motion.div>
                            {!profile.is_premium && profile.hearts < 5 && nextHeartAt && mounted && (
                                <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest px-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    <span>{common("nextIn", { time: getNextHeartTime() })}</span>
                                </div>
                            )}
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl font-black text-sm border border-orange-100 shadow-sm shadow-orange-50"
                        >
                            <Flame className="w-4 h-4 fill-orange-600" />
                            <span>{profile.daily_streak}</span>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl font-black text-sm border border-blue-100 shadow-sm shadow-blue-50"
                        >
                            <Zap className="w-4 h-4 fill-blue-600" />
                            <span>{profile.total_xp.toLocaleString()}</span>
                        </motion.div>
                    </div>

                    {/* Mobile Stats Toggle */}
                    <button
                        className="sm:hidden flex items-center gap-2 p-2 rounded-xl bg-muted/50 active:bg-muted transition-colors"
                        onClick={() => setShowMobileStats(!showMobileStats)}
                        aria-label="Toggle stats"
                        aria-expanded={showMobileStats}
                    >
                        <div className="flex items-center gap-1 text-orange-600">
                            <Flame className="w-4 h-4 fill-orange-600" />
                            <span className="text-xs font-bold">{profile.daily_streak}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600">
                            <Zap className="w-4 h-4 fill-blue-600" />
                            <span className="text-xs font-bold">{profile.total_xp}</span>
                        </div>
                        {showMobileStats ? <X className="w-4 h-4 text-muted-foreground" /> : <Menu className="w-4 h-4 text-muted-foreground" />}
                    </button>
                </div>

                {/* Mobile Stats Dropdown */}
                {showMobileStats && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="sm:hidden mt-3 pt-3 border-t border-border flex flex-wrap gap-2"
                    >
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-sm",
                            profile.is_premium ? "bg-red-100 text-red-600 border border-red-200" : "bg-red-100 text-red-600"
                        )}>
                            <Heart className={cn("w-4 h-4 fill-red-600", profile.is_premium && "animate-pulse")} />
                            <span>{common("hearts")}: {profile.is_premium ? common("unlimited") : profile.hearts}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-bold text-sm">
                            <Flame className="w-4 h-4 fill-orange-600" />
                            <span>{common("streak")}: {profile.daily_streak} {common("days")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-600 px-3 py-1.5 rounded-full font-bold text-sm">
                            <Zap className="w-4 h-4 fill-blue-600" />
                            <span>{common("xp")}: {profile.total_xp}</span>
                        </div>
                        {!profile.is_premium && profile.hearts < 5 && nextHeartAt && mounted && (
                            <div className="w-full text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {common("nextIn", { time: getNextHeartTime() })}
                            </div>
                        )}
                    </motion.div>
                )}
            </header>

            <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Welcome Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 lg:flex-row lg:items-center bg-white/70 backdrop-blur-xl p-6 sm:p-10 rounded-[3rem] border-2 border-border shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                        <Sparkles className="w-32 h-32 text-primary" />
                    </div>

                    <div className="flex items-center gap-6 sm:block">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -5 }}
                            className="w-20 h-20 sm:w-32 sm:h-32 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-3xl sm:text-5xl border-4 border-white shadow-2xl shrink-0 overflow-hidden relative"
                        >
                            <Avatar
                                src={profile.avatar_url}
                                size="2xl"
                                className="w-full h-full border-0 rounded-none bg-transparent"
                                fallback={profile.username?.[0] || '🐨'}
                            />
                        </motion.div>
                    </div>

                    <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl sm:text-4xl font-display font-black text-foreground tracking-tight leading-none">
                                {t("welcome", { name: profile.username || "Mate" })} 👋
                            </h2>
                            {profile.is_premium && (
                                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-yellow-200">
                                    <Sparkles className="w-3.5 h-3.5 fill-white" /> {t("pro")}
                                </div>
                            )}
                        </div>
                        <p className="text-muted-foreground font-bold text-lg leading-relaxed max-w-md italic">
                            {profile.is_premium ? t("proMateDesc") : t("doingGreat")}
                        </p>
                    </div>

                    <Link href="/dashboard/quiz" className="w-full lg:w-auto relative z-10">
                        <Button size="lg" className="w-full lg:w-auto px-12 py-8 rounded-[2rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-xl font-black gap-3 bg-primary border-b-8 border-primary-dark">
                            <CirclePlay className="w-8 h-8 fill-white/20" aria-hidden="true" />
                            <span>{t("startPracticing")}</span>
                        </Button>
                    </Link>
                </motion.section>

                {/* Quick Actions */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <Link href="/dashboard/review" className="block">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group hover:border-primary/50 hover:shadow-md transition-all h-full"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl group-hover:bg-orange-200 transition-colors shrink-0">
                                🧠
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm sm:text-base">{t("review")}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{t("reviewDesc")}</p>
                            </div>
                            <ChevronRight className="hidden sm:block w-4 h-4 text-primary" aria-hidden="true" />
                        </motion.div>
                    </Link>

                    <Link href="/ai-tutor" className="block">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group hover:border-primary/50 hover:shadow-md transition-all h-full"
                        >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl group-hover:bg-blue-200 transition-colors shrink-0">
                                💬
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm sm:text-base">{t("talkToOllie")}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{t("ollieDesc")}</p>
                            </div>
                            <ChevronRight className="hidden sm:block w-4 h-4 text-primary" aria-hidden="true" />
                        </motion.div>
                    </Link>
                </section>

                {/* Course Progress Card */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-br from-[#1a1a1a] to-black p-8 sm:p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
                        <div className="flex items-center gap-6">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 12 }}
                                className="w-20 h-20 sm:w-28 sm:h-28 bg-white/5 border-2 border-white/10 rounded-[2.5rem] flex items-center justify-center text-4xl sm:text-6xl shadow-2xl backdrop-blur-md"
                            >
                                🎓
                            </motion.div>
                            <div>
                                <h3 className="text-3xl sm:text-5xl font-display font-black leading-none mb-2 tracking-tighter">
                                    {t("course")}
                                </h3>
                                <p className="font-bold text-primary text-xl">
                                    {completedTopics}/{totalTopics} {t("topicsMastered", { completed: completedTopics, total: totalTopics })}
                                </p>
                            </div>
                        </div>

                        <div className="flex-1 w-full space-y-6">
                            <div className="flex items-center justify-between font-black text-2xl tracking-tighter">
                                <span className="text-white/40 uppercase text-xs tracking-[0.3em]">Overall Mastery</span>
                                <span className="text-white text-4xl">{Math.round(courseProgress)}%</span>
                            </div>
                            <div className="h-6 w-full bg-white/5 rounded-full overflow-hidden p-1.5 border border-white/10 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: courseProgress + "%" }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-shimmer" style={{ backgroundSize: '200% 100%', backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)' }} />
                                </motion.div>
                            </div>
                        </div>

                        <Link href="/skill-trees" className="w-full md:w-auto">
                            <Button size="lg" className="w-full md:w-auto bg-white text-black hover:bg-white/90 px-10 py-8 rounded-[2rem] font-black text-lg shadow-2xl shadow-white/5 border-b-8 border-gray-200">
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
                    <section className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between px-1 sm:px-2">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg sm:text-xl font-display font-bold flex items-center gap-2">
                                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" aria-hidden="true" />
                                    <span>{t("dailyQuests")}</span>
                                </h3>
                                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-black">
                                    {completedQuests}/{totalQuests}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="hidden sm:inline text-xs sm:text-sm font-bold text-muted-foreground">{t("resetIn", { time: "8h" })}</span>
                                <Link href="/quests" className="text-xs sm:text-sm font-bold text-primary hover:underline">{t("viewAll")}</Link>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {displayQuests.map((userQuest) => (
                                <motion.div
                                    key={userQuest.id}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className="bg-white/60 backdrop-blur-md p-6 rounded-[2.5rem] border-2 border-border shadow-lg flex items-center gap-6 group hover:border-primary/40 hover:bg-white/80 transition-all"
                                >
                                    <div className={cn(
                                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:rotate-6",
                                        userQuest.is_completed
                                            ? "bg-green-50 text-green-500 border-2 border-green-100"
                                            : "bg-white text-primary border-2 border-primary/10"
                                    )}>
                                        {userQuest.is_completed ? <Award className="w-8 h-8" /> : <Star className="w-8 h-8 fill-primary/10" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className={cn("font-black text-lg tracking-tight truncate", userQuest.is_completed ? "text-muted-foreground line-through opacity-50" : "text-foreground")}>
                                                {userQuest.quests?.title || t("dailyQuests")}
                                            </p>
                                            <span className="text-primary font-black text-sm">+{userQuest.quests?.xp_reward || 0} XP</span>
                                        </div>
                                        {!userQuest.is_completed && (
                                            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden p-0.5 border border-border/50">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(userQuest.progress / (userQuest.requirement_value || 1)) * 100}%` }}
                                                    className="h-full bg-primary rounded-full"
                                                />
                                            </div>
                                        )}
                                        {userQuest.is_completed && (
                                            <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Quest Completed!</span>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* League Standings */}
                    <section className="space-y-3 sm:space-y-4">
                        <div className="flex items-center justify-between px-1 sm:px-2">
                            <h3 className="text-lg sm:text-xl font-display font-bold flex items-center gap-2">
                                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" aria-hidden="true" />
                                <span>{standing?.leagues?.name || 'Bronze'} {nav("leagues")}</span>
                            </h3>
                            <Link href="/leagues" className="text-xs sm:text-sm font-bold text-primary hover:underline">{t("viewAll")}</Link>
                        </div>
                        <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-border shadow-xl group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
                                <Trophy className="w-32 h-32 text-yellow-500" />
                            </div>

                            <div className="flex items-center gap-6 mb-8 relative z-10">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl shadow-yellow-200"
                                >
                                    🥇
                                </motion.div>
                                <div>
                                    <p className="text-sm font-black text-muted-foreground uppercase tracking-widest mb-1">{t("yourRank")}</p>
                                    <div className="flex items-center gap-3">
                                        <p className="text-4xl font-display font-black">#{standing?.current_rank || '-'}</p>
                                        <div className="flex items-center gap-1 text-green-600 font-black text-xs bg-green-100 px-3 py-1 rounded-full border border-green-200 shadow-sm">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>Promotion Zone</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 relative z-10">
                                {topPlayers.length > 0 ? topPlayers.slice(0, 3).map((player, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={cn(
                                            "flex items-center gap-4 p-4 rounded-2xl transition-all",
                                            player.user_id === profile.id
                                                ? "bg-primary/10 ring-2 ring-primary/20 shadow-lg shadow-primary/5"
                                                : "bg-muted/30 hover:bg-muted/50"
                                        )}
                                    >
                                        <span className="w-8 text-lg font-display font-black text-muted-foreground/50">#{idx + 1}</span>
                                        <div className="w-10 h-10 bg-white rounded-xl overflow-hidden flex items-center justify-center text-sm font-bold shrink-0 shadow-sm ring-2 ring-white">
                                            <Avatar
                                                src={player.profiles?.avatar_url}
                                                size="sm"
                                                fallback={player.profiles?.username?.[0] || '?'}
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        <span className={`flex-1 font-black text-base truncate ${player.user_id === profile.id ? "text-primary" : "text-foreground"}`}>
                                            {player.user_id === profile.id ? t("you") : (player.profiles?.username || t("player"))}
                                        </span>
                                        <div className="flex items-center gap-1.5 font-black text-sm">
                                            <Zap className="w-4 h-4 fill-blue-500 text-blue-500" />
                                            {player.weekly_xp}
                                        </div>
                                    </motion.div>
                                )) : (
                                    <p className="text-center text-muted-foreground py-4 font-medium italic text-sm">{t("noPlayers")}</p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Mock Test CTA */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-black p-8 sm:p-12 rounded-[4rem] text-white shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-full h-full bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        <span className="text-[160px] sm:text-[220px]">🇦🇺</span>
                    </div>

                    <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                        <div className="max-w-xl text-center lg:text-left space-y-4">
                            <div className="inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-accent/20">
                                Official Simulation
                            </div>
                            <h3 className="text-4xl sm:text-6xl font-display font-black tracking-tight leading-none">
                                {t("mockTest")} <span className="inline-block animate-bounce">🇦🇺</span>
                            </h3>
                            <p className="font-bold text-white/70 text-lg sm:text-xl leading-relaxed">
                                {t("mockTestDesc")}
                            </p>
                        </div>
                        <Link href="/dashboard/mock-test" className="w-full lg:w-auto shrink-0 relative px-2">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button size="lg" className="w-full lg:w-auto bg-accent text-white hover:bg-accent/90 px-16 py-10 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-accent/20 border-b-8 border-accent-dark group/btn">
                                    <span>{t("attemptNow")}</span>
                                    <ChevronRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                </Button>
                            </motion.div>
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blogPosts.slice(0, 2).map((post: BlogPost) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`}>
                                <motion.div
                                    whileHover={{ y: -4, boxShadow: "0 10px 25px -10px rgba(0,0,0,0.1)" }}
                                    className="bg-card rounded-3xl border border-border p-4 flex gap-4 items-center group transition-all h-full"
                                >
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-muted rounded-2xl overflow-hidden shrink-0 relative">
                                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors" />
                                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                                            {post.category === "Citizenship" ? "🇦🇺" : post.category === "Visas" ? "🛂" : "🌏"}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-wider">{post.category}</span>
                                            <span className="text-[10px] text-muted-foreground">• {post.readTime}</span>
                                        </div>
                                        <h4 className="font-bold text-sm sm:text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h4>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {activity && activity.length > 0 ? activity.slice(0, 6).map((act) => (
                            <motion.div
                                key={act.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="glass p-3 sm:p-4 rounded-xl sm:rounded-3xl border border-border flex items-center gap-3 sm:gap-4 group hover:shadow-md transition-all"
                            >
                                <div className="relative shrink-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center text-lg sm:text-xl font-bold border-2 border-white shadow-sm relative">
                                        <Avatar
                                            src={act.avatar}
                                            size="md"
                                            className="w-full h-full border-0 rounded-none bg-transparent"
                                        />
                                    </div>
                                    {act.isPremium && (
                                        <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center text-[6px] sm:text-[8px] shadow-sm">
                                            ⭐
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 sm:gap-2">
                                        <span className="font-bold text-sm truncate">{act.user}</span>
                                        {act.isPremium && <span className="bg-yellow-100 text-yellow-700 text-[7px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 rounded-md uppercase shrink-0">Pro</span>}
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                        {t("scored", { score: act.score, total: act.total })}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="flex items-center gap-1 text-blue-600 font-black text-xs sm:text-sm">
                                        <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-blue-600" aria-hidden="true" />
                                        <span>+{act.xp}</span>
                                    </div>
                                    <p
                                        className="text-[8px] sm:text-[9px] text-muted-foreground font-bold uppercase mt-0.5"
                                        suppressHydrationWarning
                                    >
                                        {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full py-8 sm:py-12 text-center bg-card rounded-2xl sm:rounded-[2.5rem] border border-dashed border-border">
                                <p className="text-muted-foreground font-medium italic text-sm">{t("quietOutback")}</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
