"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Heart,
    CheckCircle2,
    XCircle,
    ChevronRight,
    MessageCircle,
    Trophy,
    Flame,
    Zap,
    AlertCircle,
    Award
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { updateUserProgress } from "@/app/actions/progress";
import { getQuestions, logQuizMistake, saveForReview } from "@/app/actions/quiz";
import { updateChallengeScore } from "@/app/actions/challenges";
import { updateTopicProgress } from "@/app/actions/skills";
import { useTranslations } from "next-intl";
import { Bookmark, Check, Loader2 } from "lucide-react";


import { Suspense } from 'react';

import { Question, AchievementManagement as Achievement } from '@/types/admin';
import { User } from '@supabase/supabase-js';

// ... (existing imports)

function QuizContent() {
    const t = useTranslations("Quiz");
    const common = useTranslations("Common");

    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Results
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [lives, setLives] = useState(5);
    const [initialLives, setInitialLives] = useState(5);
    const [score, setScore] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [challengeData, setChallengeData] = useState<Record<string, any> | null>(null);
    const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
    const [isBookmarking, setIsBookmarking] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [direction, setDirection] = useState(1);
    const [isHeartLoss, setIsHeartLoss] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic') || undefined;
    const challengeId = searchParams.get('challengeId');
    const isBattle = searchParams.get('type') === 'battle';
    const supabase = createClient();

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push('/login');
                    return;
                }
                setUser(user);

                if (isBattle && challengeId) {
                    const { data: chall } = await supabase
                        .from('challenges')
                        .select(`
                            *,
                            challenger:challenger_id (username),
                            challenged:challenged_id (username)
                        `)
                        .eq('id', challengeId)
                        .single();
                    setChallengeData(chall);
                }

                // Fetch real hearts
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('hearts')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setLives(profile.hearts);
                    setInitialLives(profile.hearts);
                }

                // Fetch questions
                const fetchedQuestions = await getQuestions(topic, 5);
                if (fetchedQuestions.length === 0) {
                    setError(t("errorNoQuestions"));
                } else {
                    setQuestions(fetchedQuestions);
                }
            } catch (err) {
                console.error("Load error:", err);
                setError(t("errorLoad"));
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [topic, challengeId, isBattle, t, router, supabase.auth]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleCheck = () => {
        if (selectedOption === null || !currentQuestion) return;

        const correct = selectedOption === currentQuestion.correct_index;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setScore(s => s + 1);
        } else {
            setLives(l => Math.max(0, l - 1));
            setIsHeartLoss(true);
            setTimeout(() => setIsHeartLoss(false), 800);
            // Log mistake
            if (currentQuestion?.id) {
                logQuizMistake(currentQuestion.id);
            }
        }
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1 && lives > 0) {
            setDirection(1);
            setCurrentQuestionIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsBookmarked(false);
            setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
        } else {
            finishQuiz();
        }
    };

    // Keyboard Support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentStep !== 1 || showExitDialog) return;

            if (e.key >= '1' && e.key <= '4' && !isAnswered) {
                const idx = parseInt(e.key) - 1;
                if (currentQuestion?.options[idx]) {
                    setSelectedOption(idx);
                }
            }

            if (e.key === 'Enter') {
                if (!isAnswered && selectedOption !== null) {
                    handleCheck();
                } else if (isAnswered) {
                    handleContinue();
                }
            }

            if (e.key === 'Escape') {
                setShowExitDialog(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentStep, isAnswered, selectedOption, currentQuestion, showExitDialog]);

    const handleBookmark = async () => {
        if (!currentQuestion?.id || isBookmarking) return;

        setIsBookmarking(true);
        try {
            const result = await saveForReview(currentQuestion.id);
            if (result.success) {
                setIsBookmarked(true);
            }
        } catch (err) {
            console.error("Bookmark error:", err);
        } finally {
            setIsBookmarking(false);
        }
    };

    const finishQuiz = async () => {
        setCurrentStep(2);
        setProgress(100);

        if (user) {
            setIsSaving(true);
            const xpGained = score * 20;
            const livesLost = initialLives - lives;

            // Standard progress update
            const result = await updateUserProgress(user.id, xpGained, score, questions.length, livesLost, topic);
            if (result.success && result.unlockedAchievements) {
                setUnlockedAchievements(result.unlockedAchievements);
            }

            // Update Topic Progress
            if (!isBattle && topic) {
                const percentage = Math.round((score / questions.length) * 100);
                await updateTopicProgress(topic, percentage);
            }

            if (isBattle && challengeId) {
                await updateChallengeScore(challengeId, score);
                // Re-fetch challenge data to see the final result
                const { data: updatedChall } = await supabase
                    .from('challenges')
                    .select('*')
                    .eq('id', challengeId)
                    .single();
                setChallengeData(updatedChall);
            }

            setIsSaving(false);

            if (score === questions.length && lives > 0) {
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#1B9B8F', '#D4A574', '#E67E5A']
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-bold italic">{t("loading")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="text-6xl mb-4">🐨</div>
                <h1 className="text-3xl font-display font-black mb-4">{t("error")}</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-sm">{error}</p>
                <Button size="lg" onClick={() => router.back()}>{t("back") || "Go Back"}</Button>
            </div>
        );
    }

    if (currentStep === 0) {
        const canStart = lives > 0;

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="text-8xl mb-6">{isBattle ? "⚔️" : canStart ? "🐨" : "🩹"}</div>
                    <h1 className="text-4xl font-display font-black mb-4">
                        {isBattle ? t("battleMode") : canStart ? t("ready") : t("outOfLives")}
                    </h1>
                    <p className="text-muted-foreground text-lg mb-8">
                        {isBattle
                            ? t("battleDesc", { opponent: challengeData?.challenger_id === user?.id ? challengeData?.challenged?.username : challengeData?.challenger?.username })
                            : canStart
                                ? t("studyDesc", { topic: topic || 'Australian Citizenship', xp: questions.length * 20 })
                                : t("outOfLivesDesc")
                        }
                    </p>

                    {!canStart && (
                        <div className="bg-red-500/10 p-6 rounded-[2rem] border-2 border-red-500/20 mb-8 flex items-center gap-4 text-left">
                            <Heart className="w-10 h-10 text-red-500 fill-red-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-red-600 dark:text-red-400">{t("nextHeartIn", { time: "2h 45m" })}</p>
                                <p className="text-sm text-red-500/80">{t("heartsRegen")}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <Button
                            size="lg"
                            className="w-full py-6 text-xl"
                            onClick={() => setCurrentStep(1)}
                            disabled={!canStart}
                        >
                            {isBattle ? t("commenceBattle") : canStart ? t("start") : t("restUp")}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full" onClick={() => router.back()}>
                            {t("maybeLater")}
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (currentStep === 2) {
        const hasPassed = lives > 0 && score >= (questions.length * 0.6);
        const isCompletedBattle = isBattle && challengeData?.status === 'completed';
        const isWaitingBattle = isBattle && challengeData?.status !== 'completed';
        const wonBattle = isCompletedBattle && user && challengeData?.winner_id === user.id;
        const drewBattle = isCompletedBattle && challengeData.winner_id === null;

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md w-full bg-card glass p-8 rounded-[3rem] border-2 border-border shadow-xl"
                >
                    <div className="text-6xl mb-4">
                        {isBattle
                            ? (wonBattle ? "👑" : drewBattle ? "🤝" : isWaitingBattle ? "⏳" : "💀")
                            : (hasPassed ? (score === questions.length ? "🌟" : "🎉") : lives === 0 ? "💔" : "💪")
                        }
                    </div>

                    <h1 className="text-4xl font-display font-black mb-2 text-primary">
                        {isBattle
                            ? (wonBattle ? t("victorious") : drewBattle ? t("draw") : isWaitingBattle ? t("part1Complete") : t("defeated"))
                            : (hasPassed
                                ? (score === questions.length
                                    ? (
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                            className="flex flex-col items-center gap-2"
                                        >
                                            <span className="text-primary font-black tracking-tighter text-5xl md:text-6xl drop-shadow-sm">{t("perfect")}</span>
                                            <div className="flex items-center gap-2 bg-primary/10 px-4 py-1 rounded-full border border-primary/20">
                                                <Trophy className="w-5 h-5 text-primary" />
                                                <span className="text-primary text-sm font-black uppercase tracking-widest">{t("score100")}</span>
                                            </div>
                                        </motion.div>
                                    )
                                    : t("complete"))
                                : lives === 0 ? t("outOfLives") : t("keepPracticing"))
                        }
                    </h1>

                    <p className="text-muted-foreground font-medium mb-8">
                        {isBattle
                            ? (isWaitingBattle
                                ? t("waitingOpponent")
                                : t("finalScore", { score, opponentScore: challengeData?.challenger_id === user?.id ? challengeData?.challenged_score : challengeData?.challenger_score }))
                            : (lives === 0
                                ? t("outOfLivesResult")
                                : hasPassed
                                    ? t("passedDesc", { score, xp: score * 10 })
                                    : t("failedDesc"))
                        }
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-orange-500/10 p-4 rounded-3xl border-2 border-orange-500/20">
                            <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 font-black mb-1">
                                <Flame className="w-5 h-5 fill-orange-600 dark:fill-orange-400" /> {common("streak").toUpperCase()}
                            </div>
                            <div className="text-2xl font-display font-black text-orange-700 dark:text-orange-300">+1 {common("days")}</div>
                        </div>
                        <div className="bg-blue-500/10 p-4 rounded-3xl border-2 border-blue-500/20">
                            <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 font-black mb-1">
                                <Zap className="w-5 h-5 fill-blue-600 dark:fill-blue-400" /> {common("xp").toUpperCase()}
                            </div>
                            <div className="text-2xl font-display font-black text-blue-700 dark:text-blue-300">+{score * 20}</div>
                        </div>
                    </div>

                    {/* Unlocked Achievements */}
                    <AnimatePresence>
                        {unlockedAchievements.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 space-y-4"
                            >
                                <div className="flex items-center justify-center gap-2 text-yellow-600 font-display font-black uppercase tracking-widest text-sm">
                                    <Award className="w-5 h-5" /> {t("newBadge")}
                                </div>
                                <div className="flex flex-wrap justify-center gap-4">
                                    {unlockedAchievements.map((name: string, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            className="bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 rounded-2xl shadow-lg shadow-yellow-200/50"
                                        >
                                            <div className="bg-card px-4 py-2 rounded-[0.9rem] border border-yellow-100/50 flex items-center gap-2">
                                                <span className="text-2xl">🏆</span>
                                                <span className="font-black text-sm text-yellow-900">{name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        size="lg"
                        className="w-full py-5 text-xl relative overflow-hidden"
                        disabled={isSaving}
                        onClick={() => router.push(isBattle ? "/friends" : "/dashboard")}
                    >
                        {isSaving ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t("saving")}</span>
                            </div>
                        ) : (
                            isBattle ? t("backToMates") : t("backToDashboard")
                        )}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Heart loss splash */}
            <AnimatePresence>
                {isHeartLoss && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-red-500 z-[100] pointer-events-none"
                    />
                )}
            </AnimatePresence>
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

            {/* Header */}
            <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-border relative z-10 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setShowExitDialog(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-xl">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex-1 max-w-md h-3 bg-muted/50 rounded-full overflow-hidden relative border border-border/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-primary/80 to-primary relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-full h-full bg-white/20 skew-x-[-20deg]"
                            />
                        </motion.div>
                    </div>
                </div>
                <div className={cn(
                    "flex items-center gap-2 font-display font-black text-xl px-4 py-2 bg-muted/50 rounded-2xl border border-border/50 transition-all",
                    isHeartLoss && "bg-red-100 border-red-200 scale-110"
                )}>
                    <Heart className={cn("w-6 h-6 fill-red-500 text-red-500", lives === 0 && "opacity-20", isHeartLoss && "animate-bounce")} />
                    <span className={cn(lives === 0 ? "text-muted-foreground" : "text-red-600")}>{lives}</span>
                </div>
            </header>

            {/* Question Content */}
            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 pb-80 flex flex-col relative z-10">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentQuestionIndex}
                        custom={direction}
                        initial={{ opacity: 0, x: direction * 50 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { type: "spring", damping: 25, stiffness: 200 }
                        }}
                        exit={{ opacity: 0, x: direction * -50 }}
                        className={cn(
                            "flex-1",
                            isAnswered && !isCorrect && "animate-shake"
                        )}
                    >
                        <h2 className="text-2xl md:text-3xl font-display font-black mb-8 leading-tight">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option: string, index: number) => {
                                const isSelected = selectedOption === index;
                                return (
                                    <motion.button
                                        key={index}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(index)}
                                        whileTap={{ scale: 0.98 }}
                                        className={cn(
                                            "w-full p-5 rounded-2xl border-2 text-left font-bold transition-all text-lg flex items-center gap-4 outline-none",
                                            isSelected
                                                ? "border-primary bg-primary/10 text-primary shadow-[0_4px_0_rgba(27,155,143,0.3)] translate-y-[-2px]"
                                                : "border-border bg-card/10 hover:bg-muted/50",
                                            isAnswered && index === currentQuestion.correct_index && "border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400",
                                            isAnswered && isSelected && index !== currentQuestion.correct_index && "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm border-2",
                                            isSelected ? "border-primary bg-primary text-white" : "border-border"
                                        )}>
                                            {String.fromCharCode(65 + index)}
                                        </span>
                                        {option}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Action / Feedback */}
            <div className="fixed bottom-0 left-0 right-0 z-30 w-full">
                <AnimatePresence mode="wait">
                    {!isAnswered ? (
                        <motion.div
                            key="check-panel"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="border-t-2 border-border p-6 md:p-8 bg-white/80 backdrop-blur-xl"
                        >
                            <div className="max-w-4xl mx-auto flex justify-end">
                                <Button
                                    size="lg"
                                    className="w-full md:w-auto md:px-24 py-6 text-xl rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    disabled={selectedOption === null}
                                    onClick={handleCheck}
                                >
                                    {t("check")}
                                </Button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="feedback-panel"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className={cn(
                                "p-6 md:p-10 border-t-2 backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)]",
                                isCorrect
                                    ? "bg-green-50/95 border-green-200"
                                    : "bg-red-50/95 border-red-200"
                            )}
                        >
                            <div className="max-w-4xl mx-auto">
                                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                    <div className={cn(
                                        "w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-xl shrink-0 scale-110 md:scale-125 mb-4 md:mb-0",
                                        isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                    )}>
                                        {isCorrect ? <CheckCircle2 className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
                                    </div>
                                    <div className="flex-1 text-center md:text-left space-y-2 relative">
                                        {isCorrect && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 0 }}
                                                animate={{ opacity: 1, y: -40 }}
                                                className="absolute -top-10 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 font-display font-black text-primary text-xl"
                                            >
                                                +10 XP
                                            </motion.div>
                                        )}
                                        <h3 className={cn("text-3xl font-black", isCorrect ? "text-green-800" : "text-red-800")}>
                                            {isCorrect ? t("correct") : t("incorrect")}
                                        </h3>
                                        <div className={cn("text-lg font-bold leading-relaxed", isCorrect ? "text-green-700/80" : "text-red-700/80")}>
                                            {isAnswered && !isCorrect && (
                                                <p className="mb-2 text-red-900 bg-red-100/50 p-3 rounded-2xl border border-red-200 inline-block">
                                                    <span className="opacity-60 mr-2">{t("correctAnswerLabel") || "Correct choice:"}</span>
                                                    {currentQuestion.options[currentQuestion.correct_index]}
                                                </p>
                                            )}
                                            <p className="line-clamp-3 hover:line-clamp-none transition-all">{currentQuestion.explanation}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full md:w-auto">
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className={cn(
                                                "py-6 px-8 rounded-2xl border-2 font-black transition-all group",
                                                isBookmarked ? "bg-primary/10 border-primary text-primary" : "border-border hover:border-primary/50"
                                            )}
                                            onClick={handleBookmark}
                                            disabled={isBookmarking}
                                        >
                                            {isBookmarking ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : isBookmarked ? (
                                                <>
                                                    <Check className="w-5 h-5 mr-2" />
                                                    {t("saved") || "Saved"}
                                                </>
                                            ) : (
                                                <>
                                                    <Bookmark className="w-5 h-5 mr-2 group-hover:fill-primary transition-all" />
                                                    {t("remindMe") || "Remind me"}
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            size="lg"
                                            className={cn(
                                                "w-full md:w-auto md:px-20 py-7 text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all",
                                                isCorrect ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-red-600 hover:bg-red-700 shadow-red-200"
                                            )}
                                            onClick={handleContinue}
                                        >
                                            {lives === 0 && !isCorrect ? t("finish") : t("continue")}
                                            <ChevronRight className="ml-2 w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Exit Confirmation Dialog */}
            <AnimatePresence>
                {showExitDialog && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowExitDialog(false)}
                            className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-white p-10 rounded-[3rem] border-2 border-border shadow-2xl text-center"
                        >
                            <div className="w-24 h-24 bg-red-100 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                <AlertCircle className="w-12 h-12 text-red-600" />
                            </div>
                            <h2 className="text-4xl font-display font-black mb-4">{t("exitTitle")}</h2>
                            <p className="text-muted-foreground text-xl mb-10 font-bold leading-relaxed px-4">
                                {t("exitDesc")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 py-8 rounded-3xl font-black text-xl border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    onClick={() => setShowExitDialog(false)}
                                >
                                    {t("keepLearning")}
                                </Button>
                                <Button
                                    variant="accent"
                                    size="lg"
                                    className="flex-1 py-8 rounded-3xl font-black text-xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    {t("exitQuiz")}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>

    );
}

export default function QuizPage() {
    const t = useTranslations("Quiz");

    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-muted-foreground font-bold italic">{t("loading")}</p>
            </div>
        }>
            <QuizContent />
        </Suspense>
    );
}
