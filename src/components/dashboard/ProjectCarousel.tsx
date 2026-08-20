import React, { useEffect, useState } from 'react';
import { Plus, Briefcase, ChevronRight, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';
import { useAuthStore, hasProAccess } from '../../stores/authStore';
import { useProjectStore } from '../../stores/projectStore';
import { UpgradeModal } from '../modals/UpgradeModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const ProjectCarousel: React.FC = () => {
    const { projects, fetchProjects, toggleProjectStatus, deleteProject, isLoading } = useProjectStore();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { user } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const activeProjects = projects.filter(p => !p.status || p.status === 'ACTIVE');

    const handleNewProjectClick = (e: React.MouseEvent) => {
        e.preventDefault();
        const isPro = hasProAccess(user);

        if (!isPro && activeProjects.length >= 1) {
            setShowUpgradeModal(true);
        } else {
            navigate('/projects/new');
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        try {
            const nextStatus = currentStatus === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
            await toggleProjectStatus(id, nextStatus as any);
            toast.success(nextStatus === 'COMPLETED' ? 'Project moved to archive' : 'Project restored');
        } catch (error) {
            toast.error('Failed to update project');
        }
    };

    const handleDeleteClick = (id: string) => {
        setProjectToDelete(id);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        setIsDeleting(true);
        try {
            await deleteProject(projectToDelete);
            toast.success("Project deleted");
            setProjectToDelete(null);
        } catch (err) {
            toast.error("Failed to delete project");
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading && projects.length === 0) return <div className="h-40 animate-pulse bg-slate-100 dark:bg-slate-800 rounded-2xl" />;

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary-500" />
                    Active Projects
                </h2>
                <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                    View All <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Create New Project Card */}
                <div
                    onClick={handleNewProjectClick}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all p-6 flex flex-col items-center justify-center text-center h-48 bg-slate-50/50 dark:bg-slate-800/20"
                >
                    <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-200">New Project</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {hasProAccess(user) ? 'Start a new goal' : `${activeProjects.length}/1 Free Project Used`}
                    </p>
                </div>

                {activeProjects.slice(0, 2).map(project => (
                    <Card key={project.id} className="h-48 relative overflow-hidden group hover:shadow-lg transition-all border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl group-hover:from-primary-500/20 transition-all" />

                        <div className="relative h-full flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleToggleStatus(project.id, project.status);
                                            }}
                                            className="group/check relative flex items-center justify-center p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                            title="Mark as Completed"
                                        >
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover/check:border-primary-500 transition-colors" />
                                            <CheckCircle2 className="w-6 h-6 absolute text-primary-500 scale-0 group-hover/check:scale-110 group-hover/check:opacity-50 transition-all" />
                                        </button>
                                        <span className="px-2 py-1 rounded-md bg-accent-100 dark:bg-accent-900/30 text-[10px] font-bold text-primary-700 dark:text-primary-300">
                                            {project.status || 'ACTIVE'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <Link to={`/projects/edit/${project.id}`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="p-1.5 h-auto bg-accent-500/10 hover:bg-accent-500/20 text-accent-600 dark:text-accent-400 rounded-lg"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleDeleteClick(project.id);
                                            }}
                                            className="p-1.5 h-auto bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                    {project.description || 'No description'}
                                </p>
                            </div>

                            <div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                        style={{ width: `${project.progress || 0}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Progress</span>
                                    <span>{project.progress || 0}%</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!projectToDelete}
                onClose={() => !isDeleting && setProjectToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Project"
                message="Are you sure you want to delete this project? This action cannot be undone and will remove all associated tasks."
                confirmText="Delete Project"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
