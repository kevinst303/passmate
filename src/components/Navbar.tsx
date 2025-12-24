"use client";

import { Link } from "@/i18n/routing";
import { Button } from "./ui/Button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { useTranslations } from "next-intl";

export const Navbar = () => {
    const t = useTranslations("Common");

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <span className="text-3xl">🐨</span>
                    <span className="text-2xl font-display font-bold text-primary tracking-tight">PassMate</span>
                </Link>
                <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
                    <ThemeToggle />
                    <LanguageSwitcher />
                    <Link href="/blog" className="text-muted-foreground hover:text-foreground font-medium transition-colors hidden sm:block">
                        {t("blog")}
                    </Link>
                    <Link href="/login" className="text-muted-foreground hover:text-foreground font-medium transition-colors">
                        {t("login")}
                    </Link>
                    <Link href="/login">
                        <Button size="sm" className="hidden sm:flex">{t("getStarted")}</Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
