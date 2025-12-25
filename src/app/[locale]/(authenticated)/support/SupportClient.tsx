"use client";

import { motion } from "framer-motion";
import {
    HelpCircle,
    BookOpen,
    MessageSquare,
    Mail,
    ArrowLeft,
    ChevronRight,
    Search,
    PlayCircle,
    FileText,
    Shield,
    ExternalLink,
    Clock,
    UserCheck,
    HeartHandshake
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

import { useTranslations } from "next-intl";

interface SupportClientProps {
    data: unknown;
}

export default function SupportClient({ data: _data }: SupportClientProps) {
    const t = useTranslations("Support");

    const categories = [
        { icon: BookOpen, title: t("categories.study.title"), desc: t("categories.study.desc"), color: "text-blue-500", bg: "bg-blue-50" },
        { icon: UserCheck, title: t("categories.account.title"), desc: t("categories.account.desc"), color: "text-green-500", bg: "bg-green-50" },
        { icon: Shield, title: t("categories.test.title"), desc: t("categories.test.desc"), color: "text-purple-500", bg: "bg-purple-50" },
        { icon: HeartHandshake, title: t("categories.feedback.title"), desc: t("categories.feedback.desc"), color: "text-orange-500", bg: "bg-orange-50" }
    ];

    const faqs = [
        { q: t("faqs.q1"), a: t("faqs.a1") },
        { q: t("faqs.q2"), a: t("faqs.a2") },
        { q: t("faqs.q3"), a: t("faqs.a3") },
        { q: t("faqs.q4"), a: t("faqs.a4") }
    ];

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8 font-sans">
            <main className="max-w-6xl mx-auto py-8 px-4">
                <Link
                    href="/profile"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> {t("backProfile")}
                </Link>

                {/* Hero Search Section */}
                <section className="bg-card glass rounded-[4rem] border-2 border-border p-10 md:p-16 shadow-2xl relative overflow-hidden text-center mb-16">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                            <HelpCircle className="w-10 h-10 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-black mb-6">{t("title")}</h1>
                        <p className="text-xl text-muted-foreground font-bold mb-10">
                            {t("subtitle")}
                        </p>

                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder={t("searchPlaceholder")}
                                className="w-full bg-card glass/50 border-2 border-border rounded-[2rem] py-6 px-16 text-lg font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                            />
                        </div>
                    </div>
                </section>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-card glass p-8 rounded-[2.5rem] border-2 border-border shadow-lg cursor-pointer group hover:border-primary/50 transition-all"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 bg-muted/50 border border-border`}>
                                <cat.icon className={`w-7 h-7 ${cat.color} dark:text-primary-light`} />
                            </div>
                            <h3 className="text-xl font-display font-black mb-2">{cat.title}</h3>
                            <p className="text-sm font-bold text-muted-foreground leading-relaxed">{cat.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-2 gap-16">
                    {/* FAQs */}
                    <section>
                        <h2 className="text-3xl font-display font-black mb-10 flex items-center gap-4">
                            <FileText className="w-8 h-8 text-primary" /> {t("faqsTitle")}
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <details key={i} className="group bg-card glass border-2 border-border rounded-3xl overflow-hidden hover:border-primary/50 transition-colors">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                        <span className="font-black text-lg">{faq.q}</span>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="px-6 pb-6 text-muted-foreground font-bold leading-relaxed border-t-2 border-dashed border-border/50 pt-4">
                                        {faq.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                        <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-black mt-8 hover:underline whitespace-nowrap">
                            {t("viewAllFaqs")} <ChevronRight className="w-4 h-4" />
                        </Link>
                    </section>

                    {/* Contact & Resources */}
                    <div className="space-y-10">
                        {/* Direct Support Card */}
                        <section className="bg-slate-950 dark:bg-card glass text-white dark:text-foreground rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-display font-black mb-4">{t("stillNeedHelp")}</h3>
                                <p className="text-white/70 font-bold mb-8 leading-relaxed">
                                    {t("supportDesc")}
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Link href="/contact" className="w-full">
                                        <Button className="w-full h-14 rounded-2xl font-black bg-white dark:bg-primary text-black dark:text-white hover:bg-white/90 dark:hover:bg-primary/90 shadow-xl">
                                            <Mail className="w-5 h-5 mr-2" /> {t("messageUs")}
                                        </Button>
                                    </Link>
                                    <Button variant="outline" className="h-14 rounded-2xl font-black border-white/20 dark:border-border hover:bg-white/10 dark:hover:bg-background/20">
                                        <MessageSquare className="w-5 h-5 mr-2" /> {t("liveChat")}
                                    </Button>
                                </div>
                                <div className="flex items-center justify-center gap-6 mt-8 text-xs font-black text-white/50 uppercase tracking-widest">
                                    <span className="flex items-center gap-2"><Clock className="w-3 h-3" /> {t("monFri")}</span>
                                    <span className="flex items-center gap-2"><ExternalLink className="w-3 h-3" /> {t("support24h")}</span>
                                </div>
                            </div>
                        </section>

                        {/* External Resources */}
                        <section className="bg-card glass border-2 border-border rounded-[3rem] p-10 shadow-xl">
                            <h3 className="text-xl font-display font-black mb-8 flex items-center gap-3">
                                <PlayCircle className="w-5 h-5 text-red-500" /> {t("resourcesTitle")}
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { label: t("resources.book"), href: "#" },
                                    { label: t("resources.videos"), href: "#" },
                                    { label: t("resources.forum"), href: "#" },
                                    { label: t("resources.booking"), href: "#" }
                                ].map((res, i) => (
                                    <Link
                                        key={i}
                                        href={res.href}
                                        className="flex items-center justify-between p-5 hover:bg-muted/50 rounded-2xl transition-all group font-bold border border-transparent hover:border-border"
                                    >
                                        <span className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                            {res.label}
                                        </span>
                                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
