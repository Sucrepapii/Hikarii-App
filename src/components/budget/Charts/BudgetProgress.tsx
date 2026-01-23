import React from 'react';
import { Card } from '../../common/Card';
import { ExpenseCategory, BudgetPeriod } from '../../../types/budget.types';
import { useBudgetStore } from '../../../stores/budgetStore';
import { formatCurrency } from '../../../utils/currencyFormatter';
import { clsx } from 'clsx';
import { isSameDay, isSameWeek, isSameMonth } from 'date-fns';

interface BudgetProgressProps {
    selectedDate?: Date;
}

export const BudgetProgress: React.FC<BudgetProgressProps> = ({ selectedDate = new Date() }) => {
    const { budgets, expenses, currency } = useBudgetStore();

    if (budgets.length === 0) {
        return (
            <Card>
                <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                    No budgets set. Add a budget to start tracking!
                </p>
            </Card>
        );
    }

    return (
        <Card>
            <h3 className="text-xl font-semibold mb-4">Budget Progress</h3>
            <div className="space-y-4">
                {budgets.map((budget) => {
                    const categoryExpenses = expenses.filter(
                        (e) => {
                            const expenseDate = new Date(e.date);
                            const period = budget.period || BudgetPeriod.MONTHLY;

                            if (period === BudgetPeriod.DAILY) {
                                return e.category === budget.category && isSameDay(expenseDate, selectedDate);
                            } else if (period === BudgetPeriod.WEEKLY) {
                                return e.category === budget.category && isSameWeek(expenseDate, selectedDate, { weekStartsOn: 1 });
                            } else {
                                return e.category === budget.category &&
                                    expenseDate.getMonth() === selectedDate.getMonth() &&
                                    expenseDate.getFullYear() === selectedDate.getFullYear();
                            }
                        }
                    );
                    const spent = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
                    const percentage = (spent / budget.limit) * 100;
                    const isOverBudget = spent > budget.limit;
                    const isNearLimit = percentage >= 80 && !isOverBudget;
                    const periodLabel = budget.period === BudgetPeriod.DAILY ? 'Today' :
                        budget.period === BudgetPeriod.WEEKLY ? 'This Week' : 'Monthly';

                    return (
                        <div key={budget._id}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-slate-700 dark:text-slate-300">
                                    {budget.category} <span className="text-xs text-slate-400 font-normal">({periodLabel})</span>
                                </span>
                                <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {formatCurrency(spent, currency)} / {formatCurrency(budget.limit, currency)}
                                </span>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={clsx(
                                        'h-full rounded-full transition-all duration-500',
                                        isOverBudget
                                            ? 'bg-gradient-to-r from-danger-500 to-danger-600'
                                            : isNearLimit
                                                ? 'bg-gradient-to-r from-warning-500 to-warning-600'
                                                : 'bg-gradient-to-r from-success-500 to-success-600'
                                    )}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                            </div>

                            <div className="flex items-center justify-between mt-1">
                                <span
                                    className={clsx(
                                        'text-xs font-medium',
                                        isOverBudget
                                            ? 'text-danger-500'
                                            : isNearLimit
                                                ? 'text-warning-500'
                                                : 'text-success-500'
                                    )}
                                >
                                    {percentage.toFixed(1)}%
                                </span>
                                {isOverBudget && (
                                    <span className="text-xs text-danger-500 font-medium">
                                        Over budget by {formatCurrency(spent - budget.limit, currency)}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
