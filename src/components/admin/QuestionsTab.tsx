"use client";

import { motion } from "framer-motion";
import { BookOpen, Search, Plus, Edit2, Trash2, SearchX, Globe, Key } from "lucide-react";
import { Question } from "@/types/admin";
import { Button } from "@/components/ui/Button";

interface QuestionsTabProps {
    questions: Question[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    setIsEditing: (q: Partial<Question>) => void;
    handleDelete: (id: string | undefined) => Promise<void>;
}

export function QuestionsTab({ questions, searchQuery, setSearchQuery, setIsEditing, handleDelete }: QuestionsTabProps) {
    const filteredQuestions = questions.filter((q) =>
        q.question_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.topic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
        >
            <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3.5rem] border-2 border-slate-200/60 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-black/20">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-1">
                        <h3 className="text-2xl md:text-3xl font-black font-display flex items-center gap-4 text-slate-900 dark:text-white">
                            <div className="w-12 h-12 rounded-[1.25rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            Knowledge Matrix
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Review, edit, and expand the global question database</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Scan database..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 rounded-2xl font-bold transition-all outline-none text-slate-900 dark:text-white"
                            />
                        </div>
                        <Button
                            onClick={() => setIsEditing({ topic: '', question_text: '', options: ['', '', '', ''], correct_index: 0, explanation: '' })}
                            className="w-full sm:w-auto h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 group transition-all hover:scale-105"
                        >
                            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> New Concept
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredQuestions.map((q) => (
                    <div key={q.id} className="group bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 dark:hover:shadow-black/40 transition-all duration-500 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                            <button onClick={() => setIsEditing(q)} className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-100 transition-all active:scale-95"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(q.id)} className="p-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"><Trash2 className="w-4 h-4" /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${q.difficulty === 'hard' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' : q.difficulty === 'medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                                    {q.difficulty || 'standard'}
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <Globe className="w-3 h-3" /> {q.topic}
                                </div>
                                {q.is_premium && (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                                        <Key className="w-3 h-3" /> Elite
                                    </div>
                                )}
                            </div>

                            <p className="text-lg font-black text-slate-900 dark:text-white leading-snug line-clamp-3 min-h-[4.5rem] group-hover:text-indigo-600 transition-colors">{q.question_text}</p>

                            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                <div className="flex -space-x-2">
                                    {q.options.slice(0, 3).map((_, i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400">
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                    {q.options.length > 3 && (
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border-2 border-white dark:border-slate-700 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                            +{q.options.length - 3}
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em]">{q.id?.slice(0, 8)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredQuestions.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <SearchX className="w-16 h-16 mb-4 opacity-10" />
                    <p className="font-bold italic">No data matching your query was found in the knowledge base.</p>
                </div>
            )}
        </motion.div>
    );
}
