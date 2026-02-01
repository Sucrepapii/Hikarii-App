import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import { Plus } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { Task, TaskStatus, TaskPriority, TaskType } from '../types/task.types';
import { TaskFormData } from '../utils/validationSchemas';
import { ProjectCarousel } from '../components/dashboard/ProjectCarousel';
// import { useBudgetStore } from '../stores/budgetStore';

export const Tasks: React.FC = () => {
    const { tasks, fetchTasks, addTask, updateTask, deleteTask, toggleTaskStatus } = useTaskStore();
    // const { createExpenseFromTask } = useBudgetStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Fetch tasks on mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<TaskStatus | 'ALL'>('ALL');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'ALL'>('ALL');

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            task.title.toLowerCase().includes(searchLower) ||
            (task.description?.toLowerCase().includes(searchLower) ?? false);
        const matchesStatus = statusFilter === 'ALL' || task.status === statusFilter;
        const matchesPriority = priorityFilter === 'ALL' || task.priority === priorityFilter;
        return matchesSearch && matchesStatus && matchesPriority;
    });

    const handleSubmit = async (data: TaskFormData) => {
        // Transform form data to include financials if task type is set
        const taskData: any = {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate,
            tags: data.tags || [],
            projectId: data.projectId,
        };

        if (data.taskType) {
            taskData.financials = {
                type: data.taskType,
                estimatedCost: data.taskType === TaskType.EXPENSE ? data.estimatedCost : undefined,
                estimatedIncome: data.taskType === TaskType.INCOME ? data.estimatedIncome : undefined,
                lateFeePerDay: data.taskType === TaskType.EXPENSE ? data.lateFeePerDay : undefined,
                cashFlowImpact:
                    (data.taskType === TaskType.INCOME ? (data.estimatedIncome || 0) : 0) -
                    (data.taskType === TaskType.EXPENSE ? (data.estimatedCost || 0) : 0),
            };
        }

        try {
            if (editingTask) {
                await updateTask(editingTask.id, taskData);
                toast.success('Task updated successfully');
            } else {
                await addTask(taskData);
                toast.success('Task created successfully');
            }
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (error: any) {
            console.error('Task save error:', error);
            toast.error(error.message || 'Failed to save task');
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0 mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Tasks
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your tasks and stay productive
                    </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-stretch md:items-start">
                    <div className="w-full md:w-72">
                        <TaskFilters
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            priorityFilter={priorityFilter}
                            onPriorityFilterChange={setPriorityFilter}
                            className="mb-0"
                        />
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => setIsModalOpen(true)}
                        className="gap-2 justify-center h-[42px] whitespace-nowrap min-w-fit touch-manipulation" // Matching input height roughly
                    >
                        <Plus className="w-5 h-5" />
                        Add Task
                    </Button>
                </div>
            </div>

            <div className="mb-8">
                <ProjectCarousel />
            </div>



            <TaskList
                tasks={filteredTasks}
                onToggle={toggleTaskStatus}
                onEdit={handleEdit}
                onDelete={deleteTask}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingTask ? 'Edit Task' : 'Create New Task'}
            >
                <TaskForm
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    defaultValues={editingTask || undefined}
                />
            </Modal>
        </div>
    );
};
