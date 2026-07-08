import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { Card } from '../common/Card';
import { Archive, RotateCcw, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ConfirmModal } from '../common/ConfirmModal';

export const TaskArchive: React.FC = () => {
    const { tasks, unarchiveTask, deleteTask } = useTaskStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const archivedTasks = tasks.filter(task =>
        task.status === 'COMPLETED' &&
        (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleUnarchive = async (id: string) => {
        try {
            await unarchiveTask(id);
            toast.success('Task restored to active list');
        } catch (error) {
            toast.error('Failed to restore task');
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteTask(deleteId);
            toast.success('Task permanently deleted');
            setDeleteId(null);
        } catch (error) {
            toast.error('Failed to delete task');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                        <Archive className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Task Archive
                        </h2>
                        <p className="text-sm text-slate-500">
                            Manage completed tasks
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search archive..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {archivedTasks.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                        Archive is empty
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Completed tasks will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {archivedTasks.map((task) => (
                        <div
                            key={task.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                        >
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate line-through opacity-70">
                                    {task.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>Completed {format(new Date(task.createdAt), 'MMM d, yyyy')}</span>
                                    {task.financials && (
                                        <span className="px-1.5 py-0.5 rounded bg-accent-50 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 font-medium">
                                            {task.financials.type}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleUnarchive(task.id)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                    title="Unarchive"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(task.id)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title="Delete Permanently"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => !isDeleting && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Permanently Delete Task"
                message="This action cannot be undone. You will lose this task data forever. Are you sure?"
                confirmText="Yes, Delete Permanently"
                variant="danger"
                isLoading={isDeleting}
            />
        </Card>
    );
};
