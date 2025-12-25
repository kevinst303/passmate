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
    Minus
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { updateProfile, uploadAvatar } from "@/app/actions/profile";
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

// Generate avatar options with dicebear seeds
const AVATAR_SEEDS = [
    { seed: "felix", color: "b6e3f4" },
    { seed: "aneka", color: "c0aede" },
    { seed: "zephyr", color: "d1fae5" },
    { seed: "milo", color: "fde68a" },
    { seed: "luna", color: "fecaca" },
    { seed: "nova", color: "a5f3fc" },
    { seed: "sage", color: "d9f99d" },
    { seed: "ruby", color: "fda4af" },
];



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

    const AVATAR_OPTIONS = [
        {
            url: "",
            label: "Default Koala",
            isEmoji: true
        },
        ...AVATAR_SEEDS.map((opt, index) => ({
            url: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${opt.seed}&backgroundColor=${opt.color}`,
            label: t(`avatars.ollie${index + 1}` as "avatars.ollie1"),
            isEmoji: false
        }))
    ];

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

    const settingsSections = [
        { id: 'profile' as const, icon: User, label: t("profileSection"), color: 'from-teal-500 to-emerald-500' },
        { id: 'preferences' as const, icon: Palette, label: t("preferencesSection"), color: 'from-purple-500 to-pink-500' },
        { id: 'security' as const, icon: Shield, label: t("securitySection"), color: 'from-orange-500 to-red-500' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pb-24 md:pb-8 md:pl-20">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md border-b border-border/50 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
                    <div className="bg-card p-2 rounded-xl border-2 border-border group-hover:border-primary/30 transition-all shadow-sm">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="hidden sm:inline">{t("backProfile")}</span>
                </Link>
                <h1 className="text-xl font-display font-black text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    {t("title")}
                </h1>
                <div className="w-20 md:w-24" /> {/* Spacer */}
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
                            <section className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl">
                                <h3 className="text-lg md:text-xl font-display font-black mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                                        <Camera className="w-5 h-5 text-white" />
                                    </div>
                                    {t("profilePicture")}
                                </h3>

                                <div className="flex flex-col lg:flex-row items-center gap-8">
                                    {/* Current Avatar Preview */}
                                    <div className="relative group">
                                        <div className="w-28 h-28 md:w-36 md:h-36 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] md:rounded-[2.5rem] border-[6px] border-card shadow-2xl flex items-center justify-center overflow-hidden">
                                            <Avatar
                                                src={avatarUrl}
                                                size="2xl"
                                                className="w-full h-full border-0 rounded-none"
                                            />
                                        </div>
                                        <label
                                            htmlFor="avatar-upload"
                                            className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-4 border-card cursor-pointer hover:scale-110 transition-transform"
                                        >
                                            {isUploading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                disabled={isUploading}
                                            />
                                        </label>
                                    </div>

                                    {/* Avatar Grid */}
                                    <div className="flex-1 w-full">
                                        <p className="text-sm text-muted-foreground mb-4 text-center lg:text-left">
                                            {t("chooseAvatar")}
                                        </p>
                                        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-3 md:gap-4">
                                            {/* Upload Option */}
                                            <button
                                                onClick={() => document.getElementById('avatar-upload')?.click()}
                                                className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden"
                                            >
                                                <Upload className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary">{t("upload")}</span>
                                            </button>

                                            {AVATAR_OPTIONS.map((opt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setAvatarUrl(opt.url)}
                                                    className={cn(
                                                        "aspect-square rounded-2xl border-4 transition-all overflow-hidden bg-muted/30 group relative hover:scale-105 flex items-center justify-center",
                                                        avatarUrl === opt.url
                                                            ? "border-primary scale-105 shadow-lg shadow-primary/30 ring-4 ring-primary/20"
                                                            : "border-transparent hover:border-primary/30"
                                                    )}
                                                >
                                                    {opt.isEmoji ? (
                                                        <span className="text-3xl md:text-4xl">🐨</span>
                                                    ) : (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <Image
                                                            src={opt.url}
                                                            alt={opt.label}
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                    )}
                                                    {avatarUrl === opt.url && (
                                                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                            <Check className="w-6 h-6 text-primary" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Account Details */}
                            <section className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl space-y-6">
                                <h3 className="text-lg md:text-xl font-display font-black flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    {t("personalDetails")}
                                </h3>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-2">{t("fullName")}</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder={t("placeholders.fullName")}
                                            className="w-full bg-muted/30 border-2 border-border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none hover:border-primary/30"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-2">{t("username")}</label>
                                        <div className="relative">
                                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">@</span>
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder={t("placeholders.username")}
                                                className="w-full bg-muted/30 border-2 border-border rounded-2xl py-4 pl-10 pr-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none hover:border-primary/30"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-2">{t("email")}</label>
                                        <div className="w-full bg-muted/50 border-2 border-border rounded-2xl py-4 px-5 flex items-center justify-between font-bold text-muted-foreground">
                                            <span>{user.email}</span>
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <p className="text-xs text-muted-foreground ml-2">{t("emailLocked")}</p>
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
                            <section className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl">
                                <h3 className="text-lg md:text-xl font-display font-black mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                        <Palette className="w-5 h-5 text-white" />
                                    </div>
                                    {t("appearance")}
                                </h3>

                                <div className="space-y-4">
                                    {/* Dark Mode Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border-2 border-border hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                                                {isDarkMode ? <Moon className="w-6 h-6 text-white" /> : <Sun className="w-6 h-6 text-white" />}
                                            </div>
                                            <div>
                                                <p className="font-bold">{t("darkMode")}</p>
                                                <p className="text-sm text-muted-foreground">{t("darkModeDesc")}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleDarkMode}
                                            className={cn(
                                                "w-14 h-8 rounded-full p-1 transition-all",
                                                isDarkMode ? "bg-primary" : "bg-muted"
                                            )}
                                        >
                                            <motion.div
                                                animate={{ x: isDarkMode ? 24 : 0 }}
                                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                            />
                                        </button>
                                    </div>

                                    {/* Language Selector */}
                                    {/* Language Selector */}
                                    <div className="bg-muted/30 rounded-2xl border-2 border-border overflow-hidden transition-all">
                                        <button
                                            onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                                            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-all"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                                                    <Globe className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-bold">{t("language")}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {LANGUAGES.find(l => l.code === currentLocale)?.name || t("currentLanguage")}
                                                    </p>
                                                </div>
                                            </div>
                                            <ChevronRight className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", showLanguageOptions && "rotate-90")} />
                                        </button>

                                        <AnimatePresence>
                                            {showLanguageOptions && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 pt-0 grid gap-2">
                                                        {LANGUAGES.map((lang) => (
                                                            <Link
                                                                key={lang.code}
                                                                href="/settings"
                                                                locale={lang.code}
                                                                className={cn(
                                                                    "flex items-center gap-4 p-3 rounded-xl transition-all",
                                                                    currentLocale === lang.code
                                                                        ? "bg-primary/10 text-primary border border-primary/20"
                                                                        : "bg-card hover:bg-muted border border-transparent"
                                                                )}
                                                            >
                                                                <span className="text-2xl">{lang.flag}</span>
                                                                <span className="font-bold">{lang.name}</span>
                                                                {currentLocale === lang.code && <Check className="w-4 h-4 ml-auto" />}
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
                            <section className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl">
                                <h3 className="text-lg md:text-xl font-display font-black mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-white" />
                                    </div>
                                    {t("notifications")}
                                </h3>

                                <div className="space-y-4">
                                    {/* Notifications Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border-2 border-border hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                                                <Bell className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{t("pushNotifications")}</p>
                                                <p className="text-sm text-muted-foreground">{t("pushNotificationsDesc")}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                            className={cn(
                                                "w-14 h-8 rounded-full p-1 transition-all",
                                                notifications ? "bg-primary" : "bg-muted"
                                            )}
                                        >
                                            <motion.div
                                                animate={{ x: notifications ? 24 : 0 }}
                                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                            />
                                        </button>
                                    </div>

                                    {/* Sound Effects Toggle */}
                                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border-2 border-border hover:border-primary/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                                                <Volume2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{t("soundEffects")}</p>
                                                <p className="text-sm text-muted-foreground">{t("soundEffectsDesc")}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSoundEnabled(!soundEnabled)}
                                            className={cn(
                                                "w-14 h-8 rounded-full p-1 transition-all",
                                                soundEffects ? "bg-primary" : "bg-muted"
                                            )}
                                        >
                                            <motion.div
                                                animate={{ x: soundEffects ? 24 : 0 }}
                                                className="w-6 h-6 bg-white rounded-full shadow-md"
                                            />
                                        </button>
                                    </div>
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
                            <section className="bg-card p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-border shadow-xl">
                                <h3 className="text-lg md:text-xl font-display font-black mb-6 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                    {t("securityOptions")}
                                </h3>

                                <div className="space-y-4">
                                    {/* Change Password */}
                                    <Link
                                        href="/security"
                                        className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border-2 border-border hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                                                <Lock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{t("changePassword")}</p>
                                                <p className="text-sm text-muted-foreground">{t("changePasswordDesc")}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>

                                    {/* Help & Support */}
                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border-2 border-border hover:border-primary/30 transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                                <HelpCircle className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-bold">{t("helpSupport")}</p>
                                                <p className="text-sm text-muted-foreground">{t("helpSupportDesc")}</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                    </Link>
                                </div>
                            </section>

                            {/* Account Info */}
                            <section className="bg-gradient-to-br from-primary/5 to-primary/10 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border-2 border-primary/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                        <Shield className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{t("accountSecurity")}</h4>
                                        <p className="text-sm text-muted-foreground">{t("accountSecurityDesc")}</p>
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
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={cn(
                                "p-5 rounded-2xl border-2 flex items-center gap-4 font-bold shadow-lg",
                                status.type === 'success'
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : "bg-red-50 border-red-200 text-red-700"
                            )}
                        >
                            {status.type === 'success'
                                ? <Check className="w-6 h-6 shrink-0" />
                                : <Shield className="w-6 h-6 shrink-0" />
                            }
                            <p>{status.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Save Button - Only show on profile section */}
                {selectedSection === 'profile' && (
                    <Button
                        size="lg"
                        className="w-full py-6 md:py-8 text-lg md:text-xl font-black rounded-[1.5rem] md:rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex gap-3"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                        {isSaving ? t("saving") : t("saveChanges")}
                    </Button>
                )}
            </main>

        </div>
    );
}
