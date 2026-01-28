import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/project.service';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CreateProjectData } from '../types/project.types';
import toast from 'react-hot-toast';

export const ProjectForm: React.FC = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateProjectData>();

    const onSubmit = async (data: CreateProjectData) => {
        try {
            await projectService.createProject(data);
            toast.success('Project created successfully!');
            navigate('/tasks'); // Redirect back to tasks or projects listing
        } catch (error) {
            console.error(error);
            toast.error('Failed to create project');
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Create New Project</h1>
            <Card>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Project Title
                        </label>
                        <input
                            {...register('title', { required: 'Title is required' })}
                            className="input w-full"
                            placeholder="e.g., Summer Vacation, Home Renovation"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            {...register('description')}
                            className="input w-full min-h-[100px]"
                            placeholder="What's this project about?"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                {...register('startDate')}
                                className="input w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                {...register('endDate')}
                                className="input w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Budget Limit (Optional)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">₦</span>
                            <input
                                type="number"
                                {...register('budgetLimit')}
                                className="input w-full pl-8"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
