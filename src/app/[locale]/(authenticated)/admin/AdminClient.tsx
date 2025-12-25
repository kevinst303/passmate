"use client";

import { useState, useEffect } from "react";
import { seedQuestions } from "@/app/actions/seed";
import { getAdminStats, manageUser, deleteUser } from "@/app/actions/admin";
import {
    RefreshCw,
    LayoutDashboard,
    Users,
    BookOpen,
    Trophy,
    Settings,
    ShieldCheck,
    LucideIcon,
    Target
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
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
    updateSystemConfig
} from "@/app/actions/admin";
import { Question, AchievementManagement as Achievement, QuestManagement as Quest } from "@/types/admin";
import {
    AdminDashboardData,
    AdminTab,
    UserProfile
} from "@/types/admin-ui";

import { OverviewTab } from "@/components/admin/OverviewTab";
import { UsersTab } from "@/components/admin/UsersTab";
import { QuestionsTab } from "@/components/admin/QuestionsTab";
import { AchievementsTab } from "@/components/admin/AchievementsTab";
import { QuestsTab } from "@/components/admin/QuestsTab";
import { SettingsTab } from "@/components/admin/SettingsTab";
import { EditModal } from "@/components/admin/EditModal";

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
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');

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
    const [isEditing, setIsEditing] = useState<Question | Achievement | Quest | UserProfile | null>(null);


    const fetchData = async () => {
        setRefreshing(true);
        try {
            const result = await getAdminStats();
            // Correctly map the returned stats to the AdminDashboardData interface
            setData({
                ...result,
                quests: (result as any).activeQuests || []
            } as AdminDashboardData);

            // Load management data if needed
            if (activeTab === 'questions') {
                const qRes = await getAllQuestions();
                if (qRes.success) setQuestions(qRes.data || []);
            } else if (activeTab === 'achievements') {
                const aRes = await getAllAchievements();
                if (aRes.success) setAchievements(aRes.data || []);
            } else if (activeTab === 'quests') {
                setQuests((result as any).activeQuests || []);
            } else if (activeTab === 'settings') {
                const sRes = await getSystemConfig();
                if (sRes.success && sRes.data) {
                    setSystemConfig(sRes.data);
                    const form: SettingsForm = { ...settingsForm };
                    sRes.data.forEach((item: SystemConfigItem) => {
                        if (item.key in form) {
                            form[item.key] = item.value;
                        }
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
            } else if (activeTab === 'users') {
                const { id, ...updates } = isEditing as UserProfile;
                res = await manageUser(id, updates);
            }

            if (res?.success) {
                setIsEditing(null);
                fetchData();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUserDelete = async (id: string) => {
        if (!confirm("Are you sure you want to PERMANENTLY delete this user? This action cannot be undone.")) return;
        setLoading(true);
        try {
            const res = await deleteUser(id);
            if (res.success) {
                fetchData();
            } else {
                alert("Failed to delete user: " + res.error);
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

    const navItems: { id: AdminTab, label: string, icon: LucideIcon }[] = [
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6">
                    <div className="space-y-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20 mb-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">System Infrastructure</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-slate-900 dark:text-white">
                            Console<span className="text-primary">.</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-sm md:text-base">PassMate infrastructure & user orchestration</p>
                    </div>

                    <div className="flex items-center gap-3 self-end lg:self-center">
                        <button
                            onClick={fetchData}
                            disabled={refreshing}
                            className={`p-4 bg-white dark:bg-card border-2 border-slate-200 dark:border-border rounded-2xl transition-all hover:border-primary group ${refreshing ? 'opacity-50' : ''}`}
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-primary ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-card/80 backdrop-blur-md rounded-[1.5rem] border-2 border-slate-200 dark:border-border shadow-sm overflow-x-auto no-scrollbar max-w-[calc(100vw-120px)] lg:max-w-none">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${activeTab === item.id
                                        ? 'bg-primary text-white shadow-lg shadow-primary/25 translate-y-[-1px]'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                >
                                    <item.icon className={`w-3.5 h-3.5 ${activeTab === item.id ? 'scale-110' : ''}`} />
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <OverviewTab
                            key="overview"
                            data={data}
                            handleSeed={handleSeed}
                            loading={loading}
                            status={status}
                        />
                    )}

                    {activeTab === 'users' && (
                        <UsersTab
                            key="users"
                            users={data?.allUsers || []}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setIsEditing={(u) => setIsEditing(u as UserProfile)}
                            handleUserDelete={handleUserDelete}
                        />
                    )}

                    {activeTab === 'questions' && (
                        <QuestionsTab
                            key="questions"
                            questions={questions}
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            setIsEditing={(q) => setIsEditing(q as Question)}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'achievements' && (
                        <AchievementsTab
                            key="achievements"
                            achievements={achievements}
                            setIsEditing={(a) => setIsEditing(a as Achievement)}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'quests' && (
                        <QuestsTab
                            key="quests"
                            quests={quests}
                            setIsEditing={(q) => setIsEditing(q as Quest)}
                            handleDelete={handleDelete}
                        />
                    )}

                    {activeTab === 'settings' && (
                        <SettingsTab
                            key="settings"
                            settingsForm={settingsForm}
                            setSettingsForm={setSettingsForm}
                            handleSaveConfig={handleSaveConfig}
                            loading={loading}
                        />
                    )}
                </AnimatePresence>

                <EditModal
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    activeTab={activeTab}
                />
            </main>
        </div>
    );
}
