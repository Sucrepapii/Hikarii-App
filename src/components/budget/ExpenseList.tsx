import React from 'react';
import { Expense, ExpenseCategory } from '../../types/budget.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Trash2, Edit, ShoppingBag, Car, Film, Zap, Heart, Package, GraduationCap, BookOpen } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/currencyFormatter';
import { useBudgetStore } from '../../stores/budgetStore';
import { clsx } from 'clsx';

interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

const categoryIcons = {
    [ExpenseCategory.FOOD]: Package,
    [ExpenseCategory.TRANSPORT]: Car,
    [ExpenseCategory.ENTERTAINMENT]: Film,
    [ExpenseCategory.UTILITIES]: Zap,
    [ExpenseCategory.SHOPPING]: ShoppingBag,
    [ExpenseCategory.HEALTH]: Heart,
    [ExpenseCategory.TUITION]: GraduationCap,
    [ExpenseCategory.BOOKS]: BookOpen,
    [ExpenseCategory.GROCERIES]: ShoppingBag,
    [ExpenseCategory.OTHER]: Package,
};

const categoryColors = {
    [ExpenseCategory.FOOD]: 'bg-orange-500',
    [ExpenseCategory.TRANSPORT]: 'bg-blue-500',
    [ExpenseCategory.ENTERTAINMENT]: 'bg-purple-500',
    [ExpenseCategory.UTILITIES]: 'bg-yellow-500',
    [ExpenseCategory.SHOPPING]: 'bg-pink-500',
    [ExpenseCategory.HEALTH]: 'bg-red-500',
    [ExpenseCategory.TUITION]: 'bg-indigo-500',
    [ExpenseCategory.BOOKS]: 'bg-emerald-500',
    [ExpenseCategory.GROCERIES]: 'bg-rose-500',
    [ExpenseCategory.OTHER]: 'bg-slate-500',
};

export const ExpenseList: React.FC<ExpenseListProps> = ({
    expenses,
    onEdit,
    onDelete,
}) => {
    const { currency } = useBudgetStore();
    if (expenses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full glass mb-4">
                    <Package className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No expenses yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Add your first expense to start tracking!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {expenses.map((expense) => {
                const CategoryIcon = categoryIcons[expense.category];

                return (
                    <Card key={expense.id} className="group">
                        <div className="flex items-center gap-4">
                            {/* Category Icon */}
                            <div
                                className={clsx(
                                    'p-3 rounded-xl text-white',
                                    categoryColors[expense.category]
                                )}
                            >
                                <CategoryIcon className="w-5 h-5" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    {expense.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {expense.category}
                                    </span>
                                    <span className="text-sm text-slate-400">•</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">
                                        {formatDate(expense.date)}
                                    </span>
                                </div>
                                {expense.description && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        {expense.description}
                                    </p>
                                )}
                            </div>

                            {/* Amount */}
                            <div className="text-right min-w-[80px]">
                                <p className="text-sm sm:text-base md:text-lg font-bold gradient-text break-all">
                                    {formatCurrency(useBudgetStore.getState().getConvertedAmount(expense.amount, currency), currency)}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(expense)}
                                    className="p-2 sm:p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg sm:rounded-xl transition-smooth flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden lg:inline font-medium">Edit</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(expense.id)}
                                    className="p-2 sm:p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg sm:rounded-xl transition-smooth flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                    <span className="hidden lg:inline font-medium">Delete</span>
                                </Button>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};
