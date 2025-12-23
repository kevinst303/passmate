"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { LogIn, UserPlus, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = isLogin
            ? await supabase.auth.signInWithPassword({ email, password })
            : await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (isLogin) {
                router.push("/dashboard");
            } else {
                setError("Check your email for the confirmation link!");
                setLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen bg-muted/30 flex flex-col justify-center items-center px-4">
            <Link href="/" className="mb-8 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-border w-full max-w-md"
            >
                <div className="text-center mb-10">
                    <div className="text-5xl mb-4">🐨</div>
                    <h1 className="text-3xl font-display font-bold text-foreground">
                        {isLogin ? "Welcome Back!" : "Join the Squad!"}
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        {isLogin ? "Your Australian journey continues." : "Start your path to citizenship today."}
                    </p>
                </div>

                <div className="flex bg-muted p-1 rounded-2xl mb-8">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${isLogin ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}
                    >
                        <LogIn className="w-4 h-4" /> Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${!isLogin ? "bg-white shadow-sm text-primary" : "text-muted-foreground"}`}
                    >
                        <UserPlus className="w-4 h-4" /> Signup
                    </button>
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="mate@example.com"
                                className="w-full bg-muted border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-muted border-none rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-accent/10 text-accent p-4 rounded-2xl text-sm font-bold">
                            {error}
                        </div>
                    )}

                    <Button
                        disabled={loading}
                        className="w-full py-4 text-lg mt-4 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Let's Go!" : "Create Account")}
                    </Button>
                </form>

                <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
                    By continuing, you agree to PassMate's <br />
                    <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </div>
            </motion.div>
        </div>
    );
}
