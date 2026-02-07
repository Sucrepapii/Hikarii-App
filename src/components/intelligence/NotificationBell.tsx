import React, { useState, useRef, useEffect } from "react";
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { Bell, X, AlertTriangle, Lightbulb, TrendingUp, CreditCard, Calendar, DollarSign, Shield } from "lucide-react";
import { InsightType, InsightPriority } from "../../types/intelligence.types";
import { clsx } from "clsx";
import { useAuthStore } from "../../stores/authStore";
import { useBudgetStore } from "../../stores/budgetStore";
import { formatCurrency } from "../../utils/currencyFormatter";

const insightIcons = {
    [InsightType.TASK_RECOMMENDATION]: Lightbulb,
    [InsightType.BUDGET_WARNING]: AlertTriangle,
    [InsightType.CASH_FLOW_ALERT]: TrendingUp,
    [InsightType.POSTPONE_SUGGESTION]: AlertTriangle,
    [InsightType.SUBSCRIPTION_ALERT]: CreditCard,
    [InsightType.PROJECT_RISK]: Calendar,
    [InsightType.SPENDING_OPT]: DollarSign,
    [InsightType.SYSTEM_UPDATE]: Shield,
};

const priorityStyles = {
    [InsightPriority.CRITICAL]: {
        bg: "bg-red-500/10 dark:bg-red-500/25 border-red-500/30",
        text: "text-red-700 dark:text-red-300",
        icon: "text-red-600 dark:text-red-400",
    },
    [InsightPriority.HIGH]: {
        bg: "bg-orange-500/10 dark:bg-orange-500/25 border-orange-500/30",
        text: "text-orange-700 dark:text-orange-300",
        icon: "text-orange-600 dark:text-orange-400",
    },
    [InsightPriority.MEDIUM]: {
        bg: "bg-yellow-500/10 dark:bg-yellow-500/25 border-yellow-500/30",
        text: "text-yellow-700 dark:text-yellow-300",
        icon: "text-yellow-600 dark:text-yellow-400",
    },
    [InsightPriority.LOW]: {
        bg: "bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/30",
        text: "text-blue-700 dark:text-blue-300",
        icon: "text-blue-600 dark:text-blue-400",
    },
};

export const NotificationBell: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { insights, recommendations, dismissInsight, clearAllInsights, refreshInsights } = useIntelligenceStore();
    const { user } = useAuthStore();
    const { currency, getConvertedAmount } = useBudgetStore();
    const isPro = user?.subscriptionStatus === 'PRO';
    const isAdmin = user?.role === 'ADMIN';

    const formatInsightMessage = (message: string) => {
        // Regex to find "NGN 1,000" or similar
        return message.replace(/NGN\s?([\d,.]+)/g, (match, amountStr) => {
            const amount = parseFloat(amountStr.replace(/,/g, ''));
            if (isNaN(amount)) return match;
            return formatCurrency(getConvertedAmount(amount, currency), currency);
        });
    };

    // Filter insights based on subscription and role:
    const visibleInsights = insights.filter(insight => {
        // Admins should not see personal financial insights
        if (isAdmin) {
            const personalTypes = [
                InsightType.CASH_FLOW_ALERT,
                InsightType.BUDGET_WARNING,
                InsightType.SPENDING_OPT,
                InsightType.POSTPONE_SUGGESTION
            ];
            // Exclude personal types for admins
            if (personalTypes.includes(insight.type)) return false;

            // For now, allow other types or upcoming system updates
            return true;
        }

        // For regular users:
        // Smart Insights (TASK_RECOMMENDATION) are Pro-only
        if (insight.type === InsightType.TASK_RECOMMENDATION) {
            return isPro;
        }
        // All other insights (warnings, alerts) are available to everyone
        return true;
    });

    // Recommendations are personal task suggestions, hide for admins
    const activeRecommendations = (isPro && !isAdmin) ? recommendations : [];

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
    const unreadCount = visibleInsights.length + activeRecommendations.length;
    const criticalCount = visibleInsights.filter((i) => i.priority === InsightPriority.CRITICAL).length +
        activeRecommendations.filter((r) => r.urgencyScore >= 80).length;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "relative p-2 rounded-xl transition-all duration-300",
                    unreadCount > 0
                        ? "bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400"
                )}
                title={`${unreadCount} ${isAdmin ? "update" : "notification"}${unreadCount !== 1 ? "s" : ""}`}
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
                <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 max-w-md max-h-[500px] overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 shadow-2xl z-50 animate-fade-in">
                    {/* Header */}
                    <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 px-4 py-3 z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {isAdmin ? "Updates" : "Notifications"}
                                </h3>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    {unreadCount}
                                </span>
                            </div>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => clearAllInsights()}
                                    className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                                >
                                    Clear All
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="p-2 space-y-2">
                        {unreadCount > 0 ? (
                            <>
                                {/* Recommendations */}
                                {activeRecommendations.map((rec) => (
                                    <div
                                        key={rec.taskId}
                                        className={clsx(
                                            "p-3 rounded-xl border-2 transition-all hover:scale-[1.02]",
                                            rec.urgencyScore >= 80 ? priorityStyles[InsightPriority.CRITICAL].bg :
                                                rec.urgencyScore >= 60 ? priorityStyles[InsightPriority.HIGH].bg :
                                                    priorityStyles[InsightPriority.MEDIUM].bg
                                        )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <Lightbulb className={clsx("w-5 h-5 mt-0.5 flex-shrink-0",
                                                rec.urgencyScore >= 80 ? priorityStyles[InsightPriority.CRITICAL].icon :
                                                    rec.urgencyScore >= 60 ? priorityStyles[InsightPriority.HIGH].icon :
                                                        priorityStyles[InsightPriority.MEDIUM].icon
                                            )} />
                                            <div className="flex-1 min-w-0">
                                                <h4 className={clsx("font-semibold text-sm mb-1",
                                                    rec.urgencyScore >= 80 ? priorityStyles[InsightPriority.CRITICAL].text :
                                                        rec.urgencyScore >= 60 ? priorityStyles[InsightPriority.HIGH].text :
                                                            priorityStyles[InsightPriority.MEDIUM].text
                                                )}>
                                                    {isAdmin ? "Suggested Update" : "Recommendation"}
                                                </h4>
                                                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                                                    {rec.reason}
                                                </p>
                                                {rec.estimatedCost ? (
                                                    <p className="text-xs mt-2 font-medium text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-1 inline-block">
                                                        💰 Cost: {formatCurrency(getConvertedAmount(rec.estimatedCost, currency), currency)}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Regular Insights */}
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
                                                        {formatInsightMessage(insight.message)}
                                                    </p>
                                                    {insight.suggestedAction && (
                                                        <p className="text-xs mt-2 font-medium text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-1">
                                                            💡 {insight.suggestedAction}
                                                        </p>
                                                    )}
                                                    {insight.financialImpact !== undefined && insight.financialImpact !== 0 && (
                                                        <p className="text-xs mt-1 font-semibold">
                                                            Impact: {formatCurrency(getConvertedAmount(Math.abs(insight.financialImpact), currency), currency)}
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
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    {isAdmin ? "Up to Date! 🚀" : "All Clear! 🎉"}
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isAdmin ? "No system updates at the moment" : "No alerts or warnings at the moment"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
