import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-muted", className)}
            {...props}
        />
    );
}

export function SkeletonCircle({ className, ...props }: SkeletonProps) {
    return (
        <Skeleton
            className={cn("rounded-full", className)}
            {...props}
        />
    );
}

export function SkeletonText({ className, ...props }: SkeletonProps) {
    return (
        <Skeleton
            className={cn("h-4 w-full", className)}
            {...props}
        />
    );
}
