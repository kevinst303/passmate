"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    PlayCircle,
    CheckCircle2,
    Lock,
    ArrowLeft,
    Sparkles,
    BookOpen,
    Trophy,
    Star,
    Loader2,
    X
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { flagMasterclassComplete } from "@/app/actions/masterclass";
import { useTranslations } from "next-intl";


interface Module {
    id: string;
    title: string;
    length: string;
    status: string;
    description: string;
}

export default function MasterclassClient({ profile, initialCompleted = [] }: { profile: unknown, initialCompleted?: string[] }) {
    const t = useTranslations("Masterclass");
    const [activeVideo, setActiveVideo] = useState<Module | null>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completedModules, setCompletedModules] = useState<string[]>(initialCompleted);

    const modules: Module[] = [
        {
            id: "m1",
            title: t("modules.m1.title"),
            length: "15:20",
            status: completedModules.includes("m1") ? "completed" : "unlocked",
            description: t("modules.m1.desc")
        },
        {
            id: "m2",
            title: t("modules.m2.title"),
            length: "22:45",
            status: completedModules.includes("m2") ? "completed" :
                completedModules.includes("m1") ? "unlocked" : "locked",
            description: t("modules.m2.desc")
        },
        {
            id: "m3",
            title: t("modules.m3.title"),
            length: "18:10",
            status: completedModules.includes("m3") ? "completed" :
                completedModules.includes("m2") ? "unlocked" : "locked",
            description: t("modules.m3.desc")
        },
        {
            id: "m4",
            title: t("modules.m4.title"),
            length: "30:00",
            status: completedModules.includes("m4") ? "completed" :
                completedModules.includes("m3") ? "unlocked" : "locked",
            description: t("modules.m4.desc")
        }
    ];

    const handleWatch = (module: Module) => {
        setActiveVideo(module);
    };

    const handleComplete = async () => {
        if (!activeVideo) return;
        setIsCompleting(true);

        try {
            const result = await flagMasterclassComplete(activeVideo.id);
            if (result.success) {
                setCompletedModules(prev => [...prev, activeVideo.id]);
                setActiveVideo(null);
            }
        } catch (error) {
            console.error("Masterclass error:", error);
        } finally {
            setIsCompleting(false);
        }
    };

    const nextModule = modules.find(m => m.status === 'unlocked');
    const progress = Math.round((completedModules.length / modules.length) * 100);

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8 transition-colors duration-500">
            <header className="max-w-5xl mx-auto pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold group mb-4 text-sm">
                        <div className="bg-card p-2 rounded-xl border border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all shadow-sm">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span>{t("backDashboard")}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-yellow-500/20 dark:shadow-yellow-500/10">
                            <Trophy className="w-8 h-8 md:w-10 md:h-10 fill-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-display font-black text-foreground tracking-tight">{t("title")}</h1>
                            <p className="text-yellow-600 dark:text-yellow-500 font-bold italic flex items-center gap-2 text-sm md:text-base">
                                <Sparkles className="w-4 h-4" /> {t("exclusive")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass p-4 rounded-3xl border border-border/50 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-500/20 rounded-2xl flex items-center justify-center text-xl">🎓</div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{t("yourProgress")}</p>
                        <p className="font-display font-black text-yellow-700 dark:text-yellow-500">{t("percentComplete", { percent: progress })}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-8 space-y-12 px-4 md:px-0">
                {/* Hero Feature */}
                <section className="relative h-[300px] md:h-[400px] rounded-[3rem] md:rounded-[4rem] overflow-hidden group shadow-2xl border-4 border-card">
                    <img
                        src="https://images.unsplash.com/photo-1523438097201-512ae7d59c44?auto=format&fit=crop&w=1200&q=80"
                        alt="Sydney Opera House"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-2">{t("nextUp")}</div>
                            <h2 className="text-foreground text-3xl md:text-4xl font-display font-black">{nextModule?.title || t("courseCompleted")}</h2>
                            <p className="text-muted-foreground font-bold max-w-lg italic text-sm md:text-base">{t("heroDesc")}</p>
                        </div>
                        <Button
                            size="lg"
                            className="h-16 md:h-20 px-8 md:px-10 rounded-2xl md:rounded-[2.5rem] bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-black text-lg md:text-xl shadow-xl shadow-yellow-500/20 hover:scale-105 transition-all flex gap-3 border-none"
                            onClick={() => nextModule && handleWatch(nextModule)}
                            disabled={!nextModule}
                        >
                            <PlayCircle className="w-6 h-6 md:w-8 md:h-8" /> {t("resumeModule")}
                        </Button>
                    </div>
                </section>

                {/* Modules Grid */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-display font-black px-4">{t("curriculum")}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {modules.map((module, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border transition-all group flex flex-col md:flex-row items-center gap-6 md:gap-8",
                                    module.status === 'locked'
                                        ? "bg-muted/30 border-border/50 opacity-60"
                                        : "glass border-border/50 hover:border-yellow-400/50 hover:shadow-xl dark:hover:shadow-yellow-500/5"
                                )}
                            >
                                <div className={cn(
                                    "w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-2xl md:text-3xl shrink-0 shadow-sm",
                                    module.status === 'completed' ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" :
                                        module.status === 'unlocked' ? "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400" : "bg-muted text-muted-foreground"
                                )}>
                                    {module.status === 'completed' ? <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" /> :
                                        module.status === 'unlocked' ? <PlayCircle className="w-8 h-8 md:w-10 md:h-10" /> : <Lock className="w-6 h-6 md:w-8 md:h-8" />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-lg md:text-xl font-display font-black text-foreground mb-1">{module.title}</h4>
                                    <p className="text-muted-foreground font-bold text-xs md:text-sm mb-2">{module.description}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] md:text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {module.length} {t("video")}</span>
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {t("xpReward", { xp: 500 })}</span>
                                    </div>
                                </div>
                                {module.status !== 'locked' && (
                                    <Button
                                        variant="outline"
                                        className="h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl font-black border-2 border-border group-hover:border-yellow-400 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-all font-display text-sm md:text-base"
                                        onClick={() => handleWatch(module)}
                                    >
                                        {module.status === 'completed' ? t("watchAgain") : t("startVideo")}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Mock Video Player Modal */}
            <AnimatePresence>
                {activeVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                    >
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-6 right-6 md:top-10 md:right-10 w-10 h-10 md:w-12 md:h-12 glass rounded-full flex items-center justify-center text-foreground hover:bg-card transition-colors shadow-lg"
                        >
                            <X className="w-5 h-5 md:w-6 md:h-6" />
                        </button>

                        <div className="max-w-4xl w-full aspect-video bg-zinc-950 rounded-2xl md:rounded-[2.5rem] border-4 border-card/50 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-30" />
                            <div className="z-10 flex flex-col items-center gap-6">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-20 h-20 md:w-24 md:h-24 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl shadow-primary/40"
                                >
                                    <PlayCircle className="w-10 h-10 md:w-12 md:h-12" />
                                </motion.div>
                                <div className="text-center px-6">
                                    <h2 className="text-white text-2xl md:text-3xl font-display font-black mb-2">{activeVideo.title}</h2>
                                    <p className="text-white/50 font-bold uppercase tracking-widest text-[10px] md:text-sm">{t("nowPlaying")} • {activeVideo.length}</p>
                                </div>
                            </div>

                            {/* Player Controls Mock */}
                            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8 flex items-center gap-4 md:gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "45%" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                                <span className="text-white/40 text-[10px] md:text-xs font-black">06:45 / {activeVideo.length}</span>
                            </div>
                        </div>

                        <div className="mt-8 md:mt-12 flex flex-col items-center gap-4">
                            <p className="text-muted-foreground font-medium max-w-lg text-center text-sm md:text-base px-6">
                                {t("tip")}
                            </p>
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-10 md:px-12 py-6 md:py-7 text-lg md:text-xl rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 font-display mt-2"
                                onClick={handleComplete}
                                disabled={isCompleting}
                            >
                                {isCompleting ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                                {t("completeEarn", { xp: 500 })}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
