"use client";

import { motion } from "framer-motion";
import {
    ArrowLeft,
    Trophy,
    Lock,
    Unlock,
    Star,
    Zap,
    Flame,
    Award
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AchievementsClientProps {
    achievementsData: any;
    profile: any;
}

export default function AchievementsClient({ achievementsData, profile }: AchievementsClientProps) {
    const { achievements, stats } = achievementsData;

    return (
        <div className="min-h-screen bg-muted/20 pb-24 md:pb-8 md:pl-28 md:pr-8">
            {/* Header */}
            <header className="max-w-6xl mx-auto pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold group mb-4">
                        <div className="bg-white p-2 rounded-xl border-2 border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                        </div>
                        <span>Back to Dashboard</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <Trophy className="w-8 h-8 fill-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-black text-foreground tracking-tight">Achievements</h1>
                            <p className="text-muted-foreground font-bold italic">Unlock badges to show off your citizenship expertise!</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Your Stats</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-4 py-2 rounded-2xl border-2 border-orange-100 font-black text-sm">
                                <Flame className="w-4 h-4 fill-orange-600" /> {profile.daily_streak}
                            </div>
                            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-4 py-2 rounded-2xl border-2 border-blue-100 font-black text-sm">
                                <Zap className="w-4 h-4 fill-blue-600" /> {profile.total_xp}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-8 space-y-12">
                {/* Stats Summary Card */}
                <section className="bg-white p-8 rounded-[3.5rem] border-2 border-border shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-display font-black text-foreground">Completion Progress</h3>
                                    <p className="text-sm text-muted-foreground font-bold">You've earned {stats.unlocked} out of {stats.total} total badges</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-4xl font-display font-black text-primary">{stats.progress}%</span>
                                </div>
                            </div>
                            <div className="h-6 bg-muted rounded-3xl overflow-hidden border-2 border-muted p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.progress}%` }}
                                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-primary rounded-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                            <div className="bg-muted/30 p-4 rounded-3xl border border-border text-center">
                                <Award className="w-6 h-6 mx-auto mb-2 text-primary" />
                                <p className="text-2xl font-display font-black">{stats.unlocked}</p>
                                <p className="text-[10px] uppercase font-black text-muted-foreground">Badges</p>
                            </div>
                            <div className="bg-muted/30 p-4 rounded-3xl border border-border text-center">
                                <Star className="w-6 h-6 mx-auto mb-2 text-yellow-500 fill-yellow-500" />
                                <p className="text-2xl font-display font-black">{achievements.reduce((acc: number, a: any) => acc + (a.is_unlocked ? a.xp_reward : 0), 0)}</p>
                                <p className="text-[10px] uppercase font-black text-muted-foreground">Reward XP</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Grid */}
                <div>
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-1 w-8 bg-primary rounded-full" />
                        <h2 className="text-2xl font-display font-black tracking-tight">Your Badge Collection</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {achievements.map((achievement: any, idx: number) => (
                            <motion.div
                                key={achievement.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className={cn(
                                    "group relative p-8 rounded-[3rem] border-2 flex flex-col items-center text-center gap-5 transition-all",
                                    achievement.is_unlocked
                                        ? "bg-white border-yellow-200 shadow-lg hover:shadow-2xl hover:border-yellow-400 hover:-translate-y-2"
                                        : "bg-muted/10 border-border/50 opacity-60 grayscale"
                                )}
                            >
                                {/* Glow effect for unlocked */}
                                {achievement.is_unlocked && (
                                    <div className="absolute inset-0 bg-yellow-400/5 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}

                                <div className={cn(
                                    "w-24 h-24 rounded-full flex items-center justify-center text-5xl relative z-10 transition-transform group-hover:scale-110 duration-300",
                                    achievement.is_unlocked
                                        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-[6px] border-white shadow-inner"
                                        : "bg-muted border-[6px] border-white"
                                )}>
                                    {achievement.badge_url || "🏆"}
                                    {achievement.is_unlocked && (
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 p-1.5 rounded-full border-4 border-white">
                                            <Unlock className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-display font-black leading-tight mb-2 group-hover:text-primary transition-colors">{achievement.name}</h3>
                                    <p className="text-sm text-muted-foreground font-bold mb-4 line-clamp-2 min-h-[2.5rem]">{achievement.description}</p>

                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter transition-all",
                                        achievement.is_unlocked
                                            ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                            : "bg-muted text-muted-foreground"
                                    )}>
                                        <Zap className={cn("w-3 h-3", achievement.is_unlocked ? "fill-white" : "")} /> {achievement.xp_reward} XP
                                    </div>
                                </div>

                                {achievement.unlocked_at && (
                                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase mt-auto">
                                        Earned {new Date(achievement.unlocked_at).toLocaleDateString()}
                                    </p>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Secret Achievement Tease */}
                <section className="bg-black text-white p-10 rounded-[4rem] border-4 border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="text-6xl group-hover:rotate-12 transition-transform">🤫</div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-display font-black mb-2">Secret Badges</h2>
                            <p className="text-white/60 font-bold max-w-lg">
                                There are hidden achievements waiting to be discovered. Keep exploring, interact with friends, and reach new heights to uncover them!
                            </p>
                        </div>
                        <div className="ml-auto">
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 font-black text-sm uppercase tracking-widest">
                                Mystery Awaits
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
