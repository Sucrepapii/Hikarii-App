import React, { useEffect } from 'react';
import { X, Sparkles, Calendar, Clock } from 'lucide-react';
import { Task, TaskBlock } from '../../types/task.types';
import { Button } from '../common/Button';
import { useTaskStore } from '../../stores/taskStore';

interface TaskSplitModalProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task;
}

export const TaskSplitModal: React.FC<TaskSplitModalProps> = ({ isOpen, onClose, task }) => {
    const { analyzeTask } = useTaskStore();
    const [loading, setLoading] = React.useState(false);
    const [blocks, setBlocks] = React.useState<TaskBlock[]>(task.blocks || []);

    useEffect(() => {
        if (isOpen && (!task.blocks || task.blocks.length === 0)) {
            handleAnalyze();
        } else if (isOpen && task.blocks) {
            setBlocks(task.blocks);
        }
    }, [isOpen, task.id]);

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            await analyzeTask(task.id);
            // Re-fetch or rely on store update? 
            // The store update might not reflect immediately in 'task' prop unless parent re-renders and passes new task.
            // But we can subscribe to store or just trust the response structure if we changed analyzeTask to return data.
            // For now, let's assume valid reactivity or simple refresh.
            // Actually, analyzeTask updates the store, so if the parent component (TaskItem) observes the store, it passes updated task.
            // If not, we might need to fetch locally. 
            // Let's rely on useTaskStore() getting the updated task? 
            // Better: analyzeTask could return the blocks.
            // But let's verify if store updates propagate.

            // Temporary fix: reloading page or trusting UI update.
            // Ideally analyzeTask returns the blocks.
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Listen to store changes for this task
    const storeTask = useTaskStore(state => state.tasks.find(t => t.id === task.id));

    useEffect(() => {
        if (storeTask?.blocks) {
            setBlocks(storeTask.blocks);
        }
    }, [storeTask]);

    if (!isOpen) return null;

    const handleRegenerate = async () => {
        setLoading(true);
        try {
            await analyzeTask(task.id, { force: true });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        try {
            const { scheduleTaskBlocks } = useTaskStore.getState(); // or usage from hook
            await scheduleTaskBlocks(task.id);
            // Maybe show success toast or close?
            onClose();
        } catch (error) {
            console.error("Sync failed", error);
            // Handle error UI
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-slate-900/75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white dark:bg-slate-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full">
                    <div className="bg-white dark:bg-slate-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-start mb-5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-lg">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg leading-6 font-display font-medium text-slate-900 dark:text-white" id="modal-title">
                                        Smart Task Split
                                    </h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        Breaking down "{task.title}"
                                    </p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="mt-4">
                            {loading ? (
                                <div className="py-12 text-center text-slate-500">
                                    <Sparkles className="w-8 h-8 animate-spin mx-auto mb-2 text-accent-500" />
                                    <p>{blocks.length > 0 ? "Syncing to calendar..." : "Analyzing task structure..."}</p>
                                </div>
                            ) : blocks.length > 0 ? (
                                <div className="space-y-3">
                                    {blocks.sort((a, b) => a.order - b.order).map((block) => (
                                        <div key={block.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 flex justify-between items-center group hover:border-accent-300 dark:hover:border-accent-600 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/50 text-accent-600 dark:text-accent-400 flex items-center justify-center text-xs font-bold">
                                                    {block.order + 1}
                                                </div>
                                                <span className="font-medium text-slate-700 dark:text-slate-200">{block.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{block.duration}m</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    No suggestions generated yet.
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                        <Button
                            variant="primary"
                            disabled={blocks.length === 0}
                            className="w-full sm:w-auto bg-gradient-brand"
                            onClick={handleSync}
                        >
                            <Calendar className="w-4 h-4 mr-2" />
                            Calendar Sync
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={handleRegenerate}
                            disabled={loading}
                            className="w-full sm:w-auto mt-3 sm:mt-0"
                        >
                            <Sparkles className="w-4 h-4 mr-2" />
                            Regenerate
                        </Button>
                        <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto mt-3 sm:mt-0">
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
