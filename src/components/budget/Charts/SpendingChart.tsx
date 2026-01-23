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
    const { expenses, budgets, currency } = useBudgetStore();

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
            spent,
            budget: budget?.limit || 0,
        };
    }).filter((data) => data.spent > 0 || data.budget > 0);

    if (categoryData.length === 0) {
        return (
            <Card>
                <h3 className="text-xl font-semibold mb-4">Spending Overview</h3>
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No spending data available yet
                </p>
            </Card>
        );
    }

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-4">Spending Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                    <XAxis
                        dataKey="category"
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)',
                        }}
                        labelStyle={{ color: '#e2e8f0' }}
                        formatter={(value: number) => formatCurrency(value, currency)}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                    <Bar dataKey="spent" fill="url(#colorSpent)" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="budget" fill="url(#colorBudget)" radius={[8, 8, 0, 0]} />
                    <defs>
                        <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
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
