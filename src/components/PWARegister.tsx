"use client";

import { useEffect } from "react";

export function PWARegister() {
    useEffect(() => {
        // Only register service worker in production
        if (process.env.NODE_ENV !== "production") return;

        if (typeof window !== "undefined" && "serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((registration) => {
                    console.log("[PWA] Service worker registered:", registration.scope);

                    // Check for updates periodically
                    setInterval(() => {
                        registration.update();
                    }, 60 * 60 * 1000); // Check every hour
                })
                .catch((error) => {
                    console.log("[PWA] Service worker registration failed:", error);
                });
        }
    }, []);

    return null;
}
