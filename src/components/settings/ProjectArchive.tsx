import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import { Card } from '../common/Card';
import { Archive, RotateCcw, Trash2, Search, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ConfirmModal } from '../common/ConfirmModal';

export const ProjectArchive: React.FC = () => {
    const { projects, fetchProjects, toggleProjectStatus, deleteProject } = useProjectStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const archivedProjects = projects.filter(p =>
        p.status === 'COMPLETED' &&
        (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleRestore = async (id: string) => {
        try {
            await toggleProjectStatus(id, 'ACTIVE');
            toast.success('Project restored to active list');
        } catch (error) {
            toast.error('Failed to restore project');
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteProject(deleteId);
            toast.success('Project permanently deleted');
            setDeleteId(null);
        } catch (error) {
            toast.error('Failed to delete project');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Project Archive
                        </h2>
                        <p className="text-sm text-slate-500">
                            Manage completed projects
                        </p>
                    </div>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {archivedProjects.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Archive className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400">
                        Archive is empty
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Completed projects will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {archivedProjects.map((project) => (
                        <div
                            key={project.id}
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                        >
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate line-through opacity-70">
                                    {project.title}
                                </h4>
                                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                    <span>Completed {format(new Date(project.updatedAt || project.createdAt), 'MMM d, yyyy')}</span>
                                    {project.budgetLimit && (
                                        <span className="px-1.5 py-0.5 rounded bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 font-medium">
                                            ₦{project.budgetLimit.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleRestore(project.id)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                    title="Restore Project"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(project.id)}
                                    className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    title="Delete Permanently"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => !isDeleting && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Permanently Delete Project"
                message="This action cannot be undone. All data associated with this project will be lost forever. Are you absolutely sure?"
                confirmText="Yes, Delete Permanently"
                variant="danger"
                isLoading={isDeleting}
            />
        </Card>
    );
};
