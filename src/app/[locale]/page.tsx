"use client";

import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Target,
  Zap,
  Users,
  MessageCircle,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");
  const common = useTranslations("Common");
  const locale = useLocale();

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
      <section className="pt-40 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary" />
              {t("hero.trusted")}
            </div>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-foreground leading-[1.1] mb-6">
              {t.rich("hero.title", {
                mate: (chunks) => <span className="text-primary italic font-serif">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="flex items-center gap-2 w-full sm:w-auto">
                  {t("hero.cta1")} <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                {t("hero.cta2")}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative bg-gradient-to-br from-primary/20 to-secondary/20 rounded-[3rem] p-8 aspect-square flex items-center justify-center">
              {/* Mock App UI Preview */}
              <div className="bg-white rounded-3xl shadow-2xl w-full h-full p-6 flex flex-col gap-6 transform lg:translate-x-12 translate-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-bold text-sm">
                    <Flame className="w-4 h-4" /> 5 Day Streak
                  </div>
                  <div className="flex items-center gap-2 bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold text-sm">
                    <Zap className="w-4 h-4" /> 1500 XP
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-bold">Daily Quest</h3>
                  <div className="bg-muted p-4 rounded-xl border-2 border-border/50">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-accent" />
                      <span className="font-semibold text-sm">Master "Values & Government"</span>
                    </div>
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "65%" }}
                        transition={{ delay: 1, duration: 1.5 }}
                        className="h-full bg-accent"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-auto bg-primary/5 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-2xl">🐨</div>
                  <div>
                    <p className="text-xs uppercase font-bold text-primary tracking-widest">Ollie the Koala</p>
                    <p className="text-sm font-medium">"You're doing great, mate! Just 5 more questions."</p>
                  </div>
                </div>
              </div>
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
              { value: "10,000+", label: "Mates Trained" },
              { value: "96%", label: "First-Time Pass Rate" },
              { value: "500+", label: "Practice Questions" },
              { value: "4.9★", label: "User Rating" }
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
            <h2 className="text-4xl font-display font-bold mb-4">Loved by New Aussies</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real stories from people who became Australian citizens with PassMate.
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
                <p className="text-muted-foreground leading-relaxed mb-6 italic">"{testimonial.text}"</p>
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
            <h2 className="text-4xl lg:text-6xl font-display font-bold mb-8">Ready to become an Australian?</h2>
            <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto">
              Join thousands of successful users who passed their test on the first try with PassMate.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary" className="bg-white text-primary border-none text-xl px-12 py-6">
                Get Started Free
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
            © 2025 PassMate. Not affiliated with the Australian Department of Home Affairs.
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
