import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { useTaskStore } from "../../stores/taskStore";
import { useBudgetStore } from "../../stores/budgetStore";
import { Card } from "../common/Card";
import { TaskRecommendationCard } from "./TaskRecommendationCard";
import { InsightCard } from "./InsightCard";
import {
    TrendingUp,
    RefreshCw,
    Wallet,
    CheckSquare,
    LineChart,
    Lock,
    Zap,
    Lightbulb
} from "lucide-react";

import { clsx } from "clsx";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../common/Button";
import { UpgradeModal } from "../modals/UpgradeModal";

interface InsightsPanelProps {
    onTaskClick?: (taskId: string) => void;
}



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
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const { user } = useAuthStore();
    const isPro = user?.subscriptionStatus === 'PRO';

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshInsights();
        setIsRefreshing(false);
        toast.success("Insights updated");
    };

    // Calculate Metrics
    const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalExpenses = useBudgetStore.getState().expenses.reduce((sum, e) => sum + e.amount, 0);
    const netCashFlow = totalBudget - totalExpenses;

    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

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

            {/* Free: Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="flex items-center gap-4 bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                        <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Net Cash Flow</p>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                            ₦{netCashFlow.toLocaleString()}
                        </p>
                    </div>
                </Card>
                <Card className="flex items-center gap-4 bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Task Completion</p>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                            {completionRate}%
                        </p>
                    </div>


                </Card>
            </div>

            {/* AI Insights List - PRO ONLY */}
            {isPro && insights.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500" />
                        Key Insights
                    </h3>
                    <div className="space-y-3">
                        {insights.map((insight) => (
                            <InsightCard
                                key={insight.id}
                                insight={insight}
                                onDismiss={dismissInsight}
                                onAction={(i) => {
                                    if (i.taskId && onTaskClick) onTaskClick(i.taskId);
                                    // Handle other actions or dismiss
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}


            {/* Actionable Insights (Smart Recommendations) - PRO ONLY */}
            <div className="relative">
                <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-500" />
                            Smart Recommendations
                        </h3>
                        {!isPro && (
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Lock className="w-3 h-3" /> PRO
                            </span>
                        )}
                    </div>

                    {!isPro && (
                        <div className="absolute inset-x-0 top-10 bottom-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center rounded-xl border border-slate-200 dark:border-slate-800">
                            <p className="text-slate-900 dark:text-white font-bold mb-2">Unlock Smart Recommendations</p>
                            <Button onClick={() => setShowUpgradeModal(true)} variant="primary" size="sm">
                                Upgrade
                            </Button>
                        </div>
                    )}

                    <div className={clsx("space-y-3", !isPro && "opacity-40 blur-sm pointer-events-none select-none")}>
                        {topRecommendations.length > 0 ? (
                            topRecommendations.map((rec) => (
                                <TaskRecommendationCard
                                    key={rec.taskId}
                                    recommendation={rec}
                                    onTaskClick={onTaskClick}
                                />
                            ))
                        ) : (
                            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-slate-500 dark:text-slate-400 font-medium">
                                    All clear! No urgent actions needed.
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Your tasks and budget are on track.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Pro: Advanced Analytics (Locked for Free) */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-6">
                {!isPro && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center mb-3 text-amber-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            Unlock Deep Analytics
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-sm mb-6 text-sm">
                            Upgrade to Pro to see detailed Spending Forecasts, Productivity Trends, and Anomaly Detection.
                        </p>
                        <Button onClick={() => setShowUpgradeModal(true)} variant="primary">
                            Upgrade to Pro
                        </Button>
                    </div>
                )}

                {/* Content - Blurred if Free, Visible if Pro */}
                <div className={clsx("space-y-4", !isPro && "opacity-40 blur-sm pointer-events-none select-none")}>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-purple-500" />
                        Advanced Analytics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white dark:bg-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Projected Savings</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">₦45,200</p>
                            <p className="text-xs text-emerald-500">+12% vs last month</p>
                        </Card>
                        <Card className="bg-white dark:bg-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Peak Productivity</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">Tue, 10 AM</p>
                            <p className="text-xs text-blue-500">Focus Score: 92</p>
                        </Card>
                        <Card className="bg-white dark:bg-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Expense Anomalies</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">0 Detected</p>
                            <p className="text-xs text-slate-400">Last scanned 2h ago</p>
                        </Card>
                    </div>
                </div>
            </div>

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </div>
    );
};
