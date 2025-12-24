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
import { getQuestions, logQuizMistake } from "@/app/actions/quiz";
import { updateChallengeScore } from "@/app/actions/challenges";
import { updateTopicProgress } from "@/app/actions/skills";
import { useTranslations } from "next-intl";


import { Suspense } from 'react';

function QuizContent() {
    const t = useTranslations("Quiz");
    const common = useTranslations("Common");

    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Results
    const [questions, setQuestions] = useState<any[]>([]);
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
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [challengeData, setChallengeData] = useState<any>(null);
    const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);

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
            // Log mistake
            if (currentQuestion?.id) {
                logQuizMistake(currentQuestion.id);
            }
        }
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1 && lives > 0) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
        } else {
            finishQuiz();
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
                        <div className="bg-red-50 p-6 rounded-[2rem] border-2 border-red-100 mb-8 flex items-center gap-4 text-left">
                            <Heart className="w-10 h-10 text-red-500 fill-red-500 flex-shrink-0" />
                            <div>
                                <p className="font-bold text-red-800">{t("nextHeartIn", { time: "2h 45m" })}</p>
                                <p className="text-sm text-red-700">{t("heartsRegen")}</p>
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
        const wonBattle = isCompletedBattle && challengeData.winner_id === user.id;
        const drewBattle = isCompletedBattle && challengeData.winner_id === null;

        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md w-full bg-white p-8 rounded-[3rem] border-2 border-border shadow-xl"
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
                                : t("finalScore", { score, opponentScore: challengeData.challenger_id === user.id ? challengeData.challenged_score : challengeData.challenger_score }))
                            : (lives === 0
                                ? t("outOfLivesResult")
                                : hasPassed
                                    ? t("passedDesc", { score, xp: score * 10 })
                                    : t("failedDesc"))
                        }
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-orange-50 p-4 rounded-3xl border-2 border-orange-100">
                            <div className="flex items-center justify-center gap-2 text-orange-600 font-black mb-1">
                                <Flame className="w-5 h-5 fill-orange-600" /> {common("streak").toUpperCase()}
                            </div>
                            <div className="text-2xl font-display font-black text-orange-700">+1 {common("days")}</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-3xl border-2 border-blue-100">
                            <div className="flex items-center justify-center gap-2 text-blue-600 font-black mb-1">
                                <Zap className="w-5 h-5 fill-blue-600" /> {common("xp").toUpperCase()}
                            </div>
                            <div className="text-2xl font-display font-black text-blue-700">+{score * 20}</div>
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
                                    {unlockedAchievements.map((ach: any, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 + (idx * 0.1) }}
                                            className="bg-gradient-to-br from-yellow-400 to-orange-500 p-0.5 rounded-2xl shadow-lg shadow-yellow-200"
                                        >
                                            <div className="bg-white px-4 py-2 rounded-[0.9rem] border border-yellow-100/50 flex items-center gap-2">
                                                <span className="text-2xl">{ach.badge_url || "🏆"}</span>
                                                <span className="font-black text-sm text-yellow-900">{ach.name}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button
                        size="lg"
                        className="w-full py-5 text-xl"
                        disabled={isSaving}
                        onClick={() => router.push(isBattle ? "/friends" : "/dashboard")}
                    >
                        {isSaving ? t("saving") : isBattle ? t("backToMates") : t("backToDashboard")}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Header */}
            <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center gap-4">
                <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                    <X className="w-8 h-8" />
                </button>
                <div className="flex-1 h-4 bg-muted rounded-full overflow-hidden border border-border/50 p-0.5">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-primary rounded-full transition-all duration-500"
                    />
                </div>
                <div className="flex items-center gap-1.5 text-accent font-black text-xl">
                    <Heart className={cn("w-6 h-6", lives === 0 ? "text-muted animate-pulse" : "fill-accent")} /> {lives}
                </div>
            </header>

            {/* Question Content */}
            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestionIndex}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="flex-1"
                    >
                        <h2 className="text-2xl md:text-3xl font-display font-black mb-8 leading-tight">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option: string, index: number) => {
                                const isSelected = selectedOption === index;
                                return (
                                    <button
                                        key={index}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(index)}
                                        className={cn(
                                            "w-full p-5 rounded-2xl border-2 text-left font-bold transition-all text-lg flex items-center gap-4 outline-none",
                                            isSelected
                                                ? "border-primary bg-primary/5 text-primary shadow-[0_4px_0_rgba(27,155,143,0.3)] translate-y-[-2px]"
                                                : "border-border hover:bg-muted/50",
                                            isAnswered && index === currentQuestion.correct_index && "border-primary bg-primary/10",
                                            isAnswered && isSelected && index !== currentQuestion.correct_index && "border-accent bg-accent/10"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-8 h-8 rounded-lg flex items-center justify-center text-sm border-2",
                                            isSelected ? "border-primary bg-primary text-white" : "border-border"
                                        )}>
                                            {index + 1}
                                        </span>
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Action / Feedback */}
            <AnimatePresence>
                {!isAnswered ? (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                        className="border-t-2 border-border p-6 md:p-10"
                    >
                        <div className="max-w-4xl mx-auto">
                            <Button
                                size="lg"
                                className="w-full md:w-auto md:px-20 py-5 text-xl float-right"
                                disabled={selectedOption === null}
                                onClick={handleCheck}
                            >
                                {t("check")}
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        className={cn(
                            "p-6 md:p-10 border-t-2",
                            isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        )}
                    >
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6">
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center",
                                isCorrect ? "bg-green-500 text-white" : "bg-red-500 text-white"
                            )}>
                                {isCorrect ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className={cn("text-2xl font-black mb-1", isCorrect ? "text-green-800" : "text-red-800")}>
                                    {isCorrect ? t("correct") : t("incorrect")}
                                </h3>
                                <div className={cn("font-medium", isCorrect ? "text-green-700" : "text-red-700")}>
                                    {isAnswered && !isCorrect && (
                                        <p className="block font-bold mb-1">{t("correctAnswer", { answer: currentQuestion.options[currentQuestion.correct_index] })}</p>
                                    )}
                                    <p>{currentQuestion.explanation}</p>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                variant={isCorrect ? "primary" : "accent"}
                                className={cn(
                                    "w-full md:w-auto md:px-20 py-5 text-xl",
                                    isCorrect ? "bg-green-600 hover:bg-green-700 shadow-[0_4px_0_#156158]" : ""
                                )}
                                onClick={handleContinue}
                            >
                                {lives === 0 && !isCorrect ? t("finish") : t("continue")}
                            </Button>
                        </div>
                    </motion.div>
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
