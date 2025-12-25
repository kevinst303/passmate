"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-muted/30 pb-28 md:pb-8 md:pl-20">
            {/* Header Skeleton */}
            <header className="bg-card border-b border-border px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-40">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
                        <div className="w-24 h-6 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="w-16 h-8 bg-muted rounded-full animate-pulse" />
                        <div className="w-16 h-8 bg-muted rounded-full animate-pulse" />
                        <div className="w-16 h-8 bg-muted rounded-full animate-pulse" />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Welcome Section Skeleton */}
                <section className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center glass p-5 sm:p-8 rounded-2xl sm:rounded-[2.5rem] border border-border">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-muted rounded-full animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="w-48 h-8 bg-muted rounded animate-pulse" />
                        <div className="w-64 h-4 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="w-full sm:w-40 h-12 bg-muted rounded-xl animate-pulse" />
                </section>

                {/* Quick Actions Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="h-24 bg-card glass rounded-2xl border border-border animate-pulse" />
                    <div className="h-24 bg-card glass rounded-2xl border border-border animate-pulse" />
                </div>

                {/* Course Progress Skeleton */}
                <section className="h-48 bg-primary/20 rounded-2xl sm:rounded-[2.5rem] animate-pulse" />

                {/* Quests & League Grid Skeleton */}
                <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-4">
                        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-card rounded-2xl border border-border animate-pulse" />
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                        <div className="h-64 bg-card rounded-2xl border border-border animate-pulse" />
                    </div>
                </div>
            </main>
        </div>
    );
}
