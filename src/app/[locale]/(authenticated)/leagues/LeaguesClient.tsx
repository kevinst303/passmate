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

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8 font-sans">
            {/* Header */}
            <header className="max-w-4xl mx-auto pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold group mb-4 text-sm">
                        <div className="bg-card glass p-2 rounded-xl border-2 border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span>{t("backDashboard")}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className={cn("w-20 h-20 bg-gradient-to-br rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl", currentLeague.color, currentLeague.shadow)}>
                            <Trophy className="w-10 h-10 fill-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-black text-foreground tracking-tight">{currentLeague.name} {nav("leagues")}</h1>
                            <p className="text-muted-foreground font-bold italic">{t("competingDesc")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-2xl border-2 border-orange-200 dark:border-orange-800 font-black text-sm">
                        <Flame className="w-4 h-4 fill-orange-600 dark:fill-orange-400" /> {profile.daily_streak}
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-2xl border-2 border-blue-200 dark:border-blue-800 font-black text-sm">
                        <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" /> {profile.total_xp}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column: Player Status */}
                    <div className="space-y-6">
                        <section className="bg-card glass p-8 rounded-[3rem] border-2 border-border shadow-xl text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-20">
                                <Target className="w-24 h-24" />
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

                        <section className="bg-gradient-to-br from-primary to-primary-light p-8 rounded-[3rem] text-white shadow-xl shadow-primary/20">
                            <h3 className="text-xl font-display font-black mb-2">{t("boostRank")}</h3>
                            <p className="text-primary-foreground/80 font-bold text-sm mb-6">{t("boostRankDesc")}</p>
                            <Link href="/dashboard/quiz">
                                <Button variant="secondary" className="w-full bg-white text-primary hover:bg-white/90">{t("getMoreXP")}</Button>
                            </Link>
                        </section>
                    </div>

                    {/* Right Column: Leaderboard */}
                    <div className="md:col-span-2">
                        <section className="bg-card glass rounded-[3.5rem] border-2 border-border shadow-2xl overflow-hidden flex flex-col h-full">
                            <div className="p-8 border-b-2 border-border flex justify-between items-center bg-muted/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <h3 className="text-2xl font-display font-black">{t("topPerformers")}</h3>
                                </div>
                                <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                                    <Zap className="w-3 h-3 fill-blue-700" /> {t("weeklyStandings")}
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
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    className={cn(
                                                        "flex items-center gap-4 px-8 py-6 transition-all group",
                                                        isUser ? "bg-primary/5 sticky top-0 z-10" : "hover:bg-muted/30"
                                                    )}
                                                >
                                                    <div className="w-10 flex justify-center shrink-0">
                                                        {pos === 1 && <span className="text-3xl filter drop-shadow-sm">🥇</span>}
                                                        {pos === 2 && <span className="text-3xl filter drop-shadow-sm">🥈</span>}
                                                        {pos === 3 && <span className="text-3xl filter drop-shadow-sm">🥉</span>}
                                                        {pos > 3 && <span className="font-display font-black text-muted-foreground group-hover:text-foreground transition-colors">#{pos}</span>}
                                                    </div>

                                                    <div className={cn(
                                                        "w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-xl transition-transform group-hover:rotate-3 relative overflow-hidden",
                                                        isUser ? "bg-primary shadow-primary/20 ring-4 ring-background" : "bg-muted border-4 border-background"
                                                    )}>
                                                        <Avatar
                                                            src={player.profiles?.avatar_url}
                                                            size="lg"
                                                            fallback={player.profiles?.username?.[0] || 'M'}
                                                            className="w-full h-full border-0 rounded-none bg-transparent"
                                                        />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className={cn("font-black text-lg", isUser ? "text-primary" : "text-foreground")}>
                                                                {isUser ? t("you") : (player.profiles?.username || "Anonymous")}
                                                            </p>
                                                            {isUser && <span className="bg-primary/10 text-primary text-[10px] uppercase font-black px-2 py-0.5 rounded-full ring-1 ring-primary/20">Mate</span>}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            {pos <= 3 && (
                                                                <span className="flex items-center gap-1 text-[8px] uppercase font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                                    <TrendingUp className="w-2.5 h-2.5" /> {t("promotion")}
                                                                </span>
                                                            )}
                                                            {pos > 7 && (
                                                                <span className="flex items-center gap-1 text-[8px] uppercase font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                                                    <TrendingDown className="w-2.5 h-2.5" /> {t("relegation")}
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
