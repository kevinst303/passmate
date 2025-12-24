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
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { flagMasterclassComplete } from "@/app/actions/masterclass";
import { useTranslations } from "next-intl";

export default function MasterclassClient({ profile, initialCompleted = [] }: { profile: any, initialCompleted?: string[] }) {
    const t = useTranslations("Masterclass");
    const [activeVideo, setActiveVideo] = useState<any>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completedModules, setCompletedModules] = useState<string[]>(initialCompleted);

    const modules = [
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

    const handleWatch = (module: any) => {
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
        <div className="min-h-screen bg-[#FDFCFB] pb-24 md:pb-8 md:pl-28 md:pr-8">
            <header className="max-w-5xl mx-auto pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-all font-bold group mb-4 text-sm">
                        <div className="bg-white p-2 rounded-xl border-2 border-border group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span>{t("backDashboard")}</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-yellow-200">
                            <Trophy className="w-10 h-10 fill-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-black text-foreground tracking-tight">{t("title")}</h1>
                            <p className="text-yellow-600 font-bold italic flex items-center gap-2">
                                <Sparkles className="w-4 h-4" /> {t("exclusive")}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-3xl border-2 border-yellow-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-xl">🎓</div>
                    <div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">{t("yourProgress")}</p>
                        <p className="font-display font-black text-yellow-700">{t("percentComplete", { percent: progress })}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto py-8 space-y-12">
                {/* Hero Feature */}
                <section className="relative h-[400px] rounded-[4rem] overflow-hidden group shadow-2xl border-4 border-white">
                    <img
                        src="https://images.unsplash.com/photo-1523438097201-512ae7d59c44?auto=format&fit=crop&w=1200&q=80"
                        alt="Sydney Opera House"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row items-end justify-between gap-6">
                        <div className="space-y-2">
                            <div className="inline-flex bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter mb-2">{t("nextUp")}</div>
                            <h2 className="text-white text-4xl font-display font-black">{nextModule?.title || t("courseCompleted")}</h2>
                            <p className="text-white/70 font-bold max-w-lg italic">{t("heroDesc")}</p>
                        </div>
                        <Button
                            size="lg"
                            className="h-20 px-10 rounded-[2.5rem] bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-black text-xl shadow-2xl hover:scale-105 transition-all flex gap-3"
                            onClick={() => handleWatch(nextModule)}
                            disabled={!nextModule}
                        >
                            <PlayCircle className="w-8 h-8" /> {t("resumeModule")}
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
                                    "p-8 rounded-[3rem] border-2 transition-all group flex flex-col md:flex-row items-center gap-8",
                                    module.status === 'locked'
                                        ? "bg-muted/30 border-border/50 opacity-60"
                                        : "bg-white border-border hover:border-yellow-300 hover:shadow-xl group-hover:bg-yellow-50/10"
                                )}
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl shrink-0 shadow-sm",
                                    module.status === 'completed' ? "bg-green-100 text-green-600" :
                                        module.status === 'unlocked' ? "bg-yellow-100 text-yellow-600" : "bg-muted text-muted-foreground"
                                )}>
                                    {module.status === 'completed' ? <CheckCircle2 className="w-10 h-10" /> :
                                        module.status === 'unlocked' ? <PlayCircle className="w-10 h-10" /> : <Lock className="w-8 h-8" />}
                                </div>
                                <div className="flex-1 text-center md:text-left">
                                    <h4 className="text-xl font-display font-black text-foreground mb-1">{module.title}</h4>
                                    <p className="text-muted-foreground font-bold text-sm mb-2">{module.description}</p>
                                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {module.length} {t("video")}</span>
                                        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> {t("xpReward", { xp: 500 })}</span>
                                    </div>
                                </div>
                                {module.status !== 'locked' && (
                                    <Button
                                        variant="outline"
                                        className="h-14 px-8 rounded-2xl font-black border-2 border-border group-hover:border-yellow-400 group-hover:text-yellow-700 transition-all font-display"
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
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6"
                    >
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute top-10 right-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="max-w-4xl w-full aspect-video bg-zinc-900 rounded-[2.5rem] border-4 border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 opacity-30" />
                            <div className="z-10 flex flex-col items-center gap-6">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl shadow-primary/40"
                                >
                                    <PlayCircle className="w-12 h-12" />
                                </motion.div>
                                <div className="text-center">
                                    <h2 className="text-white text-3xl font-display font-black mb-2">{activeVideo.title}</h2>
                                    <p className="text-white/50 font-bold uppercase tracking-widest text-sm">{t("nowPlaying")} • {activeVideo.length}</p>
                                </div>
                            </div>

                            {/* Player Controls Mock */}
                            <div className="absolute bottom-8 left-8 right-8 flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "45%" }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                                <span className="text-white/40 text-xs font-black">06:45 / {activeVideo.length}</span>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col items-center gap-4">
                            <p className="text-white/60 font-medium max-w-lg text-center">
                                {t("tip")}
                            </p>
                            <Button
                                size="lg"
                                className="bg-primary hover:bg-primary-dark text-white font-black px-12 py-7 text-xl rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-3 font-display"
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

            <Sidebar />
        </div>
    );
}
