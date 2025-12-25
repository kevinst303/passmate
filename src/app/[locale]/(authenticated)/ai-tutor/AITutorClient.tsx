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
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isOllieSpeaking, setIsOllieSpeaking] = useState(false);
    const recognitionRef = useRef<any>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Speech Synthesis (Ollie Speaking)
    const speak = (text: string) => {
        if (!isVoiceMode || typeof window === 'undefined') return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a nice Australian voice if available
        const voices = window.speechSynthesis.getVoices();
        const aussieVoice = voices.find(v => v.lang === 'en-AU' || v.name.includes('Australia'));
        if (aussieVoice) utterance.voice = aussieVoice;

        utterance.pitch = 1.1; // Make Ollie sound a bit more "koala-like"/friendly
        utterance.rate = 1.0;

        utterance.onstart = () => setIsOllieSpeaking(true);
        utterance.onend = () => {
            setIsOllieSpeaking(false);
            if (isVoiceMode) startListening();
        };

        window.speechSynthesis.speak(utterance);
    };

    // Speech Recognition (Ollie Hearing)
    const startListening = () => {
        if (typeof window === 'undefined') return;

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        if (recognitionRef.current) recognitionRef.current.stop();

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-AU';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsSpeaking(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            handleSend(undefined, transcript);
        };
        recognition.onerror = () => setIsSpeaking(false);
        recognition.onend = () => setIsSpeaking(false);

        recognitionRef.current = recognition;
        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsSpeaking(false);
    };

    const handleSend = async (e?: React.FormEvent, overrideInput?: string) => {
        e?.preventDefault();
        const messageText = overrideInput || input;
        if (!messageText.trim() || isTyping) return;

        const userMsg = { role: "user" as const, content: messageText };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);
        if (isVoiceMode) window.speechSynthesis.cancel(); // Stop talking if user sends text

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages })
            });

            const data = await response.json();
            if (data.content) {
                const assistantMsg = { role: "assistant" as const, content: data.content };
                setMessages(prev => [...prev, assistantMsg]);
                if (isVoiceMode) speak(data.content);
            }
        } catch (error) {
            console.error("Chat Error:", error);
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
                    <div className="hidden lg:flex items-center gap-4 mr-4">
                        <div className="flex items-center gap-1.5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-2xl border border-orange-200 dark:border-orange-800 font-black text-xs">
                            <Flame className="w-4 h-4 fill-orange-600 dark:fill-orange-400" /> {profile.daily_streak} {t("dayStreak")}
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-2xl border border-blue-200 dark:border-blue-800 font-black text-xs">
                            <Zap className="w-4 h-4 fill-blue-600 dark:fill-blue-400" /> {profile.total_xp.toLocaleString()} XP
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const newMode = !isVoiceMode;
                            setIsVoiceMode(newMode);
                            if (!newMode) {
                                window.speechSynthesis.cancel();
                                stopListening();
                            }
                        }}
                        className={cn(
                            "flex items-center gap-3 px-5 py-2.5 rounded-2xl border-2 transition-all font-black text-sm active:scale-95 shadow-lg",
                            isVoiceMode
                                ? "bg-primary border-primary text-white shadow-primary/20"
                                : "bg-card border-border text-muted-foreground hover:border-primary/50"
                        )}
                    >
                        {isVoiceMode ? <Volume2 className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                        <span className="hidden sm:inline">{isVoiceMode ? t("voiceMode") : t("textMode")}</span>
                    </button>
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
                                "w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-md border-2",
                                msg.role === "assistant"
                                    ? "bg-white border-primary/20 text-primary"
                                    : "bg-primary border-primary text-white"
                            )}>
                                {msg.role === "assistant" ? "🐨" : "👤"}
                            </div>
                            <div className={cn(
                                "max-w-[85%] sm:max-w-[75%] p-5 sm:p-7 rounded-[2.5rem] shadow-xl font-bold leading-relaxed tracking-tight text-base sm:text-lg relative",
                                msg.role === "assistant"
                                    ? "bg-white/80 backdrop-blur-xl text-foreground rounded-bl-none border border-border shadow-gray-200/50"
                                    : "bg-gradient-to-br from-primary to-primary-dark text-white rounded-br-none shadow-primary/20"
                            )}>
                                {msg.role === "assistant" && (
                                    <div className="absolute -top-3 -left-3">
                                        <Sparkles className="w-6 h-6 text-primary/40" />
                                    </div>
                                )}
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
                            onClick={isSpeaking ? stopListening : startListening}
                            className={cn(
                                "w-16 h-16 rounded-[2.5rem] flex items-center justify-center transition-all group shadow-lg",
                                isSpeaking
                                    ? "bg-red-500 text-white animate-pulse"
                                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            )}
                        >
                            <Mic className={cn("w-7 h-7 transition-transform", isSpeaking ? "scale-110" : "group-hover:scale-110")} />
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

            {/* Immersive Voice Mode Overlay */}
            <AnimatePresence>
                {isVoiceMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white p-6"
                    >
                        <div className="absolute top-10 left-10 flex items-center gap-3">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-white/60">Live Conversation</span>
                        </div>

                        <button
                            onClick={() => setIsVoiceMode(false)}
                            className="absolute top-10 right-10 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-95 border border-white/10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="relative mb-16">
                            <motion.div
                                animate={{
                                    scale: isSpeaking || isOllieSpeaking ? [1, 1.2, 1] : 1,
                                    opacity: isSpeaking || isOllieSpeaking ? [0.1, 0.4, 0.1] : 0.1
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute inset-0 bg-primary rounded-full blur-[100px] -z-10"
                            />
                            <motion.div
                                animate={isOllieSpeaking ? {
                                    y: [0, -10, 0],
                                    rotate: [0, -5, 5, 0]
                                } : {}}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-[160px] sm:text-[200px] filter drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                            >
                                🐨
                            </motion.div>
                        </div>

                        <div className="text-center space-y-4 max-w-sm">
                            <h2 className="text-4xl sm:text-5xl font-display font-black italic tracking-tight">
                                {isOllieSpeaking ? t("ollieSpeaking") : isSpeaking ? t("ollieHearing") : "Ollie is waiting..."}
                            </h2>
                            <p className="text-lg sm:text-xl font-bold text-primary/80 leading-relaxed">
                                {isOllieSpeaking ? "Listening to Ollie's wisdom..." : isSpeaking ? t("speakNaturally") : "Tap the mic or just start talking!"}
                            </p>
                        </div>

                        {/* Visualizer */}
                        <div className="mt-20 flex gap-2 sm:gap-4 h-24 items-center justify-center w-full max-w-md">
                            {[...Array(16)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        height: (isSpeaking || isOllieSpeaking) ? [20, Math.random() * 80 + 20, 20] : 10,
                                        opacity: (isSpeaking || isOllieSpeaking) ? [0.4, 1, 0.4] : 0.2
                                    }}
                                    transition={{
                                        repeat: Infinity,
                                        duration: 0.5,
                                        delay: i * 0.05
                                    }}
                                    className={cn(
                                        "w-2 sm:w-3 rounded-full transition-colors duration-500",
                                        isOllieSpeaking ? "bg-primary" : "bg-white"
                                    )}
                                />
                            ))}
                        </div>

                        <div className="absolute bottom-16 flex items-center gap-8">
                            <div className="flex flex-col items-center gap-3">
                                <button
                                    onClick={isSpeaking ? stopListening : startListening}
                                    className={cn(
                                        "w-20 h-20 rounded-full flex items-center justify-center transition-all border-2 shadow-2xl active:scale-90",
                                        isSpeaking
                                            ? "bg-red-500 border-red-400 text-white animate-pulse"
                                            : "bg-white border-white text-black hover:scale-105"
                                    )}
                                >
                                    {isSpeaking ? <Mic className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                                </button>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                    {isSpeaking ? t("listening") : "Tap to Speak"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
