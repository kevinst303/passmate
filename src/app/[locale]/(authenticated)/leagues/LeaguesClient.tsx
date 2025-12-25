"use client";

import { motion } from "framer-motion";
import {
    Trophy,
    Flame,
    Zap,
    TrendingUp,
    TrendingDown,
    ArrowLeft,
    Clock,
    Target
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { Avatar } from "@/components/ui/Avatar";
import { useTranslations } from "next-intl";

import { DashboardData, TopPlayer } from "@/types/dashboard";

interface LeaguesClientProps {
    data: DashboardData;
}

export default function LeaguesClient({ data }: LeaguesClientProps) {
    const t = useTranslations("Leagues");
    const nav = useTranslations("Navigation");
    const { profile, standing, topPlayers } = data;

    const LEAGUES = [
        { id: "Bronze", name: t("leagueNames.Bronze"), rank: 1, icon: "🥉", color: "from-amber-600 to-amber-800", bg: "bg-amber-100", shadow: "shadow-amber-200" },
        { id: "Silver", name: t("leagueNames.Silver"), rank: 2, icon: "🥈", color: "from-slate-400 to-slate-600", bg: "bg-slate-100", shadow: "shadow-slate-200" },
        { id: "Gold", name: t("leagueNames.Gold"), rank: 3, icon: "🥇", color: "from-yellow-400 to-yellow-600", bg: "bg-yellow-100", shadow: "shadow-yellow-200" },
        { id: "Diamond", name: t("leagueNames.Diamond"), rank: 4, icon: "💎", color: "from-blue-400 to-blue-600", bg: "bg-blue-100", shadow: "shadow-blue-200" },
    ];

    const currentLeagueName = standing?.leagues?.name || "Bronze";
    const currentLeague = LEAGUES.find(l => l.id === currentLeagueName) || LEAGUES[0];

    const currentStanding = topPlayers.findIndex(p => p.user_id === profile.id) + 1;
    const isTop3 = currentStanding > 0 && currentStanding <= 3;

    return (
        <div className="min-h-screen bg-[#FEFEF8] pb-24 md:pb-8 md:pl-28 md:pr-8 font-sans relative overflow-hidden">
            {/* Immersive Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />

            {/* Header */}
            <header className="max-w-5xl mx-auto pt-8 pb-4 px-6 md:px-0 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-4">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold group text-sm">
                        <div className="bg-white/80 backdrop-blur-md p-2 rounded-xl border-2 border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span>{t("backDashboard")}</span>
                    </Link>
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            className={cn("w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl relative group", currentLeague.color, currentLeague.shadow)}
                        >
                            <Trophy className="w-10 h-10 sm:w-12 sm:h-12 fill-white filter drop-shadow-lg" />
                            <div className="absolute inset-0 bg-white/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-primary/20">Season 1</span>
                                <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground tracking-tight">{currentLeague.name} {nav("leagues")}</h1>
                            </div>
                            <p className="text-muted-foreground font-bold italic mt-1">{t("competingDesc")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-3 rounded-[2rem] border-2 border-border shadow-xl">
                        <div className="flex items-center gap-1.5 text-orange-600 font-black border-r border-border pr-4 mr-2">
                            <Flame className="w-5 h-5 fill-orange-600" /> {profile.daily_streak}
                        </div>
                        <div className="flex items-center gap-1.5 text-blue-600 font-black">
                            <Zap className="w-5 h-5 fill-blue-600" /> {profile.total_xp.toLocaleString()}
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-8 px-6 md:px-0 relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Player Status (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        <section className="bg-white/70 backdrop-blur-xl p-8 rounded-[3.5rem] border-2 border-border shadow-2xl text-center relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                                <Target className="w-48 h-48" />
                            </div>

                            <div className="relative z-10">
                                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em] mb-4">{t("yourPosition")}</p>
                                <div className="text-6xl font-display font-black text-primary mb-2 drop-shadow-[0_0_15px_var(--glow-primary)]">#{standing?.current_rank || '10+'}</div>
                                <div className="bg-primary/10 text-primary text-xs font-black py-2 px-4 rounded-full inline-block mb-8 border border-primary/20">
                                    {t("weeklyXpLabel", { xp: standing?.weekly_xp || 0 })}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-border">
                                        <div className="flex items-center gap-2 text-muted-foreground font-bold italic">
                                            <Clock className="w-4 h-4" /> {t("endsIn")}
                                        </div>
                                        <span className="font-black">4d 12h</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm py-3 border-t border-border">
                                        <div className="flex items-center gap-2 text-muted-foreground font-bold italic">
                                            <TrendingUp className="w-4 h-4 text-green-500" /> {t("status")}
                                        </div>
                                        <span className="font-black text-green-600">{t("promotionZone")}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-gradient-to-br from-primary to-primary-dark p-8 rounded-[3.5rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-2xl font-display font-black mb-2 relative z-10">{t("boostRank")}</h3>
                            <p className="text-primary-foreground/90 font-bold text-sm mb-8 leading-relaxed relative z-10">{t("boostRankDesc")}</p>
                            <Link href="/dashboard/quiz">
                                <Button size="lg" variant="white" className="w-full h-14 rounded-2xl relative z-10">{t("getMoreXP")}</Button>
                            </Link>
                        </section>
                    </div>

                    {/* Right Column: Leaderboard (8 cols) */}
                    <div className="lg:col-span-8">
                        <section className="bg-white/80 backdrop-blur-xl rounded-[4rem] border-2 border-border shadow-2xl overflow-hidden flex flex-col">
                            <div className="px-10 py-8 border-b-2 border-border flex justify-between items-center bg-muted/5 relative">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
                                        <TrendingUp className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-display font-black">{t("topPerformers")}</h3>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{t("weeklyStandings")}</p>
                                    </div>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 bg-blue-100 text-blue-700 font-black text-xs px-4 py-2 rounded-full border border-blue-200">
                                    <Zap className="w-4 h-4 fill-blue-700" /> {t("weeklyStandings")}
                                </div>
                            </div>

                            <div className="flex-1">
                                {topPlayers.length > 0 ? (
                                    <div className="divide-y divide-border/50">
                                        {topPlayers.map((player: TopPlayer, idx: number) => {
                                            const isUser = player.user_id === profile.id;
                                            const pos = idx + 1;
                                            return (
                                                <motion.div
                                                    key={player.user_id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={cn(
                                                        "flex items-center gap-6 px-10 py-7 transition-all group relative",
                                                        isUser ? "bg-primary/5 sticky top-0 z-10" : "hover:bg-muted/40",
                                                        pos <= 3 && "bg-gradient-to-r from-transparent via-transparent to-transparent"
                                                    )}
                                                >
                                                    {isUser && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                                                    )}

                                                    <div className="w-12 flex justify-center shrink-0">
                                                        {pos === 1 && (
                                                            <div className="relative">
                                                                <span className="text-4xl filter drop-shadow-lg scale-125 block transform group-hover:rotate-12 transition-transform">🥇</span>
                                                                <motion.div
                                                                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                                                                    transition={{ repeat: Infinity, duration: 2 }}
                                                                    className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full"
                                                                />
                                                            </div>
                                                        )}
                                                        {pos === 2 && <span className="text-4xl filter drop-shadow-lg scale-110 block transform group-hover:-rotate-12 transition-transform">🥈</span>}
                                                        {pos === 3 && <span className="text-4xl filter drop-shadow-lg block transform group-hover:rotate-6 transition-transform">🥉</span>}
                                                        {pos > 3 && <span className="font-display font-black text-2xl text-muted-foreground/40 group-hover:text-primary/40 transition-colors">#{pos}</span>}
                                                    </div>

                                                    <div className={cn(
                                                        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-xl text-white shadow-xl transition-all relative overflow-hidden ring-4",
                                                        isUser ? "bg-primary shadow-primary/30 ring-white" : "bg-white ring-gray-50 border-2 border-border group-hover:border-primary/20",
                                                        pos === 1 && "ring-yellow-400/30",
                                                        pos === 2 && "ring-slate-400/30",
                                                        pos === 3 && "ring-amber-400/30"
                                                    )}>
                                                        <Avatar
                                                            src={player.profiles?.avatar_url}
                                                            size="lg"
                                                            fallback={player.profiles?.username?.[0] || 'M'}
                                                            className="w-full h-full border-0 rounded-none bg-transparent"
                                                        />
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3">
                                                            <p className={cn("font-black text-xl tracking-tight truncate", isUser ? "text-primary" : "text-foreground")}>
                                                                {isUser ? t("you") : (player.profiles?.username || "Anonymous")}
                                                            </p>
                                                            {isUser && <span className="bg-primary text-white text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full shadow-lg shadow-primary/20">Mate</span>}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {pos <= 3 && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-green-600 bg-green-100/50 px-3 py-1 rounded-full border border-green-200 shadow-sm shadow-green-100">
                                                                    <TrendingUp className="w-3 h-3" /> {t("promotion")}
                                                                </span>
                                                            )}
                                                            {pos >= 8 && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-100/50 px-3 py-1 rounded-full border border-red-200 shadow-sm shadow-red-100">
                                                                    <TrendingDown className="w-3 h-3" /> {t("relegation")}
                                                                </span>
                                                            )}
                                                            {pos > 3 && pos < 8 && (
                                                                <span className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 bg-blue-100/50 px-3 py-1 rounded-full border border-blue-200">
                                                                    <Target className="w-3 h-3" /> Safe Zone
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <div className="flex items-center gap-1.5 font-display font-black text-xl text-foreground">
                                                            <Zap className="w-5 h-5 fill-blue-500 text-blue-500" /> {player.weekly_xp}
                                                        </div>
                                                        <p className="text-[10px] uppercase font-black text-muted-foreground/60 tracking-tighter">{t("totalXpLabel")}</p>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="p-20 text-center flex flex-col items-center gap-4">
                                        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-4xl grayscale opacity-20">🏆</div>
                                        <p className="text-muted-foreground font-bold italic">{t("noRankings")}</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-muted/20 border-t-2 border-border text-center">
                                <p className="text-xs font-bold text-muted-foreground">{t("resetInfo")}</p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

        </div>
    );
}
