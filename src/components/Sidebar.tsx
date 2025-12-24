"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useState, useEffect, useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy,
    BookOpen,
    Users,
    Shield,
    Sparkles,
    MessageCircle,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    X,
    Settings,
    Award,
    GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    icon: React.ElementType;
    label: string;
    description: string;
    iconClass?: string;
}

export const Sidebar = () => {
    const pathname = usePathname();
    const t = useTranslations("Navigation");
    const [isExpanded, setIsExpanded] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);

    // Navigation items with translations
    const { mainNavItems, moreNavItems, allNavItems } = useMemo(() => {
        const main: NavItem[] = [
            {
                href: "/dashboard",
                icon: LayoutDashboard,
                label: t("home"),
                description: t("desc.home")
            },
            {
                href: "/skill-trees",
                icon: BookOpen,
                label: t("learn"),
                description: t("desc.learn")
            },
            {
                href: "/ai-tutor",
                icon: MessageCircle,
                label: t("ollie"),
                description: t("desc.ollie")
            },
        ];

        const more: NavItem[] = [
            {
                href: "/masterclass",
                icon: GraduationCap,
                label: t("masterclass"),
                description: t("desc.masterclass")
            },
            {
                href: "/leagues",
                icon: Trophy,
                label: t("leagues"),
                description: t("desc.leagues")
            },
            {
                href: "/friends",
                icon: Users,
                label: t("friends"),
                description: t("desc.friends")
            },
            {
                href: "/achievements",
                icon: Award,
                label: t("achievements"),
                description: t("desc.achievements")
            },
            {
                href: "/premium",
                icon: Sparkles,
                iconClass: "text-yellow-500 fill-yellow-500",
                label: t("premium"),
                description: t("desc.premium")
            },
            {
                href: "/profile",
                icon: Shield,
                label: t("profile"),
                description: t("desc.profile")
            },
            {
                href: "/blog",
                icon: BookOpen, // Or another icon like FileText
                label: t("blog"),
                description: t("desc.blog")
            },
            {
                href: "/settings",
                icon: Settings,
                label: t("settings"),
                description: t("desc.settings")
            },
        ];

        const all: NavItem[] = [
            ...main,
            ...more.slice(0, 5),
        ];

        return { mainNavItems: main, moreNavItems: more, allNavItems: all };
    }, [t]);

    // Close more menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.more-menu-container') && !target.closest('.more-menu-trigger')) {
                setShowMoreMenu(false);
            }
        };

        if (showMoreMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [showMoreMenu]);

    return (
        <>
            {/* Desktop Sidebar - Expandable */}
            <motion.nav
                initial={false}
                animate={{ width: isExpanded ? 280 : 80 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="hidden md:flex fixed top-0 left-0 h-full bg-white/95 backdrop-blur-lg border-r border-border flex-col z-50"
                role="navigation"
                aria-label="Main navigation"
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => setIsExpanded(false)}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-border overflow-hidden">
                    <Link href="/dashboard" className="flex items-center gap-3 min-w-max">
                        <span className="text-2xl">🐨</span>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-xl font-display font-bold text-primary whitespace-nowrap"
                                >
                                    PassMate
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-4 px-3 overflow-y-auto overflow-x-hidden">
                    <div className="space-y-1">
                        {allNavItems.map((item) => {
                            const isActive = pathname === item.href ||
                                (item.href === "/dashboard" && pathname.startsWith("/dashboard/quiz"));

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 p-3 rounded-xl transition-all group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                    )}
                                    aria-current={isActive ? "page" : undefined}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
                                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                        />
                                    )}

                                    <item.icon
                                        className={cn(
                                            "w-6 h-6 flex-shrink-0 transition-transform group-hover:scale-110",
                                            item.iconClass
                                        )}
                                        aria-hidden="true"
                                    />

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.15 }}
                                                className="flex flex-col min-w-0"
                                            >
                                                <span className="font-bold text-sm whitespace-nowrap">
                                                    {item.label}
                                                </span>
                                                <span className="text-xs text-muted-foreground truncate">
                                                    {item.description}
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="p-3 border-t border-border">
                    <Link
                        href="/profile"
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl transition-all group",
                            pathname === "/profile"
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                        )}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex flex-col min-w-0"
                                >
                                    <span className="font-bold text-sm">{t("myProfile")}</span>
                                    <span className="text-xs text-muted-foreground">{t("viewAccount")}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Expand hint */}
                    <div className="mt-3 flex justify-center">
                        <motion.div
                            animate={{ x: isExpanded ? 0 : [0, 3, 0] }}
                            transition={{ repeat: isExpanded ? 0 : Infinity, duration: 1.5 }}
                            className="text-muted-foreground"
                        >
                            {isExpanded ? (
                                <ChevronLeft className="w-5 h-5" />
                            ) : (
                                <ChevronRight className="w-5 h-5" />
                            )}
                        </motion.div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Bottom Navigation */}
            <nav
                className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-border z-50 safe-area-bottom"
                role="navigation"
                aria-label="Mobile navigation"
            >
                <div className="flex justify-around items-center px-2 py-2">
                    {mainNavItems.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href === "/dashboard" && pathname.startsWith("/dashboard/quiz"));

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all min-w-[60px]",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <div className={cn(
                                    "p-1.5 rounded-xl transition-all",
                                    isActive && "bg-primary/10"
                                )}>
                                    <item.icon
                                        className={cn(
                                            "w-6 h-6",
                                            item.iconClass
                                        )}
                                        aria-hidden="true"
                                    />
                                </div>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-tight",
                                    isActive && "text-primary"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setShowMoreMenu(true)}
                        className={cn(
                            "more-menu-trigger flex flex-col items-center gap-0.5 p-2 rounded-xl transition-all min-w-[60px]",
                            showMoreMenu ? "text-primary" : "text-muted-foreground"
                        )}
                        aria-expanded={showMoreMenu}
                        aria-haspopup="dialog"
                    >
                        <div className={cn(
                            "p-1.5 rounded-xl transition-all",
                            showMoreMenu && "bg-primary/10"
                        )}>
                            <MoreHorizontal className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            {t("more")}
                        </span>
                    </button>
                </div>
            </nav>

            {/* More Menu - Bottom Sheet */}
            <AnimatePresence>
                {showMoreMenu && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="md:hidden fixed inset-0 bg-black/50 z-[60]"
                            onClick={() => setShowMoreMenu(false)}
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="more-menu-container md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] safe-area-bottom max-h-[80vh] overflow-y-auto"
                        >
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-10 h-1 bg-border rounded-full" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-3 border-b border-border">
                                <h2 className="text-lg font-display font-bold">{t("moreOptions")}</h2>
                                <button
                                    onClick={() => setShowMoreMenu(false)}
                                    className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Navigation Items */}
                            <div className="p-4 space-y-1">
                                {moreNavItems.map((item) => {
                                    const isActive = pathname === item.href;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setShowMoreMenu(false)}
                                            className={cn(
                                                "flex items-center gap-4 p-4 rounded-2xl transition-all",
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-foreground hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                                isActive ? "bg-primary/20" : "bg-muted/50"
                                            )}>
                                                <item.icon
                                                    className={cn(
                                                        "w-6 h-6",
                                                        isActive ? "text-primary" : "text-muted-foreground",
                                                        item.iconClass
                                                    )}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold">{item.label}</p>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* Quick Actions */}
                            <div className="p-4 pt-0">
                                <div className="bg-gradient-to-r from-primary/10 to-yellow-100/50 p-4 rounded-2xl border border-primary/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                        <span className="font-display font-bold text-primary">{t("goPremium")}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-3">
                                        {t("premiumDesc")}
                                    </p>
                                    <Link
                                        href="/premium"
                                        onClick={() => setShowMoreMenu(false)}
                                        className="block w-full text-center py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors"
                                    >
                                        {t("upgradeNow")}
                                    </Link>
                                </div>
                            </div>

                            {/* Extra padding for safe area */}
                            <div className="h-4" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
