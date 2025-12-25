"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    User,
    Check,
    Loader2,
    Camera,
    Shield,
    Bell,
    Moon,
    Sun,
    Globe,
    Volume2,
    Palette,
    ChevronRight,
    Sparkles,
    Lock,
    HelpCircle,
    Upload,
    Minus,
    RefreshCw,
    Trash2,
    ExternalLink
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { updateProfile, uploadAvatar, deleteAccount } from "@/app/actions/profile";
import { useRouter, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useSettings } from "@/providers/SettingsProvider";

interface Profile {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
}

interface UserData {
    email?: string | null;
}

interface SettingsClientProps {
    profile: Profile;
    user: UserData;
}

const INITIAL_AVATARS = [
    { url: "", label: "Default", isEmoji: true },
    { url: "🐦", label: "Emu", isEmoji: true },
    { url: "🦘", label: "Kangaroo", isEmoji: true },
    { url: "🇦🇺", label: "Flag", isEmoji: true },
    { url: "🦜", label: "Parrot", isEmoji: true },
    { url: "🐊", label: "Croc", isEmoji: true },
    { url: "🏄‍♂️", label: "Surfer", isEmoji: true },
    { url: "🌞", label: "Sun", isEmoji: true },
    { url: "🪃", label: "Boomerang", isEmoji: true },
    { url: "🌊", label: "Wave", isEmoji: true },
    { url: "🤿", label: "Diving", isEmoji: true },
    { url: "🦈", label: "Shark", isEmoji: true },
];

const RANDOM_ADJECTIVES = ['happy', 'cool', 'smart', 'super', 'mega', 'ultra', 'neon', 'cyber', 'retro', 'future'];
const DICEBEAR_STYLES = ['bottts-neutral', 'avataaars', 'pixel-art', 'big-ears', 'miniavs', 'personas'];
const RANDOM_COLORS = ['b6e3f4', 'c0aede', 'd1fae5', 'fde68a', 'fecaca', 'a5f3fc', 'd9f99d', 'fda4af'];

const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇦🇺' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
];

