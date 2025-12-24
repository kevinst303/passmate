"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";

export const Newsletter = () => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setStatus('success');
        setEmail("");
    };

    return (
        <section className="py-20 px-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
            <div className="absolute top-1/2 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-[3rem] border-2 border-primary/10 p-8 md:p-16 shadow-xl shadow-primary/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
                        <Mail className="w-64 h-64 -rotate-12" />
                    </div>

                    <div className="max-w-2xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold mb-6 text-sm">
                                <Sparkles className="w-4 h-4" />
                                JOIN THE COMMUNITY
                            </div>

                            <h2 className="text-4xl md:text-5xl font-display font-black text-foreground mb-6 leading-tight">
                                Never miss a <span className="text-primary italic">Visa Update</span> again.
                            </h2>

                            <p className="text-xl text-muted-foreground mb-10 font-medium">
                                Join 5,000+ others receiving weekly insights on Australian citizenship, immigration news, and life down under.
                            </p>

                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-50 border border-green-200 p-6 rounded-3xl flex items-center gap-4"
                                    >
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-green-900">You're on the list!</h4>
                                            <p className="text-green-700 text-sm">Check your inbox soon for your Australian welcome guide.</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        onSubmit={handleSubmit}
                                        className="flex flex-col sm:flex-row gap-4"
                                    >
                                        <div className="flex-1 relative">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                            <input
                                                type="email"
                                                placeholder="Enter your email address"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-14 pr-6 py-5 bg-muted/50 border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-[2rem] outline-none transition-all font-bold"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={status === 'loading'}
                                            className="px-10 py-5 rounded-[2rem] text-lg font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            {status === 'loading' ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>Join Now <Send className="ml-2 w-5 h-5" /></>
                                            )}
                                        </Button>
                                    </motion.form>
                                )}
                            </AnimatePresence>

                            <p className="mt-6 text-xs text-muted-foreground font-medium">
                                We respect your privacy. Unsubscribe at any time. No spam, only Aussie goodness. 🐨
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};
