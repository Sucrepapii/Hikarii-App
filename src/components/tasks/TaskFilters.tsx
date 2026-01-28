import React, { useState, useRef, useEffect } from 'react';
import { TaskStatus, TaskPriority } from '../../types/task.types';
import { Search, X } from 'lucide-react';
import { Input } from '../common/Input';
import { clsx } from 'clsx';

interface TaskFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: TaskStatus | 'ALL';
    onStatusFilterChange: (status: TaskStatus | 'ALL') => void;
    priorityFilter: TaskPriority | 'ALL';
    onPriorityFilterChange: (priority: TaskPriority | 'ALL') => void;
    className?: string;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    priorityFilter,
    onPriorityFilterChange,
    className,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Only collapse if search is empty, otherwise user might be confused why filters disappeared while searching
                if (searchQuery === '' && statusFilter === 'ALL' && priorityFilter === 'ALL') {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchQuery, statusFilter, priorityFilter]);

    // Check if any filter is active
    const hasActiveFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL';

    return (
        <div ref={containerRef} className={clsx("relative z-10", className)}>
            <div
                className={clsx(
                    "transition-all duration-300 ease-in-out bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden",
                    isExpanded || hasActiveFilters ? "shadow-xl ring-2 ring-primary-500/20" : ""
                )}
            >
                <div className="p-2">
                    <Input
                        placeholder="Search tasks or filter..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        className="border-none focus:ring-0 bg-transparent"
                        icon={<Search className={clsx("w-5 h-5", isExpanded ? "text-primary-500" : "text-slate-400")} />}
                    />
                </div>

                {/* Filters Area */}
                <div
                    className={clsx(
                        "transition-all duration-300 ease-in-out border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50",
                        isExpanded || hasActiveFilters ? "max-h-[500px] opacity-100 p-4" : "max-h-0 opacity-0 overflow-hidden"
                    )}
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Filters</h3>
                            {(hasActiveFilters || searchQuery) && (
                                <button
                                    onClick={() => {
                                        onStatusFilterChange('ALL');
                                        onPriorityFilterChange('ALL');
                                        onSearchChange('');
                                        setIsExpanded(false);
                                    }}
                                    className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                                >
                                    <X className="w-3 h-3" /> Clear All
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div>
                            <label className="text-xs font-medium text-slate-500 mb-2 block">Status</label>
                            <div className="flex gap-2 flex-wrap">
                                {['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED].map(
                                    (status) => (
                                        <button
                                            key={status}
                                            onClick={() => onStatusFilterChange(status as TaskStatus | 'ALL')}
                                            className={clsx(
                                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth border',
                                                statusFilter === status
                                                    ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'
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
                            <label className="text-xs font-medium text-slate-500 mb-2 block">Priority</label>
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
                                            'px-3 py-1.5 rounded-lg text-sm font-medium transition-smooth border',
                                            priorityFilter === priority
                                                ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-primary-300'
                                        )}
                                    >
                                        {priority === 'ALL' ? 'All' : priority}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
