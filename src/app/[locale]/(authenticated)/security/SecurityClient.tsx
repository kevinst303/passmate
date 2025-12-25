"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Key,
    Smartphone,
    Eye,
    EyeOff,
    ArrowLeft,
    AlertTriangle,
    History,
    LogOut
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SecurityClientProps {
    data: unknown;
}

export default function SecurityClient({ data: _data }: SecurityClientProps) {
    const t = useTranslations("Security");
    const supabase = createClient();

    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        new: "",
        confirm: ""
    });

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        if (passwords.new.length < 8) {
            setStatus({ type: 'error', message: t("passwordMinLength") });
            return;
        }

        if (passwords.new !== passwords.confirm) {
            setStatus({ type: 'error', message: t("passwordsMismatch") });
            return;
        }

        setIsLoading(true);
        const { error } = await supabase.auth.updateUser({
            password: passwords.new
        });

        if (error) {
            setStatus({ type: 'error', message: error.message || t("updating") });
        } else {
            setStatus({ type: 'success', message: t("success") });
            setPasswords({ new: "", confirm: "" });
        }
        setIsLoading(false);

        // Clear status after 5 seconds
        setTimeout(() => setStatus(null), 5000);
    };

    const handleSignOutAll = async () => {
        setIsLoading(true);
        const { error } = await supabase.auth.signOut();
        if (!error) window.location.href = "/login";
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8 font-sans">
            <main className="max-w-4xl mx-auto py-8 px-4">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> {t("backProfile")}
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl font-display font-black tracking-tight mb-2">{t("title")}</h1>
                    <p className="text-muted-foreground font-bold">{t("subtitle")}</p>
                </div>

                <div className="space-y-10">
                    {/* Password Update Section */}
                    <section className="bg-card glass rounded-[3rem] border-2 border-border p-8 md:p-10 shadow-xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <div className="relative z-10">
                            <h2 className="text-2xl font-display font-black mb-8 flex items-center gap-4">
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-2xl border border-blue-200 dark:border-blue-800">
                                    <Key className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                </div>
                                {t("changePassword")}
                            </h2>

                            <form onSubmit={handleUpdatePassword} className="max-w-md space-y-6">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">{t("newPassword")}</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={passwords.new}
                                                onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                                className="w-full bg-card glass/50 border-2 border-border rounded-2xl py-4 px-5 pr-14 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none"
                                                placeholder={t("placeholder")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white rounded-xl transition-colors"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5 text-muted-foreground" /> : <Eye className="w-5 h-5 text-muted-foreground" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <label className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 ml-1">{t("confirmPassword")}</label>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={passwords.confirm}
                                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                            className="w-full bg-card glass/50 border-2 border-border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none"
                                            placeholder={t("placeholder")}
                                        />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {status && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className={cn(
                                                "p-4 rounded-2xl border-2 font-bold text-sm",
                                                status.type === 'success' ? "bg-green-100 dark:bg-green-950/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                                            )}
                                        >
                                            {status.message}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button
                                    type="submit"
                                    className="h-14 px-10 rounded-2xl font-black text-lg shadow-xl"
                                    disabled={isLoading || !passwords.new}
                                >
                                    {isLoading ? t("updating") : t("updatePassword")}
                                </Button>

                                <p className="text-xs text-muted-foreground font-bold flex items-center gap-2 italic">
                                    <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                    {t("passwordMinLength")}
                                </p>
                            </form>
                        </div>
                    </section>

                    {/* Security Features Grid */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* 2FA Section (Simulated) */}
                        <section className="bg-card glass rounded-[2.5rem] border-2 border-border p-8 shadow-lg">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-display font-black flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-green-500" /> {t("twoFactor.title")}
                                </h3>
                                <span className="bg-muted px-3 py-1 rounded-full text-[10px] font-black uppercase text-muted-foreground whitespace-nowrap">{t("twoFactor.soon")}</span>
                            </div>
                            <p className="text-muted-foreground font-bold text-sm mb-6 leading-relaxed">
                                {t("twoFactor.desc")}
                            </p>
                            <Button variant="outline" className="w-full h-12 rounded-xl font-black border-2 opacity-50 cursor-not-allowed">
                                {t("twoFactor.enable")}
                            </Button>
                        </section>

                        {/* Recent Activity Section */}
                        <section className="bg-card glass rounded-[2.5rem] border-2 border-border p-8 shadow-lg">
                            <h3 className="text-xl font-display font-black mb-8 flex items-center gap-3">
                                <History className="w-5 h-5 text-purple-500" /> {t("recentActivity.title")}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <div>
                                        <p className="text-sm font-black">{t("recentActivity.currentSession")}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Sydney, Australia • Chrome</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-50">
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-black">{t("recentActivity.loggedIn")}</p>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{t("recentActivity.ago", { time: "2 days" })} • iOS App</p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleSignOutAll}
                                className="mt-8 text-xs font-black text-red-500 hover:text-red-600 flex items-center gap-2 group mx-auto md:mx-0"
                            >
                                <LogOut className="w-3 h-3" /> {t("recentActivity.signOutAll")}
                            </button>
                        </section>
                    </div>

                    {/* Data Privacy Section */}
                    <section className="bg-card glass rounded-[2.5rem] border-2 border-border p-8 md:p-10 shadow-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-display font-black flex items-center gap-4">
                                    <Shield className="w-6 h-6 text-primary" /> {t("dataPrivacy.title")}
                                </h2>
                                <p className="text-muted-foreground font-bold max-w-xl">
                                    {t("dataPrivacy.desc")}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <Link href="/privacy">
                                    <Button variant="outline" className="rounded-xl font-black border-2">{t("dataPrivacy.policy")}</Button>
                                </Link>
                                <Link href="/terms">
                                    <Button variant="outline" className="rounded-xl font-black border-2">{t("dataPrivacy.terms")}</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-border flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h3 className="font-black text-lg mb-1">{t("dataPrivacy.downloadTitle")}</h3>
                                <p className="text-sm text-muted-foreground font-bold">{t("dataPrivacy.downloadDesc")}</p>
                            </div>
                            <Button variant="secondary" className="rounded-xl font-black h-12 px-8">{t("dataPrivacy.requestExport")}</Button>
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-red-500/10 dark:bg-red-950/20 rounded-[2.5rem] border-2 border-red-500/20 p-8 md:p-10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div>
                                <h3 className="text-xl font-display font-black text-red-600 mb-1">{t("dangerZone.title")}</h3>
                                <p className="text-sm text-red-900/60 font-bold italic">{t("dangerZone.desc")}</p>
                            </div>
                            <Button variant="accent" className="bg-red-500 hover:bg-red-600 h-14 px-8 rounded-2xl font-black shadow-lg shadow-red-200">
                                {t("dangerZone.delete")}
                            </Button>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