export default function SettingsClient({ profile, user }: SettingsClientProps) {
    const t = useTranslations("Settings");
    const pathname = usePathname();

    // Get current locale from pathname
    const currentLocale = pathname.split('/')[1] || 'en';

    const [avatars, setAvatars] = useState(INITIAL_AVATARS);

    const AVATAR_OPTIONS = avatars;

    const [fullName, setFullName] = useState(profile.full_name || "");
    const [username, setUsername] = useState(profile.username || "");
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // UI state
    const [selectedSection, setSelectedSection] = useState<'profile' | 'preferences' | 'security'>('profile');

    // Preferences state from Context
    const { theme, setTheme, resolvedTheme } = useTheme();
    const {
        soundEnabled,
        setSoundEnabled,
        notificationsEnabled,
        setNotificationsEnabled
    } = useSettings();

    const isDarkMode = resolvedTheme === 'dark';
    const notifications = notificationsEnabled;
    const soundEffects = soundEnabled;

    const [showLanguageOptions, setShowLanguageOptions] = useState(false);

    const router = useRouter();

    const toggleDarkMode = () => {
        setTheme(isDarkMode ? 'light' : 'dark');
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStatus(null);

        const result = await updateProfile({
            full_name: fullName,
            username: username,
            avatar_url: avatarUrl
        });

        if (result.error) {
            setStatus({ type: 'error', message: result.error });
        } else {
            setStatus({ type: 'success', message: t("success") });
            router.refresh();
        }
        setIsSaving(false);

        // Clear success message after 3 seconds
        if (!result.error) {
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setStatus(null);

        const formData = new FormData();
        formData.append('file', file);

        const result = await uploadAvatar(formData);

        if (result.error) {
            setStatus({ type: 'error', message: result.error });
        } else if (result.url) {
            setAvatarUrl(result.url);
            // Auto save the new avatar
            await updateProfile({ avatar_url: result.url });
            setStatus({ type: 'success', message: t("success") });
            router.refresh();
        }

        setIsUploading(false);
        if (!result.error) {
            setTimeout(() => setStatus(null), 3000);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) return;

        setIsSaving(true);
        const result = await deleteAccount();
        if (result.error) {
            setStatus({ type: 'error', message: result.error });
            setIsSaving(false);
        } else {
            router.push('/');
        }
    };

    const shuffleAvatars = () => {
        const emojiPool = ["🦘", "🇦🇺", "🦜", "🐊", "🏄‍♂️", "🌞", "🪃", "🌊", "🤿", "🦈", "🦭", "🐧", "🦐", "🐙", "🐢", "🍍", "🥥", "🏖️", "⛺", "🐦"];
        const shuffled = [...emojiPool].sort(() => 0.5 - Math.random());
        const newAvatars = [
            { url: "", label: "Default", isEmoji: true },
            ...shuffled.slice(0, 11).map(emoji => ({ url: emoji, label: "Avatar", isEmoji: true }))
        ];
        setAvatars(newAvatars);
    };

    const settingsSections = [
        { id: 'profile' as const, icon: User, label: t("profileSection"), color: 'from-teal-500 to-emerald-500' },
        { id: 'preferences' as const, icon: Palette, label: t("preferencesSection"), color: 'from-purple-500 to-pink-500' },
        { id: 'security' as const, icon: Shield, label: t("securitySection"), color: 'from-orange-500 to-red-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24 md:pb-8 md:pl-20">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md border-b border-border/50 px-4 md:px-6 py-4 flex items-center sticky top-0 z-10 transition-all">
                <div className="flex-1 flex justify-start">
                    <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
                        <div className="bg-card p-2 rounded-xl border-2 border-border group-hover:border-primary/30 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:inline">{t("backProfile")}</span>
                    </Link>
                </div>

                <h1 className="text-xl font-display font-black text-foreground flex items-center gap-2 absolute left-1/2 -translate-x-1/2 pointer-events-none">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {t("title")}
                </h1>

                <div className="flex-1 flex justify-end" />
            </header>

            <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 py-6 md:py-12">
                {/* Section Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                    {settingsSections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setSelectedSection(section.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-2xl font-bold transition-all whitespace-nowrap",
                                selectedSection === section.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/30"
                                    : "bg-card text-muted-foreground hover:bg-muted/50 border-2 border-border"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center",
                                selectedSection === section.id ? "bg-white/20" : `bg-gradient-to-br ${section.color}`
                            )}>
                                <section.icon className={cn(
                                    "w-4 h-4",
                                    selectedSection === section.id ? "text-white" : "text-white"
                                )} />
                            </div>
                            {section.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Profile Section */}
                    {selectedSection === 'profile' && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            {/* Profile Picture Section */}
                            <section className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                                <h3 className="text-lg md:text-xl font-display font-black mb-8 flex items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                        <Camera className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="tracking-tight">{t("profilePicture")}</span>
                                </h3>

                                <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
                                    {/* Current Avatar Preview */}
                                    <div className="relative group/preview">
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            className="w-32 h-32 md:w-44 md:h-44 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-[2.5rem] md:rounded-[3.5rem] p-1.5 shadow-2xl"
                                        >
                                            <div className="w-full h-full bg-card rounded-[2.1rem] md:rounded-[3.1rem] overflow-hidden border-4 border-card relative">
                                                <Avatar
                                                    src={avatarUrl}
                                                    size="2xl"
                                                    className="w-full h-full border-0 rounded-none transform group-hover/preview:scale-110 transition-transform duration-500"
                                                />
                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>

                                        <label
                                            htmlFor="avatar-upload-preview"
                                            className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-card cursor-pointer hover:scale-110 active:scale-95 transition-all z-20 group-hover/preview:rotate-12"
                                        >
                                            <Upload className="w-5 h-5" />
                                            <input
                                                id="avatar-upload-preview"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>

                                    {/* Avatar Grid */}
                                    <div className="flex-1 w-full space-y-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">
                                                {t("chooseAvatar")}
                                            </p>
                                            <button
                                                onClick={shuffleAvatars}
                                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/5 hover:bg-primary/10 text-primary text-xs font-black transition-all group/shuffle"
                                            >
                                                <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                                                {t("shuffle")}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-4">
                                            {/* Upload Option Card */}
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => document.getElementById('avatar-upload-preview')?.click()}
                                                className="aspect-square rounded-3xl border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition-all flex flex-col items-center justify-center gap-1.5 group relative"
                                            >
                                                <div className="w-8 h-8 rounded-xl bg-white/50 dark:bg-black/20 flex items-center justify-center shadow-sm">
                                                    <Upload className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                                                </div>
                                                <span className="text-[10px] font-black text-primary/80 uppercase tracking-tighter">{t("upload")}</span>
                                            </motion.button>

                                            {AVATAR_OPTIONS.map((opt, idx) => (
                                                <motion.button
                                                    key={idx}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setAvatarUrl(opt.url)}
                                                    className={cn(
                                                        "aspect-square rounded-3xl border-2 transition-all overflow-hidden bg-muted/30 group relative flex items-center justify-center p-1",
                                                        avatarUrl === opt.url
                                                            ? "border-primary bg-primary/10 shadow-lg shadow-primary/20 ring-4 ring-primary/10"
                                                            : "border-transparent hover:border-primary/20 hover:bg-muted/50"
                                                    )}
                                                >
                                                    <Avatar
                                                        src={opt.url}
                                                        size="xl"
                                                        fallback={opt.isEmoji ? "🐨" : undefined}
                                                        className="w-full h-full rounded-2xl border-0 bg-transparent group-hover:scale-110 transition-transform duration-500"
                                                    />

                                                    {avatarUrl === opt.url && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-card"
                                                        >
                                                            <Check className="w-3 h-3 text-white" />
                                                        </motion.div>
                                                    )}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Account Details */}
                            <section className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-2xl space-y-8 relative overflow-hidden group">
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500" />

                                <h3 className="text-lg md:text-xl font-display font-black flex items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="tracking-tight">{t("personalDetails")}</span>
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 relative z-10">
                                    <div className="space-y-2.5">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                            {t("fullName")}
                                        </label>
                                        <div className="relative group/input">
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder={t("placeholders.fullName")}
                                                className="w-full bg-muted/40 backdrop-blur-md border-2 border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none hover:border-primary/30 text-foreground placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                            {t("username")}
                                        </label>
                                        <div className="relative group/input">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-black text-lg group-focus-within/input:scale-125 transition-transform">@</span>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder={t("placeholders.username")}
                                                className="w-full bg-muted/40 backdrop-blur-md border-2 border-border rounded-2xl py-4 pl-12 pr-6 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none hover:border-primary/30 text-foreground placeholder:text-muted-foreground/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 md:col-span-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                            {t("email")}
                                        </label>
                                        <div className="w-full bg-muted/20 border-2 border-border/50 rounded-2xl py-4.5 px-6 flex items-center justify-between font-bold text-muted-foreground/80 cursor-not-allowed group/locked">
                                            <span className="tracking-wide">{user.email}</span>
                                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover/locked:bg-red-500/10 group-hover/locked:text-red-500 transition-colors">
                                                <Lock className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-3 mt-1 underline decoration-primary/20 underline-offset-4">
                                            {t("emailLocked")}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* Preferences Section */}
                    {selectedSection === 'preferences' && (
                        <motion.div
                            key="preferences"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <section className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors duration-500" />

                                <h3 className="text-lg md:text-xl font-display font-black flex items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                                        <Palette className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="tracking-tight">{t("appearance")}</span>
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    {/* Dark Mode Toggle */}
                                    <motion.div
                                        whileHover={{ y: -2 }}
                                        className="flex items-center justify-between p-5 bg-muted/30 rounded-3xl border-2 border-border hover:border-primary/30 transition-all cursor-pointer group/item"
                                        onClick={toggleDarkMode}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={cn(
                                                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                                                isDarkMode ? "bg-indigo-500 shadow-indigo-500/20" : "bg-yellow-400 shadow-yellow-400/20"
                                            )}>
                                                {isDarkMode ? <Moon className="w-7 h-7 text-white" /> : <Sun className="w-7 h-7 text-white" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight group-hover/item:text-primary transition-colors">{t("darkMode")}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{t("darkModeDesc")}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-16 h-9 rounded-full p-1.5 transition-all relative flex items-center shadow-inner",
                                            isDarkMode ? "bg-primary" : "bg-muted-foreground/20"
                                        )}>
                                            <motion.div
                                                animate={{
                                                    x: isDarkMode ? 28 : 0,
                                                    rotate: isDarkMode ? 180 : 0
                                                }}
                                                className="w-6 h-6 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden"
                                            >
                                                {isDarkMode ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-yellow-500" />}
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    {/* Language Selector */}
                                    <div className="bg-muted/30 rounded-3xl border-2 border-border overflow-hidden transition-all hover:border-primary/30 group/lang">
                                        <button
                                            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                                            className="w-full flex items-center justify-between p-5 hover:bg-muted/40 transition-all text-left"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                    <Globe className="w-7 h-7 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-lg tracking-tight group-hover/lang:text-primary transition-colors">{t("language")}</p>
                                                    <p className="text-sm text-muted-foreground font-medium">
                                                        {LANGUAGES.find(l => l.code === currentLocale)?.name || t("currentLanguage")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm transition-transform duration-300",
                                                showLanguageOptions && "rotate-180 bg-primary/20 text-primary"
                                            )}>
                                                <ChevronRight className={cn("w-5 h-5 text-muted-foreground transition-all", showLanguageOptions && "text-primary rotate-90")} />
                                            </div>
                                        </button>

                                        <AnimatePresence>
                                            {showLanguageOptions && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden bg-muted/10 border-t border-border/50"
                                                >
                                                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        {LANGUAGES.map((lang) => (
                                                            <Link
                                                                key={lang.code}
                                                                href="/settings"
                                                                locale={lang.code}
                                                                className={cn(
                                                                    "flex items-center justify-between gap-4 p-4 rounded-2xl transition-all border-2",
                                                                    currentLocale === lang.code
                                                                        ? "bg-primary/10 text-primary border-primary/40 shadow-sm"
                                                                        : "bg-card hover:bg-muted/50 border-transparent"
                                                                )}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-3xl drop-shadow-sm">{lang.flag}</span>
                                                                    <span className="font-black tracking-tight">{lang.name}</span>
                                                                </div>
                                                                {currentLocale === lang.code && (
                                                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                                                        <Check className="w-3.5 h-3.5 text-white" />
                                                                    </div>
                                                                )}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </section>

                            {/* Notifications */}
                            <section className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors duration-500" />

                                <h3 className="text-lg md:text-xl font-display font-black flex items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                                        <Bell className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="tracking-tight">{t("notifications")}</span>
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    {/* Push Notifications Toggle */}
                                    <motion.div
                                        whileHover={{ x: 2 }}
                                        className="flex items-center justify-between p-5 bg-muted/30 rounded-3xl border-2 border-border hover:border-primary/30 transition-all cursor-pointer group/push"
                                        onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                                <Bell className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight group-hover/push:text-primary transition-colors">{t("pushNotifications")}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{t("pushNotificationsDesc")}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-16 h-9 rounded-full p-1.5 transition-all relative flex items-center shadow-inner",
                                            notifications ? "bg-primary" : "bg-muted-foreground/20"
                                        )}>
                                            <motion.div
                                                animate={{ x: notifications ? 28 : 0 }}
                                                className="w-6 h-6 bg-white rounded-full shadow-lg"
                                            />
                                        </div>
                                    </motion.div>

                                    {/* Sound Effects Toggle */}
                                    <motion.div
                                        whileHover={{ x: 2 }}
                                        className="flex items-center justify-between p-5 bg-muted/30 rounded-3xl border-2 border-border hover:border-primary/30 transition-all cursor-pointer group/sound"
                                        onClick={() => setSoundEnabled(!soundEnabled)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                                <Volume2 className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight group-hover/sound:text-primary transition-colors">{t("soundEffects")}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{t("soundEffectsDesc")}</p>
                                            </div>
                                        </div>
                                        <div className={cn(
                                            "w-16 h-9 rounded-full p-1.5 transition-all relative flex items-center shadow-inner",
                                            soundEffects ? "bg-primary" : "bg-muted-foreground/20"
                                        )}>
                                            <motion.div
                                                animate={{ x: soundEffects ? 28 : 0 }}
                                                className="w-6 h-6 bg-white rounded-full shadow-lg"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </section>
                        </motion.div>
                    )}

                    {/* Security Section */}
                    {selectedSection === 'security' && (
                        <motion.div
                            key="security"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-6"
                        >
                            <section className="bg-card/50 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/10 transition-colors duration-500" />

                                <h3 className="text-lg md:text-xl font-display font-black flex items-center gap-3 relative z-10">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="tracking-tight">{t("securityOptions")}</span>
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    {/* Change Password Link */}
                                    <Link
                                        href="/security"
                                        className="flex items-center justify-between p-5 bg-muted/30 rounded-3xl border-2 border-border hover:border-primary/40 transition-all group/sec-link shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover/sec-link:scale-110 transition-transform">
                                                <Lock className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight group-hover/sec-link:text-primary transition-colors">{t("changePassword")}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{t("changePasswordDesc")}</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover/sec-link:bg-primary group-hover/sec-link:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </Link>

                                    {/* Help & Support Link */}
                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-between p-5 bg-muted/30 rounded-3xl border-2 border-border hover:border-primary/40 transition-all group/help-link shadow-sm hover:shadow-md"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover/help-link:scale-110 transition-transform">
                                                <HelpCircle className="w-7 h-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-black text-lg tracking-tight group-hover/help-link:text-primary transition-colors">{t("helpSupport")}</p>
                                                <p className="text-sm text-muted-foreground font-medium">{t("helpSupportDesc")}</p>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover/help-link:bg-primary group-hover/help-link:text-white transition-all shadow-sm">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </Link>
                                </div>
                            </section>

                            {/* Legal Links */}
                            <div className="grid grid-cols-2 gap-4">
                                <Link
                                    href="/privacy"
                                    className="p-5 bg-card/50 backdrop-blur-sm rounded-3xl border-2 border-border hover:border-primary/20 transition-all flex items-center justify-between group"
                                >
                                    <span className="font-bold text-sm text-muted-foreground group-hover:text-primary transition-colors">{t("privacyPolicy")}</span>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                </Link>
                                <Link
                                    href="/terms"
                                    className="p-5 bg-card/50 backdrop-blur-sm rounded-3xl border-2 border-border hover:border-primary/20 transition-all flex items-center justify-between group"
                                >
                                    <span className="font-bold text-sm text-muted-foreground group-hover:text-primary transition-colors">{t("termsOfService")}</span>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                </Link>
                            </div>

                            {/* Danger Zone */}
                            <section className="bg-rose-500/5 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-rose-500/20 shadow-xl space-y-6 relative overflow-hidden group">
                                <h3 className="text-lg md:text-xl font-display font-black flex items-center gap-3 text-rose-600">
                                    <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
                                        <Trash2 className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="tracking-tight">{t("dangerZone")}</span>
                                </h3>

                                <div className="p-5 bg-card/50 rounded-3xl border-2 border-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="font-black text-lg text-foreground tracking-tight">{t("deleteAccount")}</p>
                                        <p className="text-sm text-muted-foreground font-medium max-w-sm">{t("deleteAccountDesc")}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleDeleteAccount}
                                        className="w-full md:w-auto px-8 py-6 rounded-2xl border-2 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white font-black transition-all"
                                    >
                                        {t("deleteAccount")}
                                    </Button>
                                </div>
                            </section>

                            {/* Account Info Card */}
                            <section className="bg-gradient-to-br from-primary/5 via-primary/10 to-transparent p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-primary/20 relative shadow-xl overflow-hidden group">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
                                <div className="flex items-start gap-6 relative z-10">
                                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/30">
                                        <Shield className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl mb-2 tracking-tight">{t("accountSecurity")}</h4>
                                        <p className="text-base text-muted-foreground/80 font-medium leading-relaxed">{t("accountSecurityDesc")}</p>
                                    </div>
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status Message */}
                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className={cn(
                                "fixed bottom-28 md:bottom-12 left-1/2 -translate-x-1/2 min-w-[320px] p-5 rounded-[2rem] border-2 flex items-center gap-4 font-black shadow-2xl backdrop-blur-xl z-50",
                                status.type === 'success'
                                    ? "bg-emerald-500/90 border-emerald-400 text-white"
                                    : "bg-rose-500/90 border-rose-400 text-white"
                            )}
                        >
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                {status.type === 'success' ? <Check className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                            </div>
                            <p className="tracking-tight">{status.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save Button - Only show on profile section */}
                {selectedSection === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sticky bottom-[86px] md:bottom-8 z-30"
                    >
                        <Button
                            size="lg"
                            className="w-full h-20 md:h-24 text-xl md:text-2xl font-display font-black rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] active:scale-95 transition-all flex gap-4 border-4 border-white/10"
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                                    <Save className="w-6 h-6" />
                                </div>
                            )}
                            <span className="tracking-tight">{isSaving ? t("saving") : t("saveChanges")}</span>
                        </Button>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
