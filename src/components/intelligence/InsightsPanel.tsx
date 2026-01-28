import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { useTaskStore } from "../../stores/taskStore";
import { useBudgetStore } from "../../stores/budgetStore";
import { Card } from "../common/Card";
import { TaskRecommendationCard } from "./TaskRecommendationCard";
import {
    Lightbulb,
    AlertTriangle,
    TrendingUp,
    X,
    RefreshCw,
    CreditCard,
    Calendar,
    DollarSign,
} from "lucide-react";
import { InsightType, InsightPriority } from "../../types/intelligence.types";
import { clsx } from "clsx";

interface InsightsPanelProps {
    onTaskClick?: (taskId: string) => void;
}

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

export const InsightsPanel: React.FC<InsightsPanelProps> = ({ onTaskClick }) => {
    const { insights, recommendations, refreshInsights, dismissInsight } =
        useIntelligenceStore();
    const tasks = useTaskStore((state) => state.tasks);
    const budgets = useBudgetStore((state) => state.budgets);

    // Refresh insights when tasks or budgets change
    useEffect(() => {
        refreshInsights();
    }, [tasks, budgets, refreshInsights]);

    const topRecommendations = recommendations.slice(0, 3);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshInsights();
        setIsRefreshing(false);
        toast.success("Insights updated");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        💡 Smart Insights
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        AI-powered task & budget recommendations
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className={clsx(
                        "p-2 rounded-xl bg-primary-500/10 hover:bg-primary-500/20 text-primary-600 dark:text-primary-400 transition-smooth",
                        isRefreshing && "opacity-50 cursor-not-allowed spin-slow"
                    )}
                    title="Refresh Insights"
                >
                    <RefreshCw className={clsx("w-5 h-5", isRefreshing && "animate-spin")} />
                </button>
            </div>

            {/* What Should I Do Next? */}
            {topRecommendations.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-500" />
                        What Should I Do Next?
                    </h3>
                    <div className="space-y-3">
                        {topRecommendations.map((rec) => (
                            <TaskRecommendationCard
                                key={rec.taskId}
                                recommendation={rec}
                                onTaskClick={onTaskClick}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Alerts & Warnings */}
            {insights.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Alerts & Warnings
                    </h3>
                    <div className="space-y-3">
                        {insights.map((insight) => {
                            const InsightIcon = insightIcons[insight.type];
                            const styles = priorityStyles[insight.priority];

                            return (
                                <Card
                                    key={insight.id}
                                    className={clsx(
                                        "border-2",
                                        styles.bg
                                    )}
                                >
                                    <div className="flex items-start gap-3">
                                        <InsightIcon className={clsx("w-5 h-5 mt-0.5", styles.icon)} />
                                        <div className="flex-1 min-w-0">
                                            <h4 className={clsx("font-semibold mb-1", styles.text)}>
                                                {insight.title}
                                            </h4>
                                            <p className={clsx("text-sm", styles.text)}>
                                                {insight.message}
                                            </p>
                                            {insight.suggestedAction && (
                                                <p className="text-xs mt-2 font-medium text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-800/50 rounded-lg px-2 py-1 inline-block">
                                                    💡 {insight.suggestedAction}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => dismissInsight(insight.id)}
                                            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-smooth"
                                            title="Dismiss"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {insights.length === 0 && topRecommendations.length === 0 && (
                <Card className="text-center py-12">
                    <Lightbulb className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        All Clear! 🎉
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        No urgent tasks or budget conflicts at the moment. Keep it up!
                    </p>
                </Card>
            )}
        </div>
    );
};
