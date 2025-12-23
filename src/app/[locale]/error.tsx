"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle, Bug } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("App Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md"
            >
                {/* Sad Ollie */}
                <div className="relative mb-8">
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-[120px]"
                    >
                        🐨
                    </motion.div>
                    <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <h1 className="text-3xl font-display font-black mb-4">
                    Oops! Something Went Wrong
                </h1>
                <p className="text-muted-foreground font-bold mb-8 max-w-sm mx-auto">
                    Ollie encountered an unexpected problem. Don't worry, it's not your fault!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                    <Button size="lg" onClick={reset} className="w-full sm:w-auto flex items-center gap-2">
                        <RefreshCw className="w-5 h-5" /> Try Again
                    </Button>
                    <Link href="/dashboard">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto flex items-center gap-2">
                            <Home className="w-5 h-5" /> Go to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Error Details (dev only) */}
                {process.env.NODE_ENV === "development" && error.message && (
                    <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-6 text-left">
                        <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                            <Bug className="w-4 h-4" /> Error Details
                        </div>
                        <p className="text-sm text-red-600 font-mono break-all">
                            {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-xs text-red-400 font-mono mt-2">
                                Digest: {error.digest}
                            </p>
                        )}
                    </div>
                )}

                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground font-bold">
                        If this keeps happening, please{" "}
                        <Link href="/contact" className="text-primary hover:underline">
                            contact support
                        </Link>
                        .
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
