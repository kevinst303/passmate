"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// import { type ThemeProviderProps } from "next-themes";

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

interface SettingsContextType {
    soundEnabled: boolean;
    setSoundEnabled: (enabled: boolean) => void;
    notificationsEnabled: boolean;
    setNotificationsEnabled: (enabled: boolean) => void;
    avatar: string;
    setAvatar: (avatar: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children, ...props }: ThemeProviderProps) {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [avatar, setAvatar] = useState("ollie1");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Load from local storage
        const storedSound = localStorage.getItem("soundEnabled");
        if (storedSound !== null) setSoundEnabled(storedSound === "true");

        const storedNotif = localStorage.getItem("notificationsEnabled");
        if (storedNotif !== null) setNotificationsEnabled(storedNotif === "true");

        const storedAvatar = localStorage.getItem("avatar");
        if (storedAvatar) setAvatar(storedAvatar);
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem("soundEnabled", String(soundEnabled));
            localStorage.setItem("notificationsEnabled", String(notificationsEnabled));
            localStorage.setItem("avatar", avatar);
        }
    }, [soundEnabled, notificationsEnabled, avatar, mounted]);

    return (
        <NextThemesProvider {...props}>
            <SettingsContext.Provider
                value={{
                    soundEnabled,
                    setSoundEnabled,
                    notificationsEnabled,
                    setNotificationsEnabled,
                    avatar,
                    setAvatar,
                }}
            >
                {children}
            </SettingsContext.Provider>
        </NextThemesProvider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
