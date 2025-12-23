import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
}

export const Button = ({
    className,
    variant = "primary",
    size = "md",
    ...props
}: ButtonProps) => {
    const variants = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        accent: "btn-accent",
        outline: "border-2 border-primary text-primary hover:bg-primary/10",
        ghost: "hover:bg-primary/10 text-primary",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(
                "rounded-2xl font-bold transition-all disabled:opacity-50 disabled:pointer-events-none",
                variant !== "outline" ? variants[variant] : variants.outline,
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
