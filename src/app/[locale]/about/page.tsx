import { Navbar } from "@/components/Navbar";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Award, Globe, Heart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AboutPage() {
    const t = useTranslations("About");
    const common = useTranslations("Common");

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-32 pb-24 px-4">
                {/* Hero Section */}
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full font-bold mb-6 text-sm">
                        <Users className="w-4 h-4" />
                        OUR JOURNEY
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-display font-black text-foreground mb-6 tracking-tight">
                        {t("title")}
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        {t("subtitle")}
                    </p>
                </div>

                {/* Mission & Story */}
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 mb-32">
                    <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-border/50 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform" />
                        <h2 className="text-3xl font-display font-black mb-6">{t("mission")}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                            {t("missionText")}
                        </p>
                    </div>
                    <div className="bg-primary/5 rounded-[3rem] p-8 md:p-12 border border-primary/10 relative overflow-hidden group">
                        <Sparkles className="absolute bottom-8 right-8 w-16 h-16 text-primary/10 group-hover:rotate-12 transition-transform" />
                        <h2 className="text-3xl font-display font-black mb-6">{t("story")}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                            {t("storyText")}
                        </p>
                    </div>
                </div>

                {/* Meet Ollie */}
                <div className="max-w-5xl mx-auto bg-white rounded-[4rem] border-2 border-border p-8 md:p-20 mb-32 relative">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="text-center md:text-left">
                            <div className="text-6xl mb-6">🐨</div>
                            <h2 className="text-4xl font-display font-black mb-6">{t("ollie")}</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {t("ollieText")}
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-muted rounded-[3rem] overflow-hidden flex items-center justify-center text-8xl">
                                🐨
                                <div className="absolute inset-0 bg-primary/5" />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-3xl p-6 shadow-xl border border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <Award className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black">Expert Certified</p>
                                        <p className="text-xs text-muted-foreground">Ollie the Tutor</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Us? */}
                <div className="max-w-7xl mx-auto mb-32">
                    <h2 className="text-4xl font-display font-black text-center mb-16">{t("whyTitle")}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-border/50 hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    {i === 1 && <Globe className="w-7 h-7 text-primary" />}
                                    {i === 2 && <ShieldCheck className="w-7 h-7 text-primary" />}
                                    {i === 3 && <Heart className="w-7 h-7 text-primary" />}
                                </div>
                                <h3 className="text-xl font-bold mb-4">{t(`why${i}`)}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {t(`why${i}Desc`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Join the Family */}
                <div className="max-w-4xl mx-auto bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <h2 className="text-4xl md:text-5xl font-display font-black mb-8 relative z-10">{t("join")}</h2>
                    <Link href="/login">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg font-black px-12 py-8 rounded-[2rem] shadow-2xl relative z-10">
                            {t("getStarted")}
                        </Button>
                    </Link>
                </div>
            </main>

            <footer className="py-12 border-t border-border bg-white">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐨</span>
                        <span className="text-xl font-display font-bold text-primary">PassMate</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-bold text-center md:text-left">
                        © {new Date().getFullYear()} PassMate. {common("footer")}
                    </p>
                    <div className="flex gap-6 text-sm font-medium text-muted-foreground">
                        <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                        <Link href="/terms" className="hover:text-foreground">Terms</Link>
                        <Link href="/contact" className="hover:text-foreground">Contact</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
