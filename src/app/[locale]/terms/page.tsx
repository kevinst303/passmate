"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, FileText, Mail, Clock } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function TermsPage() {
    const lastUpdated = "December 23, 2025";

    const sections = [
        {
            title: "1. Acceptance of Terms",
            content: `By accessing and using PassMate ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms, please do not use our Service.`
        },
        {
            title: "2. Description of Service",
            content: `PassMate is an educational platform designed to help users prepare for the Australian Citizenship Test. The Service includes practice questions, mock exams, AI tutoring, and gamified learning features. PassMate is not affiliated with the Australian Department of Home Affairs.`
        },
        {
            title: "3. User Accounts",
            content: `To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account.`
        },
        {
            title: "4. Premium Subscriptions",
            content: `PassMate offers premium features through one-time purchases. All payments are processed through Stripe and are non-refundable except as described in our Money-Back Guarantee. Premium features include AI Tutor access, Mock Exam Simulator, Citizenship Masterclass, and Digital Certificates.`
        },
        {
            title: "5. Money-Back Guarantee",
            content: `If you purchase a premium plan, complete the full study curriculum, take the official Australian Citizenship Test within 30 days, and do not pass, we will provide a full refund upon presentation of your official test results. This guarantee is subject to verification and our discretion.`
        },
        {
            title: "6. Intellectual Property",
            content: `The Service and its original content, features, and functionality are owned by PassMate and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. Our practice questions are designed for educational purposes and do not represent actual test questions.`
        },
        {
            title: "7. User Conduct",
            content: `You agree not to use the Service to: (a) violate any laws or regulations; (b) share your account with others; (c) attempt to access other users' accounts; (d) interfere with the proper working of the Service; (e) use automated means to access the Service; (f) share, distribute, or reproduce copyrighted materials.`
        },
        {
            title: "8. Disclaimer",
            content: `The information provided on PassMate is for educational purposes only. While we strive for accuracy, we do not guarantee that our content reflects the exact questions on the official Australian Citizenship Test. Success on our platform does not guarantee success on the official test.`
        },
        {
            title: "9. Limitation of Liability",
            content: `In no event shall PassMate, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`
        },
        {
            title: "10. Changes to Terms",
            content: `We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.`
        },
        {
            title: "11. Contact Us",
            content: `If you have any questions about these Terms, please contact us at support@passmate.com.au.`
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4" /> Back to Home
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center">
                                <FileText className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-black">Terms of Service</h1>
                                <p className="text-muted-foreground font-bold flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4" /> Last updated: {lastUpdated}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border-2 border-border p-8 md:p-12 space-y-8">
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                Welcome to PassMate! These terms and conditions outline the rules and regulations for the use of our citizenship test preparation platform.
                            </p>

                            {sections.map((section, i) => (
                                <div key={i} className="border-t border-border pt-8">
                                    <h2 className="text-xl font-display font-black mb-4">{section.title}</h2>
                                    <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                                </div>
                            ))}
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
