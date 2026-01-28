import React, { useEffect, useState } from 'react';
import { Project } from '../types/project.types';
import { projectService } from '../services/project.service';
import { Card } from '../components/common/Card';
import { Plus, Briefcase, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const Projects: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProjects = async () => {
            try {
                const data = await projectService.getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Failed to load projects", error);
            } finally {
                setLoading(false);
            }
        };
        loadProjects();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading projects...</div>;

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        My Projects
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Track your goals and big-picture initiatives
                    </p>
                </div>
                <Link to="/projects/new">
                    <Button variant="primary" className="gap-2">
                        <Plus className="w-5 h-5" />
                        New Project
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.length === 0 ? (
                    <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No projects yet</h3>
                        <p className="text-slate-500 mb-6">Create a project to group your tasks and budget</p>
                        <Link to="/projects/new">
                            <Button variant="secondary">Get Started</Button>
                        </Link>
                    </div>
                ) : (
                    projects.map(project => (
                        <Card key={project.id} className="relative overflow-hidden group hover:shadow-lg transition-all border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl group-hover:from-primary-500/20 transition-all" />

                            <div className="relative">
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${project.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                        project.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-700' :
                                            'bg-blue-100 text-primary-700'
                                        }`}>
                                        {project.status}
                                    </span>
                                    {project.endDate && (
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(project.endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                    {project.description || 'No description provided'}
                                </p>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500">
                                    <span>{project.budgetLimit ? `Budget: ₦${project.budgetLimit.toLocaleString()}` : 'No Budget'}</span>
                                    {/* Placeholder for task count if available */}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};
