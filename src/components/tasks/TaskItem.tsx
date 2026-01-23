import React from 'react';
import { Task, TaskPriority, TaskStatus, TaskType } from '../../types/task.types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Check, Clock, Trash2, Edit, AlertCircle } from 'lucide-react';
import { formatRelativeDate, isOverdue } from '../../utils/dateUtils';
import { clsx } from 'clsx';
import { FinancialImpactBadge } from '../intelligence/FinancialImpactBadge';

interface TaskItemProps {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const priorityColors = {
    [TaskPriority.LOW]: 'bg-blue-500',
    [TaskPriority.MEDIUM]: 'bg-yellow-500',
    [TaskPriority.HIGH]: 'bg-orange-500',
    [TaskPriority.URGENT]: 'bg-red-500',
};

const statusIcons = {
    [TaskStatus.TODO]: Clock,
    [TaskStatus.IN_PROGRESS]: AlertCircle,
    [TaskStatus.COMPLETED]: Check,
};

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onToggle,
    onEdit,
    onDelete,
}) => {
    const StatusIcon = statusIcons[task.status];
    const isTaskOverdue = task.dueDate && isOverdue(task.dueDate);

    // Calculate financial impact
    const hasFinancials = task.financials !== undefined;
    const financialAmount = hasFinancials
        ? (task.financials?.estimatedIncome || task.financials?.actualIncome || 0) -
        (task.financials?.estimatedCost || task.financials?.actualCost || 0)
        : 0;

    const financialType = hasFinancials && task.financials
        ? task.financials.type === TaskType.EXPENSE
            ? 'expense'
            : task.financials.type === TaskType.INCOME
                ? 'income'
                : 'neutral'
        : 'neutral';

    // Late fee warning
    const hasLateFee = hasFinancials && task.financials?.lateFeePerDay && task.financials.lateFeePerDay > 0;

    return (
        <Card className="group">
            <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                    onClick={() => onToggle(task._id)}
                    className={clsx(
                        'mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-smooth',
                        task.status === TaskStatus.COMPLETED
                            ? 'bg-gradient-to-r from-success-500 to-success-600 border-success-500'
                            : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
                    )}
                >
                    {task.status === TaskStatus.COMPLETED && (
                        <Check className="w-4 h-4 text-white" />
                    )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <h3
                                className={clsx(
                                    'text-lg font-semibold mb-1',
                                    task.status === TaskStatus.COMPLETED &&
                                    'line-through text-slate-400 dark:text-slate-500'
                                )}
                            >
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                    {task.description}
                                </p>
                            )}

                            <div className="flex items-center gap-3 flex-wrap">
                                {/* Priority Badge */}
                                <span
                                    className={clsx(
                                        'px-2 py-1 rounded-lg text-xs font-medium text-white',
                                        priorityColors[task.priority]
                                    )}
                                >
                                    {task.priority}
                                </span>

                                {/* Status Badge */}
                                <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium glass">
                                    <StatusIcon className="w-3 h-3" />
                                    {task.status.replace('_', ' ')}
                                </span>

                                {/* Due Date */}
                                {task.dueDate && (
                                    <span
                                        className={clsx(
                                            'text-xs font-medium',
                                            isTaskOverdue
                                                ? 'text-danger-500'
                                                : 'text-slate-500 dark:text-slate-400'
                                        )}
                                    >
                                        {formatRelativeDate(task.dueDate)}
                                    </span>
                                )}

                                {/* Financial Impact Badge */}
                                {hasFinancials && Math.abs(financialAmount) > 0 && (
                                    <FinancialImpactBadge
                                        amount={Math.abs(financialAmount)}
                                        type={financialType}
                                        size="sm"
                                    />
                                )}

                                {/* Late Fee Warning */}
                                {hasLateFee && task.status !== TaskStatus.COMPLETED && (
                                    <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30">
                                        ⚠️ ₦{task.financials?.lateFeePerDay?.toLocaleString() || 0}/day late fee
                                    </span>
                                )}
                            </div>

                            {/* Income vs Actual (for completed income tasks) */}
                            {task.financials &&
                                task.financials.type === TaskType.INCOME &&
                                task.status === TaskStatus.COMPLETED &&
                                task.financials.actualIncome &&
                                task.financials.estimatedIncome && (
                                    <div className="mt-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Expected:</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">
                                                ₦{task.financials.estimatedIncome.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs mt-1">
                                            <span className="text-slate-600 dark:text-slate-400">Actual:</span>
                                            <span className={clsx(
                                                "font-semibold",
                                                task.financials.actualIncome >= task.financials.estimatedIncome
                                                    ? "text-green-600 dark:text-green-400"
                                                    : "text-orange-600 dark:text-orange-400"
                                            )}>
                                                ₦{task.financials.actualIncome.toLocaleString()}
                                                {task.financials.actualIncome >= task.financials.estimatedIncome ? ' ✓' : ' ⚠️'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEdit(task)}
                                className="p-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl transition-smooth flex items-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                <span className="hidden md:inline font-medium">Edit</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onDelete(task._id)}
                                className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-smooth flex items-center gap-2"
                            >
                                <Trash2 className="w-5 h-5" />
                                <span className="hidden md:inline font-medium">Delete</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};
