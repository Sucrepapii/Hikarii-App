import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Download, Database, Shield } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { exportTasks, exportExpenses } from '../utils/exportUtils';
import { useAuthStore } from '../stores/authStore';

export const Settings: React.FC = () => {
    const { tasks } = useTaskStore();
    const { expenses } = useBudgetStore();
    const { user } = useAuthStore();

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Manage your preferences and data
                </p>
            </div>

            <div className="space-y-6">
                {/* Profile Section */}
                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                Profile Information
                            </h2>
                            <p className="text-sm text-slate-500">
                                Your personal account details
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Full Name
                            </label>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                {user?.name}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Email Address
                            </label>
                            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Data Management Section */}
                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                Data Management
                            </h2>
                            <p className="text-sm text-slate-500">
                                Export your data for external analysis or backup
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div>
                                <h3 className="font-medium text-slate-800 dark:text-slate-200">Export Tasks</h3>
                                <p className="text-sm text-slate-500">
                                    Download all your tasks as a CSV file
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => exportTasks(tasks)}
                                className="gap-2"
                                disabled={tasks.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </Button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div>
                                <h3 className="font-medium text-slate-800 dark:text-slate-200">Export Expenses</h3>
                                <p className="text-sm text-slate-500">
                                    Download all your expenses and budget data as a CSV file
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                onClick={() => exportExpenses(expenses)}
                                className="gap-2"
                                disabled={expenses.length === 0}
                            >
                                <Download className="w-4 h-4" />
                                Export CSV
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
