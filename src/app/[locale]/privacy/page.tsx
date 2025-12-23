"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, Lock, Database, Clock, Users, Globe } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function PrivacyPage() {
    const lastUpdated = "December 23, 2025";

    const sections = [
        {
            icon: <Database className="w-5 h-5" />,
            title: "1. Information We Collect",
            content: `We collect information you provide directly to us, such as your email address, name, and password when you create an account. We also collect quiz performance data, study progress, and usage patterns to personalize your learning experience.`
        },
        {
            icon: <Eye className="w-5 h-5" />,
            title: "2. How We Use Your Information",
            content: `We use the information we collect to: (a) provide, maintain, and improve the Service; (b) personalize your learning experience based on your performance; (c) send you technical notices and support messages; (d) respond to your comments and questions; (e) generate anonymous, aggregated statistics about user behavior.`
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "3. Information Sharing",
            content: `We do not sell, trade, or rent your personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information with our partners for the purposes outlined above. Leaderboard information (username and score) is visible to other users.`
        },
        {
            icon: <Lock className="w-5 h-5" />,
            title: "4. Data Security",
            content: `We implement appropriate data collection, storage, and processing practices and security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal information. All data transmission is encrypted using SSL/TLS technology.`
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: "5. Third-Party Services",
            content: `We use Supabase for authentication and data storage, Stripe for payment processing, and OpenAI for AI tutoring features. These services have their own privacy policies, and we encourage you to review them. We only share information necessary for these services to function.`
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "6. Cookies",
            content: `PassMate uses cookies to enhance user experience and track session information. You can choose to disable cookies through your browser settings, though this may limit functionality of certain features.`
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "7. Data Retention",
            content: `We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account and associated data at any time by contacting support@passmate.com.au.`
        },
        {
            icon: <Users className="w-5 h-5" />,
            title: "8. Children's Privacy",
            content: `PassMate is not intended for users under the age of 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information, please contact us immediately.`
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: "9. International Data Transfers",
            content: `Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using the Service, you consent to such transfers.`
        },
        {
            icon: <Lock className="w-5 h-5" />,
            title: "10. Your Rights",
            content: `You have the right to: (a) access your personal data; (b) correct inaccurate data; (c) request deletion of your data; (d) object to processing of your data; (e) request data portability. To exercise these rights, contact us at support@passmate.com.au.`
        },
        {
            icon: <Shield className="w-5 h-5" />,
            title: "11. Changes to This Policy",
            content: `We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.`
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
                                <Shield className="w-8 h-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-black">Privacy Policy</h1>
                                <p className="text-muted-foreground font-bold flex items-center gap-2 mt-1">
                                    <Clock className="w-4 h-4" /> Last updated: {lastUpdated}
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border-2 border-border p-8 md:p-12 space-y-8">
                            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                                <p className="text-primary font-bold">
                                    🔒 Your privacy is important to us. This policy explains how PassMate collects, uses, and protects your personal information.
                                </p>
                            </div>

                            {sections.map((section, i) => (
                                <div key={i} className="border-t border-border pt-8">
                                    <h2 className="text-xl font-display font-black mb-4 flex items-center gap-3">
                                        <span className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-primary">
                                            {section.icon}
                                        </span>
                                        {section.title}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed pl-[52px]">{section.content}</p>
                                </div>
                            ))}

                            <div className="border-t border-border pt-8">
                                <h2 className="text-xl font-display font-black mb-4">Contact Us</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    If you have any questions about this Privacy Policy, please contact us at{" "}
                                    <a href="mailto:support@passmate.com.au" className="text-primary font-bold hover:underline">
                                        support@passmate.com.au
                                    </a>
                                </p>
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
