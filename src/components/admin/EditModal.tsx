"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe, ShieldCheck, Key } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    isQuestion,
    isAchievement,
    isQuest,
    isUserProfile,
    AdminTab,
    UserProfile
} from "@/types/admin-ui";
import { Question, AchievementManagement as Achievement, QuestManagement as Quest } from "@/types/admin";

interface EditModalProps {
    isEditing: Question | Achievement | Quest | UserProfile | null;
    setIsEditing: (item: any) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    loading: boolean;
    activeTab: AdminTab;
}

export function EditModal({ isEditing, setIsEditing, handleSubmit, loading, activeTab }: EditModalProps) {
    if (!isEditing) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl shadow-black/20 overflow-hidden border-2 border-slate-100 dark:border-slate-800"
            >
                <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
                    <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                        <div>
                            <h3 className="text-2xl font-black font-display text-slate-900 dark:text-white">
                                {isEditing.id ? 'Refine Entry' : 'Manual Entry'}
                            </h3>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-1">
                                Section: {activeTab}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsEditing(null)}
                            className="w-10 h-10 rounded-full hover:bg-white dark:hover:bg-slate-800 flex items-center justify-center text-slate-400 transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-8">
                        {activeTab === 'questions' ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Contextual Topic</label>
                                        <div className="relative">
                                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={(isEditing as Question).topic}
                                                onChange={e => setIsEditing({ ...isEditing, topic: e.target.value } as Question)}
                                                className="w-full pl-11 pr-4 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] font-bold transition-all outline-none"
                                                placeholder="e.g. Government"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Intelligence Level</label>
                                        <select
                                            value={(isEditing as Question).difficulty || 'standard'}
                                            onChange={e => setIsEditing({ ...isEditing, difficulty: e.target.value } as Question)}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold transition-all outline-none appearance-none"
                                        >
                                            <option value="easy">Standard (Easy)</option>
                                            <option value="medium">Intermediate</option>
                                            <option value="hard">Tactical (Hard)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Concept Definition (Question)</label>
                                    <textarea
                                        value={(isEditing as Question).question_text}
                                        onChange={e => setIsEditing({ ...isEditing, question_text: e.target.value } as Question)}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] font-bold transition-all outline-none min-h-[100px]"
                                        placeholder="Formal question content..."
                                    />
                                </div>

                                <div className="space-y-6">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 block">Response Matrix</label>
                                    <div className="space-y-4">
                                        {isQuestion(isEditing) && (isEditing as Question).options.map((opt: string, i: number) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing({ ...isEditing, correct_index: i } as Question)}
                                                    className={`w-12 h-12 rounded-[1rem] border-2 flex items-center justify-center transition-all duration-500 shadow-sm ${isQuestion(isEditing) && (isEditing as Question).correct_index === i
                                                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200'
                                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300 hover:border-primary/40'
                                                        }`}
                                                >
                                                    {isQuestion(isEditing) && (isEditing as Question).correct_index === i ? <CheckCircle2 className="w-6 h-6" /> : (i + 1)}
                                                </button>
                                                <input
                                                    type="text"
                                                    value={opt}
                                                    onChange={e => {
                                                        if (!isQuestion(isEditing)) return;
                                                        const newOpts = [...isEditing.options];
                                                        newOpts[i] = e.target.value;
                                                        setIsEditing({ ...isEditing, options: newOpts });
                                                    }}
                                                    className={`flex-1 p-5 rounded-2xl font-bold transition-all border-2 outline-none ${isQuestion(isEditing) && (isEditing as Question).correct_index === i ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800 text-emerald-900 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-primary'}`}
                                                    placeholder={`Choice ${i + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : activeTab === 'achievements' ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Badge Title</label>
                                        <input
                                            type="text"
                                            value={isAchievement(isEditing) ? (isEditing.title || isEditing.name) : ''}
                                            onChange={e => isAchievement(isEditing) && setIsEditing({ ...isEditing, title: e.target.value, name: e.target.value })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] font-bold transition-all outline-none"
                                            placeholder="The Guardian..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Icon Overlay</label>
                                        <input
                                            type="text"
                                            value={isAchievement(isEditing) ? (isEditing.icon || '🏆') : '🏆'}
                                            onChange={e => isAchievement(isEditing) && setIsEditing({ ...isEditing, icon: e.target.value })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] font-bold transition-all outline-none"
                                            placeholder="Emoji or Icon URL"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Narrative Description</label>
                                    <textarea
                                        value={isAchievement(isEditing) ? isEditing.description : ''}
                                        onChange={e => isAchievement(isEditing) && setIsEditing({ ...isEditing, description: e.target.value })}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] font-bold transition-all outline-none min-h-[100px]"
                                        placeholder="Achievement lore..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">XP Bounty</label>
                                        <input
                                            type="number"
                                            value={isAchievement(isEditing) ? (isEditing.xp_reward || isEditing.points || 0) : 0}
                                            onChange={e => isAchievement(isEditing) && setIsEditing({ ...isEditing, xp_reward: parseInt(e.target.value), points: parseInt(e.target.value) })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Badge Category</label>
                                        <select
                                            value={isAchievement(isEditing) ? (isEditing.type || 'milestone') : 'milestone'}
                                            onChange={e => isAchievement(isEditing) && setIsEditing({ ...isEditing, type: e.target.value })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        >
                                            <option value="milestone">Milestone</option>
                                            <option value="progression">Progression</option>
                                            <option value="special">Special Event</option>
                                            <option value="hidden">Hidden Discovery</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] cursor-pointer border-2 border-slate-100 dark:border-slate-700 hover:border-primary transition-all group">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isAchievement(isEditing) && isEditing.secret ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600'}`}>
                                        {isAchievement(isEditing) && isEditing.secret && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={isAchievement(isEditing) ? !!isEditing.secret : false}
                                        onChange={e => isAchievement(isEditing) && setIsEditing({ ...isEditing, secret: e.target.checked })}
                                        className="hidden"
                                    />
                                    <span className="font-black text-slate-700 dark:text-slate-300">Classified Badge (Visible only after unlock)</span>
                                </div>
                            </div>
                        ) : activeTab === 'users' ? (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Username</label>
                                        <input
                                            type="text"
                                            value={(isEditing as UserProfile).username || ''}
                                            onChange={e => setIsEditing({ ...isEditing, username: e.target.value } as UserProfile)}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={(isEditing as UserProfile).full_name || ''}
                                            onChange={e => setIsEditing({ ...isEditing, full_name: e.target.value } as UserProfile)}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Level</label>
                                        <input
                                            type="number"
                                            value={(isEditing as UserProfile).level || 1}
                                            onChange={e => setIsEditing({ ...isEditing, level: parseInt(e.target.value) } as UserProfile)}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Total XP</label>
                                        <input
                                            type="number"
                                            value={(isEditing as UserProfile).total_xp || 0}
                                            onChange={e => setIsEditing({ ...isEditing, total_xp: parseInt(e.target.value) } as UserProfile)}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Premium Status</label>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing({ ...isEditing, is_premium: !(isEditing as UserProfile).is_premium } as UserProfile)}
                                            className={`w-full p-5 rounded-[1.5rem] font-black border-2 transition-all ${(isEditing as UserProfile).is_premium
                                                ? 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500'
                                                }`}
                                        >
                                            {(isEditing as UserProfile).is_premium ? 'PREMIUM ACTIVE' : 'STANDARD MEMBER'}
                                        </button>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Premium Tier</label>
                                        <select
                                            value={isUserProfile(isEditing) ? (isEditing.premium_tier || 'test_ready') : 'test_ready'}
                                            onChange={e => isUserProfile(isEditing) && setIsEditing({ ...isEditing, premium_tier: e.target.value })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        >
                                            <option value="test_ready">Test Ready</option>
                                            <option value="citizenship_achiever">Citizenship Achiever</option>
                                            <option value="unlimited">Unlimited Elite</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">User Source</label>
                                    <div className="relative">
                                        <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={isUserProfile(isEditing) ? (isEditing.source || '') : ''}
                                            onChange={e => isUserProfile(isEditing) && setIsEditing({ ...isEditing, source: e.target.value })}
                                            placeholder="e.g. facebook_ad, referral, organic"
                                            className="w-full pl-11 pr-4 py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'quests' ? (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Quest Protocol Name</label>
                                    <input
                                        type="text"
                                        value={isQuest(isEditing) ? isEditing.title : ''}
                                        onChange={e => isQuest(isEditing) && setIsEditing({ ...isEditing, title: e.target.value })}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        placeholder="Mission title..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Objective Context</label>
                                    <textarea
                                        value={isQuest(isEditing) ? (isEditing.description || isEditing.objective || '') : ''}
                                        onChange={e => isQuest(isEditing) && setIsEditing({ ...isEditing, description: e.target.value, objective: e.target.value })}
                                        className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary focus:bg-white dark:focus:bg-slate-800 rounded-[1.5rem] font-bold transition-all outline-none min-h-[100px]"
                                        placeholder="Describe the mission goals..."
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Mission Logic</label>
                                        <select
                                            value={isQuest(isEditing) ? isEditing.type : 'quiz_complete'}
                                            onChange={e => isQuest(isEditing) && setIsEditing({ ...isEditing, type: e.target.value })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        >
                                            <option value="quiz_complete">Quiz Completion</option>
                                            <option value="perfect_score">Perfect Score</option>
                                            <option value="daily_login">Daily Login</option>
                                            <option value="topic_complete">Topic Mastery</option>
                                            <option value="referral">Referral Success</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Quantifiable Goal</label>
                                        <input
                                            type="number"
                                            value={isQuest(isEditing) ? (isEditing.requirement || 1) : 1}
                                            onChange={e => isQuest(isEditing) && setIsEditing({ ...isEditing, requirement: parseInt(e.target.value), target_value: parseInt(e.target.value) })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">XP Bounty</label>
                                        <input
                                            type="number"
                                            value={isQuest(isEditing) ? (isEditing.reward_xp || isEditing.xp_reward || 0) : 0}
                                            onChange={e => isQuest(isEditing) && setIsEditing({ ...isEditing, reward_xp: parseInt(e.target.value), xp_reward: parseInt(e.target.value) })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Deployment Status</label>
                                        <select
                                            value={isQuest(isEditing) ? isEditing.status : 'active'}
                                            onChange={e => isQuest(isEditing) && setIsEditing({ ...isEditing, status: e.target.value as any })}
                                            className="w-full p-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                        >
                                            <option value="active">Active Duty</option>
                                            <option value="inactive">On Hold</option>
                                            <option value="archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditing(null)}
                            className="flex-1 h-14 rounded-2xl font-black border-2 border-slate-200 dark:border-slate-700 text-slate-400 hover:bg-white dark:hover:bg-slate-800"
                        >
                            Discard
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 h-14 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            {loading ? 'Processing...' : (isEditing.id ? 'Commit Changes' : 'Initialize Entry')}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
