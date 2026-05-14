import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { Link } from 'react-router-dom';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { CheckSquare, Wallet, TrendingUp, Clock, AlertCircle, RefreshCw, Zap } from 'lucide-react'; import { formatCurrency } from '../utils/currencyFormatter';
import { TaskStatus, Task, TaskPriority } from '../types/task.types';
import { TaskItem } from '../components/tasks/TaskItem';
import { BudgetProgress } from '../components/budget/Charts/BudgetProgress';
import { SpendingChart } from '../components/budget/Charts/SpendingChart';
import { startOfDay, endOfMonth, isSameDay } from 'date-fns';
import { HikariWrapped } from '../components/dashboard/HikariWrapped';
import { Modal } from '../components/common/Modal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFormData } from '../utils/validationSchemas';
import toast from 'react-hot-toast';
import { UpgradeModal } from '../components/modals/UpgradeModal';
import { useIntelligenceStore } from '../stores/intelligenceStore';
import { useAuthStore } from '../stores/authStore';
import { clsx } from 'clsx';
import { useUIStore } from '../stores/uiStore';
import { DashboardGreeting } from '../components/dashboard/DashboardGreeting';

const NumberCounter: React.FC<{ value: number; prefix?: string; duration?: number }> = ({ value, prefix = '', duration = 1000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = value;
        if (start === end) {
            setCount(end);
            return;
        }

        const increment = end / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{prefix}{count.toLocaleString()}</span>;
};

export const Dashboard: React.FC = () => {
    const { tasks, fetchTasks, toggleTaskStatus, updateTask, deleteTask, isLoading: tasksLoading, error: tasksError } = useTaskStore();
    const { expenses, fetchExpenses, currency, getConvertedAmount, isLoading: budgetLoading, error: budgetError } = useBudgetStore();
    const { user } = useAuthStore();

    // Edit State
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isRefreshingInsights, setIsRefreshingInsights] = useState(false);
    const { isFocusMode, toggleFocusMode } = useUIStore();

    const { refreshInsights } = useIntelligenceStore();

    // Hikari Wrapped State
    const [isWrappedOpen, setIsWrappedOpen] = useState(false);
    const today = new Date();
    const isLastDayOfMonth = isSameDay(today, endOfMonth(today));

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

    // MOMENTUM CALCULATION (The "One-Click Profit" Insight)
    const netMomentum = tasks.reduce((sum, t) => sum + (t.financials?.cashFlowImpact || 0), 0) - totalSpent;
    const isPositiveMomentum = netMomentum >= 0;

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
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setTaskToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (taskToDelete) {
            setIsDeleting(true);
            try {
                await deleteTask(taskToDelete);
                toast.success('Task deleted');
                setTaskToDelete(null);
            } catch (error) {
                toast.error('Failed to delete task');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (tasksLoading || budgetLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mb-4" />
                <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your insights...</p>
            </div>
        );
    }

    if (tasksError || budgetError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md text-center">
                    {tasksError || budgetError}
                </p>
                <button 
                    onClick={() => { fetchTasks(); fetchExpenses(); }}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={clsx(
            "min-h-screen transition-all duration-1000 ease-in-out -m-4 md:-m-6 p-4 md:p-6",
            isFocusMode
                ? "bg-gradient-to-br from-slate-50 to-indigo-50/50 dark:from-[#080910] dark:to-indigo-950/20"
                : "animate-fade-in"
        )}>
            {/* Visual Depth: Starfield (Only in Dark Mode) */}
            {!isFocusMode && <div className="starfield-container" />}
            
            <DashboardGreeting 
                userName={user?.name} 
            />

            <div className={clsx(
                "transition-all duration-700",
                isFocusMode ? "opacity-100" : "opacity-100"
            )}>
                <div className={clsx(
                    "mb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 transition-all duration-700",
                    isFocusMode && "opacity-40 blur-[1px] pointer-events-none scale-95"
                )}>
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}! Here's your overview
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

            {/* Hikari Wrapped Trigger (Only visible on last day of month) */}
            {isLastDayOfMonth && (
                <div className="mb-6 p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse-slow">
                    <div className="bg-[#0B0C15] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-xl font-display font-bold text-white mb-1">Your {today.toLocaleString('default', { month: 'long' })} Wrapped is ready!</h3>
                            <p className="text-indigo-200 text-sm">See your productivity and financial story for this month.</p>
                        </div>
                        <button
                            onClick={() => setIsWrappedOpen(true)}
                            className="whitespace-nowrap px-6 py-2.5 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                        >
                            Play Story
                        </button>
                    </div>
                </div>
            )}

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
            <div className={clsx(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 transition-all duration-700",
                isFocusMode && "opacity-40 grayscale blur-[0.5px] pointer-events-none scale-95"
            )}>
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
                        <p className="text-3xl font-bold gradient-text">
                            <NumberCounter value={totalTasks} />
                        </p>
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
                        <p className="text-3xl font-bold gradient-text">
                            <NumberCounter value={completedTasks} />
                        </p>
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
                        <p className="text-3xl font-bold gradient-text">
                            <NumberCounter value={pendingTasks} />
                        </p>
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

            {/* Charts (Hidden in Focus Mode for extreme clarity) */}
            {!isFocusMode && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {/* Financial Momentum Card */}
                    <Card className="relative overflow-hidden group border-white/10 bg-gradient-to-br from-[#0D0F1A] to-[#161927]">
                        <div className={clsx(
                            "absolute top-0 right-0 w-32 h-32 blur-[60px] -mr-16 -mt-16 transition-colors duration-700",
                            isPositiveMomentum ? "bg-emerald-500/20" : "bg-rose-500/10"
                        )} />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={clsx(
                                    "p-3 rounded-xl",
                                    isPositiveMomentum ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                                )}>
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <span className={clsx(
                                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                                    isPositiveMomentum ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                )}>
                                    Net Clarity
                                </span>
                            </div>
                            <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                <NumberCounter 
                                    value={Math.abs(netMomentum)} 
                                    prefix={netMomentum < 0 ? `-${currency === 'NGN' ? '₦' : '$'}` : (currency === 'NGN' ? '₦' : '$')} 
                                />
                            </div>
                            <p className="text-xs text-slate-500 font-medium tracking-tight">
                                {isPositiveMomentum ? "Positive financial trajectory" : "Attention required on costs"}
                            </p>
                        </div>
                    </Card>

                    <Card className="bg-[#0D0F1A] border-white/5">
                        <BudgetProgress />
                    </Card>
                    <SpendingChart />
                </div>
            )}

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
                    {recentTasks.length > 0 ? (
                        <div className="space-y-3">
                            {/* Standard View for Top 3 */}
                                {recentTasks.slice(0, 3).map((task) => (
                                    <div key={task.id} className={clsx(
                                        "transition-all duration-500",
                                        isFocusMode && task.priority !== TaskPriority.HIGH && task.priority !== TaskPriority.URGENT ? "opacity-30 blur-[0.5px] grayscale pointer-events-none" : "opacity-100"
                                    )}>
                                        <TaskItem
                                            task={task}
                                            onToggle={toggleTaskStatus}
                                            onEdit={handleEditTask}
                                            onDelete={handleDeleteClick}
                                        />
                                    </div>
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

                <Card className={clsx(
                    "transition-all duration-700",
                    isFocusMode && "opacity-40 grayscale blur-[0.5px] pointer-events-none scale-95"
                )}>
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
                onClose={() => !isDeleting && setTaskToDelete(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task? This cannot be undone."
                confirmText="Delete Task"
                variant="danger"
                isLoading={isDeleting}
            />

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />

            {/* Fullscreen Hikari Wrapped Overlay */}
            {isWrappedOpen && (
                <HikariWrapped onClose={() => setIsWrappedOpen(false)} />
            )}

            </div>

            {/* Focus Mode Overlay Message */}
            {isFocusMode && (
                <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center animate-fade-in">
                    <div className="bg-indigo-600/10 backdrop-blur-xl border border-indigo-500/20 px-8 py-4 rounded-3xl shadow-2xl">
                        <p className="text-indigo-600 dark:text-indigo-400 font-display font-bold text-xl flex items-center gap-3">
                            <Zap className="w-6 h-6 animate-pulse" /> Focus Mode Active
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
