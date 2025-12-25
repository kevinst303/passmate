"use client";

import { motion } from "framer-motion";
import {
    Database,
    TrendingUp,
    Clock,
    CheckCircle2,
    AlertCircle,
    SearchX,
    Share2,
    Users,
    Trophy
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { AdminDashboardData } from "@/types/admin-ui"; // I might need to move this interface

interface OverviewTabProps {
    data: AdminDashboardData | null;
    loading: boolean;
    handleSeed: () => Promise<void>;
    status: { success?: boolean; message?: string } | null;
}

export function OverviewTab({ data, loading, handleSeed, status }: OverviewTabProps) {
    return (
        <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {[
                    { label: 'Total Citizens', value: data?.stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Elite Members', value: data?.stats?.premiumUsers || 0, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Elite Ratio', value: `${data?.stats?.conversionRate || 0}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Active Concepts', value: data?.stats?.totalQuestions || 0, icon: Database, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card glass p-8 rounded-[2.5rem] border-2 border-border shadow-xl shadow-black/5 hover:scale-[1.02] transition-all group"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-3xl font-black font-display tracking-tight text-slate-900">{stat.value}</h4>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-1">{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Database Management */}
                <div className="bg-card glass p-10 rounded-[3rem] border-2 border-border shadow-xl shadow-black/5">
                    <h3 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                            <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        System Maintenance
                    </h3>

                    <div className="bg-orange-500/10 p-6 md:p-8 rounded-[2rem] border-2 border-orange-500/20 mb-6 relative overflow-hidden group">
                        <div className="relative z-10">
                            <h4 className="text-orange-600 dark:text-orange-400 font-black mb-2 text-lg md:text-xl">Global Data Seeder</h4>
                            <p className="text-xs md:text-sm text-orange-800/70 dark:text-orange-300/60 mb-6 leading-relaxed font-bold">
                                Re-sync core content, tiers, and base questions. Bypass duplicate checks.
                            </p>
                            <Button
                                onClick={handleSeed}
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl h-14 md:h-16 text-base md:text-lg shadow-xl shadow-orange-200 transition-all hover:scale-[1.01]"
                            >
                                {loading ? "Processing..." : "Sync Global Content"}
                            </Button>
                        </div>
                        <Database className="absolute -right-8 -bottom-8 w-32 md:w-40 h-32 md:h-40 text-orange-200/30 -rotate-12 transition-transform group-hover:rotate-0 duration-700 pointer-events-none" />
                    </div>

                    {status && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-4 rounded-2xl border-2 flex items-center gap-3 ${status.success
                                ? "bg-green-50 border-green-100 text-green-800"
                                : "bg-red-50 border-red-100 text-red-800"
                                }`}>
                            {status.success ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                            <p className="font-bold text-sm">{status.message}</p>
                        </motion.div>
                    )}
                </div>

                <div className="bg-card glass p-10 rounded-[3rem] border-2 border-border shadow-xl shadow-black/5">
                    <h3 className="text-2xl font-black font-display mb-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                        User Acquisition
                    </h3>

                    <div className="space-y-6">
                        {[
                            { label: 'Referral Link', count: data?.stats?.referralUsers || 0, color: 'bg-primary' },
                            { label: 'Direct / Search', count: (data?.stats?.totalUsers || 0) - (data?.stats?.referralUsers || 0), color: 'bg-blue-500' },
                        ].map((source, i) => {
                            const total = data?.stats?.totalUsers || 1;
                            const percentage = ((source.count / total) * 100).toFixed(1);
                            return (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <p className="font-black text-slate-700">{source.label}</p>
                                        <p className="font-black text-slate-400 text-sm">{source.count} users ({percentage}%)</p>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: i * 0.2 }}
                                            className={`h-full ${source.color}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}

                        <div className="pt-6 border-t border-slate-100">
                            <div className="p-6 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-between">
                                <div>
                                    <p className="font-black text-slate-900">Referral Program</p>
                                    <p className="text-xs font-bold text-slate-500">Active and generating leads</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary">{data?.stats?.referralUsers || 0}</p>
                                    <p className="text-[10px] font-black uppercase text-slate-400">Total Leads</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-card glass p-8 rounded-[3rem] border-2 border-border shadow-sm">
                    <h3 className="text-2xl font-black font-display mb-6 flex items-center gap-2">
                        <Clock className="w-6 h-6 text-primary" /> Recent Quizzes
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {data?.recentQuizzes && data.recentQuizzes.length > 0 ? (
                            data.recentQuizzes.map((quiz) => {
                                const profileName = Array.isArray(quiz.profiles)
                                    ? (quiz.profiles[0]?.full_name || quiz.profiles[0]?.username || "Anonymous")
                                    : (quiz.profiles?.full_name || quiz.profiles?.username || "Anonymous");
                                const initial = profileName[0] || "?";

                                return (
                                    <div key={quiz.id} className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-border/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-border text-primary shadow-sm font-black overflow-hidden relative">
                                                <Avatar
                                                    src={null}
                                                    size="sm"
                                                    fallback={initial}
                                                    className="w-full h-full border-0 rounded-none bg-transparent"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-black text-sm">{profileName}</p>
                                                <p className="text-xs text-muted-foreground font-bold">{new Date(quiz.completed_at).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-primary text-lg">{quiz.score}/{quiz.total_questions}</p>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Score</p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                                <SearchX className="w-12 h-12 mb-2" />
                                <p className="font-bold italic text-sm">No activity recorded yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Referrals Section */}
                <div className="bg-card glass p-8 rounded-[3rem] border-2 border-border shadow-sm flex flex-col">
                    <h3 className="text-2xl font-black font-display mb-6 flex items-center gap-2">
                        <Share2 className="w-6 h-6 text-pink-500" /> Recent Referrals
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar flex-1">
                        {data?.recentReferrals && data.recentReferrals.length > 0 ? (
                            data.recentReferrals.map((ref) => (
                                <div key={ref.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border border-border/50 hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-border text-primary shadow-sm font-black overflow-hidden relative text-xs">
                                            <Avatar
                                                src={ref.avatar_url}
                                                size="sm"
                                                fallback={ref.username?.[0] || ref.full_name?.[0] || "?"}
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-sm">{ref.full_name || ref.username || "New Mate"}</p>
                                            <p className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                                                Joined via <span className="text-pink-500 font-black">{ref.source}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{new Date(ref.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                                <Users className="w-12 h-12 mb-2" />
                                <p className="font-bold italic text-sm">No referrals yet.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-black text-pink-700 dark:text-pink-300 uppercase tracking-widest">Referral Goal</span>
                            </div>
                            <span className="text-sm font-black text-pink-600">{data?.stats?.referralUsers || 0} / 100</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
