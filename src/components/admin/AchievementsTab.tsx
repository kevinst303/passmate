"use client";

import { motion } from "framer-motion";
import { Trophy, Plus, Edit2, Trash2, ShieldCheck } from "lucide-react";
import { AchievementManagement as Achievement } from "@/types/admin";
import { Button } from "@/components/ui/Button";

interface AchievementsTabProps {
    achievements: Achievement[];
    setIsEditing: (a: Partial<Achievement>) => void;
    handleDelete: (id: string | undefined) => Promise<void>;
}

export function AchievementsTab({ achievements, setIsEditing, handleDelete }: AchievementsTabProps) {
    return (
        <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3.5rem] border-2 border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-black/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-black font-display flex items-center gap-4 text-slate-900 dark:text-white">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                                <Trophy className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                            </div>
                            Recognition System
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Define milestones and rewards for the PassMate community</p>
                    </div>
                    <Button
                        onClick={() => setIsEditing({ name: '', title: '', description: '', xp_reward: 50, points: 50, icon: '🏆', type: 'Milestone', secret: false })}
                        className="h-14 px-8 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-2xl shadow-xl shadow-amber-200 dark:shadow-none flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> Create Badge
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.map((a) => (
                    <div key={a.id} className="group relative bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 overflow-hidden">
                        {/* Card Accent */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[100px] -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-700" />

                        <div className="relative z-10">
                            <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setIsEditing(a)} className="p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-primary transition-all active:scale-95"><Edit2 className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(a.id)} className="p-2.5 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-md border border-red-100 dark:border-red-900/50 rounded-2xl text-red-400 hover:text-red-500 transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                            </div>

                            <div className="text-5xl mb-8 w-24 h-24 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                {a.icon || '🏆'}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">{a.type || 'Milestone'}</span>
                                    {a.secret && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-1"><ShieldCheck className="w-2.5 h-2.5" /> Hidden</span>}
                                </div>
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{a.title || a.name}</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed line-clamp-2 min-h-[40px]">{a.description}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                        <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-slate-200">{(a.xp_reward || a.points || 0).toLocaleString()} <span className="text-slate-400">XP</span></span>
                                </div>
                                <div className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">ID: {a.id?.slice(0, 8)}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
