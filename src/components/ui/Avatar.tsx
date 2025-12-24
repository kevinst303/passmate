"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    className?: string;
    fallback?: string;
}

export function Avatar({
    src,
    alt = "Avatar",
    size = "md",
    className,
    fallback = "🐨",
}: AvatarProps) {
    const [error, setError] = useState(false);

    const sizeClasses = {
        sm: "w-8 h-8 text-sm rounded-lg",
        md: "w-12 h-12 text-xl rounded-xl",
        lg: "w-16 h-16 text-2xl rounded-2xl",
        xl: "w-24 h-24 text-4xl rounded-3xl",
        "2xl": "w-40 h-40 text-7xl rounded-[3.5rem]",
    };

    return (
        <div
            className={cn(
                "relative flex items-center justify-center bg-muted/30 border-2 border-border overflow-hidden shrink-0 transition-all",
                sizeClasses[size],
                className
            )}
        >
            {src && !error ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover"
                    onError={() => setError(true)}
                    unoptimized={src.endsWith(".svg")}
                />
            ) : (
                <span role="img" aria-label="avatar fallback">
                    {fallback}
                </span>
            )}
        </div>
    );
}
