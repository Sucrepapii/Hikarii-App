import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/project.service';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CreateProjectData } from '../types/project.types';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export const ProjectForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;

    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreateProjectData>();

    // Load existing data if editing
    useEffect(() => {
        if (isEditing && id) {
            const loadProject = async () => {
                try {
                    const project = await projectService.getProject(id);
                    reset({
                        title: project.title,
                        description: project.description,
                        startDate: project.startDate ? project.startDate.split('T')[0] : '', // Format for date input
                        endDate: project.endDate ? project.endDate.split('T')[0] : '',
                        budgetLimit: project.budgetLimit
                    });
                } catch (error) {
                    toast.error("Failed to load project details");
                    navigate('/projects');
                }
            };
            loadProject();
        }
    }, [id, isEditing, reset, navigate]);

    const onSubmit = async (data: CreateProjectData) => {
        try {
            if (isEditing && id) {
                await projectService.updateProject(id, data);
                toast.success('Project updated successfully!');
            } else {
                await projectService.createProject(data);
                toast.success('Project created successfully!');
            }
            navigate('/projects');
        } catch (error) {
            console.error(error);
            toast.error(isEditing ? 'Failed to update project' : 'Failed to create project');
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                {isEditing ? 'Edit Project' : 'Create New Project'}
            </h1>
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
                            {isSubmitting ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Project' : 'Create Project')}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
