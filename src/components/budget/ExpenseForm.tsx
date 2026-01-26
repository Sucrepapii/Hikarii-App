import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { expenseSchema, ExpenseFormData } from '../../utils/validationSchemas';
import { ExpenseCategory } from '../../types/budget.types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { DollarSign, Calendar } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';

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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseFormData>({
        resolver: zodResolver(expenseSchema),
        defaultValues: defaultValues || {
            category: ExpenseCategory.OTHER,
            date: new Date(),
        },
    });

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

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Link to Task (Optional)
                </label>
                <select
                    className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    {...register('linkedTaskId')}
                >
                    <option value="">None</option>
                    {tasks.map(task => (
                        <option key={task.id} value={task.id}>
                            {task.title}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                    Link this expense to a task to track project spending.
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
                {errors.description && (
                    <p className="mt-1.5 text-sm text-danger-500">{errors.description.message}</p>
                )}
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                    Save Expense
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
