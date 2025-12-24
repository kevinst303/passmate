"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Target,
  Zap,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("HomePage");
  const common = useTranslations("Common");

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="z-10"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-full font-bold mb-8 shadow-sm">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm tracking-wide">{t("hero.trusted")}</span>
            </div>

            <h1 className="text-5xl lg:text-[5.5rem] font-display font-black text-foreground leading-[1] mb-8 tracking-tight">
              {t.rich("hero.title", {
                mate: (chunks) => (
                  <span className="relative inline-block text-primary italic font-serif px-2">
                    {chunks}
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1, duration: 1 }}
                      className="absolute bottom-1 left-0 h-3 bg-primary/10 -z-10"
                    />
                  </span>
                )
              })}
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-12 max-w-lg leading-relaxed font-medium">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/login" className="w-full sm:w-auto">
                <Button size="lg" className="btn-primary w-full h-16 text-xl shadow-[0_6px_0_#147a71] hover:shadow-[0_4px_0_#147a71] hover:translate-y-[2px] active:shadow-none active:translate-y-[6px] transition-all px-8 rounded-2xl group">
                  {t("hero.cta1")} <ChevronRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard/mock-test" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-16 text-lg border-2 hover:bg-muted/50 rounded-2xl font-bold">
                  {t("hero.cta2")}
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-muted flex items-center justify-center overflow-hidden shadow-sm relative">
                    <Image
                      src={`https://i.pravatar.cc/100?img=${i + 10}`}
                      alt="User avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-yellow-500 font-bold">
                  {"★".repeat(5)} <span className="text-foreground ml-1">4.9/5</span>
                </div>
                <p className="text-muted-foreground font-medium">{t("hero.trusted")}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Main Mock UI Container */}
            <div className="relative w-full max-w-[500px] z-20">
              {/* Outer Glow/Halo */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-[3.5rem] blur-3xl opacity-50 -z-10 animate-pulse" />

              <div className="bg-white/90 backdrop-blur-xl border border-white rounded-[3rem] shadow-[0_30px_70px_rgba(0,0,0,0.1)] overflow-hidden">
                {/* Header Area */}
                <div className="p-8 pb-4 flex justify-between items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-orange-100/80 text-orange-600 px-4 py-2 rounded-2xl font-black text-sm shadow-sm"
                  >
                    <Flame className="w-5 h-5 fill-orange-600" /> 5 {common("days")} {common("streak")}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-3 bg-blue-100/80 text-blue-600 px-4 py-2 rounded-2xl font-black text-sm shadow-sm"
                  >
                    <Zap className="w-5 h-5 fill-blue-600" /> 1500 XP
                  </motion.div>
                </div>

                <div className="p-8 pt-4 flex flex-col gap-10">
                  {/* Daily Quest Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-foreground">{t("features.f1.title")}</h3>
                      <span className="text-primary font-bold text-sm bg-primary/5 px-3 py-1 rounded-full">65% Done</span>
                    </div>

                    <div className="bg-muted/50 p-6 rounded-[2rem] border border-border/40 relative overflow-hidden group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-black text-sm text-foreground">Mastering &quot;Values&quot;</p>
                          <p className="text-xs text-muted-foreground font-bold italic">Australian Citizenship Test</p>
                        </div>
                      </div>

                      <div className="relative h-4 w-full bg-border/50 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-accent to-[#ff8e6e] rounded-full relative"
                        >
                          <div className="absolute top-0 right-0 h-full w-2 bg-white/20 blur-[1px]" />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Character/Chat Area */}
                  <div className="bg-[#FEFEF8] border-2 border-primary/10 p-6 rounded-[2.5rem] flex items-start gap-5 shadow-sm relative">
                    <div className="flex-shrink-0 relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-4xl shadow-lg transform -rotate-3">
                        🐨
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-[#FEFEF8] rounded-full shadow-sm" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black text-primary tracking-[0.2em] mb-1">PassMate Guide</p>
                      <h4 className="font-black text-sm text-foreground mb-1">Ollie the Koala</h4>
                      <p className="text-sm font-bold text-muted-foreground leading-snug">
                        &quot;You&apos;re doing great, mate! Just <span className="text-primary underline decoration-2 underline-offset-4 font-black">5 more questions</span> to hit your goal.&quot;
                      </p>
                    </div>
                    {/* Speech bubble pointy bit */}
                    <div className="absolute -left-2 top-8 w-4 h-4 bg-[#FEFEF8] border-l-2 border-t-2 border-primary/10 rotate-[-45deg]" />
                  </div>
                </div>
              </div>

              {/* Optional secondary floating element */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-8 -bottom-8 bg-white p-5 rounded-3xl shadow-2xl border border-primary/5 hidden lg:block z-30 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Trophy className="w-6 h-6 fill-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Achievement</p>
                  <p className="text-sm font-black text-foreground">Aussie Legend</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t("features.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: <Flame className="text-orange-500" />,
                title: t("features.f1.title"),
                desc: t("features.f1.desc")
              },
              {
                icon: <Trophy className="text-yellow-500" />,
                title: t("features.f2.title"),
                desc: t("features.f2.desc")
              },
              {
                icon: <ChevronRight className="text-primary" />,
                title: t("features.f3.title"),
                desc: t("features.f3.desc")
              },
              {
                icon: <ShieldCheck className="text-accent" />,
                title: t("features.f4.title"),
                desc: t("features.f4.desc")
              }
            ].map((f, i) => (
              <motion.div
                key={i}
                variants={item}
                className="bg-white p-8 rounded-[2rem] border border-border/50 hover:shadow-xl transition-shadow cursor-default"
              >
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center"
          >
            {[
              { value: "10,000+", label: t("stats.trained") },
              { value: "96%", label: t("stats.passRate") },
              { value: "500+", label: t("stats.questions") },
              { value: "4.9★", label: t("stats.rating") }
            ].map((stat, i) => (
              <div key={i} className="text-white">
                <div className="text-5xl lg:text-6xl font-display font-black mb-2">{stat.value}</div>
                <div className="text-primary-foreground/70 font-bold uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">{t("testimonials.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                name: "Sarah J.",
                location: "Sydney, NSW",
                text: "I was so nervous about the test, but PassMate made it feel like a game! Passed on my first try with 95%.",
                avatar: "S"
              },
              {
                name: "Ahmed K.",
                location: "Melbourne, VIC",
                text: "The AI tutor Ollie explained everything so clearly. The mock tests were exactly like the real exam!",
                avatar: "A"
              },
              {
                name: "Li W.",
                location: "Brisbane, QLD",
                text: "Daily streaks kept me motivated. In 3 weeks I went from knowing nothing to being fully prepared.",
                avatar: "L"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={item}
                className="bg-white p-8 rounded-[2.5rem] border-2 border-border shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic">&quot;{testimonial.text}&quot;</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto bg-primary text-white rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
        >
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-8">{t("cta.title")}</h2>
            <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="bg-white text-primary border-none text-xl px-12 py-6">
                {t("cta.button")}
              </Button>
            </Link>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-32 -translate-x-32" />
        </motion.div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐨</span>
            <span className="text-xl font-display font-bold text-primary">PassMate</span>
          </div>
          <p className="text-muted-foreground text-sm">
            {common("footer")}
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">{common("privacy")}</Link>
            <Link href="/terms" className="hover:text-foreground">{common("terms")}</Link>
            <Link href="/contact" className="hover:text-foreground">{common("contact")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
