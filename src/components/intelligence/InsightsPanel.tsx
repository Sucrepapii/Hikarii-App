import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { useIntelligenceStore } from "../../stores/intelligenceStore";
import { useTaskStore } from "../../stores/taskStore";
import { useBudgetStore } from "../../stores/budgetStore";
import { Card } from "../common/Card";
import { TaskRecommendationCard } from "./TaskRecommendationCard";
import {
    TrendingUp,
    RefreshCw,
    LineChart,
    Lock,
    Zap,
} from "lucide-react";

import { clsx } from "clsx";
import { useAuthStore } from "../../stores/authStore";
import { Button } from "../common/Button";
import { UpgradeModal } from "../modals/UpgradeModal";
import { isFeatureAvailable } from "../../config/features";

interface InsightsPanelProps {
    onTaskClick?: (taskId: string) => void;
}



export const InsightsPanel: React.FC<InsightsPanelProps> = ({ onTaskClick }) => {
    const { recommendations, refreshInsights } =
        useIntelligenceStore();
    const tasks = useTaskStore((state) => state.tasks);
    const budgets = useBudgetStore((state) => state.budgets);
    const { expenses, currency } = useBudgetStore();

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

    // Calculate Real Analytics
    const calculateAnalytics = () => {
        // 1. Projected Savings - Calculate from budget vs actual spending
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
        const totalSpent = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
        const projectedSavings = Math.max(0, totalBudget - totalSpent);

        // Compare with last month
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const lastMonthExpenses = expenses.filter(e => {
            const expenseDate = new Date(e.date);
            return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
        });
        const lastMonthSpent = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        const lastMonthBudget = totalBudget; // Assuming same budget
        const lastMonthSavings = Math.max(0, lastMonthBudget - lastMonthSpent);
        const savingsChange = lastMonthSavings > 0
            ? ((projectedSavings - lastMonthSavings) / lastMonthSavings * 100)
            : 0;

        // 2. Peak Productivity - Find most productive day/time from completed tasks
        const completedTasks = tasks.filter(t => t.status === 'COMPLETED' && t.completedAt);
        const tasksByDayHour: Record<string, number> = {};

        completedTasks.forEach(task => {
            if (task.completedAt) {
                const date = new Date(task.completedAt);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const hour = date.getHours();
                const key = `${day}-${hour}`;
                tasksByDayHour[key] = (tasksByDayHour[key] || 0) + 1;
            }
        });

        let peakDay = 'N/A';
        let peakHour = 0;
        let maxTasks = 0;
        Object.entries(tasksByDayHour).forEach(([key, count]) => {
            if (count > maxTasks) {
                maxTasks = count;
                const [day, hour] = key.split('-');
                peakDay = day;
                peakHour = parseInt(hour);
            }
        });

        const focusScore = completedTasks.length > 0
            ? Math.min(100, Math.round((completedTasks.length / Math.max(tasks.length, 1)) * 100))
            : 0;

        // 3. Expense Anomalies - Detect unusual spending patterns
        const avgExpense = expenses.length > 0
            ? expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length
            : 0;
        const anomalies = expenses.filter(e => e.amount > avgExpense * 2.5).length;

        return {
            projectedSavings,
            savingsChange,
            peakDay,
            peakHour,
            focusScore,
            anomalies,
            lastScanned: new Date()
        };
    };

    const analytics = calculateAnalytics();


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


            {/* AI Insights List - PRO ONLY */}



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
                        {!isPro && (
                            <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Lock className="w-3 h-3" /> PRO
                            </span>
                        )}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-white dark:bg-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Projected Savings</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                {useBudgetStore.getState().formatCurrency(analytics.projectedSavings, currency)}
                            </p>
                            <p className={`text-xs ${analytics.savingsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {analytics.savingsChange >= 0 ? '+' : ''}{analytics.savingsChange.toFixed(1)}% vs last month
                            </p>
                        </Card>
                        <Card className="bg-white dark:bg-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Peak Productivity</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                {analytics.peakDay === 'N/A' ? 'No data yet' : `${analytics.peakDay}, ${analytics.peakHour > 12 ? analytics.peakHour - 12 : analytics.peakHour} ${analytics.peakHour >= 12 ? 'PM' : 'AM'}`}
                            </p>
                            <p className="text-xs text-blue-500">Focus Score: {analytics.focusScore}</p>
                        </Card>
                        <Card className="bg-white dark:bg-slate-800">
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-1">Expense Anomalies</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">{analytics.anomalies} Detected</p>
                            <p className="text-xs text-slate-400">
                                Last scanned {Math.floor((new Date().getTime() - analytics.lastScanned.getTime()) / 1000 / 60)}m ago
                            </p>
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
