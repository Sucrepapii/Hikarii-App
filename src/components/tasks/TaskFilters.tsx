import React from 'react';
import { TaskStatus, TaskPriority } from '../../types/task.types';
import { Search, Filter } from 'lucide-react';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { clsx } from 'clsx';

interface TaskFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: TaskStatus | 'ALL';
    onStatusFilterChange: (status: TaskStatus | 'ALL') => void;
    priorityFilter: TaskPriority | 'ALL';
    onPriorityFilterChange: (priority: TaskPriority | 'ALL') => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    priorityFilter,
    onPriorityFilterChange,
}) => {
    return (
        <Card className="mb-6">
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-primary-500" />
                <h3 className="text-lg font-semibold">Filters</h3>
            </div>

            <div className="space-y-4">
                {/* Search */}
                <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                />

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Status
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED].map(
                            (status) => (
                                <button
                                    key={status}
                                    onClick={() => onStatusFilterChange(status as TaskStatus | 'ALL')}
                                    className={clsx(
                                        'px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth',
                                        statusFilter === status
                                            ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                            : 'glass hover:bg-white/20 dark:hover:bg-black/30'
                                    )}
                                >
                                    {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                                </button>
                            )
                        )}
                    </div>
                </div>

                {/* Priority Filter */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Priority
                    </label>
                    <div className="flex gap-2 flex-wrap">
                        {[
                            'ALL',
                            TaskPriority.LOW,
                            TaskPriority.MEDIUM,
                            TaskPriority.HIGH,
                            TaskPriority.URGENT,
                        ].map((priority) => (
                            <button
                                key={priority}
                                onClick={() => onPriorityFilterChange(priority as TaskPriority | 'ALL')}
                                className={clsx(
                                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth',
                                    priorityFilter === priority
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                        : 'glass hover:bg-white/20 dark:hover:bg-black/30'
                                )}
                            >
                                {priority === 'ALL' ? 'All' : priority}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </Card>
    );
};
