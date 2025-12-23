"use client";

import { Link } from "@/i18n/routing";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-width-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-3xl">🐨</span>
                    <span className="text-2xl font-display font-bold text-primary tracking-tight">PassMate</span>
                </Link>
                <div className="flex items-center gap-4 sm:gap-6">
                    <LanguageSwitcher />
                    <Link href="/login" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                        Log in
                    </Link>
                    <Link href="/login">
                        <Button size="sm" className="hidden sm:flex">Get Started</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
