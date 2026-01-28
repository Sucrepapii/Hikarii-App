import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '../../utils/validationSchemas';
import { TaskStatus, TaskPriority, TaskType } from '../../types/task.types';
import { ExpenseCategory } from '../../types/budget.types';
import { Project } from '../../types/project.types';
import { projectService } from '../../services/project.service';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Calendar, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Briefcase } from 'lucide-react';

interface TaskFormProps {
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
    defaultValues?: Partial<TaskFormData>;
    submitLabel?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
    onSubmit,
    onCancel,
    defaultValues,
    submitLabel = 'Save Task',
}) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: defaultValues || {
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            tags: [],
        },
    });

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (err) {
                console.error("Failed to load projects", err);
            }
        };
        loadProjects();
    }, []);

    const selectedTaskType = watch('taskType');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
                label="Title"
                placeholder="Enter task title..."
                error={errors.title?.message}
                {...register('title')}
            />

            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Description
                </label>
                <textarea
                    placeholder="Enter task description..."
                    className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    rows={4}
                    {...register('description')}
                />
                {errors.description && (
                    <p className="mt-1.5 text-sm text-danger-500">{errors.description.message}</p>
                )}
            </div>

            {/* Project Selection */}
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Project (Optional)
                </label>
                <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        {...register('projectId')}
                    >
                        <option value="">No Project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Priority
                    </label>
                    <select
                        className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        {...register('priority')}
                    >
                        <option value={TaskPriority.LOW}>Low</option>
                        <option value={TaskPriority.MEDIUM}>Medium</option>
                        <option value={TaskPriority.HIGH}>High</option>
                        <option value={TaskPriority.URGENT}>Urgent</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Status
                    </label>
                    <select
                        className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        {...register('status')}
                    >
                        <option value={TaskStatus.TODO}>To Do</option>
                        <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
                        <option value={TaskStatus.COMPLETED}>Completed</option>
                    </select>
                </div>
            </div>

            <Input
                label="Due Date"
                type="date"
                icon={<Calendar className="w-4 h-4" />}
                {...register('dueDate', {
                    setValueAs: (v) => (v ? new Date(v) : undefined),
                })}
            />

            {/* Financial Intelligence Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Financial Intelligence
                </h3>

                <div className="space-y-4">
                    {/* Task Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Task Type
                        </label>
                        <select
                            className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            {...register('taskType')}
                        >
                            <option value={TaskType.NEUTRAL}>None (Neutral)</option>
                            <option value={TaskType.EXPENSE}>💸 Expense (Costs money)</option>
                            <option value={TaskType.INCOME}>💰 Income (Generates money)</option>
                        </select>
                    </div>

                    {/* Expense Fields */}
                    {selectedTaskType === TaskType.EXPENSE && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Estimated Cost (₦)"
                                    type="number"
                                    placeholder="Enter cost..."
                                    icon={<TrendingDown className="w-4 h-4 text-red-500" />}
                                    {...register('estimatedCost', {
                                        setValueAs: (v) => (v ? parseFloat(v) : undefined),
                                    })}
                                    error={errors.estimatedCost?.message}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Expense Category
                                    </label>
                                    <select
                                        className="w-full px-4 py-2.5 rounded-xl glass border-2 border-white/20 dark:border-white/10 transition-smooth text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        {...register('expenseCategory')}
                                    >
                                        <option value={ExpenseCategory.OTHER}>Other</option>
                                        <option value={ExpenseCategory.FOOD}>Food</option>
                                        <option value={ExpenseCategory.TRANSPORT}>Transport</option>
                                        <option value={ExpenseCategory.ENTERTAINMENT}>Entertainment</option>
                                        <option value={ExpenseCategory.UTILITIES}>Utilities</option>
                                        <option value={ExpenseCategory.SHOPPING}>Shopping</option>
                                        <option value={ExpenseCategory.HEALTH}>Health</option>
                                    </select>
                                </div>
                            </div>

                            <Input
                                label="Late Fee Per Day (₦) - Optional"
                                type="number"
                                placeholder="Enter late fee..."
                                icon={<AlertTriangle className="w-4 h-4 text-orange-500" />}
                                {...register('lateFeePerDay', {
                                    setValueAs: (v) => (v ? parseFloat(v) : undefined),
                                })}
                                error={errors.lateFeePerDay?.message}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 -mt-2">
                                💡 Set a daily late fee to prioritize this task and avoid penalties
                            </p>
                        </>
                    )}

                    {/* Income Fields */}
                    {selectedTaskType === TaskType.INCOME && (
                        <div>
                            <Input
                                label="Expected Income (₦)"
                                type="number"
                                placeholder="Enter expected income..."
                                icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                                {...register('estimatedIncome', {
                                    setValueAs: (v) => (v ? parseFloat(v) : undefined),
                                })}
                                error={errors.estimatedIncome?.message}
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                💡 Track expected vs actual income when task completes
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button type="submit" variant="primary" className="flex-1" isLoading={isSubmitting}>
                    {submitLabel}
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};
