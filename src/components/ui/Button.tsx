import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "white";
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
        outline: "btn-outline",
        ghost: "btn-ghost",
        white: "btn-white",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={cn(
                "rounded-2xl transition-all disabled:opacity-50 disabled:pointer-events-none inline-flex items-center justify-center whitespace-nowrap",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
