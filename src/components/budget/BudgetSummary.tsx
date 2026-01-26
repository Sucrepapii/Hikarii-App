import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, Wallet, DollarSign } from 'lucide-react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useBudgetStore } from '../../stores/budgetStore';

export const BudgetSummary: React.FC = () => {
    const { expenses, budgets, currency } = useBudgetStore();

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const remaining = totalBudget - totalSpent;
    const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Spent */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-danger-500/20 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-danger-500/10">
                            <TrendingUp className="w-5 h-5 text-danger-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Total Spent
                        </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold gradient-text truncate">
                        {formatCurrency(totalSpent, currency)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {expenses.length} expenses
                    </p>
                </div>
            </Card>

            {/* Total Budget */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary-500/10">
                            <Wallet className="w-5 h-5 text-primary-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Total Budget
                        </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold gradient-text truncate">
                        {formatCurrency(totalBudget, currency)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {budgets.length} categories
                    </p>
                </div>
            </Card>

            {/* Remaining */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success-500/20 to-transparent rounded-full blur-2xl" />
                <div className="relative">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-success-500/10">
                            <DollarSign className="w-5 h-5 text-success-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                            Remaining
                        </span>
                    </div>
                    <p className="text-2xl md:text-3xl font-bold gradient-text truncate">
                        {formatCurrency(remaining, currency)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {percentageUsed.toFixed(1)}% used
                    </p>
                </div>
            </Card>
        </div>
    );
};
