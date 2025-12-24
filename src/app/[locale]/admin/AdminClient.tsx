"use client";

import { useState, useEffect } from "react";
import { seedQuestions } from "@/app/actions/seed";
import { getAdminStats, togglePremiumStatus, resetHearts } from "@/app/actions/admin";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/Sidebar";
import {
    CheckCircle2,
    AlertCircle,
    Database,
    ShieldAlert,
    Users,
    Zap,
    TrendingUp,
    RefreshCw,
    Clock,
    User,
    LayoutDashboard,
    Heart,
    BookOpen,
    Trophy,
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronRight,
    SearchX,
    Settings,
    Key,
    Globe,
    ShieldCheck,
    Save,
    AlertTriangle,
    Cpu,
    CreditCard,
    Bell
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
    getAllQuestions,
    getAllAchievements,
    upsertQuestion,
    deleteQuestion,
    upsertAchievement,
    deleteAchievement,
    upsertQuest,
    deleteQuest,
    getSystemConfig,
    updateSystemConfig,
    type Question,
    type Achievement,
    type Quest
} from "@/app/actions/admin";
import { Target } from "lucide-react";

interface UserProfile {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    is_premium: boolean;
    hearts: number;
    total_xp: number;
    level: number;
    created_at: string;
}

interface RecentQuiz {
    id: string;
    score: number;
    total_questions: number;
    completed_at: string;
    profiles: {
        username: string;
        full_name: string;
    } | {
        username: string;
        full_name: string;
    }[] | null;
}

interface AdminDashboardData {
    stats: {
        totalUsers: number;
        premiumUsers: number;
        conversionRate: string | number;
        totalQuestions: number;
        totalAchievements: number;
        newUsers24h: number;
    };
    recentQuizzes: RecentQuiz[];
    activeQuests: Quest[];
    allUsers: UserProfile[];
}

interface SystemConfigItem {
    key: string;
    value: string | number | boolean;
    description?: string;
}

interface SettingsForm {
    ai_provider: string;
    ai_model: string;
    ai_key: string;
    ai_instructions: string;
    stripe_webhook_secret: string;
    stripe_standard_id: string;
    stripe_premium_id: string;
    maintenance_mode: boolean;
    global_banner: string;
    daily_xp_cap: number;
    heart_regen_hours: number;
    [key: string]: string | number | boolean;
}

