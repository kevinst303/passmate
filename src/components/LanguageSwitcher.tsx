"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { Globe } from "lucide-react";

export const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

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
        <div className="relative group">
            <button className="flex items-center gap-2 p-2 rounded-full hover:bg-muted transition-colors" aria-label="Change language">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium uppercase font-display">{locale}</span>
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white border border-border shadow-2xl rounded-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] p-2">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors ${locale === lang.code ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted text-foreground'
                            }`}
                    >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="flex-1 text-left">{lang.name}</span>
                        {locale === lang.code && <span className="w-2 h-2 rounded-full bg-primary" />}
                    </button>
                ))}
            </div>
        </div>
    );
};
