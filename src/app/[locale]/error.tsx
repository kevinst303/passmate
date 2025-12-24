"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Home, AlertTriangle, Bug, ChevronDown, ChevronUp, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        // Log the error to an error reporting service
        console.error("App Error:", error);
    }, [error]);

    return (
        <div className="relative min-h-screen bg-[#FEFEF8] overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            {/* Animated Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-accent/5 rounded-full blur-[80px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg"
            >
                {/* Main Card with Glassmorphism */}
                <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12">
                    {/* Character/Icon Section */}
                    <div className="relative mb-10 inline-block">
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                rotate: [-1, 1, -1]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: "easeInOut"
                            }}
                            className="text-[100px] md:text-[120px] select-none filter drop-shadow-xl"
                        >
                            🐨
                        </motion.div>

                        {/* Status Icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="absolute -top-1 -right-1 w-12 h-12 md:w-14 md:h-14 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white dark:border-gray-800"
                        >
                            <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-red-500" />
                        </motion.div>

                        {/* Floating shadow effect */}
                        <motion.div
                            animate={{
                                scaleX: [1, 1.1, 1],
                                opacity: [0.2, 0.1, 0.2]
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 4,
                                ease: "easeInOut"
                            }}
                            className="w-24 h-4 bg-black/10 rounded-[100%] mx-auto mt-[-10px] blur-md"
                        />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-display font-black text-foreground mb-4 tracking-tight">
                        Oops! Something Went Wrong
                    </h1>

                    <p className="text-muted-foreground text-lg font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                        Ollie encountered an unexpected problem. Don&apos;t worry, it&apos;s not your fault!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={reset}
                            className="w-full sm:w-auto flex items-center justify-center h-14"
                        >
                            <RefreshCw className="w-5 h-5 mr-2 group-active:rotate-180 transition-transform duration-500" />
                            Try Again
                        </Button>
                        <Link href="/dashboard" className="w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full h-14 font-bold flex items-center justify-center gap-2"
                            >
                                <Home className="w-5 h-5" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Support Link */}
                    <div className="mt-10 pt-8 border-t border-border/50">
                        <p className="text-sm text-muted-foreground font-semibold flex items-center justify-center gap-2">
                            Need help?
                            <Link href="/contact" className="text-primary hover:text-primary/80 underline underline-offset-4 flex items-center gap-1">
                                <LifeBuoy className="w-4 h-4" /> Contact Support
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Error Details (Toggleable) */}
                {(process.env.NODE_ENV === "development" || showDetails) && (
                    <div className="mt-6 text-left w-full">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors mx-auto mb-2 uppercase tracking-widest px-4 py-2 rounded-full hover:bg-black/5"
                        >
                            {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {showDetails ? "Hide" : "View"} Error Details
                        </button>

                        <AnimatePresence>
                            {showDetails && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl p-6 shadow-inner overflow-hidden"
                                >
                                    <div className="flex items-center gap-2 text-red-700 font-bold mb-3 text-sm">
                                        <Bug className="w-4 h-4" /> Technical Report
                                    </div>
                                    <div className="space-y-3 font-mono text-[13px] leading-relaxed">
                                        <div className="bg-white/50 rounded-lg p-3 text-red-600 break-all border border-red-50">
                                            {error.message || "An anonymous error occurred."}
                                        </div>
                                        {error.digest && (
                                            <div className="text-red-400 text-xs">
                                                <span className="font-bold opacity-60">ID:</span> {error.digest}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
