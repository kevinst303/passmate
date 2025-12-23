"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Shield,
    Settings,
    CreditCard,
    Share2,
    LogOut,
    Flame,
    Zap,
    Trophy,
    Target,
    ChevronRight,
    Mail,
    User,
    Star,
    Award,
    Edit3,
    MessageCircle
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ProfileClientProps {
    data: any;
    achievementsData: any;
}

export default function ProfileClient({ data, achievementsData }: ProfileClientProps) {
    const { profile, user } = data;
    const { achievements } = achievementsData;
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const joinedDate = new Date(profile.created_at).toLocaleDateString('en-AU', {
        month: 'long',
        year: 'numeric'
    });

    const unlockedAchievements = achievements.filter((a: any) => a.is_unlocked);

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 md:pb-8 md:pl-28 md:pr-8">
            <main className="max-w-5xl mx-auto py-8 space-y-10">
                {/* Profile Header Card */}
                <section className="bg-white p-10 rounded-[4rem] border-2 border-border shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative group/avatar">
                            <div className="w-40 h-40 bg-gradient-to-br from-primary/10 to-primary/5 rounded-[3.5rem] flex items-center justify-center text-7xl shadow-inner border-[6px] border-white overflow-hidden transition-transform group-hover/avatar:scale-105 duration-500">
                                {profile.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : "🐨"}
                            </div>
                            <Link href="/settings">
                                <Button variant="secondary" className="absolute bottom-2 right-2 rounded-2xl shadow-xl w-10 h-10 border-2 border-white p-0">
                                    <Edit3 className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                                <h1 className="text-4xl font-display font-black text-foreground tracking-tight">{profile.full_name || profile.username || 'Citizen Mate'}</h1>
                                <div className="flex gap-2 justify-center md:justify-start">
                                    <span className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-primary/20">
                                        Level {profile.level}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md shadow-yellow-200">
                                        PRO
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground font-bold italic mb-8">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" /> {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" /> Joined {joinedDate}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                <div className="bg-orange-50 text-orange-600 px-6 py-2.5 rounded-2xl border-2 border-orange-100 font-black text-sm flex items-center gap-2 shadow-sm">
                                    <Flame className="w-5 h-5 fill-orange-600" /> {profile.daily_streak} DAY STREAK
                                </div>
                                <div className="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-2xl border-2 border-blue-100 font-black text-sm flex items-center gap-2 shadow-sm">
                                    <Zap className="w-5 h-5 fill-blue-600" /> {profile.total_xp.toLocaleString()} TOTAL XP
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-full md:w-auto">
                            <Link href="/settings" className="w-full">
                                <Button variant="outline" className="h-14 w-full px-8 rounded-2xl font-black text-lg border-2 border-border hover:bg-muted/50 transition-all flex items-center justify-center gap-3">
                                    <Settings className="w-5 h-5" /> Settings
                                </Button>
                            </Link>
                            <Button variant="accent" className="h-14 px-8 rounded-2xl font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-3" onClick={handleLogout}>
                                <LogOut className="w-5 h-5" /> Sign Out
                            </Button>
                        </div>
                    </div>
                </section>

                <div className="grid md:grid-cols-5 gap-10">
                    <div className="md:col-span-3 space-y-10">
                        {/* Stats Summary */}
                        <section className="bg-white p-10 rounded-[3.5rem] border-2 border-border shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-display font-black flex items-center gap-3">
                                    <Target className="w-6 h-6 text-accent" /> Your Stats
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                <div className="text-center group">
                                    <div className="p-4 rounded-3xl bg-muted/30 border border-border group-hover:bg-primary/5 transition-colors mb-2">
                                        <Zap className="w-8 h-8 mx-auto text-blue-500 fill-blue-500" />
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">Current XP</p>
                                    <p className="text-2xl font-display font-black">{profile.current_xp}</p>
                                </div>
                                <div className="text-center group">
                                    <div className="p-4 rounded-3xl bg-muted/30 border border-border group-hover:bg-orange-50 transition-colors mb-2">
                                        <Flame className="w-8 h-8 mx-auto text-orange-500 fill-orange-500" />
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">Streak</p>
                                    <p className="text-2xl font-display font-black">{profile.daily_streak}</p>
                                </div>
                                <div className="text-center group">
                                    <div className="p-4 rounded-3xl bg-muted/30 border border-border group-hover:bg-yellow-50 transition-colors mb-2">
                                        <Trophy className="w-8 h-8 mx-auto text-yellow-500 fill-yellow-500" />
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">Quizzes</p>
                                    <p className="text-2xl font-display font-black">24</p>
                                </div>
                                <div className="text-center group">
                                    <div className="p-4 rounded-3xl bg-muted/30 border border-border group-hover:bg-purple-50 transition-colors mb-2">
                                        <Award className="w-8 h-8 mx-auto text-purple-500 fill-purple-500" />
                                    </div>
                                    <p className="text-[10px] font-black text-muted-foreground uppercase">Badges</p>
                                    <p className="text-2xl font-display font-black">{unlockedAchievements.length}</p>
                                </div>
                            </div>
                        </section>

                        {/* Recent Badges */}
                        <section className="bg-white p-10 rounded-[4.5rem] border-2 border-border shadow-xl">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-2xl font-display font-black flex items-center gap-3">
                                    <Award className="w-6 h-6 text-yellow-500" /> Recent Badges
                                </h3>
                                <Link href="/achievements" className="text-sm font-black text-primary hover:underline flex items-center gap-1 group">
                                    View Collection <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-6">
                                {unlockedAchievements.slice(0, 8).map((achievement: any) => (
                                    <motion.div
                                        key={achievement.id}
                                        whileHover={{ y: -5 }}
                                        className="flex flex-col items-center gap-2"
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-50 to-orange-50 border-4 border-white shadow-lg rounded-[2rem] flex items-center justify-center text-4xl">
                                            {achievement.badge_url || "🏆"}
                                        </div>
                                        <span className="text-[10px] font-black uppercase text-center text-muted-foreground line-clamp-1">{achievement.name}</span>
                                    </motion.div>
                                ))}
                                {unlockedAchievements.length === 0 && (
                                    <div className="col-span-full py-10 text-center flex flex-col items-center gap-4">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-3xl opacity-20 grayscale">🏆</div>
                                        <p className="text-muted-foreground font-bold italic">Start learning to earn your first badge!</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-2 space-y-10">
                        {/* Premium Card / Support Ollie */}
                        <section className={cn(
                            "rounded-[4rem] p-10 shadow-2xl relative overflow-hidden group h-full transition-all",
                            profile.is_premium
                                ? "bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 text-foreground"
                                : "bg-black text-white border-4 border-white/5"
                        )}>
                            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors" />

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6",
                                        profile.is_premium ? "bg-primary text-white" : "bg-white/10"
                                    )}>
                                        {profile.is_premium ? "🌟" : "💎"}
                                    </div>
                                    <h2 className="text-3xl font-display font-black mb-4 tracking-tight">
                                        {profile.is_premium ? "PassMate Legend" : "PassMate Gold"}
                                    </h2>
                                    <p className={cn(
                                        "font-bold mb-8 leading-relaxed",
                                        profile.is_premium ? "text-muted-foreground" : "text-white/60"
                                    )}>
                                        {profile.is_premium
                                            ? "You've unlocked all the features! You're supporting independent Aussie developers and Ollie thanks ya!"
                                            : "You're currently a free user. Upgrade to unlock the full potential of PassMate and pass your test first try!"}
                                    </p>

                                    <div className="space-y-4 mb-10">
                                        {[
                                            'Unlimited Mock Tests',
                                            profile.is_premium ? 'AI Tutor Access (Unlocked)' : 'Personal AI Tutor 24/7',
                                            'Detailed Performance Analytics',
                                            'No Heart Restrictions'
                                        ].map((feature) => (
                                            <div key={feature} className={cn(
                                                "flex items-center gap-3 text-sm font-bold",
                                                profile.is_premium ? "text-foreground" : "text-white/80"
                                            )}>
                                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] text-white">
                                                    {profile.is_premium ? "✓" : "✨"}
                                                </div>
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {!profile.is_premium ? (
                                    <Link href="/premium">
                                        <Button size="lg" className="w-full bg-white text-black hover:bg-white/90 h-16 rounded-[2rem] font-black text-xl shadow-2xl">
                                            Become a Pro
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button variant="outline" size="lg" className="w-full h-16 rounded-[2rem] font-black text-xl border-2 border-primary/20 hover:bg-primary/5">
                                        Support Ollie
                                    </Button>
                                )}
                            </div>
                        </section>
                    </div>
                </div>

                {/* Account Settings List */}
                <section className="bg-white rounded-[4rem] border-2 border-border shadow-xl overflow-hidden divide-y-2 divide-border/50">
                    {[
                        { icon: CreditCard, label: "Billing & Subscription", href: "/billing", color: "text-green-500", bg: "bg-green-50" },
                        { icon: Shield, label: "Privacy & Security", href: "/security", color: "text-blue-500", bg: "bg-blue-50" },
                        { icon: Share2, label: "Invite Friends & Earn XP", href: "/referral", color: "text-orange-500", bg: "bg-orange-50" },
                        { icon: MessageCircle, label: "Support & Feedback", href: "/support", color: "text-purple-500", bg: "bg-purple-50" }
                    ].map((opt, i) => (
                        <Link
                            key={i}
                            href={opt.href}
                            className="flex items-center justify-between p-8 hover:bg-muted/30 transition-all group"
                        >
                            <div className="flex items-center gap-6">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", opt.bg)}>
                                    <opt.icon className={cn("w-6 h-6", opt.color)} />
                                </div>
                                <span className="font-black text-xl text-foreground tracking-tight">{opt.label}</span>
                            </div>
                            <div className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center group-hover:border-primary/50 group-hover:text-primary transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
