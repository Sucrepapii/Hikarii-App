import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { useAuthStore, hasProAccess } from '../stores/authStore';
import { UpgradeModal } from '../components/modals/UpgradeModal';
import { Button } from '../components/common/Button';
import { Lock } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { format, subDays, eachDayOfInterval, isSameDay } from 'date-fns';
import { TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';
import { SpendingChart } from '../components/budget/Charts/SpendingChart';
import { formatCurrency } from '../utils/currencyFormatter';
import { TaskStatus } from '../types/task.types'; // Kept for data calculations
import { TaskRecommendationCard } from '../components/intelligence/TaskRecommendationCard';
import { IntelligenceService } from '../utils/intelligenceService';

export const Analytics: React.FC = () => {
    const { tasks } = useTaskStore();
    const { expenses, budgets, currency, getConvertedAmount } = useBudgetStore();
    const { user } = useAuthStore();
    const isPro = hasProAccess(user);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);


    // 1. Prepare Cash Flow Trend Data (Last 30 Days)
    const today = new Date();
    const last30Days = subDays(today, 30);
    const dateRange = eachDayOfInterval({ start: last30Days, end: today });

    const cashFlowData = dateRange.map(date => {
        const dayExpenses = expenses
            .filter(e => isSameDay(new Date(e.date), date))
            .reduce((sum, e) => sum + e.amount, 0);

        // Note: Assuming income comes from tasks marked as INCOME type
        // This logic might need adjustment based on how income is strictly stored
        // For now using task financials if type is INCOME and status COMPLETED
        const dayIncome = tasks
            .filter(t =>
                t.financials?.type === 'INCOME' &&
                t.status === TaskStatus.COMPLETED &&
                isSameDay(new Date(t.createdAt), date)
            )
            .reduce((sum, t) => sum + (t.financials?.actualIncome || t.financials?.estimatedIncome || 0), 0);

        return {
            date: format(date, 'MMM dd'),
            Income: getConvertedAmount(dayIncome, currency),
            Expenses: getConvertedAmount(dayExpenses, currency)
        };
    });

    const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;

    // 3. Generate Intelligence Insights
    // Note: IntelligenceService expects non-null/undefined for financials mostly
    const recommendations = React.useMemo(() =>
        IntelligenceService.recommendNextTasks(tasks, budgets).slice(0, 3)
        , [tasks, budgets]);

    const insights = React.useMemo(() =>
        IntelligenceService.generateInsights(tasks, expenses || [], budgets).slice(0, 4)
        , [tasks, expenses, budgets, useBudgetStore.getState().currency]);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    Analytics & Reports
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Comprehensive view of your productivity, spending, and insights
                </p>
            </div>

            {/* Top Level Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-600 dark:text-slate-400">Net Cash Flow (30d)</h3>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-200 break-all">
                        {formatCurrency(cashFlowData.reduce((acc, curr) => acc + curr.Income - curr.Expenses, 0), currency)}
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-600">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-600 dark:text-slate-400">Task Completion Rate</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-accent-100 dark:bg-accent-900/30 text-accent-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-600 dark:text-slate-400">Actionable Insights</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {insights.length + recommendations.length}
                    </p>
                </Card>
            </div>

            {/* Main Financial Charts - PRO ONLY */}
            <div className="relative">
                {!isPro && (
                    <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4 text-primary-600 shadow-lg shadow-primary-500/20">
                            <Lock className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                            Unlock Detailed Reports
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8 text-lg">
                            Get full access to spending trends, income analysis, and detailed financial reports with Pro.
                        </p>
                        <Button onClick={() => setShowUpgradeModal(true)} variant="primary" size="lg">
                            Upgrade to Pro
                        </Button>
                    </div>
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${!isPro ? 'opacity-20 pointer-events-none select-none filter blur-sm' : ''}`}>
                    {/* Cash Flow Chart - From Analytics */}
                    <Card className="lg:col-span-1">
                        <h2 className="text-lg font-semibold mb-6 text-slate-800 dark:text-slate-200">
                            Income vs Expenses (Last 30 Days)
                        </h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={cashFlowData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => {
                                            // Handle compact formatting for Y-axis
                                            return value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value.toString();
                                        }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                            border: 'none'
                                        }}
                                        formatter={(value: number) => [
                                            formatCurrency(value, currency),
                                            // Name is automatically handled by dataKey
                                        ]}
                                    />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="Income"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="Expenses"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Spending Breakdown Chart - From Reports */}
                    <SpendingChart />
                </div>
            </div>


            {/* AI Insights Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold gradient-text mb-6">Hikarii Intelligence Insights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="relative">
                        {!isPro && (
                            <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-3 text-amber-600">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Recommendations Locked</h4>
                                <Button onClick={() => setShowUpgradeModal(true)} variant="ghost" className="text-primary-600">
                                    Unlock
                                </Button>
                            </div>
                        )}
                        <div className={`space-y-4 ${!isPro ? 'opacity-40 pointer-events-none select-none filter blur-sm' : ''}`}>
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Smart Recommendations</h3>
                            {recommendations.length > 0 ? (
                                recommendations.map((rec) => (
                                    <TaskRecommendationCard
                                        key={rec.taskId}
                                        recommendation={rec}
                                        onTaskClick={() => { }}
                                    />
                                ))
                            ) : (
                                <Card>
                                    <p className="text-slate-500 text-center py-4">
                                        No urgent recommendations right now. You are doing great!
                                    </p>
                                </Card>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        {!isPro && (
                            <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-center rounded-xl border border-slate-200 dark:border-slate-800">
                                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl mb-3 text-amber-600">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Deep Insights Locked</h4>
                                <Button onClick={() => setShowUpgradeModal(true)} variant="ghost" className="text-primary-600">
                                    Unlock
                                </Button>
                            </div>
                        )}
                        <div className={`space-y-4 ${!isPro ? 'opacity-40 pointer-events-none select-none filter blur-sm' : ''}`}>
                            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Financial & Productivity Insights</h3>
                            {insights.filter(i => i.type !== 'TASK_RECOMMENDATION').map(insight => (
                                <div key={insight.id} className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-300 rounded-lg">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">{insight.title}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{insight.message}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
