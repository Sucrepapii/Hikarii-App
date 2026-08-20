import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseFormData } from '../../utils/validationSchemas';
import { ExpenseCategory } from '../../types/budget.types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { DollarSign, Calendar } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useAuthStore, hasProAccess } from '../../stores/authStore';
import { UpgradeModal } from '../modals/UpgradeModal';
import { clsx } from "clsx";

interface ExpenseFormProps {
    onSubmit: (data: ExpenseFormData) => void;
    onCancel: () => void;
    defaultValues?: Partial<ExpenseFormData>;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({
    onSubmit,
    onCancel,
    defaultValues,
}) => {
    const { tasks } = useTaskStore();
    const { user } = useAuthStore();
    const isPro = hasProAccess(user);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
    });

    // Handle initial values and formatting
    React.useEffect(() => {
        if (defaultValues) {
            const formattedValues = { ...defaultValues };
            if (formattedValues.date) {
                const date = new Date(formattedValues.date);
                // @ts-ignore
                formattedValues.date = date.toISOString().split('T')[0];
            }
            reset(formattedValues);
        } else {
            reset({
                category: ExpenseCategory.OTHER,
                date: new Date().toISOString().split('T')[0] as any,
            });
        }
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Title"
                placeholder="Enter expense title..."
                error={errors.title?.message}
                {...register('title')}
            />

            <Input
                label="Amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                icon={<DollarSign className="w-4 h-4" />}
                error={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })}
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Category
                </label>
                <select
                    className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('category')}
                >
                    <option value={ExpenseCategory.FOOD}>Food</option>
                    <option value={ExpenseCategory.TRANSPORT}>Transport</option>
                    <option value={ExpenseCategory.ENTERTAINMENT}>Entertainment</option>
                    <option value={ExpenseCategory.UTILITIES}>Utilities</option>
                    <option value={ExpenseCategory.SHOPPING}>Shopping</option>
                    <option value={ExpenseCategory.HEALTH}>Health</option>
                    <option value={ExpenseCategory.OTHER}>Other</option>
                </select>
            </div>

            <Input
                label="Date"
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                {...register('date', {
                    setValueAs: (v) => (v ? new Date(v) : new Date()),
                })}
            />

            {/* Link Task */}
            <div>
                <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Link to Task (Optional)
                    </label>
                    {!isPro && (
                        <span
                            onClick={() => setShowUpgradeModal(true)}
                            className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded cursor-pointer hover:bg-amber-200"
                        >
                            PRO ONLY
                        </span>
                    )}
                </div>
                <div className="relative">
                    <select
                        {...register('linkedTaskId')}
                        disabled={!isPro}
                        className={clsx(
                            "w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
                            !isPro && "opacity-60 cursor-not-allowed bg-slate-100 dark:bg-slate-800"
                        )}
                    >
                        <option value="">None</option>
                        {tasks
                            .filter(task => task.status !== 'COMPLETED' || task.id === defaultValues?.linkedTaskId)
                            .map(task => (
                                <option key={task.id} value={task.id}>
                                    {task.title}
                                </option>
                            ))}
                    </select>
                    {!isPro && (
                        <div
                            className="absolute inset-0 z-10 cursor-pointer"
                            onClick={() => setShowUpgradeModal(true)}
                            title="Upgrade to link expenses to tasks"
                        />
                    )}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                    Associate this expense with a specific task
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description (Optional)
                </label>
                <textarea
                    placeholder="Enter expense description..."
                    className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={3}
                    {...register('description')}
                />
                {
                    errors.description && (
                        <p className="mt-1.5 text-sm text-danger-500">{errors.description.message}</p>
                    )
                }
            </div >

            <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                    Save Expense
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </form >
    );
};
