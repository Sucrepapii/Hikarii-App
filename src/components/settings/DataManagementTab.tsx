import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Download, Database } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useBudgetStore } from '../../stores/budgetStore';
import { exportTasks, exportExpenses } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

export const DataManagementTab: React.FC = () => {
    const { tasks } = useTaskStore();
    const { expenses } = useBudgetStore();

    const handleExportTasks = () => {
        try {
            exportTasks(tasks);
            toast.success('Tasks exported successfully');
        } catch {
            toast.error('Failed to export tasks');
        }
    };

    const handleExportExpenses = () => {
        try {
            exportExpenses(expenses);
            toast.success('Expenses exported successfully');
        } catch {
            toast.error('Failed to export expenses');
        }
    };

    return (
        <Card>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400">
                    <Database className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                        Data Management
                    </h2>
                    <p className="text-sm text-slate-500">
                        Export your tasks and financial records
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div>
                        <h3 className="font-medium text-slate-800 dark:text-slate-200">
                            Export Tasks
                        </h3>
                        <p className="text-sm text-slate-500">
                            Download all your tasks as a CSV file ({tasks.length} tasks)
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleExportTasks}
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export Tasks
                    </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                    <div>
                        <h3 className="font-medium text-slate-800 dark:text-slate-200">
                            Export Financials
                        </h3>
                        <p className="text-sm text-slate-500">
                            Download all expenses and budgets as CSV ({expenses.length} records)
                        </p>
                    </div>
                    <Button
                        variant="secondary"
                        onClick={handleExportExpenses}
                        className="w-full sm:w-auto flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Export Expenses
                    </Button>
                </div>
            </div>
        </Card>
    );
};
export default DataManagementTab;
