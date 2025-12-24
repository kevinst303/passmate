"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
        setIsOpen(false);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const languages = [
        { code: 'en', name: 'English', flag: '🇦🇺' },
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'zh', name: '中文', flag: '🇨🇳' },
        { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
        { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
        { code: 'ar', name: 'العربية', flag: '🇸🇦' },
        { code: 'tl', name: 'Tagalog', flag: '🇵🇭' },
    ];

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-2 pr-3 rounded-full transition-all duration-200 border ${isOpen ? 'bg-muted border-border' : 'hover:bg-muted/50 border-transparent'
                    }`}
                aria-label="Change language"
                aria-expanded={isOpen}
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-bold uppercase font-display hidden sm:inline-block tracking-wide">{locale}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <div
                className={`absolute right-0 mt-3 w-72 bg-background/95 backdrop-blur-xl border border-border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] rounded-3xl transition-all duration-300 origin-top-right p-3 ${isOpen
                    ? 'opacity-100 visible translate-y-0 scale-100'
                    : 'opacity-0 invisible -translate-y-4 scale-95'
                    }`}
            >
                <div className="grid grid-cols-1 gap-1">
                    <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Select Language
                    </div>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm transition-all duration-200 group ${locale === lang.code
                                ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20'
                                : 'hover:bg-muted text-foreground/80 hover:text-foreground'
                                }`}
                        >
                            <span className="text-2xl filter drop-shadow-sm transition-transform group-hover:scale-110 duration-200">{lang.flag}</span>
                            <span className="flex-1 text-left text-base">{lang.name}</span>
                            {locale === lang.code && (
                                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
