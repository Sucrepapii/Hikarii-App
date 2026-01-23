import React from 'react';
import { Card } from '../components/common/Card';
import { SpendingChart } from '../components/budget/Charts/SpendingChart';
import { BudgetProgress } from '../components/budget/Charts/BudgetProgress';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { TaskStatus, TaskPriority } from '../types/task.types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/currencyFormatter';

export const Reports: React.FC = () => {
    const { tasks } = useTaskStore();
    const { expenses, currency } = useBudgetStore();

    // Task completion data
    const taskStatusData = [
        { name: 'Completed', value: tasks.filter((t) => t.status === TaskStatus.COMPLETED).length },
        { name: 'In Progress', value: tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length },
        { name: 'To Do', value: tasks.filter((t) => t.status === TaskStatus.TODO).length },
    ].filter((d) => d.value > 0);

    // Task priority data
    const taskPriorityData = [
        { name: 'Urgent', value: tasks.filter((t) => t.priority === TaskPriority.URGENT).length },
        { name: 'High', value: tasks.filter((t) => t.priority === TaskPriority.HIGH).length },
        { name: 'Medium', value: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length },
        { name: 'Low', value: tasks.filter((t) => t.priority === TaskPriority.LOW).length },
    ].filter((d) => d.value > 0);

    const COLORS = ['#a855f7', '#6366f1', '#10b981', '#f59e0b'];

    return (
        <div className="animate-fade-in">
            <div className="mb-6">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    Reports & Analytics
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Insights into your tasks and spending
                </p>
            </div>

            {/* Budget Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <SpendingChart />
                <BudgetProgress />
            </div>

            {/* Task Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Task Status Distribution</h3>
                    {taskStatusData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taskStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {taskStatusData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                            No task data available
                        </p>
                    )}
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold mb-4">Task Priority Distribution</h3>
                    {taskPriorityData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={taskPriorityData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {taskPriorityData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">
                            No task data available
                        </p>
                    )}
                </Card>
            </div>

            {/* Summary Stats */}
            <Card>
                <h3 className="text-xl font-semibold mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Tasks</p>
                        <p className="text-2xl font-bold gradient-text">{tasks.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Expenses</p>
                        <p className="text-2xl font-bold gradient-text">{expenses.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Spent</p>
                        <p className="text-2xl font-bold gradient-text">
                            {formatCurrency(expenses.reduce((sum, e) => sum + e.amount, 0), currency)}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};
