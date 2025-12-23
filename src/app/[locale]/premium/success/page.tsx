"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Rocket, ArrowRight, ShieldCheck, Zap, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

export default function PremiumSuccessPage() {
    useEffect(() => {
        // Trigger confetti on mount
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white rounded-[4rem] border-2 border-border shadow-2xl p-8 md:p-16 text-center relative overflow-hidden"
            >
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-200"
                    >
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-4xl md:text-5xl font-display font-black mb-4">Welcome to Premium, Mate!</h1>
                    <p className="text-xl text-muted-foreground font-bold mb-12">
                        You're now a <span className="text-primary italic">Citizenship Achiever</span>.
                        Your journey to becoming Australian just got a massive boost.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="p-6 bg-blue-50 rounded-3xl border-2 border-blue-100">
                            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                            <p className="font-black text-sm text-blue-900">Unlimited Hearts</p>
                        </div>
                        <div className="p-6 bg-purple-50 rounded-3xl border-2 border-purple-100">
                            <Star className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                            <p className="font-black text-sm text-purple-900">Masterclass Access</p>
                        </div>
                        <div className="p-6 bg-yellow-50 rounded-3xl border-2 border-yellow-100">
                            <ShieldCheck className="w-8 h-8 text-yellow-600 mx-auto mb-3" />
                            <p className="font-black text-sm text-yellow-900">Official Certificate</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Link href="/dashboard">
                            <Button size="lg" className="h-20 w-full rounded-[2rem] text-xl font-black shadow-xl hover:scale-[1.02] transition-all flex gap-3">
                                Go to Dashboard <Rocket className="w-6 h-6" />
                            </Button>
                        </Link>
                        <Link href="/masterclass">
                            <Button variant="outline" size="lg" className="h-16 w-full rounded-2xl text-lg font-black border-2 flex gap-3">
                                Start Masterclass <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    <p className="mt-12 text-muted-foreground text-sm font-bold flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Your premium features are now active. Enjoy the ride!
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
