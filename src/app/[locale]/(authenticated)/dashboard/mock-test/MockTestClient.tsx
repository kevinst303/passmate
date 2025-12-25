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
import { getRandomQuestions, logQuizMistake, saveForReview } from "@/app/actions/quiz";
import {
    Bookmark,
    Check,
    Loader2
} from "lucide-react";

import { checkAndUnlockAchievements } from "@/app/actions/achievements";
import { useTranslations } from "next-intl";
import { Question } from "@/types/admin";
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

    const [isBookmarking, setIsBookmarking] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [showNavigator, setShowNavigator] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<number, { selected: number, isCorrect: boolean }>>({});

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

    const [direction, setDirection] = useState(1); // 1 for next, -1 for previous

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
            // Log mistake
            if (currentQuestion?.id) {
                logQuizMistake(currentQuestion.id);
            }
        }

        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: { selected: selectedOption, isCorrect: correct }
        }));
    };

    const handleContinue = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setDirection(1);
            setCurrentQuestionIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
            setIsBookmarked(false);
        } else {
            finishQuiz();
        }
    };

    // Keyboard Support
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only active during quiz step
            if (currentStep !== 1 || showExitDialog) return;

            // Numbers 1-4 for options
            if (e.key >= '1' && e.key <= '4' && !isAnswered) {
                const idx = parseInt(e.key) - 1;
                if (currentQuestion?.options[idx]) {
                    setSelectedOption(idx);
                }
            }

            // Enter to check or continue
            if (e.key === 'Enter') {
                if (!isAnswered && selectedOption !== null) {
                    handleCheck();
                } else if (isAnswered) {
                    handleContinue();
                }
            }

            // Escape to show exit dialog
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
            <div className="min-h-screen bg-[#FEFEF8] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-2xl w-full bg-white/80 backdrop-blur-xl p-6 sm:p-12 rounded-[3.5rem] border-2 border-border shadow-2xl text-center relative z-10"
                >
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-4xl sm:text-6xl mx-auto mb-6 sm:mb-8 shadow-inner border border-primary/20">🇦🇺</div>
                    <h1 className="text-3xl sm:text-5xl font-display font-black mb-4 sm:mb-8 tracking-tight">{t("title")}</h1>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-10 text-left">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center gap-3 mb-3 relative">
                                <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-primary" />
                                </div>
                                <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">{t("requirements")}</p>
                            </div>
                            <p className="font-display font-bold text-lg leading-snug relative">{t("passMark")}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center gap-3 mb-3 relative">
                                <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-accent" />
                                </div>
                                <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">{t("mandatory")}</p>
                            </div>
                            <p className="font-display font-bold text-lg leading-snug text-accent relative">{t("mandatoryDesc")}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center gap-3 mb-3 relative">
                                <div className="w-10 h-10 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <Timer className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">{t("timer")}</p>
                            </div>
                            <p className="font-display font-bold text-lg leading-snug relative">{t("duration")}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-card p-6 rounded-[2.5rem] border-2 border-border shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                            <div className="flex items-center gap-3 mb-3 relative">
                                <div className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">
                                    <Zap className="w-5 h-5 text-yellow-600" />
                                </div>
                                <p className="font-extrabold text-xs uppercase tracking-widest text-muted-foreground">{t("reward")}</p>
                            </div>
                            <p className="font-display font-bold text-lg leading-snug relative">{t("rewardDesc")}</p>
                        </motion.div>
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

                    <div className="grid grid-cols-2 gap-4 mb-6">
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

                    {/* Topic Breakdown */}
                    <div className="mb-8 text-left space-y-3">
                        <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">{t("topicBreakdown") || "Topic Breakdown"}</h4>
                        <div className="bg-muted/10 rounded-3xl border border-border p-5 space-y-5">
                            {Object.entries(
                                questions.reduce((acc, q, idx) => {
                                    const topic = q.topic;
                                    if (!acc[topic]) acc[topic] = { total: 0, correct: 0 };
                                    acc[topic].total++;
                                    if (userAnswers[idx]?.isCorrect) {
                                        acc[topic].correct++;
                                    }
                                    return acc;
                                }, {} as Record<string, { total: number, correct: number }>)
                            ).map(([topic, stats]) => {
                                const percentage = Math.round((stats.correct / stats.total) * 100);
                                return (
                                    <div key={topic} className="space-y-2">
                                        <div className="flex justify-between items-center text-xs font-bold">
                                            <span className="text-foreground truncate max-w-[220px]">{topic}</span>
                                            <span className={cn(
                                                "font-black px-2 py-0.5 rounded-full",
                                                percentage >= 75 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {stats.correct}/{stats.total}
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden border border-border/50">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-1000",
                                                    percentage >= 75 ? "bg-primary" : "bg-accent"
                                                )}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                <p className="text-[11px] text-primary/80 leading-relaxed font-bold italic">
                                    💡 {t("topicHint") || "Questions with the red bar are areas you should revisit in the Study Path for better results."}
                                </p>
                            </div>
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

                    <Button
                        size="lg"
                        className="w-full py-5 text-xl relative overflow-hidden"
                        onClick={() => router.push("/dashboard")}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>{t("saving")}</span>
                            </div>
                        ) : (
                            t("returnHome")
                        )}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FEFEF8] flex flex-col relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

            <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-border relative z-10 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setShowExitDialog(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-xl">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex-1 max-w-md h-3 bg-muted/50 rounded-full overflow-hidden relative border border-border/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
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
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowNavigator(true)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-xl hover:bg-muted/80 transition-colors border border-border/50 group"
                    >
                        <div className="grid grid-cols-2 gap-0.5">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full group-hover:bg-primary transition-colors" />)}
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">{t("navigator") || "Navigator"}</span>
                    </button>
                    <div className={cn(
                        "flex items-center gap-2 font-mono font-bold text-xl px-4 py-2 rounded-2xl",
                        timeLeft < 300 ? "bg-red-100 text-red-600 animate-pulse" : "bg-muted text-foreground"
                    )}>
                        <Timer className="w-5 h-5" /> {formatTime(timeLeft)}
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 pb-80 relative z-10">
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
                                    <motion.button
                                        key={index}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(index)}
                                        whileTap={{ scale: 0.98 }}
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
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            <div className="fixed bottom-0 left-0 right-0 z-30 w-full">
                <AnimatePresence mode="wait">
                    {!isAnswered ? (
                        <motion.footer
                            key="check-footer"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className="bg-white/80 backdrop-blur-xl border-t-2 border-border p-6 md:p-8"
                        >
                            <div className="max-w-3xl mx-auto flex justify-between items-center gap-4">
                                <div className="hidden md:block">
                                    <p className="text-sm font-bold text-muted-foreground italic">{t("rulesTip")}</p>
                                </div>
                                <Button
                                    size="lg"
                                    className="w-full md:w-auto md:px-24 py-6 text-xl rounded-2xl shadow-lg shadow-primary/20"
                                    disabled={selectedOption === null}
                                    onClick={handleCheck}
                                >
                                    {t("checkAnswer")}
                                </Button>
                            </div>
                        </motion.footer>
                    ) : (
                        <motion.div
                            key="feedback-footer"
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
                                                +20 XP
                                            </motion.div>
                                        )}
                                        <h3 className={cn("text-3xl font-black", isCorrect ? "text-green-800" : "text-red-800")}>
                                            {isCorrect ? t("correct") || "Correct!" : t("incorrect") || "Incorrect"}
                                        </h3>
                                        <div className={cn("text-lg font-bold leading-relaxed", isCorrect ? "text-green-700/80" : "text-red-700/80")}>
                                            {!isCorrect && (
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
                                                "md:px-20 py-7 text-xl rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all",
                                                isCorrect
                                                    ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                                                    : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                                            )}
                                            onClick={handleContinue}
                                        >
                                            {currentQuestionIndex === questions.length - 1 ? t("finishTest") : t("nextQuestion")}
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
                                <AlertTriangle className="w-12 h-12 text-red-600" />
                            </div>
                            <h2 className="text-4xl font-display font-black mb-4">{t("exitTitle") || "Wait, mate!"}</h2>
                            <p className="text-muted-foreground text-xl mb-10 font-bold leading-relaxed px-4">
                                {t("exitDesc") || "You're in the middle of an official mock test. If you leave now, your progress will be lost."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="flex-1 py-8 rounded-3xl font-black text-xl border-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    onClick={() => setShowExitDialog(false)}
                                >
                                    {t("keepGoing") || "Keep Going"}
                                </Button>
                                <Button
                                    variant="accent"
                                    size="lg"
                                    className="flex-1 py-8 rounded-3xl font-black text-xl bg-red-600 hover:bg-red-700 shadow-xl shadow-red-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                    onClick={() => router.push("/dashboard")}
                                >
                                    {t("exitTest") || "Exit Test"}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* Question Navigator Drawer */}
            <AnimatePresence>
                {showNavigator && (
                    <div className="fixed inset-0 z-[100] flex items-end justify-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNavigator(false)}
                            className="absolute inset-0 bg-background/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-white rounded-t-[3rem] border-x-2 border-t-2 border-border shadow-2xl p-8"
                        >
                            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-8" />
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-2xl font-display font-black">{t("testProgress") || "Test Progress"}</h3>
                                <button onClick={() => setShowNavigator(false)} className="p-2 hover:bg-muted rounded-xl transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-5 gap-3 mb-10">
                                {questions.map((q, idx) => {
                                    const isAnsweredIdx = idx < currentQuestionIndex || (idx === currentQuestionIndex && isAnswered);
                                    const isCurrent = idx === currentQuestionIndex;
                                    const isMandatory = q.topic === "Democratic beliefs, rights and liberties";

                                    return (
                                        <button
                                            key={idx}
                                            disabled={!isAnsweredIdx && idx !== currentQuestionIndex}
                                            onClick={() => {
                                                if (idx <= currentQuestionIndex) {
                                                    setDirection(idx > currentQuestionIndex ? 1 : -1);
                                                    setCurrentQuestionIndex(idx);
                                                    setShowNavigator(false);
                                                }
                                            }}
                                            className={cn(
                                                "aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2",
                                                isCurrent ? "border-primary bg-primary/10 text-primary" :
                                                    isAnsweredIdx ? "border-primary/20 bg-primary/5 text-primary/60" :
                                                        "border-border bg-muted/30 text-muted-foreground opacity-50",
                                                isMandatory && !isAnsweredIdx && "border-accent/30"
                                            )}
                                        >
                                            <span className="text-sm font-black">{idx + 1}</span>
                                            {isMandatory && <div className="w-1.5 h-1.5 bg-accent rounded-full" />}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex gap-4 p-4 bg-muted/50 rounded-2xl text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full border border-primary bg-primary/20" /> {t("answeredLegend") || "Answered"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" /> {t("currentLegend") || "Current"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-accent" /> {t("mandatoryLegend") || "Mandatory"}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
