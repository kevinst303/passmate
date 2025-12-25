import { Skeleton, SkeletonCircle, SkeletonText } from "@/components/ui/Skeleton";

export default function SkillTreesLoading() {
    return (
        <div className="min-h-screen bg-muted/30 pb-24 md:pb-8 md:pl-28 md:pr-8">
            <header className="max-w-4xl mx-auto pt-8 pb-4">
                <SkeletonText className="h-10 w-64 mb-4" />
                <SkeletonText className="h-4 w-96" />
            </header>

            <main className="max-w-4xl mx-auto py-12">
                <div className="space-y-12">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center">
                            <SkeletonCircle className="w-24 h-24 mb-4 shadow-xl" />
                            <SkeletonText className="h-6 w-48 mb-2" />
                            <SkeletonText className="h-3 w-32" />
                            {i < 5 && <div className="w-1 h-12 bg-muted my-2" />}
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
