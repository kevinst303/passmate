"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Mic,
    Send,
    Volume2,
    VolumeX,
    Sparkles,
    ArrowLeft,
    Loader2,
    ChevronRight,
    Zap,
    Flame,
    MessageCircle,
    X,
    Ear
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Message {
    role: "user" | "assistant" | "system";
    content: string;
}

interface Mistake {
    questions: {
        question_text: string;
    };
}

interface Profile {
    daily_streak: number;
    total_xp: number;
}

interface AITutorClientProps {
    initialMistakes?: Mistake[];
    profile: Profile;
}

export default function AITutorClient({ initialMistakes, profile }: AITutorClientProps) {
    const t = useTranslations("AITutor");
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        if (initialMistakes && initialMistakes.length > 0) {
            const mistakeList = initialMistakes.map(m => `- ${m.questions?.question_text}`).join('\n');
            setMessages([
                { role: "assistant" as const, content: `${t("welcomeMistakes")} \n\n${mistakeList}` }
            ]);
        } else {
            setMessages([
                { role: "assistant" as const, content: t("welcomeDefault") }
            ]);
        }
    }, [initialMistakes, t]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { role: "user" as const, content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await response.text();
                console.error("Non-JSON response received:", text.slice(0, 100));
                throw new Error("Received non-JSON response from server");
            }

            const data = await response.json();

            if (data.content) {
                setMessages(prev => [...prev, { role: "assistant", content: data.content }]);
            } else {
                throw new Error(data.error || "Something went wrong");
            }
        } catch (error: unknown) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: "assistant" as const, content: t("errorConnecting") }]);
        } finally {
            setIsTyping(false);
        }
    };

    const suggestions = [
        t("suggestions.constitution"),
        t("suggestions.trialTest"),
        t("suggestions.aussieSlang"),
        t("suggestions.oath")
    ];

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0 md:pl-28 flex flex-col font-sans">
            {/* Header */}
            <header className="bg-background/80 backdrop-blur-md border-b border-border px-8 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard" className="bg-muted/50 p-2.5 rounded-2xl hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                    </Link>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl shadow-inner relative">
                            🐨
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-display font-black text-foreground leading-tight">Ollie AI</h1>
                            <p className="text-xs font-bold text-green-600 uppercase tracking-widest">{t("activeNow")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-4 mr-4">
                        <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-800 font-black text-xs">
                            <Flame className="w-4 h-4 fill-orange-600 dark:fill-orange-400" /> {profile.daily_streak} {t("dayStreak")}
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-2xl border border-blue-200 dark:border-blue-800 font-black text-xs">
                            <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" /> {profile.total_xp.toLocaleString()} XP
                        </div>
                    </div>
                    <Button variant="ghost" className="rounded-2xl w-11 h-11 border-2 border-border/50 p-0">
                        <Volume2 className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-10 flex flex-col h-[calc(100vh-80px)]">
                {/* Chat Container */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-8 pb-10 pr-2 scrollbar-hide"
                >
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={cn(
                                "flex items-end gap-3",
                                msg.role === "user" ? "flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm",
                                msg.role === "assistant" ? "bg-primary text-white shadow-primary/20" : "bg-muted border border-border/50"
                            )}>
                                {msg.role === "assistant" ? "🐨" : "👤"}
                            </div>
                            <div className={cn(
                                "max-w-[75%] p-6 rounded-[2.5rem] shadow-xl font-medium leading-relaxed tracking-tight text-lg relative",
                                msg.role === "assistant"
                                    ? "bg-card glass text-foreground rounded-bl-none border-2 border-border/10"
                                    : "bg-primary text-white rounded-br-none"
                            )}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-end gap-3"
                        >
                            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-xl shadow-lg shadow-primary/20">
                                🐨
                            </div>
                            <div className="bg-card glass p-6 rounded-[2.5rem] rounded-bl-none shadow-xl border-2 border-border/10 flex gap-1.5">
                                <motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                                <motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                                <motion.span animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2.5 h-2.5 bg-primary rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input Controls */}
                <div className="mt-6 flex flex-col gap-4">
                    <div className="flex gap-2 px-2 overflow-x-auto pb-2 no-scrollbar">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setInput(suggestion)}
                                className="whitespace-nowrap bg-card glass border-2 border-border px-6 py-2.5 rounded-2xl text-sm font-black text-muted-foreground hover:border-primary hover:text-primary transition-all shadow-sm active:scale-95"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>

                    <div className="bg-card glass p-3 rounded-[3.5rem] shadow-2xl border-2 border-border/10 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsSpeaking(true)}
                            className="w-16 h-16 bg-muted rounded-[2.5rem] flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                        >
                            <Mic className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        </button>

                        <form onSubmit={handleSend} className="flex-1 flex items-center gap-3 pr-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={t("chatPlaceholder")}
                                className="flex-1 bg-transparent border-none focus:ring-0 font-bold text-xl placeholder:text-muted-foreground/40"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-30 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/20"
                            >
                                <Send className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Immersive Voice Mode */}
            <AnimatePresence>
                {isSpeaking && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white"
                    >
                        <button
                            onClick={() => setIsSpeaking(false)}
                            className="absolute top-10 right-10 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="relative mb-20">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                                className="absolute inset-0 bg-primary rounded-full blur-[100px] -z-10"
                            />
                            <div className="text-[180px] filter drop-shadow-[0_0_50px_rgba(255,255,255,0.3)]">🐨</div>
                        </div>

                        <div className="text-center space-y-6">
                            <h2 className="text-5xl font-display font-black italic tracking-tight">{t("ollieHearing")}</h2>
                            <p className="text-xl font-bold text-primary animate-pulse">{t("speakNaturally")}</p>
                        </div>

                        <div className="mt-24 flex gap-3 h-20 items-center">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [30, 80, 30], opacity: [0.4, 0.9, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.08 }}
                                    className="w-3 bg-gradient-to-t from-primary to-white/40 rounded-full"
                                />
                            ))}
                        </div>

                        <div className="absolute bottom-16 flex gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                    <Ear className="w-6 h-6" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{t("listening")}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <button
                                    onClick={() => setIsSpeaking(false)}
                                    className="w-14 h-14 bg-red-500/20 rounded-2xl flex items-center justify-center border border-red-500/30 group"
                                >
                                    <X className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-widest text-red-400">{t("cancel")}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Sidebar />
        </div>
    );
}
