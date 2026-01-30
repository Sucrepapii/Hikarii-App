import React, { useState, useRef, useEffect } from "react";
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { Bell, X, AlertTriangle, Lightbulb, TrendingUp, CreditCard, Calendar, DollarSign } from "lucide-react";
import { InsightType, InsightPriority } from "../../types/intelligence.types";
import { clsx } from "clsx";
import { useAuthStore } from "../../stores/authStore";

const insightIcons = {
    [InsightType.TASK_RECOMMENDATION]: Lightbulb,
    [InsightType.BUDGET_WARNING]: AlertTriangle,
    [InsightType.CASH_FLOW_ALERT]: TrendingUp,
    [InsightType.POSTPONE_SUGGESTION]: AlertTriangle,
    [InsightType.SUBSCRIPTION_ALERT]: CreditCard,
    [InsightType.PROJECT_RISK]: Calendar,
    [InsightType.SPENDING_OPT]: DollarSign,
};

const priorityStyles = {
    [InsightPriority.CRITICAL]: {
        bg: "bg-red-500/10 border-red-500/30",
        text: "text-red-700 dark:text-red-300",
        icon: "text-red-600 dark:text-red-400",
    },
    [InsightPriority.HIGH]: {
        bg: "bg-orange-500/10 border-orange-500/30",
        text: "text-orange-700 dark:text-orange-300",
        icon: "text-orange-600 dark:text-orange-400",
    },
    [InsightPriority.MEDIUM]: {
        bg: "bg-yellow-500/10 border-yellow-500/30",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: "text-yellow-600 dark:text-yellow-400",
    },
    [InsightPriority.LOW]: {
        bg: "bg-blue-500/10 border-blue-500/30",
        text: "text-blue-700 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
    },
};

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { insights, dismissInsight, refreshInsights } = useIntelligenceStore();
    const { user } = useAuthStore();
    const isPro = user?.subscriptionStatus === 'PRO';

    // Filter insights based on subscription:
    // Smart Insights (TASK_RECOMMENDATION) are Pro-only
    const visibleInsights = insights.filter(insight => {
        // If it's a Smart Insight (task recommendation), only show for Pro users
        if (insight.type === InsightType.TASK_RECOMMENDATION) {
            return isPro;
        }
        // All other insights (warnings, alerts) are available to everyone
        return true;
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Refresh insights periodically
    useEffect(() => {
        refreshInsights();
        const interval = setInterval(refreshInsights, 60000); // Refresh every minute
        return () => clearInterval(interval);
    }, [refreshInsights]);



    // Use filtered insights for counts
    const unreadCount = visibleInsights.length;
    const criticalCount = visibleInsights.filter((i) => i.priority === InsightPriority.CRITICAL).length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "relative p-2 rounded-xl transition-all duration-300",
                    unreadCount > 0
                        ? "bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
                        : "glass hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                )}
                title={`${unreadCount} notification${unreadCount !== 1 ? "s" : ""}`}
            >
                <Bell className={clsx("w-5 h-5", unreadCount > 0 && "animate-pulse")} />

                {/* Badge */}
                {unreadCount > 0 && (
                    <span
                        className={clsx(
                            "absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold text-white",
                            criticalCount > 0
                                ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse"
                                : "bg-gradient-to-r from-primary-500 to-secondary-500"
                        )}
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 max-h-[500px] overflow-y-auto rounded-2xl glass border-2 border-white/20 dark:border-white/10 shadow-2xl z-50 animate-fade-in">
                    {/* Header */}
                    <div className="sticky top-0 glass backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-4 py-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                Notifications
                            </h3>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {unreadCount} alert{unreadCount !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="p-2">
                        {visibleInsights.length > 0 ? (
                            <div className="space-y-2">
                                {visibleInsights.map((insight) => {
                                    const InsightIcon = insightIcons[insight.type];
                                    const styles = priorityStyles[insight.priority];

                                    return (
                                        <div
                                            key={insight.id}
                                            className={clsx(
                                                "p-3 rounded-xl border-2 transition-all hover:scale-[1.02]",
                                                styles.bg
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <InsightIcon className={clsx("w-5 h-5 mt-0.5 flex-shrink-0", styles.icon)} />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={clsx("font-semibold text-sm mb-1", styles.text)}>
                                                        {insight.title}
                                                    </h4>
                                                    <p className={clsx("text-xs leading-relaxed", styles.text)}>
                                                        {insight.message}
                                                    </p>
                                                    {insight.suggestedAction && (
                                                        <p className="text-xs mt-2 font-medium text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-1">
                                                            💡 {insight.suggestedAction}
                                                        </p>
                                                    )}
                                                    {insight.financialImpact !== undefined && insight.financialImpact !== 0 && (
                                                        <p className="text-xs mt-1 font-semibold">
                                                            Impact: ₦{Math.abs(insight.financialImpact).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => dismissInsight(insight.id)}
                                                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-smooth flex-shrink-0"
                                                    title="Dismiss"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    All Clear! 🎉
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    No alerts or warnings at the moment
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
