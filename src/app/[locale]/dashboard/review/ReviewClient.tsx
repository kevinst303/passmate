"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Brain
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
        <div className="min-h-screen bg-background flex flex-col">
            <header className="max-w-4xl mx-auto w-full px-6 py-6 flex items-center gap-4">
                <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
                    <X className="w-8 h-8" />
                </button>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / mistakes.length) * 100}%` }}
                        className="h-full bg-orange-500 rounded-full"
                    />
                </div>
                <div className="font-display font-black text-orange-600 px-3 py-1 bg-orange-50 rounded-lg text-sm">
                    {currentIndex + 1} / {mistakes.length}
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ x: 30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -30, opacity: 0 }}
                        className="flex-1"
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
                                    <button
                                        key={index}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(index)}
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

            <AnimatePresence>
                {!isAnswered ? (
                    <div className="border-t-2 border-border p-6 md:p-10">
                        <div className="max-w-4xl mx-auto flex justify-end">
                            <Button
                                size="lg"
                                className="w-full md:w-auto md:px-24 py-5 text-xl rounded-2xl bg-orange-500 hover:bg-orange-600 shadow-[0_4px_0_#c2410c]"
                                disabled={selectedOption === null}
                                onClick={handleCheck}
                            >
                                {t("check")}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className={cn(
                            "p-8 border-t-2",
                            isCorrect ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800"
                        )}
                    >
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
                            <div className={cn(
                                "w-16 h-16 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-lg",
                                isCorrect ? "bg-green-500" : "bg-red-500"
                            )}>
                                {isCorrect ? "✅" : "❌"}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-black mb-1">
                                    {isCorrect ? t("wellDone") : t("notQuite")}
                                </h3>
                                <p className="font-bold opacity-80">{currentQuestion.explanation}</p>
                            </div>
                            <Button
                                size="lg"
                                className={cn(
                                    "w-full md:w-auto md:px-20 py-5 text-xl rounded-2xl",
                                    isCorrect ? "bg-green-600 hover:bg-green-700 shadow-[0_4px_0_#15803d]" : "bg-red-600 hover:bg-red-700 shadow-[0_4px_0_#b91c1c]"
                                )}
                                onClick={handleContinue}
                            >
                                {currentIndex === mistakes.length - 1 ? t("finish") : t("next")}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
