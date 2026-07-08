import React from "react";
import { TaskRecommendation } from "../../types/intelligence.types";
import { useTaskStore } from "../../stores/taskStore";
import { Card } from "../common/Card";
import { clsx } from "clsx";
import { useBudgetStore } from "../../stores/budgetStore";
import { formatCurrency } from "../../utils/currencyFormatter";

interface TaskRecommendationCardProps {
    recommendation: TaskRecommendation;
    onTaskClick?: (taskId: string) => void;
}

export const TaskRecommendationCard: React.FC<TaskRecommendationCardProps> = ({
    recommendation,
    onTaskClick,
}) => {
    const task = useTaskStore((state) => state.getTaskById(recommendation.taskId));
    const { currency, getConvertedAmount } = useBudgetStore();

    if (!task) return null;

    // Urgency color based on score
    const urgencyColor =
        recommendation.urgencyScore >= 80
            ? "text-red-600 dark:text-red-400 bg-red-500/10"
            : recommendation.urgencyScore >= 60
                ? "text-orange-600 dark:text-orange-400 bg-orange-500/10"
                : "text-yellow-600 dark:text-yellow-400 bg-yellow-500/10";

    const urgencyBarColor =
        recommendation.urgencyScore >= 80
            ? "bg-gradient-to-r from-red-500 to-red-600"
            : recommendation.urgencyScore >= 60
                ? "bg-gradient-to-r from-orange-500 to-orange-600"
                : "bg-gradient-to-r from-yellow-500 to-yellow-600";

    return (
        <Card
            className="cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onTaskClick?.(recommendation.taskId)}
        >
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                            {task.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {recommendation.reason}
                        </p>
                    </div>
                    <span
                        className={clsx(
                            "px-2 py-1 rounded-lg text-xs font-bold",
                            urgencyColor
                        )}
                    >
                        {recommendation.urgencyScore}
                    </span>
                </div>

                {/* Urgency Bar */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Urgency</span>
                        <span>{recommendation.urgencyScore}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className={clsx("h-full transition-all duration-500", urgencyBarColor)}
                            style={{ width: `${recommendation.urgencyScore}%` }}
                        />
                    </div>
                </div>

                {/* Financial Context */}
                {recommendation.estimatedCost ? (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                        <span>💰 Cost: {formatCurrency(getConvertedAmount(recommendation.estimatedCost, currency), currency)}</span>
                    </div>
                ) : recommendation.financialContext && (
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
                        <span>💰 {recommendation.financialContext}</span>
                    </div>
                )}
            </div>
        </Card>
    );
};
