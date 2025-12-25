"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Brain,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "@/i18n/routing";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { resolveMistake } from "@/app/actions/quiz";
import { useTranslations } from "next-intl";

export interface Question {
    id: string;
    question_text: string;
    options: string[];
    correct_index: number;
    explanation: string;
}

export interface Mistake {
    id: string;
    questions: Question;
}

interface ReviewClientProps {
    mistakes: Mistake[];
}

export default function ReviewClient({ mistakes }: ReviewClientProps) {
    const t = useTranslations("Review");
    const [currentStep, setCurrentStep] = useState(0); // 0: Start, 1: Quiz, 2: Results
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [direction, setDirection] = useState(1);
    const router = useRouter();

    if (mistakes.length === 0 && currentStep !== 2) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="text-8xl mb-6">✅</div>
                <h1 className="text-4xl font-display font-black mb-4">{t("clearTitle")}</h1>
                <p className="text-muted-foreground text-lg mb-8 max-w-sm">
                    {t("clearDesc")}
                </p>
                <Button size="lg" onClick={() => router.push("/dashboard")}>{t("finish")}</Button>
            </div>
        );
    }

    const currentMistake = mistakes[currentIndex];
    const currentQuestion = currentMistake?.questions;

    const handleCheck = async () => {
        if (selectedOption === null || !currentQuestion) return;

        const correct = selectedOption === currentQuestion.correct_index;
        setIsCorrect(correct);
        setIsAnswered(true);

        if (correct) {
            setScore(s => s + 1);
            // Mark as resolved in DB
            await resolveMistake(currentMistake.id);
        }
    };

    const handleContinue = () => {
        if (currentIndex < mistakes.length - 1) {
            setDirection(1);
            setCurrentIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setCurrentStep(2);
            if (score > 0) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }
    };

    // Keyboard Support
    useEffect(() => {
        if (typeof window === 'undefined') return;

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

    if (currentStep === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full"
                >
                    <div className="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-8">🧠</div>
                    <h1 className="text-4xl font-display font-black mb-4">{t("title")}</h1>
                    <p className="text-muted-foreground text-lg mb-10">
                        {t("introDesc", { count: mistakes.length })}
                    </p>
                    <div className="space-y-4">
                        <Button size="lg" className="w-full py-6 text-xl" onClick={() => setCurrentStep(1)}>
                            {t("startReview")}
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
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-md w-full bg-white p-10 rounded-[3.5rem] border-2 border-border shadow-xl"
                >
                    <div className="text-7xl mb-6">{score === mistakes.length ? "🎓" : "💪"}</div>
                    <h1 className="text-4xl font-display font-black mb-4">{t("completeTitle")}</h1>
                    <p className="text-muted-foreground font-medium mb-10">
                        {t("completeDesc", { count: score })}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
                            <div className="text-sm font-black text-orange-600 mb-1 uppercase tracking-wider">{t("solved")}</div>
                            <div className="text-4xl font-display font-black text-orange-700">{score}</div>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                            <div className="text-sm font-black text-blue-600 mb-1 uppercase tracking-wider">{t("xpEarned")}</div>
                            <div className="text-4xl font-display font-black text-blue-700">+{score * 10}</div>
                        </div>
                    </div>
                    <Button size="lg" className="w-full py-5 text-xl" onClick={() => router.push("/dashboard")}>
                        {t("finish")}
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10" />

            <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-border relative z-10 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setShowExitDialog(true)} className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-xl">
                        <X className="w-8 h-8" />
                    </button>
                    <div className="flex-1 max-w-md h-3 bg-muted/50 rounded-full overflow-hidden relative border border-border/50">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentIndex + 1) / mistakes.length) * 100}%` }}
                            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 relative overflow-hidden"
                        >
                            <motion.div
                                animate={{ x: ['100%', '-100%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 w-full h-full bg-white/20 skew-x-[-20deg]"
                            />
                        </motion.div>
                    </div>
                </div>
                <div className="font-display font-black text-orange-600 px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100 text-sm">
                    {currentIndex + 1} / {mistakes.length}
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 pb-40 flex flex-col relative z-10">
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={currentIndex}
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
                        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-orange-200">
                            <Brain className="w-3.5 h-3.5" /> {t("trickyQuestion")}
                        </div>
                        <h2 className="text-3xl font-display font-black mb-10 leading-tight">
                            {currentQuestion?.question_text}
                        </h2>

                        <div className="space-y-4">
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
                                                ? "border-orange-500 bg-orange-50 text-orange-700 shadow-[0_6px_0_rgba(249,115,22,0.3)] translate-y-[-2px]"
                                                : "border-border hover:border-orange-300 hover:bg-muted/30",
                                            isAnswered && index === currentQuestion.correct_index && "border-green-500 bg-green-50 text-green-700",
                                            isAnswered && isSelected && index !== currentQuestion.correct_index && "border-red-500 bg-red-50 text-red-700"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0 transition-all",
                                            isSelected ? "border-orange-500 bg-orange-500 text-white" : "border-border"
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

            <AnimatePresence mode="wait">
                {!isAnswered ? (
                    <motion.div
                        key="check-panel"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="fixed bottom-0 left-0 right-0 border-t-2 border-border p-6 md:p-8 bg-white/80 backdrop-blur-xl z-20"
                    >
                        <div className="max-w-4xl mx-auto flex justify-end">
                            <Button
                                size="lg"
                                className="w-full md:w-auto md:px-24 py-6 text-xl rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200"
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
                            "fixed bottom-0 left-0 right-0 p-6 md:p-10 border-t-2 backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.1)] z-20",
                            isCorrect ? "bg-green-50/95 border-green-200" : "bg-red-50/95 border-red-200"
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
                                <div className="flex-1 text-center md:text-left space-y-2">
                                    <h3 className={cn("text-3xl font-black", isCorrect ? "text-green-800" : "text-red-800")}>
                                        {isCorrect ? t("wellDone") : t("notQuite")}
                                    </h3>
                                    <div className={cn("text-lg font-bold leading-relaxed", isCorrect ? "text-green-700/80" : "text-red-700/80")}>
                                        <p className="line-clamp-3 hover:line-clamp-none transition-all">{currentQuestion.explanation}</p>
                                    </div>
                                </div>
                                <Button
                                    size="lg"
                                    className={cn(
                                        "w-full md:w-auto md:px-20 py-6 text-xl rounded-2xl shadow-xl active:scale-95",
                                        isCorrect ? "bg-green-600 hover:bg-green-700 shadow-green-200" : "bg-red-600 hover:bg-red-700 shadow-red-200"
                                    )}
                                    onClick={handleContinue}
                                >
                                    {currentIndex === mistakes.length - 1 ? t("finish") : t("next")}
                                    <ChevronRight className="ml-2 w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            <h2 className="text-4xl font-display font-black mb-4">Wait, mate!</h2>
                            <p className="text-muted-foreground text-xl mb-10 font-bold leading-relaxed px-4">
                                If you leave now, you'll lose your practice progress.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="py-6 rounded-2xl font-black text-lg border-2"
                                    onClick={() => setShowExitDialog(false)}
                                >
                                    Keep Practising
                                </Button>
                                <Button
                                    variant="accent"
                                    size="lg"
                                    className="py-6 rounded-2xl font-black text-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                                    onClick={() => router.back()}
                                >
                                    Exit Review
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
