"use client";

export default function LeaguesLoading() {
    return (
        <div className="min-h-screen bg-background pb-24 md:pb-8 md:pl-28 md:pr-8">
            {/* Header Skeleton */}
            <header className="max-w-4xl mx-auto pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="w-32 h-6 bg-muted rounded animate-pulse" />
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-muted rounded-[2.5rem] animate-pulse" />
                        <div className="space-y-2">
                            <div className="w-48 h-8 bg-muted rounded animate-pulse" />
                            <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-20 h-10 bg-muted rounded-2xl animate-pulse" />
                    <div className="w-20 h-10 bg-muted rounded-2xl animate-pulse" />
                </div>
            </header>

            <main className="max-w-4xl mx-auto py-8">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Left Column Skeleton */}
                    <div className="space-y-6">
                        <div className="h-64 bg-card glass rounded-[3rem] border border-border animate-pulse" />
                        <div className="h-40 bg-muted rounded-[3rem] animate-pulse" />
                    </div>

                    {/* Right Column Skeleton */}
                    <div className="md:col-span-2">
                        <div className="h-[600px] bg-card glass rounded-[3.5rem] border border-border animate-pulse" />
                    </div>
                </div>
            </main>
        </div>
    );
}
