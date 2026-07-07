import React from 'react';
import { Card } from '../../common/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useBudgetStore } from '../../../stores/budgetStore';
import { ExpenseCategory } from '../../../types/budget.types';
import { formatCurrency } from '../../../utils/currencyFormatter';

interface SpendingChartProps {
    selectedDate?: Date;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ selectedDate = new Date() }) => {
    const { expenses, budgets, currency, getConvertedAmount } = useBudgetStore();

    // Group expenses by category
    const categoryData = Object.values(ExpenseCategory).map((category) => {
        const categoryExpenses = expenses.filter((e) => {
            const expenseDate = new Date(e.date);
            return e.category === category &&
                expenseDate.getMonth() === selectedDate.getMonth() &&
                expenseDate.getFullYear() === selectedDate.getFullYear();
        });
        const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
        const budget = budgets.find((b) => b.category === category);

        return {
            category,
            spent: getConvertedAmount(spent, currency),
            budget: getConvertedAmount(budget?.limit || 0, currency),
        };
    }).filter((data) => data.spent > 0 || data.budget > 0);

    if (categoryData.length === 0) {
        return (
            <Card className="h-full flex flex-col justify-center min-h-[200px]">
                <h3 className="text-xl font-semibold mb-4">Spending Overview</h3>
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No spending data available yet
                </p>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <h3 className="text-xl font-semibold mb-4">Spending Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                    <XAxis
                        dataKey="category"
                        stroke="currentColor"
                        tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.6 }}
                        className="text-slate-500 dark:text-slate-400"
                    />
                    <YAxis
                        stroke="currentColor"
                        tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.6 }}
                        className="text-slate-500 dark:text-slate-400"
                        tickFormatter={(value) => {
                            // Manual formatting for Y-axis to save space
                            const symbol = currency === 'NGN' ? '₦' : currency === 'USD' ? '$' : currency === 'GBP' ? '£' : '€';
                            return `${symbol}${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`;
                        }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--tw-bg-opacity, rgba(255, 255, 255, 0.9))',
                            background: 'CanvasText' in document.documentElement.style ? undefined : undefined, // Placeholder for theme-aware bg
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: '16px',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                        }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                        cursor={{ fill: 'rgba(6, 182, 212, 0.05)' }}
                        formatter={(value: number) => [formatCurrency(value, currency), 'Spent']}
                    />
                    <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                    />
                    <Bar dataKey="spent" fill="url(#colorSpent)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="budget" fill="url(#colorBudget)" radius={[8, 8, 0, 0]} />
                    <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                        </linearGradient>
                        <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                            <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                        </linearGradient>
                    </defs>
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
