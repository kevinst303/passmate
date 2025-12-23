"use client";

import { motion } from "framer-motion";
import { Home, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

// Floating particle component
const FloatingParticle = ({ delay, duration, x, y, size }: { delay: number; duration: number; x: number; y: number; size: number }) => (
    <motion.div
        className="absolute rounded-full bg-primary/20"
        style={{ width: size, height: size }}
        initial={{ x, y, opacity: 0 }}
        animate={{
            y: [y, y - 100, y],
            opacity: [0, 0.6, 0],
            scale: [0.8, 1.2, 0.8],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    />
);

export default function NotFound() {
    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

            {/* Animated gradient orbs */}
            <motion.div
                className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-3xl"
                animate={{
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-1/4 -right-32 w-80 h-80 bg-gradient-to-l from-secondary/30 to-accent/10 rounded-full blur-3xl"
                animate={{
                    x: [0, -40, 0],
                    y: [0, -20, 0],
                    scale: [1, 1.15, 1],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating particles */}
            <FloatingParticle delay={0} duration={6} x={-150} y={100} size={8} />
            <FloatingParticle delay={1} duration={8} x={150} y={200} size={12} />
            <FloatingParticle delay={2} duration={7} x={-100} y={-50} size={6} />
            <FloatingParticle delay={3} duration={9} x={200} y={-100} size={10} />
            <FloatingParticle delay={4} duration={5} x={-200} y={150} size={14} />

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 max-w-lg"
            >
                {/* Glassmorphism card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
                    {/* Ollie Lost with enhanced animation */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                rotate: [0, -8, 8, -8, 0],
                                y: [0, -5, 0],
                            }}
                            transition={{
                                rotate: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
                            }}
                            className="text-[120px] md:text-[140px] mb-4 drop-shadow-lg"
                        >
                            🐨
                        </motion.div>
                        {/* Subtle sparkle effect */}
                        <motion.div
                            className="absolute top-4 right-1/4"
                            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                        >
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                    </motion.div>

                    {/* 404 text with gradient */}
                    <motion.h1
                        className="text-7xl md:text-8xl font-display font-black mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <span className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">4</span>
                        <span className="bg-gradient-to-r from-primary via-primary to-teal-400 bg-clip-text text-transparent">0</span>
                        <span className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">4</span>
                    </motion.h1>

                    <motion.h2
                        className="text-xl md:text-2xl font-display font-bold text-foreground mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        Crikey! Page Not Found
                    </motion.h2>

                    <motion.p
                        className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        Looks like Ollie wandered off the track. The page you&apos;re looking for doesn&apos;t exist or has been moved.
                    </motion.p>

                    {/* Premium Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Link href="/" className="group">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98, y: 0 }}
                                className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-teal-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-3 overflow-hidden transition-shadow hover:shadow-xl hover:shadow-primary/40"
                            >
                                {/* Shine effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                <Home className="w-5 h-5 relative z-10" />
                                <span className="relative z-10">Go Home</span>
                            </motion.button>
                        </Link>

                        <Link href="/dashboard" className="group">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98, y: 0 }}
                                className="relative w-full sm:w-auto px-8 py-4 bg-white border-2 border-primary/20 text-primary rounded-2xl font-bold text-lg shadow-lg shadow-gray-200/50 flex items-center justify-center gap-3 overflow-hidden transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-gray-300/50 hover:bg-primary/5"
                            >
                                {/* Subtle gradient overlay on hover */}
                                <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform" />
                                <span className="relative z-10">Dashboard</span>
                            </motion.button>
                        </Link>
                    </motion.div>
                </div>

                {/* Quick Links Section */}
                <motion.div
                    className="mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <p className="text-sm text-muted-foreground mb-4 font-medium">
                        Looking for something specific?
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { href: "/login", label: "Login" },
                            { href: "/premium", label: "Premium" },
                            { href: "/contact", label: "Contact Us" },
                            { href: "/terms", label: "Terms" },
                        ].map((link, index) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm font-semibold text-primary hover:bg-white hover:shadow-md transition-all duration-200 border border-white/50"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
