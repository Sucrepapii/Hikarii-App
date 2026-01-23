import React from 'react';
import { Task } from '../../types/task.types';
import { TaskItem } from './TaskItem';
import { Inbox } from 'lucide-react';

interface TaskListProps {
    tasks: Task[];
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
    tasks,
    onToggle,
    onEdit,
    onDelete,
}) => {
    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full glass mb-4">
                    <Inbox className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    No tasks yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Create your first task to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};
