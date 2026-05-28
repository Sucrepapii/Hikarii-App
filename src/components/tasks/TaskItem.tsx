import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, TaskType } from '../../types/task.types';
import { Card } from '../common/Card';
import { Check, Clock, Trash2, Edit, Sparkles } from 'lucide-react';
import { formatRelativeDate, isOverdue } from '../../utils/dateUtils';
import { clsx } from 'clsx';
import { FinancialImpactBadge } from '../intelligence/FinancialImpactBadge';
import { useBudgetStore } from '../../stores/budgetStore';
import { useTaskStore } from '../../stores/taskStore';

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

export const TaskItem: React.FC<TaskItemProps> = ({
    task,
    onToggle,
    onEdit,
    onDelete,
}) => {
    const [showSparkles, setShowSparkles] = useState(false);

    const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (task.status !== TaskStatus.COMPLETED) {
            setShowSparkles(true);
            setTimeout(() => setShowSparkles(false), 800);
            if (typeof window.triggerCoinBurst === 'function') {
                window.triggerCoinBurst(e.clientX, e.clientY);
            }
        }
        onToggle(task.id);
    };

    const { expenses } = useBudgetStore();
    const linkedExpenses = expenses.filter(e => e.linkedTaskId === task.id);
    const totalLinkedSpent = linkedExpenses.reduce((sum, e) => sum + e.amount, 0);

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

    const { openSplitModal } = useTaskStore();

    return (
        <Card className="group h-full flex flex-col relative overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
            {/* Status Strip */}
            <div className={clsx(
                "absolute top-0 left-0 w-1 h-full",
                priorityColors[task.priority]
            )} />

            <div className="flex flex-col h-full pl-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-4">
                        <button
                            onClick={handleToggle}
                            className="group/check relative flex items-center justify-center p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
                            title="Mark as Completed"
                        >
                            {/* Success Sparkles */}
                            {showSparkles && (
                                <>
                                    <Sparkles className="sparkle-burst text-yellow-400 top-[-10px] left-[-10px]" size={16} />
                                    <Sparkles className="sparkle-burst text-indigo-400 top-[-5px] right-[-5px]" size={12} style={{ animationDelay: '0.1s' }} />
                                    <Sparkles className="sparkle-burst text-purple-400 bottom-[-8px] left-[5px]" size={14} style={{ animationDelay: '0.2s' }} />
                                </>
                            )}
                            <div className={clsx(
                                "w-6 h-6 rounded-full border-2 transition-all",
                                task.status === TaskStatus.COMPLETED
                                    ? "border-success-500 bg-success-500"
                                    : "border-slate-300 dark:border-slate-600 group-hover/check:border-primary-500"
                            )} />
                            <Check className={clsx(
                                "w-3.5 h-3.5 absolute text-white transition-all",
                                task.status === TaskStatus.COMPLETED ? "scale-100 opacity-100" : "scale-0 opacity-0 group-hover/check:scale-100 group-hover/check:opacity-50"
                            )} />
                        </button>
                        <div>
                            <h3
                                className={clsx(
                                    'text-base font-semibold text-slate-900 dark:text-slate-100 leading-tight mb-1',
                                    task.status === TaskStatus.COMPLETED &&
                                    'line-through text-slate-400 dark:text-slate-500'
                                )}
                            >
                                {task.title}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className={clsx(
                                    'text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider',
                                    task.priority === TaskPriority.URGENT ? 'bg-red-100 text-red-600 dark:bg-red-900/30' :
                                        task.priority === TaskPriority.HIGH ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                                            task.priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30' :
                                                'bg-blue-100 text-blue-600 dark:bg-blue-900/30'
                                )}>
                                    {task.priority}
                                </span>
                                {task.dueDate && (
                                    <span className={clsx(
                                        'text-xs flex items-center gap-1',
                                        isTaskOverdue ? 'text-red-500 font-medium' : 'text-slate-400'
                                    )}>
                                        <Clock className="w-3 h-3" />
                                        {formatRelativeDate(task.dueDate)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 min-h-[20px]">
                        {task.description}
                    </p>
                )}

                {/* Footer Content (Financials & Actions) */}
                <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-end justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        {/* Financial Impact Badge */}
                        {hasFinancials && Math.abs(financialAmount) > 0 && (
                            <div className="mb-2">
                                <FinancialImpactBadge
                                    amount={Math.abs(financialAmount)}
                                    type={financialType}
                                    size="sm"
                                />
                            </div>
                        )}

                        {/* Progress Bar for Budget */}
                        {task.financials && task.financials.type === TaskType.EXPENSE && task.financials.estimatedCost && (
                            <div>
                                <div className="flex justify-between text-[10px] mb-1">
                                    <span className="text-slate-500">Budget</span>
                                    <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {Math.round((totalLinkedSpent / task.financials.estimatedCost) * 100)}%
                                    </span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={clsx(
                                            "h-full rounded-full transition-all duration-500",
                                            totalLinkedSpent > task.financials.estimatedCost ? "bg-red-500" : "bg-primary-500"
                                        )}
                                        style={{ width: `${Math.min((totalLinkedSpent / task.financials.estimatedCost) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Compact Actions */}
                    <div className="flex gap-1 shrink-0">
                        <button
                            onClick={() => openSplitModal(task.id)}
                            className="p-2 text-slate-400 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
                            title="Smart Split"
                        >
                            <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onEdit(task)}
                            className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(task.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

        </Card>
    );
};