export default function AdminClient() {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'questions' | 'achievements' | 'quests' | 'settings'>('overview');

    // Management states
    const [questions, setQuestions] = useState<Question[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [systemConfig, setSystemConfig] = useState<SystemConfigItem[]>([]);
    const [settingsForm, setSettingsForm] = useState<SettingsForm>({
        ai_provider: 'google',
        ai_model: 'gemini-pro',
        ai_key: '',
        ai_instructions: '',
        stripe_webhook_secret: '',
        stripe_standard_id: '',
        stripe_premium_id: '',
        maintenance_mode: false,
        global_banner: '',
        daily_xp_cap: 500,
        heart_regen_hours: 3
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [isEditing, setIsEditing] = useState<Question | Achievement | Quest | null>(null);

    const fetchData = async () => {
        setRefreshing(true);
        try {
            const result = await getAdminStats();
            setData(result);

            // Load management data if needed
            if (activeTab === 'questions') {
                const qRes = await getAllQuestions();
                if (qRes.success) setQuestions(qRes.data || []);
            } else if (activeTab === 'achievements') {
                const aRes = await getAllAchievements();
                if (aRes.success) setAchievements(aRes.data || []);
            } else if (activeTab === 'quests') {
                // For now, getAdminStats already returns activeQuests, but we might want a full list later
                setQuests(result.activeQuests || []);
            } else if (activeTab === 'settings') {
                const sRes = await getSystemConfig();
                if (sRes.success && sRes.data) {
                    setSystemConfig(sRes.data);
                    // Map array to object for the form
                    const form: SettingsForm = { ...settingsForm };
                    sRes.data.forEach((item: SystemConfigItem) => {
                        form[item.key] = item.value as any; // Cast value as it can be ambiguous for specific form fields
                    });
                    setSettingsForm(form);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleSeed = async () => {
        setLoading(true);
        setStatus(null);
        try {
            const result = await seedQuestions();
            if (result.success) {
                setStatus({ success: true, message: result.message || "Database seeded successfully!" });
                fetchData();
            } else {
                setStatus({ success: false, message: result.error || "Failed to seed database." });
            }
        } catch (err) {
            setStatus({ success: false, message: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (activeTab === 'questions') {
                res = await upsertQuestion(isEditing as Question);
            } else if (activeTab === 'achievements') {
                res = await upsertAchievement(isEditing as Achievement);
            } else if (activeTab === 'quests') {
                res = await upsertQuest(isEditing as Quest);
            }

            if (res?.success) {
                setIsEditing(null);
                fetchData();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async (keys: string[]) => {
        setLoading(true);
        try {
            for (const key of keys) {
                await updateSystemConfig({
                    key,
                    value: settingsForm[key],
                    description: `System setting for ${key}`
                });
            }
            setStatus({ success: true, message: "Settings updated successfully!" });
            fetchData();
        } catch (err) {
            setStatus({ success: false, message: "Failed to update settings." });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string | undefined) => {
        if (!id) return;
        if (!confirm("Are you sure?")) return;
        let res;
        if (activeTab === 'questions') {
            res = await deleteQuestion(id);
        } else if (activeTab === 'quests') {
            res = await deleteQuest(id);
        } else if (activeTab === 'achievements') {
            res = await deleteAchievement(id);
        }
        if (res?.success) fetchData();
    };

    const navItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'questions', label: 'Questions', icon: BookOpen },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'quests', label: 'Quests', icon: Target },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background p-4 pb-24 md:pb-12 md:pl-28 md:pr-6 md:pt-6 font-sans selection:bg-primary/10">
            <main className="max-w-6xl mx-auto space-y-10">
                {/* Modern Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-slate-200">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-primary/10 p-2 rounded-xl">
                                <ShieldAlert className="w-6 h-6 text-primary" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60">System Administrator</span>
                        </div>
                        <h1 className="text-5xl font-display font-black tracking-tight text-foreground">
                            Console<span className="text-primary">.</span>
                        </h1>
                        <p className="text-muted-foreground font-bold mt-2 text-lg">Manage PassMate infrastructure and user experience</p>
                    </div>

                    <div className="flex items-center gap-1 p-1.5 bg-card/80 backdrop-blur-md rounded-[1.5rem] border-2 border-border/60 shadow-xl shadow-black/5 overflow-x-auto w-full lg:w-auto scrollbar-hide">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id as any)}
                                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${activeTab === item.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-[1.02]'
                                    : 'hover:bg-muted text-slate-500 hover:text-foreground'
                                    } shrink-0`}
                            >
                                <item.icon className={`w-4 h-4 transition-transform ${activeTab === item.id ? 'scale-110' : ''}`} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* Enhanced Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[
                                    { label: "Total Users", value: data?.stats?.totalUsers || 0, icon: Users, gradient: "from-blue-600 to-indigo-600", bg: "bg-blue-50" },
                                    { label: "Premium Users", value: data?.stats?.premiumUsers || 0, icon: Zap, gradient: "from-amber-400 to-orange-600", bg: "bg-amber-50" },
                                    { label: "Growth (24h)", value: `+${data?.stats?.newUsers24h || 0}`, icon: TrendingUp, gradient: "from-emerald-400 to-teal-600", bg: "bg-emerald-50" },
                                    { label: "Question Pool", value: data?.stats?.totalQuestions || 0, icon: BookOpen, gradient: "from-rose-400 to-red-600", bg: "bg-rose-50" },
                                    { label: "Badges Live", value: data?.stats?.totalAchievements || 0, icon: Trophy, gradient: "from-violet-400 to-purple-600", bg: "bg-violet-50" },
                                    { label: "Conversion", value: `${data?.stats?.conversionRate || 0}%`, icon: Heart, gradient: "from-pink-400 to-rose-600", bg: "bg-pink-50" },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        whileHover={{ y: -5, scale: 1.02 }}
                                        className="bg-card glass p-7 rounded-[2.5rem] border-2 border-border shadow-sm flex items-center gap-6 group hover:shadow-2xl hover:shadow-black/10 transition-all duration-500"
                                    >
                                        <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${stat.gradient} flex items-center justify-center shrink-0 shadow-lg shadow-black/10 group-hover:rotate-6 transition-transform duration-500`}>
                                            <stat.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.15em] mb-1">{stat.label}</p>
                                            <p className="text-4xl font-black font-display text-foreground tabular-nums leading-none">{stat.value}</p>
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

                                    <div className="bg-orange-500/10 p-8 rounded-[2rem] border-2 border-orange-500/20 mb-6 relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <h4 className="text-orange-600 dark:text-orange-400 font-black mb-2 text-xl">Global Data Seeder</h4>
                                            <p className="text-sm text-orange-800/70 dark:text-orange-300/60 mb-8 leading-relaxed font-bold">
                                                Re-sync core content, tiers, and base questions.
                                                <span className="block mt-2 flex items-center gap-2 text-orange-500 font-black">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Action will bypass duplicate checks.
                                                </span>
                                            </p>
                                            <Button
                                                onClick={handleSeed}
                                                disabled={loading}
                                                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black rounded-2xl h-16 text-lg shadow-xl shadow-orange-200 transition-all hover:scale-[1.01]"
                                            >
                                                {loading ? "Processing..." : "Sync Global Content"}
                                            </Button>
                                        </div>
                                        <Database className="absolute -right-8 -bottom-8 w-40 h-40 text-orange-200/30 -rotate-12 transition-transform group-hover:rotate-0 duration-700" />
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

                                {/* Recent Activity */}
                                <div className="bg-card glass p-8 rounded-[3rem] border-2 border-border shadow-sm">
                                    <h3 className="text-2xl font-black font-display mb-6 flex items-center gap-2">
                                        <Clock className="w-6 h-6 text-primary" /> Recent Quizzes
                                    </h3>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {data?.recentQuizzes && data.recentQuizzes.length > 0 ? (
                                            data.recentQuizzes.map((quiz) => {
                                                const profileName = Array.isArray(quiz.profiles)
                                                    ? (quiz.profiles[0]?.full_name || quiz.profiles[0]?.username || "Anonymous")
                                                    : (quiz.profiles?.full_name || quiz.profiles?.username || "Anonymous");
                                                const initial = profileName[0] || "?";

                                                return (
                                                    <div key={quiz.id} className="flex items-center justify-between p-4 bg-muted/40 rounded-2xl border border-border/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-border text-primary shadow-sm font-black">
                                                                {initial}
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
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'users' && (
                        <motion.div
                            key="users"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-[3.5rem] border-2 border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden"
                        >
                            <div className="p-10 border-b border-slate-100 bg-slate-50/50">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                                                <Users className="w-7 h-7 text-blue-600" />
                                            </div>
                                            Citizen Registry
                                        </h3>
                                        <p className="text-slate-500 font-bold mt-1">Manage all user accounts and tier assignments</p>
                                    </div>
                                    <div className="relative w-full md:w-96 group">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Search by identity or username..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl font-bold transition-all outline-none text-slate-900 shadow-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[1000px]">
                                    <thead>
                                        <tr className="bg-slate-50/80 text-slate-400 font-display font-black text-[11px] uppercase tracking-[0.2em]">
                                            <th className="px-10 py-6">Identity</th>
                                            <th className="px-10 py-6">Member Tier</th>
                                            <th className="px-10 py-6">Performance</th>
                                            <th className="px-10 py-6">Gamification</th>
                                            <th className="px-10 py-6 text-right">System Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data?.allUsers?.filter((u: UserProfile) =>
                                            u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            u.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
                                        ).map((user: UserProfile) => (
                                            <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-2xl font-black text-slate-400">
                                                            {user.avatar_url ? (
                                                                <img src={user.avatar_url} className="w-full h-full object-cover" alt="" />
                                                            ) : (
                                                                user.username?.[0]?.toUpperCase() || 'U'
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 text-lg leading-tight">{user.username || 'Anonymous User'}</p>
                                                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">{user.id.slice(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${user.is_premium
                                                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-200'
                                                        : 'bg-slate-100 text-slate-500 border-2 border-slate-200'
                                                        }`}>
                                                        {user.is_premium ? <Zap className="w-3 h-3 fill-current" /> : <ShieldCheck className="w-3 h-3" />}
                                                        {user.is_premium ? 'Premium Elite' : 'Standard'}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex -space-x-2">
                                                            {[...Array(3)].map((_, i) => (
                                                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-rose-50 flex items-center justify-center ${i >= (user.hearts || 0) ? 'grayscale opacity-30 shadow-none' : 'text-rose-500 shadow-sm'}`}>
                                                                    <Heart className="w-4 h-4 fill-current" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-black text-slate-400">/{user.hearts || 0} HP</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="space-y-1">
                                                        <p className="text-lg font-black text-slate-700">{user.total_xp?.toLocaleString() || 0} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">XP</span></p>
                                                        <p className="text-[10px] font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-md inline-block">Level {user.level || 1}</p>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={async () => {
                                                                const res = await togglePremiumStatus(user.id, !user.is_premium, 'citizenship_achiever');
                                                                if (res.success) fetchData();
                                                            }}
                                                            className={`p-3 border-2 rounded-xl transition-all shadow-sm ${user.is_premium ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-slate-50 border-slate-200 text-slate-400'} hover:scale-105`}
                                                            title="Toggle Premium"
                                                        >
                                                            <Zap className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                const res = await resetHearts(user.id);
                                                                if (res.success) fetchData();
                                                            }}
                                                            className="p-3 bg-white border-2 border-slate-100 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm text-slate-400 hover:scale-105"
                                                            title="Reset Health"
                                                        >
                                                            <Heart className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'questions' && (
                        <motion.div
                            key="questions"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900">
                                        <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center">
                                            <BookOpen className="w-7 h-7 text-rose-600" />
                                        </div>
                                        Question Repository
                                    </h3>
                                    <p className="text-slate-500 font-bold mt-1">Curate and expand the PassMate knowledge engine</p>
                                </div>
                                <Button
                                    onClick={() => setIsEditing({ topic: 'History', question_text: '', options: ['', '', '', ''], correct_index: 0, difficulty: 'medium' })}
                                    className="w-full md:w-auto bg-primary text-white font-black px-8 h-16 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all"
                                >
                                    <Plus className="w-6 h-6" /> Initialize New Question
                                </Button>
                            </div>

                            <div className="bg-white rounded-[3rem] border-2 border-slate-200/60 shadow-2xl shadow-slate-200/40 overflow-hidden">
                                <div className="p-10 border-b border-slate-100 bg-slate-50/50">
                                    <div className="relative w-full md:w-96 group">
                                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                                        <input
                                            type="text"
                                            placeholder="Filter questions..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/5 rounded-2xl font-bold transition-all outline-none text-slate-900 shadow-sm"
                                        />
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-100">
                                    {questions
                                        .filter(q => q.question_text?.toLowerCase().includes(searchQuery.toLowerCase()))
                                        .map((q) => (
                                            <div key={q.id} className="p-6 md:p-10 hover:bg-slate-50/80 transition-colors group relative overflow-hidden">
                                                <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <span className="bg-rose-100 text-rose-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-200/50">{q.topic}</span>
                                                            <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${q.difficulty === 'hard' ? 'bg-red-50 border-red-200 text-red-600' :
                                                                q.difficulty === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-green-50 border-green-200 text-green-600'
                                                                }`}>{q.difficulty}</span>
                                                            {q.is_premium && <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-200 shadow-sm ring-2 ring-amber-50">Premium</span>}
                                                        </div>
                                                        <h4 className="text-2xl font-black text-slate-800 mb-8 leading-snug max-w-4xl">{q.question_text}</h4>

                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            {q.options.map((option: string, i: number) => (
                                                                <div
                                                                    key={i}
                                                                    className={`p-5 rounded-2xl border-2 font-bold text-sm transition-all ${i === q.correct_index
                                                                        ? 'bg-green-50 border-green-200 text-green-700 shadow-sm'
                                                                        : 'bg-white border-slate-100 text-slate-500 group-hover:bg-slate-50'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="flex items-center gap-3">
                                                                            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${i === q.correct_index ? 'bg-green-200' : 'bg-slate-100'}`}>
                                                                                {String.fromCharCode(65 + i)}
                                                                            </span>
                                                                            {option}
                                                                        </span>
                                                                        {i === q.correct_index && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3">
                                                        <button
                                                            onClick={() => setIsEditing(q)}
                                                            className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-primary hover:border-primary hover:shadow-lg hover:shadow-primary/10 transition-all"
                                                        >
                                                            <Edit2 className="w-5 h-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(q.id)}
                                                            className="p-4 bg-white border-2 border-slate-100 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-200 hover:shadow-lg hover:shadow-red-100 transition-all"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900">
                                        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                                            <Trophy className="w-7 h-7 text-purple-600" />
                                        </div>
                                        Badge Architecture
                                    </h3>
                                    <p className="text-slate-500 font-bold mt-1">Design rewarding milestones for PassMate users</p>
                                </div>
                                <Button
                                    onClick={() => setIsEditing({ name: '', description: '', xp_reward: 100, secret: false })}
                                    className="w-full md:w-auto bg-primary text-white font-black px-8 h-16 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all"
                                >
                                    <Plus className="w-6 h-6" /> Craft New Badge
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {achievements.map((a: Achievement) => (
                                    <motion.div
                                        layout
                                        key={a.id}
                                        className="bg-white border-2 border-slate-200/60 rounded-[3rem] p-10 flex flex-col items-center text-center group hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-100 transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:bg-purple-50 transition-colors" />

                                        <div className="w-24 h-24 mb-6 rounded-[2rem] bg-gradient-to-br from-purple-100 to-indigo-50 border-4 border-white shadow-xl flex items-center justify-center relative z-10">
                                            {a.badge_url ? (
                                                <img src={a.badge_url} alt={a.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Trophy className="w-10 h-10 text-purple-600" />
                                            )}
                                            {a.secret && <ShieldAlert className="absolute -top-2 -right-2 w-6 h-6 text-amber-500 fill-white border-2 border-white rounded-full bg-amber-500" />}
                                        </div>

                                        <h4 className="text-2xl font-black text-slate-900 mb-2 relative z-10">{a.name}</h4>
                                        <p className="text-sm text-slate-500 font-bold mb-8 leading-relaxed line-clamp-2 px-4 relative z-10">{a.description}</p>

                                        <div className="flex items-center gap-4 mt-auto relative z-10 w-full">
                                            <div className="flex-1 bg-slate-50 rounded-2xl py-3 px-4 flex items-center justify-between border border-slate-100">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Award</span>
                                                <span className="text-sm font-black text-purple-600">{a.xp_reward} XP</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setIsEditing(a)} className="p-3 bg-white border-2 border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-slate-600">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(a.id)} className="p-3 bg-white border-2 border-slate-100 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all shadow-sm text-slate-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'quests' && (
                        <motion.div
                            key="quests"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-3xl font-black font-display flex items-center gap-4 text-slate-900">
                                        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center">
                                            <Target className="w-7 h-7 text-teal-600" />
                                        </div>
                                        Objective Protocol
                                    </h3>
                                    <p className="text-slate-500 font-bold mt-1">Configure automated daily challenges and rewards</p>
                                </div>
                                <Button
                                    onClick={() => setIsEditing({ title: '', description: '', xp_reward: 50, type: 'quiz_complete', requirement: 1 } as Quest)}
                                    className="w-full md:w-auto bg-primary text-white font-black px-8 h-16 rounded-[1.5rem] shadow-xl shadow-primary/20 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all"
                                >
                                    <Plus className="w-6 h-6" /> Deploy New Mission
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {quests.map((q: Quest) => (
                                    <motion.div
                                        layout
                                        key={q.id}
                                        className="bg-white border-2 border-slate-200/60 rounded-[3rem] p-8 flex items-center gap-8 group hover:border-teal-300 hover:shadow-2xl hover:shadow-teal-100 transition-all duration-500"
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-teal-50 flex items-center justify-center shrink-0 border-2 border-teal-100/50 group-hover:rotate-3 transition-transform">
                                            <Target className="w-10 h-10 text-teal-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-xl font-black text-slate-900">{q.title}</h4>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => setIsEditing(q)} className="p-3 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(q.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <p className="text-sm font-bold text-slate-500 mb-4">{q.description || q.objective}</p>
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                                    <Zap className="w-3 h-3 fill-current" /> {q.xp_reward} XP Bounty
                                                </div>
                                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                    Protocol: {q.type.replace('_', ' ')}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div
                            key="settings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl font-black font-display flex items-center gap-3">
                                    <Settings className="w-8 h-8 text-primary" /> System Settings
                                </h3>
                                {refreshing && (
                                    <div className="flex items-center gap-2 text-primary font-black animate-pulse">
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Syncing...
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Configuration Sidebar/Menu */}
                                <div className="space-y-4">
                                    {[
                                        { id: 'ai', icon: Cpu, label: 'AI Engine', desc: 'Gemini, prompt & models' },
                                        { id: 'stripe', icon: CreditCard, label: 'Payments', desc: 'Webhooks & Stripe keys' },
                                        { id: 'app', icon: Bell, label: 'App Config', desc: 'Maintenance & Alerts' },
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            className="w-full text-left p-6 bg-white rounded-[2rem] border-2 border-border hover:border-primary transition-all group shadow-sm focus:ring-4 focus:ring-primary/10 outline-none"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <cat.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-lg">{cat.label}</p>
                                                    <p className="text-xs text-muted-foreground font-bold">{cat.desc}</p>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Configuration Content */}
                                <div className="lg:col-span-2 space-y-8">
                                    {/* AI Settings Group */}
                                    <div className="bg-white p-8 rounded-[3rem] border-2 border-border shadow-sm space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-2xl font-black font-display flex items-center gap-3">
                                                <Cpu className="w-6 h-6 text-purple-600" /> AI Engine
                                            </h4>
                                            <span className="bg-purple-50 text-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Provider</label>
                                                    <select
                                                        value={settingsForm.ai_provider}
                                                        onChange={e => setSettingsForm({ ...settingsForm, ai_provider: e.target.value })}
                                                        className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    >
                                                        <option value="google">Google Gemini</option>
                                                        <option value="openai">OpenAI GPT-4</option>
                                                        <option value="anthropic">Anthropic Claude</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Model ID</label>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.ai_model}
                                                        onChange={e => setSettingsForm({ ...settingsForm, ai_model: e.target.value })}
                                                        className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Provider API Key</label>
                                                <div className="relative">
                                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="password"
                                                        value={settingsForm.ai_key}
                                                        onChange={e => setSettingsForm({ ...settingsForm, ai_key: e.target.value })}
                                                        placeholder="••••••••••••••••••••••••"
                                                        className="w-full pl-11 pr-4 py-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">System Instructions Override</label>
                                                <textarea
                                                    value={settingsForm.ai_instructions}
                                                    onChange={e => setSettingsForm({ ...settingsForm, ai_instructions: e.target.value })}
                                                    className="w-full p-6 bg-muted/50 border-2 border-transparent focus:border-primary rounded-[2rem] font-bold transition-all outline-none min-h-[120px]"
                                                    placeholder="You are Ollie the Koala, an AI tutor for..."
                                                ></textarea>
                                            </div>

                                            <Button
                                                onClick={() => handleSaveConfig(['ai_provider', 'ai_model', 'ai_key', 'ai_instructions'])}
                                                disabled={loading}
                                                className="w-full h-14 rounded-2xl font-black bg-primary text-white shadow-xl shadow-primary/20"
                                            >
                                                {loading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Save AI Configuration</>}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Stripe Settings Group */}
                                    <div className="bg-white p-8 rounded-[3rem] border-2 border-border shadow-sm space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-2xl font-black font-display flex items-center gap-3">
                                                <CreditCard className="w-6 h-6 text-blue-600" /> Payment & Billing
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Stripe Live</span>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Webhook Endpoint</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="text"
                                                        value="https://passmate.app/api/webhooks"
                                                        readOnly
                                                        className="w-full pl-11 pr-4 py-4 bg-muted/30 border-2 border-transparent rounded-2xl font-bold text-muted-foreground cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Webhook Secret</label>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                    <input
                                                        type="password"
                                                        value={settingsForm.stripe_webhook_secret}
                                                        onChange={e => setSettingsForm({ ...settingsForm, stripe_webhook_secret: e.target.value })}
                                                        placeholder="whsec_..."
                                                        className="w-full pl-11 pr-4 py-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Standard Product ID</label>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.stripe_standard_id}
                                                        onChange={e => setSettingsForm({ ...settingsForm, stripe_standard_id: e.target.value })}
                                                        placeholder="prod_..."
                                                        className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Premium Product ID</label>
                                                    <input
                                                        type="text"
                                                        value={settingsForm.stripe_premium_id}
                                                        onChange={e => setSettingsForm({ ...settingsForm, stripe_premium_id: e.target.value })}
                                                        placeholder="prod_..."
                                                        className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleSaveConfig(['stripe_webhook_secret', 'stripe_standard_id', 'stripe_premium_id'])}
                                                disabled={loading}
                                                className="w-full h-14 rounded-2xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
                                            >
                                                {loading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Update Billing Keys</>}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* App/System Settings Group */}
                                    <div className="bg-white p-8 rounded-[3rem] border-2 border-border shadow-sm space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-2xl font-black font-display flex items-center gap-3">
                                                <Bell className="w-6 h-6 text-orange-500" /> App Configuration
                                            </h4>
                                        </div>

                                        <div className="space-y-6">
                                            <div className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all ${settingsForm.maintenance_mode ? 'bg-red-100 border-red-200' : 'bg-muted/30 border-border'}`}>
                                                <div>
                                                    <p className={`font-black ${settingsForm.maintenance_mode ? 'text-red-800' : 'text-muted-foreground'}`}>Maintenance Mode</p>
                                                    <p className={`text-xs font-bold italic ${settingsForm.maintenance_mode ? 'text-red-700' : 'text-muted-foreground/60'}`}>Blocks all user access except admins</p>
                                                </div>
                                                <button
                                                    onClick={() => setSettingsForm({ ...settingsForm, maintenance_mode: !settingsForm.maintenance_mode })}
                                                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors border-2 ${settingsForm.maintenance_mode ? 'bg-red-600 border-red-700' : 'bg-muted border-border'}`}
                                                >
                                                    <span className={`inline-block h-5 w-5 rounded-full bg-white transition shadow-sm ${settingsForm.maintenance_mode ? 'translate-x-7' : 'translate-x-1'}`}></span>
                                                </button>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase text-muted-foreground ml-2">Global UI Message (Banner)</label>
                                                <input
                                                    type="text"
                                                    value={settingsForm.global_banner}
                                                    onChange={e => setSettingsForm({ ...settingsForm, global_banner: e.target.value })}
                                                    placeholder="Major update coming this weekend! 🚀"
                                                    className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Daily XP Cap</label>
                                                    <input
                                                        type="number"
                                                        value={settingsForm.daily_xp_cap}
                                                        onChange={e => setSettingsForm({ ...settingsForm, daily_xp_cap: parseInt(e.target.value) })}
                                                        className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase text-muted-foreground ml-2">Free Hearts Regen (Hours)</label>
                                                    <input
                                                        type="number"
                                                        value={settingsForm.heart_regen_hours}
                                                        onChange={e => setSettingsForm({ ...settingsForm, heart_regen_hours: parseInt(e.target.value) })}
                                                        className="w-full p-4 bg-muted/50 border-2 border-transparent focus:border-primary rounded-2xl font-bold transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                onClick={() => handleSaveConfig(['maintenance_mode', 'global_banner', 'daily_xp_cap', 'heart_regen_hours'])}
                                                disabled={loading}
                                                className="w-full h-14 rounded-2xl font-black bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-100"
                                            >
                                                {loading ? "Saving..." : <><Save className="w-5 h-5 mr-2" /> Publish Global Config</>}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Ultra-Premium Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xl"
                            onClick={() => setIsEditing(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] p-12 overflow-hidden border-2 border-slate-100"
                        >
                            {/* Modal Header Decoration */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />

                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-4xl font-black font-display text-slate-900 tracking-tight">
                                        {isEditing.id ? 'Refine' : 'Compose'}{' '}
                                        <span className="text-primary capitalize">{activeTab.slice(0, -1)}</span>
                                    </h2>
                                    <p className="text-slate-500 font-bold mt-1 uppercase text-[10px] tracking-[0.2em]">Registry Entry ID: {isEditing.id || 'NEW_ENTITY'}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsEditing(null)}
                                    className="rounded-full w-10 h-10 p-0 text-slate-400 hover:bg-slate-100"
                                >
                                    <Plus className="w-6 h-6 rotate-45" />
                                </Button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Form content remains visually updated but logically same */}
                                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar space-y-8 py-2">
                                    {activeTab === 'questions' ? (
                                        <>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Core Topic</label>
                                                    <select
                                                        value={(isEditing as Question).topic}
                                                        onChange={e => setIsEditing({ ...isEditing, topic: e.target.value } as Question)}
                                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white rounded-[1.5rem] font-bold transition-all outline-none"
                                                    >
                                                        <option>History</option>
                                                        <option>Government & Law</option>
                                                        <option>Democratic Beliefs</option>
                                                        <option>Values</option>
                                                        <option>People</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Sub-Topic</label>
                                                    <input
                                                        type="text"
                                                        value={(isEditing as Question).subtopic || ''}
                                                        onChange={e => setIsEditing({ ...isEditing, subtopic: e.target.value } as Question)}
                                                        placeholder="e.g. Constitutional Powers"
                                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white rounded-[1.5rem] font-bold transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Prompt Formulation</label>
                                                <textarea
                                                    value={(isEditing as Question).question_text}
                                                    onChange={e => setIsEditing({ ...isEditing, question_text: e.target.value } as Question)}
                                                    className="w-full p-8 bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white rounded-[2.5rem] font-bold transition-all outline-none min-h-[140px] text-lg leading-relaxed"
                                                    placeholder="Formal question content..."
                                                />
                                            </div>

                                            <div className="space-y-5">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2 block">Response Matrix</label>
                                                <div className="space-y-4">
                                                    {(isEditing as Question).options.map((opt: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-4 group">
                                                            <button
                                                                type="button"
                                                                onClick={() => setIsEditing({ ...isEditing, correct_index: i } as Question)}
                                                                className={`w-12 h-12 rounded-[1rem] border-2 flex items-center justify-center transition-all duration-500 shadow-sm ${(isEditing as Question).correct_index === i
                                                                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-200'
                                                                    : 'bg-white border-slate-200 text-slate-300 hover:border-primary/40'
                                                                    }`}
                                                            >
                                                                {(isEditing as Question).correct_index === i ? <CheckCircle2 className="w-6 h-6" /> : (i + 1)}
                                                            </button>
                                                            <input
                                                                type="text"
                                                                value={opt}
                                                                onChange={e => {
                                                                    const newOpts = [...(isEditing as Question).options];
                                                                    newOpts[i] = e.target.value;
                                                                    setIsEditing({ ...isEditing, options: newOpts } as Question);
                                                                }}
                                                                className={`flex-1 p-5 rounded-2xl font-bold transition-all border-2 outline-none ${(isEditing as Question).correct_index === i ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-slate-50 border-slate-100 focus:bg-white focus:border-primary'}`}
                                                                placeholder={`Choice ${i + 1}`}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    ) : activeTab === 'achievements' ? (
                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Badge Codename</label>
                                                <input
                                                    type="text"
                                                    value={(isEditing as Achievement).name}
                                                    onChange={e => setIsEditing({ ...isEditing, name: e.target.value } as Achievement)}
                                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white rounded-[1.5rem] font-bold transition-all outline-none"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Narrative Description</label>
                                                <input
                                                    type="text"
                                                    value={(isEditing as Achievement).description}
                                                    onChange={e => setIsEditing({ ...isEditing, description: e.target.value } as Achievement)}
                                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary focus:bg-white rounded-[1.5rem] font-bold transition-all outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">XP Bounty</label>
                                                    <input
                                                        type="number"
                                                        value={(isEditing as Achievement).xp_reward}
                                                        onChange={e => setIsEditing({ ...isEditing, xp_reward: parseInt(e.target.value) } as Achievement)}
                                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-3 flex items-end">
                                                    <label className="flex items-center gap-4 w-full p-5 bg-slate-50 rounded-[1.5rem] cursor-pointer border-2 border-slate-100 hover:border-primary transition-all group">
                                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${(isEditing as Achievement).secret ? 'bg-primary border-primary' : 'bg-white border-slate-300'}`}>
                                                            {(isEditing as Achievement).secret && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={(isEditing as Achievement).secret}
                                                            onChange={e => setIsEditing({ ...isEditing, secret: e.target.checked } as Achievement)}
                                                            className="hidden"
                                                        />
                                                        <span className="font-black text-slate-700">Classified Badge</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Quest Protocol Name</label>
                                                <input
                                                    type="text"
                                                    value={(isEditing as Quest).title}
                                                    onChange={e => setIsEditing({ ...isEditing, title: e.target.value } as Quest)}
                                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                                    placeholder="Mission title..."
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Objective Context</label>
                                                <input
                                                    type="text"
                                                    value={(isEditing as Quest).description || (isEditing as Quest).objective || ''}
                                                    onChange={e => setIsEditing({ ...isEditing, description: e.target.value } as Quest)}
                                                    className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Mission Logic</label>
                                                    <select
                                                        value={(isEditing as Quest).type}
                                                        onChange={e => setIsEditing({ ...isEditing, type: e.target.value } as Quest)}
                                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                                    >
                                                        <option value="quiz_complete">Quiz Completion</option>
                                                        <option value="perfect_score">Perfect Score</option>
                                                        <option value="daily_login">Daily Login</option>
                                                        <option value="topic_complete">Topic Mastery</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Quantifiable Goal</label>
                                                    <input
                                                        type="number"
                                                        value={(isEditing as Quest).requirement || 1}
                                                        onChange={e => setIsEditing({ ...isEditing, requirement: parseInt(e.target.value) } as Quest)}
                                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 focus:border-primary rounded-[1.5rem] font-bold outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsEditing(null)}
                                        className="flex-1 h-16 rounded-[1.5rem] font-black border-2 border-slate-200 text-slate-400 hover:bg-slate-50"
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 h-16 rounded-[1.5rem] font-black bg-primary text-white shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                                    >
                                        {loading ? 'Processing...' : (isEditing.id ? 'Commit Changes' : 'Initialize Entry')}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </main>
            <Sidebar />
        </div>
    );
}

// Helper component for styled scrollbar
const styles = `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E2E8F0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #CBD5E1;
}
`;
