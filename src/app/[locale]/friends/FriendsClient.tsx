"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users,
    UserPlus,
    Search,
    Flame,
    Zap,
    MessageCircle,
    ArrowLeft,
    Mail,
    Check,
    X,
    Loader2,
    Trophy,
    Sparkles
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, searchUsers } from "@/app/actions/friends";
import { createChallenge } from "@/app/actions/challenges";
import { useRouter } from "@/i18n/routing";
import { useEffect } from "react";

export interface FriendProfile {
    id: string;
    username: string;
    full_name: string | null;
    avatar_url: string | null;
    is_premium: boolean;
    level: number;
    daily_streak: number;
    total_xp: number;
    status: 'online' | 'offline';
    friendship_id: string;
}

export interface User {
    id: string;
    username: string;
    avatar_url: string | null;
    is_premium: boolean;
    level: number;
}

export interface Challenge {
    id: string;
    challenger_id: string;
    challenged_id: string;
    challenger_score: number | null;
    challenged_score: number | null;
    challenger_played: boolean;
    challenged_played: boolean;
    winner_id: string | null;
    challenger?: { username: string; avatar_url: string | null };
    challenged?: { username: string; avatar_url: string | null };
}

export interface FriendRequest {
    id: string;
    user: {
        username: string;
        avatar_url: string | null;
    };
}

interface FriendsClientProps {
    initialData: {
        friends: FriendProfile[];
        pendingReceived: Challenge[];
        pendingSent: Challenge[];
        completed: Challenge[];
        pendingRequests: FriendRequest[];
        error?: string;
    };
    profile: {
        daily_streak: number;
        total_xp: number;
        id: string;
    };
}

