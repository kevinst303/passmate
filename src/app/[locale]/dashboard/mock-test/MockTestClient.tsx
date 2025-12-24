// Premium Mock Test Experience
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Heart,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Trophy,
    Flame,
    Zap,
    Timer,
    AlertTriangle,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "@/i18n/routing";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { updateUserProgress } from "@/app/actions/progress";
import { getRandomQuestions, logQuizMistake } from "@/app/actions/quiz";
import { checkAndUnlockAchievements } from "@/app/actions/achievements";
import { useTranslations } from "next-intl";
import { Question } from "@/app/actions/admin";
import { User } from "@supabase/supabase-js";

interface Profile {
    premium_tier?: string;
}

interface MockTestClientProps {
    profile: Profile;
}

export default function MockTestClient({ profile }: MockTestClientProps) {
    const t = useTranslations("MockTest");
    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Results
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [mandatoryCorrect, setMandatoryCorrect] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [attemptId, setAttemptId] = useState<string | null>(null);

    const router = useRouter();
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

                const fetchedQuestions = await getRandomQuestions(20);
                setQuestions(fetchedQuestions);
            } catch (err) {
                console.error("Load error:", err);
                setError("Failed to load mock test.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Timer Logic
    useEffect(() => {
        if (currentStep === 1 && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && currentStep === 1) {
            finishQuiz();
        }
    }, [currentStep, timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const currentQuestion = questions[currentQuestionIndex];

    const handleCheck = () => {
        if (selectedOption === null || !currentQuestion) return;

        const correct = selectedOption === currentQuestion.correct_index;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setScore(s => s + 1);
            if (currentQuestion.topic === "Democratic beliefs, rights and liberties") {
                setMandatoryCorrect(m => m + 1);
            }
        } else {
            if (currentQuestion?.id) {
                logQuizMistake(currentQuestion.id);
            }
        }
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setCurrentStep(2);

        if (user) {
            setIsSaving(true);
            const totalQuestions = questions.length;
            const xpGained = score * 25; // Higher reward for mock test

            const mandatoryQuestions = questions.filter(q => q.topic === "Democratic beliefs, rights and liberties").length;
            const passedMandatory = mandatoryCorrect === mandatoryQuestions;
            const hasPassed = score >= (totalQuestions * 0.75) && passedMandatory;

            const result = await updateUserProgress(user.id, xpGained, score, totalQuestions, hasPassed ? 0 : 1);
            if (result.success) {
                setAttemptId(result.attemptId);
            }

            if (hasPassed) {
                await checkAndUnlockAchievements(user.id, 'mock_test', { passed: true });
                confetti({
                    particleCount: 200,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#1B9B8F', '#FFD700', '#FFFFFF']
                });
            }

            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FEFEF8] flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="font-display font-black text-primary italic">{t("preparing")}</p>
            </div>
        );
    }

    if (currentStep === 0) {
        return (
            <div className="min-h-screen bg-[#FEFEF8] flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-2xl w-full bg-white p-10 rounded-[4rem] border-2 border-border shadow-xl text-center"
                >
                    <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">🇦🇺</div>
                    <h1 className="text-4xl font-display font-black mb-6">{t("title")}</h1>

                    <div className="grid grid-cols-2 gap-6 mb-10 text-left">
                        <div className="bg-muted/50 p-6 rounded-3xl border border-border">
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-5 h-5 text-primary" />
                                <p className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">{t("requirements")}</p>
                            </div>
                            <p className="font-bold">{t("passMark")}</p>
                        </div>
                        <div className="bg-muted/50 p-6 rounded-3xl border border-border">
                            <div className="flex items-center gap-3 mb-2">
                                <AlertTriangle className="w-5 h-5 text-accent" />
                                <p className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">{t("mandatory")}</p>
                            </div>
                            <p className="font-bold text-accent">{t("mandatoryDesc")}</p>
                        </div>
                        <div className="bg-muted/50 p-6 rounded-3xl border border-border">
                            <div className="flex items-center gap-3 mb-2">
                                <Timer className="w-5 h-5 text-blue-500" />
                                <p className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">{t("timer")}</p>
                            </div>
                            <p className="font-bold">{t("duration")}</p>
                        </div>
                        <div className="bg-muted/50 p-6 rounded-3xl border border-border">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                <p className="font-extrabold text-sm uppercase tracking-wider text-muted-foreground">{t("reward")}</p>
                            </div>
                            <p className="font-bold">{t("rewardDesc")}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button size="lg" className="w-full py-6 text-xl" onClick={() => setCurrentStep(1)}>
                            {t("startTest")}
                        </Button>
                        <Button variant="outline" size="lg" className="w-full" onClick={() => router.back()}>
                            {t("backDashboard")}
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (currentStep === 2) {
        const mandatoryQuestions = questions.filter(q => q.topic === "Democratic beliefs, rights and liberties").length;
        const passedMandatory = mandatoryCorrect === mandatoryQuestions;
        const hasPassed = score >= (questions.length * 0.75) && passedMandatory;

        return (
            <div className="min-h-screen bg-[#FEFEF8] flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-xl w-full bg-white p-10 rounded-[4rem] border-2 border-border shadow-2xl relative overflow-hidden"
                >
                    {hasPassed && (
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-light" />
                    )}
                    <div className="text-8xl mb-6">{hasPassed ? "🐨🎉" : "🐨💡"}</div>
                    <h1 className="text-4xl font-display font-black mb-4">
                        {hasPassed ? t("legend") : t("almost")}
                    </h1>
                    <p className="text-muted-foreground text-lg font-medium mb-10 max-w-sm mx-auto">
                        {hasPassed
                            ? t("passDesc")
                            : !passedMandatory
                                ? t("mandatoryFailDesc")
                                : t("failScoreDesc", { score, total: questions.length })}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-muted/30 p-6 rounded-[2rem] border border-border">
                            <p className="text-xs font-black text-muted-foreground uppercase mb-1">{t("overallScore")}</p>
                            <p className={cn("text-3xl font-display font-black", hasPassed ? "text-primary" : "text-accent")}>
                                {Math.round((score / questions.length) * 100)}%
                            </p>
                        </div>
                        <div className="bg-muted/30 p-6 rounded-[2rem] border border-border">
                            <p className="text-xs font-black text-muted-foreground uppercase mb-1">{t("mandatoryLabel")}</p>
                            <p className={cn("text-3xl font-display font-black", passedMandatory ? "text-primary" : "text-accent")}>
                                {mandatoryCorrect}/{mandatoryQuestions}
                            </p>
                        </div>
                    </div>

                    {hasPassed && profile.premium_tier === 'citizenship_achiever' && (
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-[2.5rem] border-2 border-yellow-200 mb-8 group cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="flex items-center gap-4 text-left">
                                <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:rotate-12 transition-transform">📜</div>
                                <div className="flex-1">
                                    <h4 className="font-black text-yellow-900 text-lg">{t("certificateTitle")}</h4>
                                    <p className="text-sm font-bold text-yellow-800/70">{t("certificateUnlocked")}</p>
                                </div>
                                <Button
                                    size="lg"
                                    variant="secondary"
                                    className="ml-auto bg-white text-yellow-700 hover:bg-yellow-100 px-8 rounded-2xl shadow-sm"
                                    onClick={() => router.push(`/certificate/${attemptId}`)}
                                >
                                    {t("view")}
                                </Button>
                            </div>
                        </div>
                    )}

                    <Button size="lg" className="w-full py-5 text-xl" onClick={() => router.push("/dashboard")} disabled={isSaving}>
                        {isSaving ? t("saving") : t("returnHome")}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex-1 max-w-md h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            className="h-full bg-primary"
                        />
                    </div>
                </div>
                <div className={cn(
                    "flex items-center gap-2 font-mono font-bold text-xl px-4 py-2 rounded-2xl",
                    timeLeft < 300 ? "bg-red-100 text-red-600 animate-pulse" : "bg-muted text-foreground"
                )}>
                    <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
                            {t("questionCount", { current: currentQuestionIndex + 1, total: questions.length })}
                        </span>
                        {currentQuestion?.topic === "Democratic beliefs, rights and liberties" && (
                            <span className="bg-accent/10 text-accent text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                                <AlertTriangle className="w-3 h-3" /> {t("mandatoryBadge")}
                            </span>
                        )}
                    </div>
                    <h2 className="text-3xl font-display font-black leading-tight text-foreground">
                        {currentQuestion?.question_text}
                    </h2>
                </div>

                <div className="grid gap-4 mb-20">
                    {currentQuestion?.options.map((option: string, index: number) => {
                        const isSelected = selectedOption === index;
                        return (
                            <button
                                key={index}
                                disabled={isAnswered}
                                onClick={() => setSelectedOption(index)}
                                className={cn(
                                    "w-full p-6 rounded-3xl border-2 text-left font-bold transition-all text-xl flex items-center gap-6",
                                    isSelected
                                        ? "border-primary bg-primary/5 text-primary shadow-[0_6px_0_rgba(27,155,143,0.3)] translate-y-[-2px]"
                                        : "border-border hover:border-primary/30 hover:bg-muted/30",
                                    isAnswered && index === currentQuestion.correct_index && "border-green-500 bg-green-50 text-green-700",
                                    isAnswered && isSelected && index !== currentQuestion.correct_index && "border-red-500 bg-red-50 text-red-700"
                                )}
                            >
                                <span className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0 transition-colors",
                                    isSelected ? "border-primary bg-primary text-white" : "border-border"
                                )}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                {option}
                            </button>
                        );
                    })}
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-border p-6 md:p-10 z-20">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-muted-foreground italic">{t("rulesTip")}</p>
                    </div>
                    <Button
                        size="lg"
                        className="w-full md:w-auto md:px-24 py-5 text-xl rounded-2xl"
                        disabled={selectedOption === null && !isAnswered}
                        onClick={isAnswered ? handleContinue : handleCheck}
                    >
                        {isAnswered ? (currentQuestionIndex === questions.length - 1 ? t("finishTest") : t("nextQuestion")) : t("checkAnswer")}
                    </Button>
                </div>
            </footer>
        </div>
    );
}
