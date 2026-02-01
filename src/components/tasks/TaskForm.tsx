import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, TaskFormData } from '../../utils/validationSchemas';
import { TaskStatus, TaskPriority, TaskType, Task } from '../../types/task.types';
import { ExpenseCategory } from '../../types/budget.types';
import { Project } from '../../types/project.types';
import { projectService } from '../../services/project.service';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { useBudgetStore } from '../../stores/budgetStore';
import { Briefcase, Calendar, DollarSign, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import apiClient from '../../api/client';

interface TaskFormProps {
    onSubmit: (data: TaskFormData) => void;
    onCancel: () => void;
    defaultValues?: Task;
    submitLabel?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
    NGN: '₦',
    USD: '$',
    GBP: '£',
    EUR: '€',
    CAD: 'C$',
};

const DURATION_REGEX = /\((\d+(?:\.\d+)?)\s*(h|hr|hrs|hours|m|min|mins|minutes)\)/i;

export const TaskForm: React.FC<TaskFormProps> = ({
    onSubmit,
    onCancel,
    defaultValues,
    submitLabel = 'Save Task',
}) => {
    const { currency, getConvertedAmount, getAmountInBaseCurrency } = useBudgetStore();
    const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: defaultValues || {
            status: TaskStatus.TODO,
            priority: TaskPriority.MEDIUM,
            tags: [],
        },
    });

    // Handle currency conversion for initial values and updates
    useEffect(() => {
        if (defaultValues) {
            const convertedValues = { ...defaultValues };

            // Convert financial values from Base (NGN) to Selected Currency for display
            if (convertedValues.financials?.estimatedCost) {
                // @ts-ignore
                convertedValues.estimatedCost = Number(getConvertedAmount(convertedValues.financials.estimatedCost, currency).toFixed(2));
            }
            if (convertedValues.financials?.estimatedIncome) {
                // @ts-ignore
                convertedValues.estimatedIncome = Number(getConvertedAmount(convertedValues.financials.estimatedIncome, currency).toFixed(2));
            }
            if (convertedValues.financials?.lateFeePerDay) {
                // @ts-ignore
                convertedValues.lateFeePerDay = Number(getConvertedAmount(convertedValues.financials.lateFeePerDay, currency).toFixed(2));
            }

            // Map flattened fields
            if (convertedValues.financials?.type) {
                // @ts-ignore
                convertedValues.taskType = convertedValues.financials.type;
            }

            reset(convertedValues);
        } else {
            reset({
                status: TaskStatus.TODO,
                priority: TaskPriority.MEDIUM,
                tags: [],
            });
        }
    }, [defaultValues, currency, reset, getConvertedAmount]);

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

    const handleFormSubmit = (data: TaskFormData) => {
        // Convert back to Base Currency (NGN) before submitting
        const submissionData = { ...data };

        if (submissionData.estimatedCost) {
            submissionData.estimatedCost = getAmountInBaseCurrency(submissionData.estimatedCost, currency);
        }
        if (submissionData.estimatedIncome) {
            submissionData.estimatedIncome = getAmountInBaseCurrency(submissionData.estimatedIncome, currency);
        }
        if (submissionData.lateFeePerDay) {
            submissionData.lateFeePerDay = getAmountInBaseCurrency(submissionData.lateFeePerDay, currency);
        }

        onSubmit(submissionData);
    };

    // Duration Parsing Logic
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        const match = title.match(DURATION_REGEX);

        if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            let minutes = 0;

            if (unit.startsWith('h')) {
                minutes = value * 60;
            } else {
                minutes = value;
            }

            setValue('estimatedDuration', Math.round(minutes));
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <Input
                label="Title"
                placeholder="Enter task title (e.g., 'Write Report (2 hours)')"
                error={errors.title?.message}
                {...register('title')}
                onChange={(e) => {
                    register('title').onChange(e);
                    handleTitleChange(e);
                }}
            />

            <div>
                <Input
                    label="Estimated Duration (Minutes)"
                    type="number"
                    placeholder="Auto-calculated from title..."
                    icon={<Clock className="w-4 h-4 text-slate-400" />}
                    {...register('estimatedDuration', {
                        setValueAs: (v) => (v ? parseInt(v) : undefined),
                    })}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    💡 Tip: Add time to title like "(2 hours)" to auto-fill
                </p>
            </div>

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

            {/* Google Calendar Sync - Only show if connected */}
            <GoogleSyncCheckbox register={register} />

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
                                    label={`Estimated Cost (${currencySymbol})`}
                                    type="number"
                                    step="0.01"
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
                                label={`Late Fee Per Day (${currencySymbol}) - Optional`}
                                type="number"
                                step="0.01"
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
                                label={`Expected Income (${currencySymbol})`}
                                type="number"
                                step="0.01"
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

const GoogleSyncCheckbox = ({ register }: { register: any }) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        apiClient.get('/google/status')
            .then(res => setIsConnected(res.data.isConnected))
            .catch(() => setIsConnected(false));
    }, []);

    if (!isConnected) return null;

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50">
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    id="addToCalendar"
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400 dark:border-slate-600 dark:bg-slate-700 dark:checked:border-blue-500 dark:checked:bg-blue-500"
                    {...register('addToCalendar')}
                />
                <CheckCircle2 className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
            </div>
            <label htmlFor="addToCalendar" className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer font-medium select-none">
                Add to Google Calendar
            </label>
        </div>
    );
};
