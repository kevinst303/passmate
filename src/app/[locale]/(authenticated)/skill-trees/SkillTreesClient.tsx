"use client";

import { motion } from "framer-motion";
import {
    ChevronRight,
    Lock,
    CheckCircle2,
    Flame,
    Zap,
    ArrowLeft,
    BookOpen,
    PlayCircle,
    Trophy,
    Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

import { DashboardData } from "@/types/dashboard";

interface Topic {
    id: string;
    title: string;
    lessons: number;
    icon: string;
    status: string;
    progress: number;
    completed: boolean;
}

interface SkillTreesClientProps {
    data: DashboardData;
    skillTreeData: {
        topics: Topic[];
    };
}

export default function SkillTreesClient({ data, skillTreeData }: SkillTreesClientProps) {
    const t = useTranslations("SkillTrees");
    const { profile } = data;
    const TOPICS = skillTreeData.topics || [];

    // Calculate overall progress
    const completedTopics = TOPICS.filter((t) => t.completed).length;
    const totalTopics = TOPICS.length;
    const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/95 pb-28 md:pb-8 md:pl-24 font-sans">
            {/* Mobile-optimized Header */}
            <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50 px-4 py-3 md:static md:bg-transparent md:border-none md:px-8 md:pt-8 md:pb-4">
                <div className="max-w-4xl mx-auto">
                    {/* Top row - Back button and stats */}
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold group text-sm min-h-[44px]"
                            aria-label={t("backDashboard")}
                        >
                            <div className="bg-card glass p-2 rounded-xl border-2 border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="hidden sm:inline">{t("backDashboard")}</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-xl border border-orange-200 dark:border-orange-800 font-black text-xs sm:text-sm">
                                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-orange-600 dark:fill-orange-400" />
                                <span>{profile.daily_streak}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl border border-blue-200 dark:border-blue-800 font-black text-xs sm:text-sm">
                                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-blue-600 dark:fill-blue-400" />
                                <span>{profile.total_xp}</span>
                            </div>
                        </div>
                    </div>

                    {/* Title section */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-primary-light rounded-2xl sm:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
                            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-black text-foreground tracking-tight">
                                {t("studyCourse")}
                            </h1>
                            <p className="text-xs sm:text-sm text-muted-foreground font-bold italic truncate">
                                {t("pathDesc")}
                            </p>
                        </div>
                    </div>

                    {/* Progress Overview - Mobile */}
                    <div className="mt-4 p-4 glass rounded-2xl border border-border shadow-sm md:hidden">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("courseProgress")}</span>
                            <span className="text-sm font-black text-primary">{t("topicsCount", { completed: completedTopics, total: totalTopics })}</span>
                        </div>
                        <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${overallProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-12">
                {/* Desktop Progress Overview */}
                <div className="hidden md:flex items-center justify-between mb-8 p-6 glass rounded-3xl border border-border shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                            <Sparkles className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-muted-foreground">{t("courseProgress")}</p>
                            <p className="text-2xl font-display font-black">{t("percentComplete", { percent: overallProgress })}</p>
                        </div>
                    </div>
                    <div className="flex-1 max-w-md mx-8">
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${overallProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                            />
                        </div>
                    </div>
                    <p className="text-lg font-black text-foreground">{t("topicsMastered", { completed: completedTopics, total: totalTopics })}</p>
                </div>

                {/* Topics List */}
                <div className="space-y-3 md:space-y-0 relative" role="list" aria-label="Study topics">
                    {TOPICS.map((topic, i) => {
                        const isLocked = topic.status === "locked";
                        const isCompleted = topic.completed;
                        const isInProgress = !isLocked && !isCompleted && topic.progress > 0;
                        const isFirst = i === 0;
                        const isLast = i === TOPICS.length - 1;

                        return (
                            <motion.article
                                key={topic.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="relative z-10"
                                role="listitem"
                            >
                                {/* Desktop layout with timeline */}
                                <div className={cn(
                                    "hidden md:block",
                                    isLocked && "opacity-50"
                                )}>
                                    {/* Timeline wrapper - uses grid for precise alignment */}
                                    <div className="grid grid-cols-[64px_1fr] gap-5">
                                        {/* Left column: Marker + Connector */}
                                        <div className="relative flex flex-col items-center">
                                            {/* Connector line ABOVE marker (except first) */}
                                            {!isFirst && (
                                                <div
                                                    className={cn(
                                                        "absolute top-0 w-1 h-6 -translate-y-full",
                                                        isLocked ? "bg-border" : "bg-primary/40"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            )}

                                            {/* Topic Marker */}
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg relative z-20 shrink-0 transition-all duration-300 border-4",
                                                isCompleted
                                                    ? "bg-green-500 text-white border-green-400 shadow-green-500/30"
                                                    : isInProgress
                                                        ? "bg-primary text-white border-primary-light/50 shadow-primary/30"
                                                        : !isLocked
                                                            ? "bg-card glass border-primary text-primary shadow-primary/10"
                                                            : "bg-muted/80 border-border text-muted-foreground shadow-none"
                                            )}>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-7 h-7" />
                                                ) : isLocked ? (
                                                    <Lock className="w-5 h-5" />
                                                ) : (
                                                    <span className="font-display font-black text-xl">{i + 1}</span>
                                                )}
                                            </div>

                                            {/* Connector line BELOW marker (except last) */}
                                            {!isLast && (
                                                <div
                                                    className={cn(
                                                        "w-1 flex-1 min-h-6",
                                                        isLocked ? "bg-border" : "bg-primary/40"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            )}
                                        </div>

                                        {/* Right column: Card */}
                                        <div className="pb-6">
                                            <div className={cn(
                                                "bg-card glass p-5 rounded-2xl border-2 shadow-sm transition-all duration-300 h-full",
                                                !isLocked && "hover:shadow-md hover:border-primary/40",
                                                isCompleted && "border-green-500/20 bg-green-500/5",
                                                isInProgress && "border-primary/40 bg-primary/5",
                                                !isLocked && !isCompleted && !isInProgress && "border-border",
                                                isLocked && "border-border/50 bg-muted/30"
                                            )}>
                                                <div className="flex items-center gap-4">
                                                    {/* Topic icon */}
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0",
                                                        isCompleted ? "bg-green-500/20" : isLocked ? "bg-muted" : "bg-primary/10"
                                                    )}>
                                                        {topic.icon}
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <h3 className="text-lg font-display font-bold text-foreground">
                                                                {topic.title}
                                                            </h3>
                                                            {isCompleted && (
                                                                <span className="bg-green-500/20 text-green-500 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                                                                    {t("mastered")}
                                                                </span>
                                                            )}
                                                            {isInProgress && (
                                                                <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
                                                                    {t("inProgress")}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {topic.lessons} {t("lessons")} • {isCompleted ? "100%" : `${topic.progress}%`} {t("percentComplete", { percent: "" }).replace("%", "")}
                                                        </p>
                                                    </div>

                                                    {/* Progress bar - only for unlocked topics */}
                                                    {!isLocked && (
                                                        <div className="w-28 shrink-0">
                                                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    animate={{ width: `${topic.progress}%` }}
                                                                    transition={{ duration: 0.6, delay: i * 0.1 }}
                                                                    className={cn(
                                                                        "h-full rounded-full",
                                                                        isCompleted
                                                                            ? "bg-green-500"
                                                                            : "bg-gradient-to-r from-primary to-primary-light"
                                                                    )}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action button */}
                                                    <div className="shrink-0 ml-2">
                                                        {isLocked ? (
                                                            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-muted rounded-lg text-muted-foreground font-semibold text-xs uppercase tracking-wide">
                                                                <Lock className="w-3.5 h-3.5" />
                                                                <span>{t("locked")}</span>
                                                            </div>
                                                        ) : (
                                                            <Link
                                                                href={`/dashboard/quiz?topic=${encodeURIComponent(topic.title)}`}
                                                                aria-label={`${isCompleted ? t('review') : topic.progress > 0 ? t('continue') : t('start')} ${topic.title}`}
                                                            >
                                                                <Button
                                                                    className={cn(
                                                                        "h-10 px-5 rounded-lg font-semibold text-sm inline-flex items-center gap-2 whitespace-nowrap transition-all active:scale-95",
                                                                        isCompleted
                                                                            ? "bg-green-600 hover:bg-green-700 text-white"
                                                                            : "bg-primary hover:bg-primary/90 text-white"
                                                                    )}
                                                                >
                                                                    {isCompleted ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <PlayCircle className="w-4 h-4 shrink-0" />}
                                                                    <span>{isCompleted ? t("review") : topic.progress > 0 ? t("continue") : t("start")}</span>
                                                                    <ChevronRight className="w-4 h-4 shrink-0" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile layout - No left marker, full width cards */}
                                <div className={cn(
                                    "block md:hidden",
                                    isLocked && "opacity-60"
                                )}>
                                    <div className={cn(
                                        "bg-card glass p-4 rounded-2xl border-2 shadow-sm transition-all",
                                        isCompleted && "border-green-500/20 bg-green-500/5",
                                        isInProgress && "border-primary/30",
                                        !isLocked && !isCompleted && !isInProgress && "border-border",
                                        isLocked && "border-border/50 bg-muted/20"
                                    )}>
                                        {/* Top row: Icon + Title + Badge */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div className={cn(
                                                "w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0",
                                                isCompleted ? "bg-green-500/20" : isLocked ? "bg-muted" : "bg-primary/10"
                                            )}>
                                                {topic.icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[15px] font-bold leading-tight text-foreground line-clamp-2">
                                                    {topic.title}
                                                </h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {topic.lessons} {t("lessons")}
                                                </p>
                                            </div>

                                            {/* Status badge */}
                                            {isCompleted && (
                                                <span className="bg-green-500/20 text-green-500 text-[10px] font-bold px-2 py-1 rounded-lg shrink-0">
                                                    ✓ {t("mastered")}
                                                </span>
                                            )}
                                            {isInProgress && (
                                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded-lg shrink-0">
                                                    {topic.progress}%
                                                </span>
                                            )}
                                        </div>

                                        {/* Progress bar - only for unlocked */}
                                        {!isLocked && (
                                            <div className="mb-3">
                                                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${topic.progress}%` }}
                                                        transition={{ duration: 0.6, delay: i * 0.1 }}
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            isCompleted
                                                                ? "bg-green-500"
                                                                : "bg-gradient-to-r from-primary to-primary-light"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Action button - Full width */}
                                        {isLocked ? (
                                            <div className="flex items-center justify-center gap-2 py-3 bg-muted/50 rounded-xl text-muted-foreground text-sm font-semibold">
                                                <Lock className="w-4 h-4" />
                                                <span>{t("locked")}</span>
                                            </div>
                                        ) : (
                                            <Link
                                                href={`/dashboard/quiz?topic=${encodeURIComponent(topic.title)}`}
                                                className="block"
                                                aria-label={`${isCompleted ? t('review') : topic.progress > 0 ? t('continue') : t('start')} ${topic.title}`}
                                            >
                                                <Button
                                                    className={cn(
                                                        "w-full h-12 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2",
                                                        isCompleted
                                                            ? "bg-green-600 hover:bg-green-700"
                                                            : "bg-primary hover:bg-primary/90"
                                                    )}
                                                >
                                                    {isCompleted ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <PlayCircle className="w-4 h-4 shrink-0" />}
                                                    <span className="whitespace-nowrap">{isCompleted ? t("reviewTopic") : topic.progress > 0 ? t("continue") : t("startLearning")}</span>
                                                    <ChevronRight className="w-4 h-4 shrink-0" />
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>

                {/* Practice Test CTA - Responsive */}
                <section className="mt-10 sm:mt-14 md:mt-20 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black text-white p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl md:rounded-[3rem] border border-white/10 shadow-2xl group">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/30 transition-colors" aria-hidden="true" />
                    <div className="absolute bottom-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-accent/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" aria-hidden="true" />

                    <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-6 md:gap-10">
                        {/* Icon */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 rounded-2xl sm:rounded-3xl md:rounded-[2rem] flex items-center justify-center text-3xl sm:text-4xl md:text-5xl shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all shrink-0 border border-white/10">
                            📜
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-black mb-2 sm:mb-3">
                                {t("mockTestTitle")}
                            </h2>
                            <p className="text-white/60 font-semibold text-sm sm:text-base md:text-lg leading-relaxed max-w-lg mx-auto md:mx-0">
                                {t.rich("mockTestDesc", {
                                    badge: (chunks) => <span className="text-primary font-bold italic">{t("mockBadge")}</span>
                                })}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <Link href="/dashboard/mock-test" className="w-full sm:w-auto shrink-0">
                            <Button
                                variant="accent"
                                size="lg"
                                className="w-full sm:w-auto min-h-[52px] px-6 sm:px-8 md:px-10 text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3"
                            >
                                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                                <span>{t("takeTest")}</span>
                            </Button>
                        </Link>
                    </div>
                </section>

                {/* Quick tip card - Mobile only */}
                <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3 md:hidden">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-lg shrink-0">
                        💡
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-blue-900">
                            {t("proTip")}
                        </p>
                    </div>
                </div>
            </main>

        </div>
    );
}
