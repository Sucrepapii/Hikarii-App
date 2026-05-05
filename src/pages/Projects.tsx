import React, { useEffect, useState } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useCollaborationStore } from '../stores/collaborationStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Plus, Briefcase, Calendar, Edit2, Trash2, CheckCircle2, Users, MessageSquare, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import toast from 'react-hot-toast';
import { UpgradeModal } from '../components/modals/UpgradeModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { InviteModal } from '../components/collaboration/InviteModal';
import { MemberList } from '../components/collaboration/MemberList';
import { ActivityLog } from '../components/collaboration/ActivityLog';

export const Projects: React.FC = () => {
    const { projects, isLoading, fetchProjects, toggleProjectStatus, deleteProject } = useProjectStore();
    const { members, fetchMembers, reset } = useCollaborationStore();
    const { user, checkAuth } = useAuthStore();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Collaboration panel state
    const [inviteProjectId, setInviteProjectId] = useState<string | null>(null);
    const [collabPanelProject, setCollabPanelProject] = useState<{ id: string; title: string } | null>(null);
    const [collabTab, setCollabTab] = useState<'members' | 'activity'>('members');

    useEffect(() => {
        const load = async () => {
            await checkAuth();
            await fetchProjects();
        };
        load();
    }, []);

    // Fetch members when panel opens
    useEffect(() => {
        if (collabPanelProject) {
            reset();
            fetchMembers(collabPanelProject.id);
        }
    }, [collabPanelProject]);

    const handleDeleteClick = (id: string) => setDeleteId(id);

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteProject(deleteId);
            toast.success("Project deleted");
            setDeleteId(null);
        } catch {
            toast.error("Failed to delete project");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'COMPLETED' ? 'ACTIVE' : 'COMPLETED';
        try {
            await toggleProjectStatus(id, newStatus as any);
            toast.success(newStatus === 'COMPLETED' ? 'Project moved to archive' : 'Project restored');
        } catch {
            toast.error("Failed to update project status");
        }
    };

    const activeProjects = projects.filter(p => !p.status || p.status === 'ACTIVE');

    if (isLoading && projects.length === 0) return <div className="p-8 text-center">Loading projects...</div>;

    return (
        <>
            <div className="animate-fade-in space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold gradient-text mb-2">My Projects</h1>
                        <p className="text-slate-600 dark:text-slate-400">Track your goals and big-picture initiatives</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link to="/settings?tab=archive">
                            <Button variant="ghost" className="text-slate-500 hover:text-primary-600">View Archive</Button>
                        </Link>
                        <Button
                            variant="primary"
                            className="gap-2 whitespace-nowrap touch-manipulation min-w-fit"
                            onClick={() => {
                                const isFree = !user?.subscriptionStatus || user?.subscriptionStatus === 'FREE';
                                if (isFree && projects.length >= 1) {
                                    setIsUpgradeModalOpen(true);
                                } else {
                                    window.location.href = '/projects/new';
                                }
                            }}
                        >
                            <Plus className="w-5 h-5" />
                            New Project
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeProjects.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <Briefcase className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No active projects</h3>
                            <p className="text-slate-500 mb-6">Create a project to group your tasks and budget</p>
                            <Link to="/projects/new">
                                <Button variant="secondary">Get Started</Button>
                            </Link>
                        </div>
                    ) : (
                        activeProjects.map(project => (
                            <Card key={project.id} className="relative overflow-hidden group hover:shadow-lg transition-all border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl group-hover:from-primary-500/20 transition-all" />

                                <div className="relative flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(project.id, project.status)}
                                            className="group/check relative flex items-center justify-center p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                            title="Mark as Completed"
                                        >
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600 group-hover/check:border-primary-500 transition-colors" />
                                            <CheckCircle2 className="w-6 h-6 absolute text-primary-500 scale-0 group-hover/check:scale-110 group-hover/check:opacity-50 transition-all" />
                                        </button>
                                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-primary-100 text-primary-700">
                                            {project.status || 'ACTIVE'}
                                        </span>
                                        {project.isShared && (
                                            <span className="px-2 py-1 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                                                <Users className="w-3 h-3" /> Shared
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {/* Share / Collab button */}
                                        {project.userId === user?.id && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setInviteProjectId(project.id)}
                                                className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg transition-smooth"
                                                title="Invite Collaborator"
                                            >
                                                <Users className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {/* Activity log button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setCollabPanelProject({ id: project.id, title: project.title });
                                                setCollabTab('activity');
                                            }}
                                            className="p-2 bg-slate-500/10 hover:bg-slate-500/20 text-slate-500 dark:text-slate-400 rounded-lg transition-smooth"
                                            title="Activity Log"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                        </Button>
                                        {project.userId === user?.id && (
                                            <>
                                                <Link to={`/projects/edit/${project.id}`}>
                                                    <Button variant="ghost" size="sm" className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-lg transition-smooth">
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(project.id)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg transition-smooth">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{project.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                                    {project.description || 'No description provided'}
                                </p>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm text-slate-500">
                                    <span>{project.budgetLimit ? `Budget: ₦${project.budgetLimit.toLocaleString()}` : 'No Budget'}</span>
                                    {project.endDate && (
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(project.endDate).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* ── COLLABORATION SIDE PANEL ─────────────────────────────── */}
            {collabPanelProject && (
                <div className="fixed inset-0 z-40 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCollabPanelProject(null)} />
                    <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-white/10 shadow-2xl flex flex-col animate-slide-in-right h-full">
                        {/* Panel Header */}
                        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5">
                            <div>
                                <h2 className="font-bold text-slate-900 dark:text-white text-sm">{collabPanelProject.title}</h2>
                                <p className="text-xs text-slate-400">Collaboration</p>
                            </div>
                            <button onClick={() => setCollabPanelProject(null)} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-100 dark:border-white/5 px-5">
                            {(['members', 'activity'] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setCollabTab(tab)}
                                    className={`py-3 px-1 mr-5 text-xs font-semibold border-b-2 transition-colors capitalize ${
                                        collabTab === tab
                                            ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                            : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                                >
                                    {tab === 'members' ? <><Users className="w-3.5 h-3.5 inline mr-1" />Members</> : <><MessageSquare className="w-3.5 h-3.5 inline mr-1" />Activity</>}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-5 flex flex-col">
                            {collabTab === 'members' ? (
                                <>
                                    <MemberList
                                        projectId={collabPanelProject.id}
                                        members={members}
                                        currentUserId={user?.id || ''}
                                        isOwner={projects.find(p => p.id === collabPanelProject.id)?.userId === user?.id}
                                    />
                                    {projects.find(p => p.id === collabPanelProject.id)?.userId === user?.id && (
                                        <Button
                                            variant="secondary"
                                            className="mt-4 gap-2 w-full"
                                            onClick={() => setInviteProjectId(collabPanelProject.id)}
                                        >
                                            <Users className="w-4 h-4" /> Invite Member
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <ActivityLog projectId={collabPanelProject.id} currentUserId={user?.id || ''} />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODALS ────────────────────────────────────────────────── */}
            <UpgradeModal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} />

            {inviteProjectId && (
                <InviteModal
                    projectId={inviteProjectId}
                    projectTitle={projects.find(p => p.id === inviteProjectId)?.title || ''}
                    isOpen={!!inviteProjectId}
                    onClose={() => setInviteProjectId(null)}
                />
            )}

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => !isDeleting && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Project"
                message="Are you sure you want to delete this project? This will also remove all associated tasks."
                confirmText="Delete Project"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
};
