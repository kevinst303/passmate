import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

export default function AchievementsLoading() {
    return (
        <div className="min-h-screen bg-muted/30 pb-24 md:pb-8 md:pl-28 md:pr-8">
            <header className="max-w-6xl mx-auto pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <SkeletonCircle className="w-16 h-16" />
                    <div className="space-y-2">
                        <SkeletonText className="h-8 w-48" />
                        <SkeletonText className="h-4 w-64" />
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto py-8 space-y-12">
                <Skeleton className="h-48 rounded-[3.5rem]" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-[3rem]" />
                    ))}
                </div>
            </main>
        </div>
    );
}
