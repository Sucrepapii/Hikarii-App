import React from "react";

interface FinancialImpactBadgeProps {
    amount: number;
    type: "expense" | "income" | "neutral";
    size?: "sm" | "md" | "lg";
    showIcon?: boolean;
    className?: string;
}

export const FinancialImpactBadge: React.FC<FinancialImpactBadgeProps> = ({
    amount,
    type,
    size = "md",
    showIcon = true,
    className = "",
}) => {
    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-1.5",
    };

    const typeStyles = {
        expense: {
            bg: "bg-red-500/10 dark:bg-red-500/20",
            text: "text-red-600 dark:text-red-400",
            icon: "↓",
            border: "border border-red-500/30",
        },
        income: {
            bg: "bg-green-500/10 dark:bg-green-500/20",
            text: "text-green-600 dark:text-green-400",
            icon: "↑",
            border: "border border-green-500/30",
        },
        neutral: {
            bg: "bg-slate-500/10 dark:bg-slate-500/20",
            text: "text-slate-600 dark:text-slate-400",
            icon: "•",
            border: "border border-slate-500/30",
        },
    };

    const style = typeStyles[type];

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full font-semibold ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} ${className}`}
            title={`${type === "expense" ? "Cost" : type === "income" ? "Income" : "Financial impact"}: ₦${amount.toLocaleString()}`}
        >
            {showIcon && <span className="font-bold">{style.icon}</span>}
            <span>₦{amount.toLocaleString()}</span>
        </span>
    );
};
