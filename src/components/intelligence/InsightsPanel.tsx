import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { useTaskStore } from "../../stores/taskStore";
import { useBudgetStore } from "../../stores/budgetStore";
import { Card } from "../common/Card";
import { TaskRecommendationCard } from "./TaskRecommendationCard";
import {
    Lightbulb,
    TrendingUp,
    RefreshCw,
} from "lucide-react";

import { clsx } from "clsx";

interface InsightsPanelProps {
    onTaskClick?: (taskId: string) => void;
}



export const InsightsPanel: React.FC<InsightsPanelProps> = ({ onTaskClick }) => {
    const { recommendations, refreshInsights } =
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



            {/* Empty State */}
            {topRecommendations.length === 0 && (
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
