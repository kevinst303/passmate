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
    X
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { Sidebar } from "@/components/Sidebar";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface Profile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    current_xp: number;
    total_xp: number;
    daily_streak: number;
    hearts: number;
    is_premium: boolean;
    level: number;
}

interface UserQuest {
    id: string;
    quests: {
        title: string;
        xp_reward: number;
    } | null;
    progress: number;
    requirement_value: number;
    is_completed: boolean;
}

interface Standing {
    leagues?: {
        name: string;
    } | null;
    current_rank: number | null;
}

interface Player {
    user_id: string;
    weekly_xp: number;
    profiles?: {
        username: string | null;
        avatar_url: string | null;
    } | null;
}

interface ActivityItem {
    id: string;
    user: string;
    avatar: string | null;
    isPremium: boolean;
    score: number;
    total: number;
    xp: number;
    time: string;
}

interface TopicStatus {
    topic: string;
    status: 'completed' | 'in_progress' | 'locked';
}

interface DashboardClientProps {
    data: {
        profile: Profile;
        quests: UserQuest[];
        standing: Standing | null;
        topPlayers: Player[];
        topicProgress: TopicStatus[];
        activity: ActivityItem[];
        nextHeartAt: string | null;
    };
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
        <div className="min-h-screen bg-muted/30 pb-28 md:pb-8 md:pl-20">
            {/* Header */}
            <header className="bg-white border-b border-border px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xl sm:text-2xl" aria-hidden="true">🐨</span>
                        <h1 className="text-lg sm:text-xl font-display font-bold text-primary truncate">PassMate</h1>
                    </div>

