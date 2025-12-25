"use client";

import { motion } from "framer-motion";
import { Target, Plus, Edit2, Trash2 } from "lucide-react";
import { QuestManagement as Quest } from "@/types/admin";
import { Button } from "@/components/ui/Button";

interface QuestsTabProps {
    quests: Quest[];
    setIsEditing: (q: Partial<Quest>) => void;
    handleDelete: (id: string | undefined) => Promise<void>;
}

export function QuestsTab({ quests, setIsEditing, handleDelete }: QuestsTabProps) {
    return (
        <motion.div
            key="quests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3.5rem] border-2 border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-black/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-black font-display flex items-center gap-4 text-slate-900 dark:text-white">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Target className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            Mission Control
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Deploy daily objectives and strategic goals for all users</p>
                    </div>
                    <Button
                        onClick={() => setIsEditing({ title: '', objective: '', description: '', xp_reward: 100, reward_xp: 100, type: 'Daily', requirement: 1, target_value: 1, status: 'active' })}
                        className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 group transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> New Mission
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {quests.map((q) => (
                    <div key={q.id} className="group relative bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500">
                        <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(q)} className="p-2.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-primary transition-all active:scale-95"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(q.id)} className="p-2.5 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-md border border-red-100 dark:border-red-900/50 rounded-2xl text-red-400 hover:text-red-500 transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${q.status === 'active' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/30 text-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${q.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            {q.status === 'active' ? 'Active' : 'On Hold'}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{q.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 space-y-3">
                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight pr-10">{q.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-relaxed line-clamp-2">{q.description || q.objective || 'Complete the tactical objectives to claim rewards.'}</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Requirement</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-slate-200">{q.requirement || q.target_value} <span className="text-slate-400">units</span></span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Bounty</span>
                                    </div>
                                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+{q.reward_xp || q.xp_reward} <span className="text-emerald-400/50">XP</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
