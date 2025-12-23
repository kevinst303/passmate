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
    MoreVertical,
    Check,
    X,
    Loader2,
    Trophy,
    Sparkles
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, removeFriend, searchUsers } from "@/app/actions/friends";
import { createChallenge } from "@/app/actions/challenges";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface FriendsClientProps {
    initialData: any;
    profile: any;
}

export default function FriendsClient({ initialData, profile }: FriendsClientProps) {
    const { friends, pendingRequests, pendingReceived = [], pendingSent = [], completed = [] } = initialData;
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
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
            setSuccess(`Request sent to ${username}!`);
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
        if (!confirm("Are you sure you want to remove this mate?")) return;

        setIsActionLoading(friendshipId);
        const result = await removeFriend(friendshipId);
        if (!result.error) {
            router.refresh();
        }
        setIsActionLoading(null);
    };

    const handleBattle = async (friendId: string) => {
        setIsActionLoading(friendId);
        const result = await createChallenge(friendId);
        if (result.success && result.challenge) {
            router.push(`/dashboard/quiz?type=battle&challengeId=${result.challenge.id}`);
        } else {
            setError(result.error || "Failed to start battle");
        }
        setIsActionLoading(null);
    };

    return (
        <div className="min-h-screen bg-muted/30 pb-24 md:pb-0 md:pl-20">
            <header className="bg-white border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <Link href="/dashboard" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-5 h-5" /> <span className="font-bold">Dashboard</span>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold text-sm">
                        <Flame className="w-4 h-4 fill-orange-600" /> {profile.daily_streak}
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
                        <Zap className="w-4 h-4 fill-blue-600" /> {profile.total_xp}
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
                                placeholder="Find mates by username..."
                                className="w-full bg-white border-2 border-border rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
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
                                className="absolute z-20 w-full bg-white mt-1 rounded-2xl border-2 border-border shadow-2xl overflow-hidden"
                            >
                                {searchResults.map((user) => (
                                    <div key={user.id} className="p-3 hover:bg-muted/50 flex items-center justify-between border-b border-muted last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-xl">
                                                {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover rounded-xl" /> : "👤"}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <p className="font-bold text-sm">{user.username}</p>
                                                    {user.is_premium && (
                                                        <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">Level {user.level}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleAddFriend(user.username)}
                                            disabled={isActionLoading === user.username}
                                        >
                                            {isActionLoading === user.username ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4 mr-2" />}
                                            Add
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
                            <Zap className="w-5 h-5 text-orange-500 fill-orange-500" /> Pending Battles
                        </h3>
                        <div className="grid gap-4">
                            {pendingReceived.map((challenge: any) => (
                                <div key={challenge.id} className="bg-orange-50 p-5 rounded-[2.5rem] border-2 border-orange-200 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                                            {challenge.challenger?.avatar_url ? <img src={challenge.challenger.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : "⚔️"}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{challenge.challenger?.username}</p>
                                            <p className="text-sm font-medium text-orange-700">Challenged you to a battle!</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            className="rounded-xl border-2 bg-orange-600 hover:bg-orange-700 shadow-[0_4px_0_#9a3412]"
                                            onClick={() => router.push(`/dashboard/quiz?type=battle&challengeId=${challenge.id}`)}
                                        >
                                            <Zap className="w-4 h-4 mr-2" /> {challenge.challenged_played ? "Improve Score" : "Fight!"}
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
                            <Loader2 className="w-5 h-5" /> Waiting for Mates
                        </h3>
                        <div className="grid gap-4 opacity-75">
                            {pendingSent.map((challenge: any) => (
                                <div key={challenge.id} className="bg-white p-5 rounded-[2.5rem] border-2 border-border flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-2xl grayscale">
                                            {challenge.challenged?.avatar_url ? <img src={challenge.challenged.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : "👤"}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{challenge.challenged?.username}</p>
                                            <p className="text-sm font-medium text-muted-foreground">
                                                {challenge.challenger_played ? "Your turn done! Waiting..." : "Challenge sent!"}
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
                                            Finish your part
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
                            <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Recent Results
                        </h3>
                        <div className="grid gap-4">
                            {completed.map((battle: any) => {
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
                                                    {isWinner ? "You won!" : isDraw ? "It's a draw!" : "Mangled..."}
                                                </p>
                                                <p className="text-sm font-medium opacity-70">
                                                    vs {opponent?.username} • {myScore}:{opScore}
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/dashboard/quiz?type=battle&challengeId=${battle.id}`}>
                                            <Button variant="ghost" size="sm" className="rounded-xl">Rematch?</Button>
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
                            <Mail className="w-5 h-5 text-blue-500 fill-blue-500" /> Friend Requests
                        </h3>
                        <div className="grid gap-4">
                            {pendingRequests.map((req: any) => (
                                <div key={req.id} className="bg-white p-5 rounded-[2.5rem] border-2 border-border flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-2xl">
                                            {req.user?.avatar_url ? <img src={req.user.avatar_url} className="w-full h-full object-cover rounded-2xl" /> : "👤"}
                                        </div>
                                        <div>
                                            <p className="font-black text-lg">{req.user?.username}</p>
                                            <p className="text-sm font-medium text-muted-foreground">Wants to be mates!</p>
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
                                            Accept
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
                            <Users className="w-5 h-5 text-primary" /> Your Mates
                        </h3>
                        <span className="text-sm font-bold text-muted-foreground">{friends.length} Friends</span>
                    </div>

                    <div className="grid gap-4">
                        {friends.map((friend: any) => (
                            <motion.div
                                key={friend.id}
                                whileHover={{ y: -2 }}
                                className="bg-white p-6 rounded-[2.5rem] border-2 border-border shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all"
                            >
                                <div className="relative">
                                    <div className="w-16 h-16 bg-muted rounded-[1.5rem] flex items-center justify-center text-4xl shadow-inner group-hover:bg-primary/5 transition-colors overflow-hidden">
                                        {friend.avatar_url ? <img src={friend.avatar_url} className="w-full h-full object-cover" /> : "👤"}
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
                                            Level {friend.level}
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
                                        <MessageCircle className="w-4 h-4" /> Chat
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="hidden md:flex items-center gap-2"
                                        onClick={() => handleBattle(friend.id)}
                                        disabled={isActionLoading === friend.id}
                                    >
                                        {isActionLoading === friend.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Battle
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
                            <p className="text-muted-foreground font-bold italic">No mates yet? Add some by username above! 🐨</p>
                        </div>
                    )}
                </section>

                {/* Global Mate Search CTA */}
                <section className="bg-white p-10 rounded-[4rem] border-2 border-border shadow-sm text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 scale-110">
                        🐨
                    </div>
                    <h2 className="text-2xl font-display font-black">Invite your mates!</h2>
                    <p className="text-muted-foreground font-bold max-w-sm mx-auto">
                        Learning is better with friends. Invite someone to join PassMate and compete together!
                    </p>
                    <Button variant="secondary" className="px-12 py-4 h-auto text-lg flex items-center gap-2 mx-auto">
                        <Mail className="w-5 h-5" /> Send Invites
                    </Button>
                </section>
            </main>

            <Sidebar />
        </div>
    );
}