                    {/* Desktop Stats */}
                    <div className="hidden sm:flex items-center gap-2 sm:gap-4">
                        <div className="flex flex-col items-end gap-0.5">
                            <div className={cn(
                                "flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm transition-all",
                                profile.is_premium ? "bg-red-100 text-red-600 border border-red-200" : "bg-red-100 text-red-600"
                            )}>
                                <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-600", profile.is_premium && "animate-pulse")} aria-hidden="true" />
                                <span>{profile.is_premium ? "∞" : profile.hearts}</span>
                            </div>
                            {!profile.is_premium && profile.hearts < 5 && nextHeartAt && mounted && (
                                <div className="flex items-center gap-1 text-[8px] font-black text-muted-foreground uppercase tracking-tighter">
                                    <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                                    <span>{common("nextIn", { time: getNextHeartTime() })}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 bg-orange-100 text-orange-600 px-2.5 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-600" aria-hidden="true" />
                            <span>{profile.daily_streak}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-600 px-2.5 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm">
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-blue-600" aria-hidden="true" />
                            <span>{profile.total_xp}</span>
                        </div>
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
                    className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm"
                >
                    <div className="flex items-center gap-4 sm:block">
                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-primary/10 rounded-full flex items-center justify-center text-2xl sm:text-4xl border-4 border-white shadow-lg shrink-0 overflow-hidden relative">
                            {profile.avatar_url ? (
                                <Image
                                    src={profile.avatar_url}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            ) : "🐨"}
                        </div>
                        <div className="sm:hidden flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg font-display font-extrabold text-foreground">
                                    {t("welcome", { name: profile.full_name?.split(' ')[0] || profile.username })}
                                </h2>
                                {profile.is_premium && (
                                    <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-yellow-200">
                                        <Sparkles className="w-3 h-3 fill-yellow-600" /> {t("pro")}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium mt-0.5 line-clamp-2">
                                {profile.is_premium ? t("proDesc") : t("streakDesc")}
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:block flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-foreground">
                                {t("welcome", { name: profile.full_name || profile.username })} 👋
                            </h2>
                            {profile.is_premium && (
                                <div className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-yellow-200">
                                    <Sparkles className="w-3 h-3 fill-yellow-600" /> {t("pro")}
                                </div>
                            )}
                        </div>
                        <p className="text-muted-foreground font-medium text-sm sm:text-base">
                            {profile.is_premium ? t("proMateDesc") : t("doingGreat")}
                        </p>
                    </div>
                    <Link href="/dashboard/quiz" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                            <CirclePlay className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
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
                            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group hover:border-primary/50 hover:shadow-md transition-all h-full"
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
                            className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-[2.5rem] border border-border flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 group hover:border-primary/50 hover:shadow-md transition-all h-full"
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
                    className="bg-gradient-to-br from-primary to-primary/80 p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] text-white shadow-xl shadow-primary/20"
                >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-white/20 rounded-xl sm:rounded-[2rem] flex items-center justify-center text-2xl sm:text-4xl shadow-inner border border-white/10 shrink-0">
                                🎓
                            </div>
                            <div className="flex-1 sm:hidden">
                                <h3 className="text-lg font-display font-black leading-tight">{t("course")}</h3>
                                <p className="font-bold opacity-80 text-xs">{completedTopics}/{totalTopics} {t("topicsMastered", { completed: completedTopics, total: totalTopics })}</p>
                            </div>
                            <span className="sm:hidden text-2xl font-display font-black">{Math.round(courseProgress)}%</span>
                        </div>
                        <div className="hidden sm:block flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-display font-black leading-tight">{t("course")}</h3>
                                    <p className="font-bold opacity-80 text-sm">{t("topicsMastered", { completed: completedTopics, total: totalTopics })}</p>
                                </div>
                                <span className="text-2xl sm:text-3xl font-display font-black">{Math.round(courseProgress)}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:flex sm:items-center sm:gap-6">
                        <div className="flex-1 h-2.5 sm:h-3 w-full bg-black/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: courseProgress + "%" }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-white rounded-full"
                            />
                        </div>
                        <Link href="/skill-trees" className="block mt-4 sm:mt-0">
                            <Button variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 px-6 sm:px-8 h-12 sm:h-14 rounded-xl sm:rounded-2xl font-black">
                                {t("resumePath")}
                            </Button>
                        </Link>
                    </div>
                </motion.section>

                {/* Level Progress */}
                <section className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm">
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
                        <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-72 overflow-y-auto pr-1 [mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%_-_20px),transparent)]">
                            {displayQuests.map((userQuest) => (
                                <motion.div
                                    key={userQuest.id}
                                    whileHover={{ scale: 1.01 }}
                                    className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-3xl border border-border shadow-sm flex items-center gap-3 sm:gap-4 group hover:border-primary/30 transition-all"
                                >
                                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${userQuest.is_completed ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                                        {userQuest.is_completed ? <Award className="w-5 h-5 sm:w-6 sm:h-6" /> : <Star className="w-5 h-5 sm:w-6 sm:h-6" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`font-bold text-sm sm:text-base truncate ${userQuest.is_completed ? "text-muted-foreground line-through" : ""}`}>
                                            {userQuest.quests?.title || t("dailyQuests")}
                                        </p>
                                        {!userQuest.is_completed && (
                                            <div className="mt-1.5 sm:mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-accent transition-all"
                                                    style={{ width: `${(userQuest.progress / (userQuest.requirement_value || 1)) * 100}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs sm:text-sm font-extrabold text-primary">+{userQuest.quests?.xp_reward || 0} XP</p>
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
                        <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-sm">
                            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-border/50">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-100 rounded-2xl sm:rounded-3xl flex items-center justify-center text-2xl sm:text-3xl">🥇</div>
                                <div>
                                    <p className="text-xs sm:text-sm font-bold text-muted-foreground">{t("yourRank")}</p>
                                    <p className="text-xl sm:text-2xl font-display font-extrabold">#{standing?.current_rank || '-'}</p>
                                </div>
                                <div className="ml-auto flex items-center gap-1 sm:gap-1.5 text-green-600 font-bold text-xs sm:text-sm bg-green-50 px-2 sm:px-3 py-1 rounded-full">
                                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
                                    <span className="hidden xs:inline">{t("keepItUp")}</span>
                                    <span className="xs:hidden">+</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:space-y-4 max-h-64 overflow-y-auto">
                                {topPlayers.length > 0 ? topPlayers.slice(0, 5).map((player, idx) => (
                                    <div key={idx} className={`flex items-center gap-2 sm:gap-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl ${player.user_id === profile.id ? "bg-primary/10 ring-1 ring-primary/20" : ""}`}>
                                        <span className="w-5 sm:w-6 text-xs sm:text-sm font-extrabold text-muted-foreground">#{idx + 1}</span>
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-muted rounded-full overflow-hidden flex items-center justify-center text-xs font-bold shrink-0 relative">
                                            {player.profiles?.avatar_url ? (
                                                <Image
                                                    src={player.profiles.avatar_url}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : player.profiles?.username?.[0] || '?'}
                                        </div>
                                        <span className={`flex-1 font-bold text-sm truncate ${player.user_id === profile.id ? "text-primary" : ""}`}>
                                            {player.user_id === profile.id ? t("you") : (player.profiles?.username || t("player"))}
                                        </span>
                                        <span className="font-extrabold text-xs sm:text-sm shrink-0">{player.weekly_xp} XP</span>
                                    </div>
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
                    className="bg-gradient-to-r from-accent to-accent/80 p-5 sm:p-8 rounded-2xl sm:rounded-[3rem] text-white shadow-xl relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                        <div>
                            <h3 className="text-xl sm:text-2xl font-display font-black mb-1 sm:mb-2 flex items-center gap-2">
                                {t("mockTest")} <span aria-label="Australian flag">🇦🇺</span>
                            </h3>
                            <p className="font-bold opacity-90 text-sm sm:text-base max-w-sm">
                                {t("mockTestDesc")}
                            </p>
                        </div>
                        <Link href="/dashboard/mock-test" className="w-full sm:w-auto shrink-0">
                            <Button variant="secondary" className="w-full sm:w-auto bg-white text-accent hover:bg-white/90 px-8 sm:px-10 py-3 sm:py-4 h-auto text-base sm:text-lg shadow-2xl">
                                {t("attemptNow")}
                            </Button>
                        </Link>
                    </div>
                    <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4 scale-100 sm:scale-150 pointer-events-none" aria-hidden="true">
                        <span className="text-[120px] sm:text-[200px]">🇦🇺</span>
                    </div>
                </motion.section>

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
                                className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-3xl border border-border flex items-center gap-3 sm:gap-4 group hover:shadow-md transition-all"
                            >
                                <div className="relative shrink-0">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center text-lg sm:text-xl font-bold border-2 border-white shadow-sm relative">
                                        {act.avatar ? (
                                            <Image
                                                src={act.avatar}
                                                alt=""
                                                fill
                                                className="object-cover"
                                            />
                                        ) : "🐨"}
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
                            <div className="col-span-full py-8 sm:py-12 text-center bg-white rounded-2xl sm:rounded-[2.5rem] border border-dashed border-border">
                                <p className="text-muted-foreground font-medium italic text-sm">{t("quietOutback")}</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
