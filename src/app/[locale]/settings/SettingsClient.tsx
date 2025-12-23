"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    Save,
    User,
    Mail,
    Shield,
    Check,
    Loader2,
    Sparkles,
    Camera
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
    profile: any;
    user: any;
}

const AVATAR_OPTIONS = [
    { url: "https://api.dicebear.com/7.x/bottts/svg?seed=ollie1", label: "Classic Ollie" },
    { url: "https://api.dicebear.com/7.x/bottts/svg?seed=ollie2", label: "Cool Ollie" },
    { url: "https://api.dicebear.com/7.x/bottts/svg?seed=ollie3", label: "Study Ollie" },
    { url: "https://api.dicebear.com/7.x/bottts/svg?seed=ollie4", label: "King Ollie" },
    { url: "https://api.dicebear.com/7.x/bottts/svg?seed=ollie5", label: "Aussie Ollie" },
    { url: "https://api.dicebear.com/7.x/bottts/svg?seed=ollie6", label: "Smarty Ollie" },
];

export default function SettingsClient({ profile, user }: SettingsClientProps) {
    const [fullName, setFullName] = useState(profile.full_name || "");
    const [username, setUsername] = useState(profile.username || "");
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || "");
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const router = useRouter();

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
            setStatus({ type: 'success', message: "Profile updated successfully, mate!" });
            router.refresh();
        }
        setIsSaving(false);

        // Clear success message after 3 seconds
        if (!result.error) {
            setTimeout(() => setStatus(null), 3000);
        }
        setIsSaving(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 md:pb-8 md:pl-20">
            <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold group">
                    <div className="bg-white p-2 rounded-xl border-2 border-border group-hover:border-primary/30 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span>Back to Profile</span>
                </Link>
                <h1 className="text-xl font-display font-black text-foreground">Account Settings</h1>
                <div className="w-24" /> {/* Spacer */}
            </header>

            <main className="max-w-3xl mx-auto p-6 space-y-10 py-12">
                {/* Profile Picture Section */}
                <section className="bg-white p-8 rounded-[3.5rem] border-2 border-border shadow-xl">
                    <h3 className="text-xl font-display font-black mb-8 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-primary" /> Profile Picture
                    </h3>

                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-32 h-32 bg-primary/10 rounded-[2.5rem] border-[6px] border-white shadow-2xl flex items-center justify-center text-5xl overflow-hidden shrink-0">
                            {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" /> : "🐨"}
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 w-full">
                            {AVATAR_OPTIONS.map((opt) => (
                                <button
                                    key={opt.url}
                                    onClick={() => setAvatarUrl(opt.url)}
                                    className={cn(
                                        "w-full aspect-square rounded-2xl border-4 transition-all overflow-hidden bg-muted/30 group",
                                        avatarUrl === opt.url ? "border-primary scale-105 shadow-lg" : "border-transparent hover:border-primary/30"
                                    )}
                                >
                                    <img src={opt.url} alt={opt.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Account Details */}
                <section className="bg-white p-8 rounded-[3.5rem] border-2 border-border shadow-xl space-y-8">
                    <h3 className="text-xl font-display font-black flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" /> Personal Details
                    </h3>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-2">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="e.g. Steve Irwin"
                                className="w-full bg-muted/30 border-2 border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none border-transparent hover:border-border/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="citizen_mate"
                                className="w-full bg-muted/30 border-2 border-border rounded-2xl py-4 px-6 focus:ring-4 focus:ring-primary/10 transition-all font-bold outline-none border-transparent hover:border-border/50"
                            />
                        </div>

                        <div className="space-y-2 opacity-60 grayscale cursor-not-allowed">
                            <label className="text-xs font-black text-muted-foreground uppercase tracking-wider ml-2">Email (Cannot be changed)</label>
                            <div className="w-full bg-muted border-2 border-border rounded-2xl py-4 px-6 flex items-center justify-between font-bold">
                                {user.email}
                                <Shield className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                </section>

                <AnimatePresence>
                    {status && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={cn(
                                "p-6 rounded-3xl border-2 flex items-center gap-4 font-bold shadow-lg",
                                status.type === 'success' ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                            )}
                        >
                            {status.type === 'success' ? <Check className="w-6 h-6 shrink-0" /> : <Shield className="w-6 h-6 shrink-0" />}
                            <p>{status.message}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button
                    size="lg"
                    className="w-full py-8 text-xl font-black rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex gap-3"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
                    Save Changes
                </Button>
            </main>

            <Sidebar />
        </div>
    );
}
