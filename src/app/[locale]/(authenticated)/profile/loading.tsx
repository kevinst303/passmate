import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-muted/30 pb-24 md:pb-8 md:pl-28 md:pr-8">
            <header className="max-w-4xl mx-auto pt-8 pb-4">
                <div className="w-32 h-6 bg-muted rounded animate-pulse mb-6" />
                <div className="flex items-center gap-6 mb-8">
                    <SkeletonCircle className="w-20 h-20 sm:w-28 sm:h-28" />
                    <div className="flex-1 space-y-3">
                        <SkeletonText className="h-8 w-48" />
                        <SkeletonText className="h-4 w-64" />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-24 rounded-3xl" />
                    ))}
                </div>

                <div className="space-y-4">
                    <SkeletonText className="h-6 w-32" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 rounded-[2.5rem]" />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
