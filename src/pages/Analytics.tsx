import React from 'react';
import { Card } from '../components/common/Card';
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
import { TaskStatus } from '../types/task.types'; // Kept for data calculations
import { TaskRecommendationCard } from '../components/intelligence/TaskRecommendationCard';
import { IntelligenceService } from '../utils/intelligenceService';

export const Analytics: React.FC = () => {
    const { tasks } = useTaskStore();
    const { expenses, budgets } = useBudgetStore();


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
            Income: dayIncome,
            Expenses: dayExpenses
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
        , [tasks, expenses, budgets]);

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
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        ₦{(cashFlowData.reduce((acc, curr) => acc + curr.Income - curr.Expenses, 0)).toLocaleString()}
                    </p>
                </Card>

                <Card>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
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
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <h3 className="font-medium text-slate-600 dark:text-slate-400">Actionable Insights</h3>
                    </div>
                    <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                        {insights.length + recommendations.length}
                    </p>
                </Card>
            </div>

            {/* Main Financial Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                    tickFormatter={(value) => `₦${value / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                        border: 'none'
                                    }}
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


            {/* AI Insights Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <h2 className="text-2xl font-bold gradient-text mb-6">Hikari Intelligence Insights</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
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

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Financial & Productivity Insights</h3>
                        {insights.filter(i => i.type !== 'TASK_RECOMMENDATION').map(insight => (
                            <div key={insight.id} className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300 rounded-lg">
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
    );
};
