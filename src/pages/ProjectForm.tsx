import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { projectService } from '../services/project.service';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CreateProjectData } from '../types/project.types';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AIProjectScoper } from '../components/intelligence/AIProjectScoper';
import toast from 'react-hot-toast';

export const ProjectForm: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = !!id;
    const [showAIScoper, setShowAIScoper] = useState(false);

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

    const handleScopeApplied = async (phases: any[], title: string, description: string, budget: number) => {
        try {
            setShowAIScoper(false);
            const loadId = toast.loading("Gemini is assembling your project checklist & budget targets...");
            
            await projectService.createProject({
                title,
                description,
                startDate: new Date().toISOString().split('T')[0],
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days default
                budgetLimit: budget,
                aiPhases: phases
            } as any);

            toast.success("Project blueprint loaded and pre-funded successfully!", { id: loadId });
            navigate('/projects');
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate project template", { id: "scoping-progress" });
        }
    };

    if (showAIScoper) {
        return (
            <div className="max-w-2xl mx-auto">
                <AIProjectScoper 
                    onScopeApplied={handleScopeApplied}
                    onClose={() => setShowAIScoper(false)}
                />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
                {isEditing ? 'Edit Project' : 'Create New Project'}
            </h1>

            {!isEditing && (
                <div 
                    onClick={() => setShowAIScoper(true)}
                    className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 shadow-sm cursor-pointer hover:border-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-between gap-4 group"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                            <Sparkles className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                AI Autopilot Scoper
                                <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-[9.5px] text-indigo-500 font-bold uppercase tracking-wider">New</span>
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Describe what you want to build and let Gemini auto-generate the complete task checklist!</p>
                        </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                </div>
            )}

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
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
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
