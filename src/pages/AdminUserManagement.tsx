import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Search, Shield, Clock, X, Users, Trash2, Ban, CheckCircle, AlertTriangle, MoreVertical, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EditUserModal } from '../components/admin/EditUserModal';
import { CreateAdminModal } from '../components/admin/CreateAdminModal';
import { useAdminUserActions, UserData } from '../hooks/useAdminUserActions';

export const AdminUserManagement: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pages: 1,
        total: 0
    });

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/dashboard?page=${pagination.currentPage}&limit=10`);
            setUsers(response.data.users || []);
            setPagination(prev => ({
                ...prev,
                pages: response.data.pagination.pages,
                total: response.data.pagination.total
            }));
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    const {
        isUpdating,
        editingUser,
        setEditingUser,
        userToDelete,
        setUserToDelete,
        selectedUserIds,
        setSelectedUserIds,
        toggleUserSelection,
        batchActionToConfirm,
        setBatchActionToConfirm,
        suspensionReason,
        setSuspensionReason,
        suspensionDuration,
        setSuspensionDuration,
        isCreatingAdmin,
        setIsCreatingAdmin,
        newAdmin,
        setNewAdmin,
        handleUpdateUser,
        handleDeleteUser,
        handleSuspendUser,
        handleReactivateUser,
        handleCreateAdmin,
        handleBatchAction,
    } = useAdminUserActions(fetchAdminData);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user, navigate, pagination.currentPage]);

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Access Denied</h2>
                    <p className="text-slate-500 mt-2">You do not have permission to view this page.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Manage Accounts</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage user accounts, permissions, and status</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCreatingAdmin(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5"
                    >
                        <UserPlus className="w-5 h-5" />
                        Create Admin
                    </button>
                    {selectedUserIds.length > 0 && (
                        <div className="flex items-center gap-2 animate-slide-in-right bg-primary-50 dark:bg-primary-900/20 p-2 rounded-xl border border-primary-100 dark:border-primary-800">
                            <span className="text-sm font-bold text-primary-700 dark:text-primary-300 px-2">{selectedUserIds.length} Selected</span>
                            <div className="h-6 w-px bg-primary-200 dark:bg-primary-700 mx-1" />
                            <button
                                onClick={() => setBatchActionToConfirm('SUSPEND')}
                                className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold hover:bg-amber-600 transition-colors"
                            >
                                Bulk Suspend
                            </button>
                            <button
                                onClick={() => setBatchActionToConfirm('DELETE')}
                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                            >
                                Bulk Delete
                            </button>
                            <button
                                onClick={() => setSelectedUserIds([])}
                                className="p-1.5 text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary-600" />
                        User Directory
                    </h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-80 shadow-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                                <th className="p-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                        checked={selectedUserIds.length === filteredUsers.length && filteredUsers.length > 0}
                                        onChange={() => {
                                            if (selectedUserIds.length === filteredUsers.length) setSelectedUserIds([]);
                                            else setSelectedUserIds(filteredUsers.map(u => u.id));
                                        }}
                                    />
                                </th>
                                <th className="p-4">User Details</th>
                                <th className="p-4">Account Status</th>
                                <th className="p-4">Activity Log</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className={clsx(
                                    "hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group",
                                    selectedUserIds.includes(u.id) && "bg-primary-50/30 dark:bg-primary-900/10"
                                )}>
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                            checked={selectedUserIds.includes(u.id)}
                                            onChange={() => toggleUserSelection(u.id)}
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-md transition-transform group-hover:scale-110">
                                                    {u.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className={clsx(
                                                    "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800",
                                                    u.isSuspended ? "bg-red-500" : "bg-emerald-500"
                                                )} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{u.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                {u.role === 'ADMIN' && (
                                                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-900 dark:border-white">
                                                        ADMIN
                                                    </span>
                                                )}
                                                {u.role !== 'ADMIN' && (
                                                    <span className={clsx(
                                                        "px-2 py-0.5 rounded-lg text-[10px] font-bold border",
                                                        u.subscriptionStatus === 'PRO'
                                                            ? "bg-accent-100 text-accent-700 border-accent-200 dark:bg-accent-900/30 dark:text-accent-300 dark:border-accent-800"
                                                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                                                    )}>
                                                        {u.subscriptionStatus}
                                                    </span>
                                                )}
                                                <span className={clsx(
                                                    "px-2 py-0.5 rounded-lg text-[10px] font-bold border",
                                                    u.isSuspended
                                                        ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                                                        : "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800"
                                                )}>
                                                    {u.isSuspended ? 'SUSPENDED' : 'ACTIVE'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Joined {format(new Date(u.createdAt), 'MMM yyyy')}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-xs">
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">Last active:</p>
                                            <p className="text-slate-900 dark:text-white font-bold">
                                                {u.lastLoginAt ? format(new Date(u.lastLoginAt), 'MMM d, p') : 'Never'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {u.isSuspended ? (
                                                <button
                                                    onClick={() => handleReactivateUser(u.id)}
                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors"
                                                    title="Reactivate Account"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setSuspensionReason(u.suspensionReason || '');
                                                    }}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-xl transition-colors"
                                                    title="Suspend User"
                                                >
                                                    <Ban className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setEditingUser(u)}
                                                className="p-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
                                            >
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Page {pagination.currentPage} of {pagination.pages} (Total {pagination.total} users)
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || loading}
                            className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.pages || loading}
                            className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Card>

            {/* Comprehensive Manage/Edit Modal */}
            {editingUser && (
                <EditUserModal
                    editingUser={editingUser}
                    onClose={() => setEditingUser(null)}
                    isUpdating={isUpdating}
                    onUpdate={handleUpdateUser}
                    onSuspend={handleSuspendUser}
                    onReactivate={handleReactivateUser}
                    onDelete={(u) => setUserToDelete(u)}
                    suspensionReason={suspensionReason}
                    setSuspensionReason={setSuspensionReason}
                    suspensionDuration={suspensionDuration}
                    setSuspensionDuration={setSuspensionDuration}
                    setEditingUser={setEditingUser}
                />
            )}

            {/* Delete User Confirmation remains as is but with slightly improved styling */}
            {userToDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => !isUpdating && setUserToDelete(null)} />
                    <Card className="relative w-full max-w-sm animate-scale-in p-8 border-none shadow-2xl">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 transition-transform hover:rotate-0">
                                <Trash2 className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-3">Permanent Deletion?</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
                                You are about to delete <strong>{userToDelete.name}</strong>. This is irreversible and will remove all their financial data and projects.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setUserToDelete(null)}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
                                    disabled={isUpdating}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-600/20"
                                >
                                    {isUpdating ? 'Deleting...' : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
            {/* Create Admin Modal */}
            <CreateAdminModal
                isOpen={isCreatingAdmin}
                onClose={() => setIsCreatingAdmin(false)}
                isUpdating={isUpdating}
                onSubmit={handleCreateAdmin}
                newAdmin={newAdmin}
                setNewAdmin={setNewAdmin}
            />
            <ConfirmModal
                isOpen={!!batchActionToConfirm}
                onClose={() => !isUpdating && setBatchActionToConfirm(null)}
                onConfirm={handleBatchAction}
                title={batchActionToConfirm === 'DELETE' ? 'Bulk Delete Users' : 'Bulk Suspend Users'}
                message={batchActionToConfirm === 'DELETE' 
                    ? `Are you sure you want to permanently delete ${selectedUserIds.length} selected users and all their associated data?`
                    : `Are you sure you want to suspend ${selectedUserIds.length} selected users for 30 days?`}
                confirmText={batchActionToConfirm === 'DELETE' ? 'Delete Users' : 'Suspend Users'}
                variant={batchActionToConfirm === 'DELETE' ? 'danger' : 'primary'}
                isLoading={isUpdating}
            />
        </div>
    );
};
