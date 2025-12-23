"use client";

import { motion } from "framer-motion";
import {
    Users,
    Gift,
    Share2,
    Copy,
    Check,
    ArrowLeft,
    Zap,
    Trophy,
    Award,
    TrendingUp,
    MessageCircle,
    Twitter,
    Facebook
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Sidebar } from "@/components/Sidebar";
import { useState } from "react";

interface ReferralClientProps {
    data: any;
}

export default function ReferralClient({ data }: ReferralClientProps) {
    const { profile } = data;
    const [copied, setCopied] = useState(false);

    const referralCode = profile.id.split('-')[0].toUpperCase();
    const referralLink = `https://passmate.com.au/signup?ref=${referralCode}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareStats = [
        { label: "Friends Referred", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { label: "XP Earned", value: "0", icon: Zap, color: "text-orange-500", bg: "bg-orange-50" },
        { label: "Badges Unlocked", value: "0", icon: Award, color: "text-purple-500", bg: "bg-purple-50" }
    ];

    const rewards = [
        { friends: 1, reward: "500 XP Bonus", badge: "Friendly Neighbor" },
        { friends: 5, reward: "1,000 XP + Rare Badge", badge: "Community Leader" },
        { friends: 10, reward: "1 Month Premium Free", badge: "National Icon" }
    ];

    return (
        <div className="min-h-screen bg-[#FDFCFB] pb-24 md:pb-8 md:pl-28 md:pr-8">
            <main className="max-w-5xl mx-auto py-8 px-4">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Profile
                </Link>

                <div className="grid lg:grid-cols-5 gap-10">
                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-10">
                        {/* Hero Card */}
                        <section className="bg-primary rounded-[4rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-white/15 transition-colors" />

                            <div className="relative z-10">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-4xl mb-8">
                                    🎁
                                </div>
                                <h1 className="text-4xl md:text-5xl font-display font-black mb-6 leading-tight">
                                    Spread the word, <br />earn the rewards!
                                </h1>
                                <p className="text-xl text-white/80 font-bold mb-10 max-w-md">
                                    Help your mates pass their citizenship test and earn massive XP bonuses and exclusive badges.
                                </p>

                                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex-1 w-full">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2 ml-1">Your Referral link</p>
                                        <div className="bg-black/20 border border-white/10 rounded-2xl py-4 px-5 font-mono text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                                            {referralLink}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={copyToClipboard}
                                        className="w-full md:w-auto bg-white text-primary hover:bg-white/90 h-16 px-8 rounded-2xl font-black text-lg transition-transform active:scale-95"
                                    >
                                        {copied ? <><Check className="w-5 h-5 mr-2" /> Copied!</> : <><Copy className="w-5 h-5 mr-2" /> Copy Link</>}
                                    </Button>
                                </div>
                            </div>
                        </section>

                        {/* Rewards Progress */}
                        <section className="bg-white rounded-[3.5rem] border-2 border-border p-10 shadow-xl">
                            <h3 className="text-2xl font-display font-black mb-10 flex items-center gap-3">
                                <Trophy className="w-6 h-6 text-yellow-500" /> Referral Milestone Rewards
                            </h3>

                            <div className="space-y-8">
                                {rewards.map((r, i) => (
                                    <div key={i} className="relative">
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center text-2xl border-2 border-border shrink-0">
                                                {i === 0 ? "🥉" : i === 1 ? "🥈" : "🥇"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-black text-lg">{r.reward}</h4>
                                                    <span className="text-sm font-black text-muted-foreground">{r.friends} Friends</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-bold italic">Unlock badge: {r.badge}</p>
                                            </div>
                                        </div>
                                        <div className="h-3 bg-muted rounded-full overflow-hidden border border-border/50">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: "0%" }} // No actual progress yet
                                                className="h-full bg-primary"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar / Stats */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Referral Stats */}
                        <section className="bg-white rounded-[3rem] border-2 border-border p-10 shadow-xl">
                            <h3 className="text-xl font-display font-black mb-8">Performance</h3>
                            <div className="space-y-6">
                                {shareStats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-5 group">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${stat.bg}`}>
                                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-display font-black leading-none mb-1">{stat.value}</p>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10 pt-8 border-t-2 border-dashed border-border text-center">
                                <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-4 py-2 rounded-full text-xs font-black mb-4">
                                    <TrendingUp className="w-4 h-4" /> Top 10% Referrer
                                </div>
                                <p className="text-xs text-muted-foreground font-bold italic">Keep sharing to climb the global leaderboard!</p>
                            </div>
                        </section>

                        {/* Social Share Grid */}
                        <section className="bg-white rounded-[3rem] border-2 border-border p-10 shadow-xl">
                            <h3 className="text-xl font-display font-black mb-8 flex items-center gap-3">
                                <Share2 className="w-5 h-5 text-primary" /> Quick Share
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="flex items-center justify-center gap-3 bg-blue-600 text-white h-14 rounded-2xl font-black hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
                                    <Facebook className="w-5 h-5" /> Meta
                                </button>
                                <button className="flex items-center justify-center gap-3 bg-black text-white h-14 rounded-2xl font-black hover:bg-black/80 transition-colors shadow-lg shadow-gray-200">
                                    <Twitter className="w-5 h-5" /> X.com
                                </button>
                                <button className="col-span-2 flex items-center justify-center gap-3 bg-green-600 text-white h-14 rounded-2xl font-black hover:bg-green-700 transition-colors shadow-lg shadow-green-100">
                                    <MessageCircle className="w-5 h-5" /> WhatsApp
                                </button>
                            </div>
                        </section>

                        {/* FAQ Box */}
                        <div className="bg-muted/30 rounded-[2.5rem] p-8 border-2 border-border/50">
                            <h4 className="font-black mb-3">How it works?</h4>
                            <p className="text-sm text-muted-foreground font-bold leading-relaxed">
                                When your mates sign up using your link, you both get 200 XP instantly. If they upgrade to Premium, you get a massive 2000 XP bonus!
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Sidebar />
        </div>
    );
}