export default function FriendsClient({ initialData, profile }: FriendsClientProps) {
    const t = useTranslations("Friends");
    const common = useTranslations("Common");

    const {
        friends = [],
        pendingRequests = [],
        pendingReceived = [],
        pendingSent = [],
        completed = []
    } = initialData;

    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(initialData.error || null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsSearching(true);
                const { users } = await searchUsers(searchQuery);
                setSearchResults(users || []);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAddFriend = async (username: string) => {
        setIsActionLoading(username);
        setError(null);
        setSuccess(null);

        const result = await sendFriendRequest(username);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess(t("requestSent", { username }));
            setSearchQuery("");
            setSearchResults([]);
            router.refresh();
        }
        setIsActionLoading(null);
    };

    const handleAccept = async (requestId: string) => {
        setIsActionLoading(requestId);
        const result = await acceptFriendRequest(requestId);
        if (!result.error) {
            router.refresh();
        }
        setIsActionLoading(null);
    };

    const handleReject = async (requestId: string) => {
        setIsActionLoading(requestId);
        const result = await rejectFriendRequest(requestId);
        if (!result.error) {
            router.refresh();
        }
        setIsActionLoading(null);
    };

    const handleRemove = async (friendshipId: string) => {
        if (!confirm(t("removeConfirm"))) return;

        setIsActionLoading(friendshipId);
        const result = await removeFriend(friendshipId);
        if (!result.error) {
            router.refresh();
        }
        setIsActionLoading(null);
    };

    const handleInvite = async () => {
        const inviteData = {
            title: 'Join me on PassMate!',
            text: 'I\'m using PassMate to study for my Australian Citizenship test. Join me and let\'s compete!',
            url: window.location.origin
        };

        if (navigator.share) {
            try {
                await navigator.share(inviteData);
            } catch (err) {
                // AbortError is expected when user cancels the share dialog - ignore it
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Error sharing:', err);
                }
            }
        } else {
            try {
                await navigator.clipboard.writeText(inviteData.url);
                setSuccess(t("linkCopied") || "Invite link copied to clipboard!");
            } catch (err) {
                setError("Failed to copy link");
            }
        }
    };

    const handleBattle = async (friendId: string) => {
        setIsActionLoading(friendId);
        const result = await createChallenge(friendId);
        if (result.success && result.challenge) {
            router.push(`/dashboard/quiz?type=battle&challengeId=${result.challenge.id}`);
        } else {
            setError(result.error || t("battleStartError"));
        }
        setIsActionLoading(null);
    };

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-20 font-sans">
            <header className="bg-card glass border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" /> <span className="font-bold">{t("backDashboard")}</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full font-bold text-sm">
                        <Flame className="w-4 h-4 fill-orange-600 dark:fill-orange-400" /> {profile.daily_streak}
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full font-bold text-sm">
                        <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" /> {profile.total_xp}
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-8">
                {/* Search & Add Friends */}
                <div className="relative space-y-2">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t("searchPlaceholder")}
                                className="w-full bg-card glass border-2 border-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
                            />
                            {isSearching && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Search Results Dropdown */}
                    <AnimatePresence>
                        {searchResults.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-20 w-full bg-card glass mt-1 rounded-2xl border-2 border-border shadow-2xl overflow-hidden"
                            >
                                {searchResults.map((user) => (
                                    <div key={user.id} className="p-3 hover:bg-muted/50 flex items-center justify-between border-b border-muted last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl overflow-hidden relative">
                                                <Avatar
                                                    src={user.avatar_url}
                                                    size="sm"
                                                    fallback="👤"
                                                    className="w-full h-full border-0 rounded-none bg-transparent"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-bold text-sm">{user.username}</p>
                                                    {user.is_premium && (
                                                        <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{common("level", { level: user.level })}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddFriend(user.username)}
                                            disabled={isActionLoading === user.username}
                                        >
                                            {isActionLoading === user.username ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                            {t("add")}
                                        </Button>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 font-bold text-sm"
                        >
                            {error}
                        </motion.div>
                    )}
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-4 bg-green-50 text-green-600 rounded-2xl border border-green-100 font-bold text-sm"
                        >
                            {success}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Active Battles (Pending Received) */}
                {pendingReceived.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xl font-display font-black px-2 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> {t("pendingBattles")}
                        </h3>
                        <div className="grid gap-4">
                            {pendingReceived.map((challenge: Challenge) => (
                                <div key={challenge.id} className="bg-orange-500/10 dark:bg-orange-950/20 p-5 rounded-[2.5rem] border-2 border-orange-500/20 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-border/50 overflow-hidden relative">
                                            <Avatar
                                                src={challenge.challenger?.avatar_url}
                                                size="md"
                                                fallback="⚔️"
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{challenge.challenger?.username}</p>
                                            <p className="text-sm font-medium text-orange-700">{t("challengedYou")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="rounded-xl border-2 bg-orange-600 hover:bg-orange-700 shadow-[0_4px_0_#9a3412]"
                                            onClick={() => router.push(`/dashboard/quiz?type=battle&challengeId=${challenge.id}`)}
                                        >
                                            <Zap className="w-4 h-4 mr-2" /> {challenge.challenged_played ? t("improveScore") : t("fight")}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Waiting for Opponent (Pending Sent) */}
                {pendingSent.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xl font-display font-black px-2 flex items-center gap-2 text-muted-foreground">
                            <Loader2 className="w-5 h-5" /> {t("waitingMates")}
                        </h3>
                        <div className="grid gap-4 opacity-75">
                            {pendingSent.map((challenge: Challenge) => (
                                <div key={challenge.id} className="bg-card glass p-5 rounded-[2.5rem] border-2 border-border flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-2xl grayscale overflow-hidden relative">
                                            <Avatar
                                                src={challenge.challenged?.avatar_url}
                                                size="md"
                                                fallback="👤"
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{challenge.challenged?.username}</p>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {challenge.challenger_played ? t("yourTurnDone") : t("challengeSent")}
                                            </p>
                                        </div>
                                    </div>
                                    {!challenge.challenger_played && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl"
                                            onClick={() => router.push(`/dashboard/quiz?type=battle&challengeId=${challenge.id}`)}
                                        >
                                            {t("finishPart")}
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Results */}
                {completed.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xl font-display font-black px-2 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500" /> {t("recentResults")}
                        </h3>
                        <div className="grid gap-4">
                            {completed.map((battle: Challenge) => {
                                const isWinner = battle.winner_id === profile.id;
                                const isDraw = battle.winner_id === null;
                                const opponent = battle.challenger_id === profile.id ? battle.challenged : battle.challenger;
                                const myScore = battle.challenger_id === profile.id ? battle.challenger_score : battle.challenged_score;
                                const opScore = battle.challenger_id === profile.id ? battle.challenged_score : battle.challenger_score;

                                return (
                                    <div key={battle.id} className={cn(
                                        "p-5 rounded-[2.5rem] border-2 flex items-center justify-between shadow-sm",
                                        isWinner ? "bg-green-50 border-green-200" : isDraw ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"
                                    )}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-3xl">
                                                {isWinner ? "👑" : isDraw ? "🤝" : "💀"}
                                            </div>
                                            <div>
                                                <p className="font-black text-lg">
                                                    {isWinner ? t("won") : isDraw ? t("draw") : t("lost")}
                                                </p>
                                                <p className="text-sm font-medium opacity-70">
                                                    {t("versus", { username: opponent?.username || "mate", score1: myScore ?? 0, score2: opScore ?? 0 })}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/quiz?type=battle&challengeId=${battle.id}`}>
                                            <Button variant="ghost" size="sm" className="rounded-xl">{t("rematch")}</Button>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <section className="space-y-4">
                        <h3 className="text-xl font-display font-black px-2 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-500 fill-blue-500" /> {t("friendRequests")}
                        </h3>
                        <div className="grid gap-4">
                            {pendingRequests.map((req: FriendRequest) => (
                                <div key={req.id} className="bg-card glass p-5 rounded-[2.5rem] border-2 border-border flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl overflow-hidden relative">
                                            <Avatar
                                                src={req.user?.avatar_url}
                                                size="md"
                                                fallback="👤"
                                                className="w-full h-full border-0 rounded-none bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{req.user?.username}</p>
                                            <p className="text-sm font-medium text-muted-foreground">{t("wantsToBeMates")}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="rounded-xl border-2 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                                            onClick={() => handleAccept(req.id)}
                                            disabled={isActionLoading === req.id}
                                        >
                                            {isActionLoading === req.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                                            {t("accept")}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="rounded-xl hover:bg-red-50 hover:text-red-600"
                                            onClick={() => handleReject(req.id)}
                                            disabled={isActionLoading === req.id}
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Friends List */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-display font-black flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" /> {t("yourMates")}
                        </h3>
                        <span className="text-sm font-bold text-muted-foreground">{t("friendsCount", { count: friends.length })}</span>
                    </div>

                    <div className="grid gap-4">
                        {friends.map((friend: FriendProfile) => (
                            <motion.div
                                key={friend.id}
                                whileHover={{ y: -2 }}
                                className="bg-card glass p-6 rounded-[2.5rem] border-2 border-border shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:bg-primary/5 transition-colors overflow-hidden relative">
                                        <Avatar
                                            src={friend.avatar_url}
                                            size="lg"
                                            fallback="👤"
                                            className="w-full h-full border-0 rounded-none bg-transparent"
                                        />
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                                        friend.status === "online" ? "bg-green-500" : "bg-muted-foreground"
                                    )} />
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-lg font-black">{friend.full_name || friend.username}</h4>
                                        {friend.is_premium && (
                                            <div className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 border border-yellow-200">
                                                <Sparkles className="w-2.5 h-2.5 fill-yellow-600" /> Pro
                                            </div>
                                        )}
                                        <span className="text-[10px] font-black uppercase bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                            {common("level", { level: friend.level })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1 text-sm font-bold text-orange-600">
                                            <Flame className="w-3.5 h-3.5 fill-orange-600" /> {friend.daily_streak}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-bold text-blue-600">
                                            <Zap className="w-3.5 h-3.5 fill-blue-600" /> {friend.total_xp.toLocaleString()} XP
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2 border-primary/20 text-primary">
                                        <MessageCircle className="w-4 h-4" /> {t("chat")}
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="hidden md:flex items-center gap-2"
                                        onClick={() => handleBattle(friend.id)}
                                        disabled={isActionLoading === friend.id}
                                    >
                                        {isActionLoading === friend.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} {t("battle")}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"
                                        onClick={() => handleRemove(friend.friendship_id)}
                                        disabled={isActionLoading === friend.friendship_id}
                                    >
                                        {isActionLoading === friend.friendship_id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    {friends.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-[3rem] border-2 border-dashed border-border/50">
                            <p className="text-muted-foreground font-bold italic">{t("noFriends")}</p>
                        </div>
                    )}
                </section>

                {/* Global Mate Search CTA */}
                <section className="bg-card glass p-10 rounded-[4rem] border-2 border-border shadow-sm text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 scale-110">
                        🐨
                    </div>
                    <h2 className="text-2xl font-display font-black">{t("inviteTitle")}</h2>
                    <p className="text-muted-foreground font-bold max-w-sm mx-auto">
                        {t("inviteDesc")}
                    </p>
                    <Button
                        variant="secondary"
                        className="px-12 py-4 h-auto text-lg flex items-center gap-2 mx-auto"
                        onClick={handleInvite}
                    >
                        <Mail className="w-5 h-5" /> {t("sendInvites")}
                    </Button>
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
