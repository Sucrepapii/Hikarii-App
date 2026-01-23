import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { CheckSquare, Wallet, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/currencyFormatter';
import { TaskStatus, Task } from '../types/task.types';
import { TaskItem } from '../components/tasks/TaskItem';
import { BudgetProgress } from '../components/budget/Charts/BudgetProgress';
import { SpendingChart } from '../components/budget/Charts/SpendingChart';
import { InsightsPanel } from '../components/intelligence/InsightsPanel';
import { startOfDay } from 'date-fns';
import { Modal } from '../components/common/Modal';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskFormData } from '../utils/validationSchemas';
import toast from 'react-hot-toast';

export const Dashboard: React.FC = () => {
    const { tasks, fetchTasks, toggleTaskStatus, updateTask, deleteTask } = useTaskStore();
    const { expenses, fetchExpenses, currency } = useBudgetStore();

    // Edit State
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    const recentTasks = tasks.slice(-5).reverse();
    const recentExpenses = expenses.slice(-3).reverse();

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setIsEditModalOpen(true);
    };

    const handleUpdateTask = async (data: TaskFormData) => {
        if (editingTask) {
            try {
                await updateTask(editingTask._id, data);
                toast.success('Task updated successfully');
                setIsEditModalOpen(false);
                setEditingTask(null);
            } catch (error) {
                toast.error('Failed to update task');
            }
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Welcome back! Here's your overview
                </p>
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
                                <span key={task._id} className="inline-flex items-center px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-xs font-medium text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
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

            {/* Smart Insights Panel */}
            <div className="mb-6">
                <InsightsPanel />
            </div>

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
                        <p className="text-2xl font-bold gradient-text">
                            {formatCurrency(totalSpent, currency)}
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
                            {recentTasks.map((task) => (
                                <TaskItem
                                    key={task._id}
                                    task={task}
                                    onToggle={toggleTaskStatus}
                                    onEdit={handleEditTask}
                                    onDelete={deleteTask}
                                />
                            ))}
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
                                    key={expense._id}
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
                                        {formatCurrency(expense.amount, currency)}
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
        </div>
    );
};
