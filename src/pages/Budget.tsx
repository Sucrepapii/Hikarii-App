import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { BudgetSummary } from '../components/budget/BudgetSummary';
import { ExpenseList } from '../components/budget/ExpenseList';
import { ExpenseForm } from '../components/budget/ExpenseForm';
import { BudgetProgress } from '../components/budget/Charts/BudgetProgress';
import { SpendingChart } from '../components/budget/Charts/SpendingChart';
import { BudgetProjection } from '../components/budget/BudgetProjection';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Plus, Settings, ChevronLeft, ChevronRight, ChevronDown, Calendar, Trash2 } from 'lucide-react';
import { useBudgetStore } from '../stores/budgetStore';
import { Expense, ExpenseCategory, BudgetPeriod } from '../types/budget.types';
import { ExpenseFormData } from '../utils/validationSchemas';
import { useAuthStore } from '../stores/authStore';

export const Budget: React.FC = () => {
    const { expenses, addExpense, updateExpense, deleteExpense, setBudget, deleteBudget, budgets, currency, setCurrency, forecasts, fetchForecasts } = useBudgetStore();
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const handleExpenseSubmit = async (data: ExpenseFormData) => {
        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, data);
                toast.success('Expense updated');
            } else {
                await addExpense(data);
                toast.success('Expense added');
            }
            setIsExpenseModalOpen(false);
            setEditingExpense(null);
        } catch (error: any) {
            toast.error('Failed to save expense');
        }
    };

    const handleEdit = (expense: Expense) => {
        setEditingExpense(expense);
        setIsExpenseModalOpen(true);
    };

    const handleCloseExpenseModal = () => {
        setIsExpenseModalOpen(false);
        setEditingExpense(null);
    };

    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<string | null>(null);

    const handleSetBudget = (category: ExpenseCategory, limit: number, period: BudgetPeriod) => {
        setBudget(category, limit, period);
    };

    const handleDeleteBudgetClick = (budgetIds: string) => {
        setBudgetToDelete(budgetIds);
    };

    const handleConfirmDeleteBudget = async () => {
        if (budgetToDelete) {
            await deleteBudget(budgetToDelete);
            toast.success('Budget removed');
            setBudgetToDelete(null);
        }
    };

    const handleDeleteExpenseClick = (id: string) => {
        setExpenseToDelete(id);
    };

    const handleConfirmDeleteExpense = async () => {
        if (expenseToDelete) {
            await deleteExpense(expenseToDelete);
            toast.success('Expense deleted');
            setExpenseToDelete(null);
        }
    };

    const { user } = useAuthStore();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const minDate = React.useMemo(() => {
        try {
            return user?.createdAt ? new Date(user.createdAt) : new Date(0);
        } catch {
            return new Date(0);
        }
    }, [user?.createdAt]);

    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [viewYear, setViewYear] = useState(selectedDate.getFullYear());

    // Reset view year when modal opens
    React.useEffect(() => {
        if (isDatePickerOpen) {
            setViewYear(selectedDate.getFullYear());
        }
    }, [isDatePickerOpen, selectedDate]);

    React.useEffect(() => {
        fetchForecasts();
    }, [expenses, budgets]); // Re-fetch when underlying data changes

    const isMinMonth = selectedDate.getMonth() === minDate.getMonth() &&
        selectedDate.getFullYear() === minDate.getFullYear();

    const changeMonth = (offset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);

        // Prevent going before registration month
        if (offset < 0 && newDate < minDate && !isMinMonth) {
            // If trying to go back but already at min month, do nothing (handled by button disable)
            // But if we just crossing boundary, ensure we don't go past
            if (newDate.getMonth() < minDate.getMonth() && newDate.getFullYear() === minDate.getFullYear()) return;
        }

        setSelectedDate(newDate);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Budget
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Track your expenses and manage your budget
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                    {/* Month Picker */}
                    <div className="relative order-1 flex-1 min-w-[280px]">
                        <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 border-2 border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => changeMonth(-1)}
                                disabled={isMinMonth}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
                            >
                                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>

                            <button
                                onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                                className="flex-1 px-2 sm:px-4 py-1.5 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors touch-manipulation"
                            >
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200">
                                    {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <button
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors touch-manipulation"
                            >
                                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        {isDatePickerOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDatePickerOpen(false)}
                                />
                                <div className="absolute top-full right-0 mt-2 p-4 glass rounded-2xl border-2 border-white/20 shadow-xl z-50 w-72 animate-in fade-in zoom-in-95 duration-200">
                                    {/* Year Selector */}
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            onClick={() => setViewYear(y => y - 1)}
                                            disabled={viewYear - 1 < minDate.getFullYear()}
                                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-30"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <span className="font-bold text-lg text-slate-700 dark:text-slate-200">
                                            {viewYear}
                                        </span>
                                        <button
                                            onClick={() => setViewYear(y => y + 1)}
                                            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Month Grid */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {Array.from({ length: 12 }, (_, i) => {
                                            const date = new Date(viewYear, i, 1);
                                            const isSelected = selectedDate.getMonth() === i && selectedDate.getFullYear() === viewYear;
                                            const isCurrentMonth = i === new Date().getMonth() && viewYear === new Date().getFullYear();
                                            const isDisabled = viewYear === minDate.getFullYear() && i < minDate.getMonth() || viewYear < minDate.getFullYear();

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        const newDate = new Date(selectedDate);
                                                        newDate.setFullYear(viewYear);
                                                        newDate.setMonth(i);
                                                        setSelectedDate(newDate);
                                                        setIsDatePickerOpen(false);
                                                    }}
                                                    disabled={isDisabled}
                                                    className={`
                                                        p-2 rounded-lg text-sm font-medium transition-all
                                                        ${isSelected
                                                            ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                            : isCurrentMonth
                                                                ? 'bg-primary-50 text-primary-600 border border-primary-100 dark:bg-primary-900/20 dark:text-primary-400 dark:border-primary-500/20'
                                                                : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'
                                                        }
                                                        ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}
                                                    `}
                                                >
                                                    {date.toLocaleString('default', { month: 'short' })}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-1 sm:flex-none gap-2 sm:gap-3 min-w-[280px]">
                        <Button
                            variant="secondary"
                            onClick={() => setIsBudgetModalOpen(true)}
                            className="flex-1 sm:flex-none justify-center gap-2 min-w-[120px] touch-manipulation"
                            size="sm"
                        >
                            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden xs:inline">Set Budget</span>
                            <span className="xs:hidden">Budget</span>
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => setIsExpenseModalOpen(true)}
                            className="flex-1 sm:flex-none justify-center gap-2 min-w-[120px] touch-manipulation"
                            size="sm"
                        >
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="hidden xs:inline">Add Expense</span>
                            <span className="xs:hidden">Expense</span>
                        </Button>
                    </div>
                </div>
            </div>

            <BudgetSummary />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <SpendingChart selectedDate={selectedDate} />
                <div className="space-y-6">
                    <BudgetProgress selectedDate={selectedDate} />
                    <BudgetProjection forecasts={forecasts} currency={currency} />
                </div>
            </div>

            <Card>
                <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
                <ExpenseList
                    expenses={expenses.slice().reverse().slice(0, 10)}
                    onEdit={handleEdit}
                    onDelete={handleDeleteExpenseClick}
                />
            </Card>

            <Modal
                isOpen={isExpenseModalOpen}
                onClose={handleCloseExpenseModal}
                title={editingExpense ? 'Edit Expense' : 'Add New Expense'}
            >
                <ExpenseForm
                    onSubmit={handleExpenseSubmit}
                    onCancel={handleCloseExpenseModal}
                    defaultValues={editingExpense || undefined}
                />
            </Modal>

            <Modal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                title="Set Budget Limits"
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Set monthly budget limits for each category
                    </p>
                    {Object.values(ExpenseCategory).map((category) => {
                        const existingBudget = budgets.find(b => b.category === category);
                        return (
                            <div key={category} className="flex items-center gap-2">
                                <label className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    {category}
                                </label>

                                <select
                                    className="w-24 text-sm px-2 py-2 rounded-lg glass border-2 border-white/20 dark:border-white/10 text-slate-900 dark:text-slate-100 bg-transparent"
                                    defaultValue={existingBudget?.period || BudgetPeriod.MONTHLY}
                                    onChange={(e) => {
                                        const period = e.target.value as BudgetPeriod;
                                        if (existingBudget?.limit) {
                                            handleSetBudget(category, existingBudget.limit, period);
                                        }
                                    }}
                                >
                                    <option value={BudgetPeriod.DAILY}>Daily</option>
                                    <option value={BudgetPeriod.WEEKLY}>Weekly</option>
                                    <option value={BudgetPeriod.MONTHLY}>Monthly</option>
                                </select>

                                <input
                                    type="number"
                                    placeholder="0.00"
                                    defaultValue={existingBudget?.limit}
                                    className="w-24 px-3 py-2 rounded-lg glass border-2 border-white/20 dark:border-white/10 text-slate-900 dark:text-slate-100"
                                    onBlur={(e) => {
                                        const value = parseFloat(e.target.value);
                                        if (value > 0) {
                                            const row = e.target.parentElement;
                                            const select = row?.querySelector('select');
                                            const selectedPeriod = (select?.value as BudgetPeriod) || BudgetPeriod.MONTHLY;

                                            // Convert input amount to NGN before saving
                                            const amountInNGN = useBudgetStore.getState().getAmountInBaseCurrency(value, currency);
                                            handleSetBudget(category, amountInNGN, selectedPeriod);
                                        }
                                    }}
                                />
                                {existingBudget && (
                                    <button
                                        onClick={() => handleDeleteBudgetClick(existingBudget.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Remove Budget"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {/* Currency Selector */}
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg glass border-2 border-white/20 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:border-primary-500 transition-smooth"
                        >
                            <option value="NGN">NGN - Nigerian Naira</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="CAD">CAD - Canadian Dollar</option>
                        </select>
                    </div>

                    <Button
                        variant="primary"
                        onClick={() => setIsBudgetModalOpen(false)}
                        className="w-full mt-4"
                    >
                        Save Budgets
                    </Button>
                </div>
            </Modal>

            <ConfirmModal
                isOpen={!!expenseToDelete}
                onClose={() => setExpenseToDelete(null)}
                onConfirm={handleConfirmDeleteExpense}
                title="Delete Expense"
                message="Are you sure you want to delete this expense? This action cannot be undone."
                confirmText="Delete Expense"
                variant="danger"
            />

            <ConfirmModal
                isOpen={!!budgetToDelete}
                onClose={() => setBudgetToDelete(null)}
                onConfirm={handleConfirmDeleteBudget}
                title="Remove Budget Limit"
                message="Are you sure you want to remove this budget limit? You will stop tracking spending against this category."
                confirmText="Remove Limit"
                variant="danger"
            />
        </div>
    );
};
