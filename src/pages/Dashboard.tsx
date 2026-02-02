import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Link } from 'react-router-dom';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { CheckSquare, Wallet, TrendingUp, Clock, AlertCircle, RefreshCw } from 'lucide-react'; import { formatCurrency } from '../utils/currencyFormatter';
import { TaskStatus, Task } from '../types/task.types';
import { TaskItem } from '../components/tasks/TaskItem';
import { BudgetProgress } from '../components/budget/Charts/BudgetProgress';
import { SpendingChart } from '../components/budget/Charts/SpendingChart';
import { startOfDay } from 'date-fns';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFormData } from '../utils/validationSchemas';
import toast from 'react-hot-toast';
import { UpgradeModal } from '../components/modals/UpgradeModal';
import { useIntelligenceStore } from '../stores/intelligenceStore';
import { clsx } from 'clsx';

export const Dashboard: React.FC = () => {
    const { tasks, fetchTasks, toggleTaskStatus, updateTask, deleteTask } = useTaskStore();
    const { expenses, fetchExpenses, currency, getConvertedAmount } = useBudgetStore();

    // Edit State
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    const { refreshInsights } = useIntelligenceStore();

    // Fetch data on mount
    useEffect(() => {
        fetchTasks();
        fetchExpenses();
    }, [fetchTasks, fetchExpenses]);

    // Calculate stats
    const totalTasks = tasks.length;

    // Find Overdue Tasks
    const overdueTasks = tasks.filter(t => {
        if (!t.dueDate || t.status === TaskStatus.COMPLETED) return false;
        return new Date(t.dueDate) < startOfDay(new Date());
    });

    const completedTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Sort: Active First (Newest->Oldest), then Completed (Newest->Oldest)
    const activeTasks = tasks.filter(t => t.status !== TaskStatus.COMPLETED).reverse();
    const completedHistory = tasks.filter(t => t.status === TaskStatus.COMPLETED).reverse();
    const recentTasks = [...activeTasks, ...completedHistory].slice(0, 4);

    const recentExpenses = expenses.slice(-3).reverse();

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsEditModalOpen(true);
    };

    const handleUpdateTask = async (data: TaskFormData) => {
        if (editingTask) {
            try {
                await updateTask(editingTask.id, data);
                toast.success('Task updated successfully');
                setIsEditModalOpen(false);
                setEditingTask(null);
            } catch (error) {
                toast.error('Failed to update task');
            }
        }
    };

    const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setTaskToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            await deleteTask(taskToDelete);
            toast.success('Task deleted');
            setTaskToDelete(null);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Welcome back! Here's your overview
                    </p>
                </div>
                <button
                    onClick={async () => {
                        setIsRefreshingInsights(true);
                        await refreshInsights();
                        setIsRefreshingInsights(false);
                        toast.success("Smart Insights updated");
                    }}
                    disabled={isRefreshingInsights}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-2 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm",
                        isRefreshingInsights && "opacity-70 cursor-not-allowed"
                    )}
                    title="Refresh Smart Insights"
                >
                    <RefreshCw className={clsx("w-4 h-4 text-primary-500", isRefreshingInsights && "animate-spin")} />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Refresh Insights</span>
                </button>
            </div>

            {/* Overdue Alert Banner */}
            {overdueTasks.length > 0 && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 flex items-start gap-4 animate-slide-up">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                            Attention: {overdueTasks.length} Overdue Task{overdueTasks.length > 1 ? 's' : ''}
                        </h3>
                        <p className="text-red-600/80 dark:text-red-400/80 text-sm mb-2">
                            You have tasks that missed their deadline. Please review them to avoid late fees or delays.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {overdueTasks.slice(0, 3).map(task => (
                                <span key={task.id} className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                                    {task.title}
                                </span>
                            ))}
                            {overdueTasks.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 text-xs text-red-600 dark:text-red-400">
                                    +{overdueTasks.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary-500/10">
                                <CheckSquare className="w-5 h-5 text-primary-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Tasks
                            </span>
                        </div>
                        <p className="text-3xl font-bold gradient-text">{totalTasks}</p>
                    </div>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-success-500/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-success-500/10">
                                <TrendingUp className="w-5 h-5 text-success-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Completed
                            </span>
                        </div>
                        <p className="text-3xl font-bold gradient-text">{completedTasks}</p>
                    </div>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-warning-500/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-warning-500/10">
                                <Clock className="w-5 h-5 text-warning-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Pending
                            </span>
                        </div>
                        <p className="text-3xl font-bold gradient-text">{pendingTasks}</p>
                    </div>
                </Card>

                <Card className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-accent-500/20 to-transparent rounded-full blur-2xl" />
                    <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-accent-500/10">
                                <Wallet className="w-5 h-5 text-accent-500" />
                            </div>
                            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Spent
                            </span>
                        </div>
                        <p className="text-lg sm:text-2xl md:text-3xl font-bold gradient-text break-all">
                            {formatCurrency(getConvertedAmount(totalSpent, currency), currency)}
                        </p>
                    </div>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <SpendingChart />
                <BudgetProgress />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
                    {recentTasks.length > 0 ? (
                        <div className="space-y-3">
                            {/* Standard View for Top 3 */}
                            {recentTasks.slice(0, 3).map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTaskStatus}
                                    onEdit={handleEditTask}
                                    onDelete={handleDeleteClick}
                                />
                            ))}

                            {/* View All Link */}
                            {recentTasks.length > 3 && (
                                <Link
                                    to="/tasks"
                                    className="block w-full py-2 text-center text-sm font-medium text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors border-t border-slate-100 dark:border-slate-800 mt-2"
                                >
                                    View All Tasks
                                </Link>
                            )}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                            No tasks yet
                        </p>
                    )}
                </Card>

                <Card>
                    <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
                    {recentExpenses.length > 0 ? (
                        <div className="space-y-3">
                            {recentExpenses.map((expense) => (
                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between p-3 rounded-lg glass"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                            {expense.title}
                                        </p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            {expense.category}
                                        </p>
                                    </div>
                                    <p className="font-bold gradient-text">
                                        {formatCurrency(getConvertedAmount(expense.amount, currency), currency)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                            No expenses yet
                        </p>
                    )}
                </Card>
            </div>

            {/* Edit Task Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Task"
            >
                <TaskForm
                    onSubmit={handleUpdateTask}
                    onCancel={() => setIsEditModalOpen(false)}
                    defaultValues={editingTask || undefined}
                    submitLabel="Save Changes"
                />
            </Modal>

            <ConfirmModal
                isOpen={!!taskToDelete}
                onClose={() => setTaskToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This cannot be undone."
                confirmText="Delete Task"
                variant="danger"
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />
        </div>
    );
};
