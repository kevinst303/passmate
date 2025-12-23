"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Mail, MessageSquare, HelpCircle, Loader2, Check, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    const faqs = [
        {
            q: "How accurate are the practice questions?",
            a: "Our questions are designed based on the official Australian Citizenship Test resource book. While we don't have access to the actual test questions, our content covers all topics you'll encounter."
        },
        {
            q: "Can I get a refund if I don't pass?",
            a: "Yes! If you complete our full study curriculum and don't pass the official test within 30 days, we'll refund your premium purchase in full."
        },
        {
            q: "How do I reset my password?",
            a: "Click 'Forgot Password' on the login page. We'll send a password reset link to your registered email address."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-16">
                            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <MessageSquare className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-5xl font-display font-black mb-4">Get in Touch</h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                Have a question or feedback? We'd love to hear from you, mate!
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12">
                            {/* Contact Form */}
                            <div className="bg-white rounded-[2.5rem] border-2 border-border p-8 md:p-10">
                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Check className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-display font-black mb-3">Message Sent!</h3>
                                        <p className="text-muted-foreground font-bold">
                                            Thanks for reaching out. We'll get back to you within 24 hours.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">
                                                Your Name
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Steve Irwin"
                                                className="w-full bg-muted/50 border-2 border-border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="mate@example.com"
                                                className="w-full bg-muted/50 border-2 border-border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">
                                                Subject
                                            </label>
                                            <select
                                                required
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full bg-muted/50 border-2 border-border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none appearance-none"
                                            >
                                                <option value="">Select a topic...</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="technical">Technical Support</option>
                                                <option value="billing">Billing Question</option>
                                                <option value="refund">Refund Request</option>
                                                <option value="partnership">Partnership Opportunity</option>
                                                <option value="feedback">Feedback / Suggestion</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-black text-muted-foreground uppercase tracking-wider mb-2">
                                                Message
                                            </label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Tell us what's on your mind..."
                                                className="w-full bg-muted/50 border-2 border-border rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold outline-none resize-none"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full py-6 text-lg font-black rounded-2xl"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Sending...</>
                                            ) : (
                                                <><Send className="w-5 h-5 mr-2" /> Send Message</>
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </div>

                            {/* Info & FAQ */}
                            <div className="space-y-8">
                                {/* Contact Info */}
                                <div className="bg-white rounded-[2.5rem] border-2 border-border p-8">
                                    <h3 className="text-xl font-display font-black mb-6 flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-primary" /> Contact Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                                                <Mail className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Email</p>
                                                <a href="mailto:support@passmate.com.au" className="text-primary hover:underline">
                                                    support@passmate.com.au
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                                                <Clock className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Response Time</p>
                                                <p className="text-muted-foreground">Within 24 hours (Mon-Fri)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center shrink-0">
                                                <MapPin className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold">Location</p>
                                                <p className="text-muted-foreground">Sydney, Australia 🇦🇺</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ */}
                                <div className="bg-white rounded-[2.5rem] border-2 border-border p-8">
                                    <h3 className="text-xl font-display font-black mb-6 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-primary" /> Frequently Asked Questions
                                    </h3>
                                    <div className="space-y-6">
                                        {faqs.map((faq, i) => (
                                            <div key={i} className="border-b border-border pb-6 last:border-0 last:pb-0">
                                                <p className="font-bold mb-2">{faq.q}</p>
                                                <p className="text-muted-foreground text-sm">{faq.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <footer className="py-12 border-t border-border">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🐨</span>
                        <span className="text-xl font-display font-bold text-primary">PassMate</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        © 2025 PassMate. Not affiliated with the Australian Department of Home Affairs.
                    </p>
                </div>
            </footer>
        </div>
    );
}
