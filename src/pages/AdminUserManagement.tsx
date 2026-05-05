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

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    subscriptionStatus: string;
    lastLoginAt: string | null;
    createdAt: string;
    isSuspended: boolean;
    suspensionReason?: string;
    suspensionExpires?: string;
    requiresPasswordChange?: boolean;
}

export const AdminUserManagement: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pages: 1,
        total: 0
    });

    // Batch Operations State
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [batchActionToConfirm, setBatchActionToConfirm] = useState<'DELETE' | 'SUSPEND' | null>(null);

    // Suspension State
    const [suspensionReason, setSuspensionReason] = useState('');
    const [suspensionDuration, setSuspensionDuration] = useState('7'); // days

    // Create Admin State
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user, navigate, pagination.currentPage]);

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

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsUpdating(true);
        try {
            await apiClient.put(`/admin/users/${editingUser.id}`, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                subscriptionStatus: editingUser.subscriptionStatus
            });

            toast.success('User updated successfully');
            setEditingUser(null);
            fetchAdminData();
        } catch (error) {
            console.error('Failed to update user:', error);
            toast.error('Failed to update user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        setIsUpdating(true);
        try {
            await apiClient.delete(`/admin/users/${userToDelete.id}`);
            toast.success('User and all associated data deleted');
            setUserToDelete(null);
            fetchAdminData();
        } catch (error) {
            console.error('Failed to delete user:', error);
            toast.error('Failed to delete user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSuspendUser = async () => {
        if (!editingUser) return;
        setIsUpdating(true);
        try {
            await apiClient.post(`/admin/users/${editingUser.id}/suspend`, {
                reason: suspensionReason,
                durationDays: parseInt(suspensionDuration)
            });
            toast.success('User suspended');
            setEditingUser(null);
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to suspend user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCreateAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            await apiClient.post('/admin/create-admin', newAdmin);
            toast.success('Admin account created successfully');
            setIsCreatingAdmin(false);
            setNewAdmin({ name: '', email: '', password: '' });
            fetchAdminData();
        } catch (error: any) {
            console.error('Failed to create admin:', error);
            const message = error.response?.data?.message || 'Failed to create admin';
            toast.error(message);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReactivateUser = async (id: string) => {
        setIsUpdating(true);
        try {
            await apiClient.post(`/admin/users/${id}/reactivate`);
            toast.success('User reactivated');
            fetchAdminData();
        } catch (error) {
            toast.error('Failed to reactivate user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleBatchAction = async () => {
        if (selectedUserIds.length === 0 || !batchActionToConfirm) return;
        const action = batchActionToConfirm;

        setIsUpdating(true);
        try {
            await apiClient.post('/admin/batch', {
                userIds: selectedUserIds,
                action,
                details: action === 'SUSPEND' ? { reason: 'Batch suspension', durationDays: 30 } : {}
            });
            toast.success(`Batch ${action.toLowerCase()} successful`);
            setSelectedUserIds([]);
            setBatchActionToConfirm(null);
            fetchAdminData();
        } catch (error) {
            toast.error('Batch operation failed');
        } finally {
            setIsUpdating(false);
        }
    };

    const toggleUserSelection = (id: string) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
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
                                                            ? "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => !isUpdating && setEditingUser(null)} />
                    <Card className="relative w-full max-w-2xl animate-scale-in overflow-hidden border-none shadow-2xl">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-xl">
                                    {editingUser.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white">{editingUser.name}</h3>
                                    <p className="text-sm text-slate-500">{editingUser.email}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto">
                            {/* Account Settings */}
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    Access Control
                                </h4>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Platform Role</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['USER', 'ADMIN'].map(r => (
                                            <button
                                                key={r}
                                                onClick={() => setEditingUser({ ...editingUser, role: r })}
                                                className={clsx(
                                                    "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                                                    editingUser.role === r
                                                        ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-600/20"
                                                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-400"
                                                )}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {editingUser.role !== 'ADMIN' ? (
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subscription Tier</label>
                                        <select
                                            value={editingUser.subscriptionStatus}
                                            onChange={(e) => setEditingUser({ ...editingUser, subscriptionStatus: e.target.value })}
                                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium focus:ring-4 focus:ring-primary-500/10 outline-none"
                                        >
                                            <option value="FREE">FREE (Standard)</option>
                                            <option value="TRIAL">TRIAL (14-Day)</option>
                                            <option value="PRO">PRO (Premium)</option>
                                        </select>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Subscription Restricted</p>
                                        <p className="text-sm text-slate-500">Administrators have full platform access by default.</p>
                                    </div>
                                )}

                                <div className="pt-4">
                                    <button
                                        onClick={handleUpdateUser}
                                        disabled={isUpdating}
                                        className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-xl"
                                    >
                                        {isUpdating ? 'Updating...' : 'Save Permissions'}
                                    </button>
                                </div>
                            </div>

                            {/* Suspension Controls */}
                            <div className="space-y-6 bg-slate-50 dark:bg-slate-800/30 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-amber-600 flex items-center gap-2">
                                    <Ban className="w-4 h-4" />
                                    Account Suspension
                                </h4>

                                {editingUser.isSuspended ? (
                                    <div className="space-y-4 text-center">
                                        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                                            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                                            <p className="text-sm font-bold text-red-700 dark:text-red-400">Account is currently suspended</p>
                                            <p className="text-xs text-red-600 mt-1">Reason: {editingUser.suspensionReason || 'None specified'}</p>
                                        </div>
                                        <button
                                            onClick={() => handleReactivateUser(editingUser.id)}
                                            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                                        >
                                            Reactivate Now
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Duration</label>
                                            <select
                                                value={suspensionDuration}
                                                onChange={(e) => setSuspensionDuration(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none"
                                            >
                                                <option value="1">24 Hours</option>
                                                <option value="7">7 Days</option>
                                                <option value="30">30 Days</option>
                                                <option value="0">Indefinite</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Reason for Action</label>
                                            <textarea
                                                value={suspensionReason}
                                                onChange={(e) => setSuspensionReason(e.target.value)}
                                                placeholder="Violation of terms, suspicious activity..."
                                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm min-h-[100px] outline-none"
                                            />
                                        </div>
                                        <button
                                            onClick={handleSuspendUser}
                                            disabled={isUpdating}
                                            className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
                                        >
                                            {isUpdating ? 'Executing...' : 'Suspend Account'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-100 dark:bg-slate-900 flex justify-center border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => {
                                    setUserToDelete(editingUser);
                                    setEditingUser(null);
                                }}
                                className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                                Permanently Delete Account
                            </button>
                        </div>
                    </Card>
                </div>
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
            {isCreatingAdmin && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => !isUpdating && setIsCreatingAdmin(false)} />
                    <Card className="relative w-full max-w-md animate-scale-in overflow-hidden border-none shadow-2xl">
                        <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                            <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center">
                                    <UserPlus className="w-6 h-6" />
                                </div>
                                Create New Admin
                            </h3>
                            <button onClick={() => setIsCreatingAdmin(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAdmin} className="p-8 space-y-6">
                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900 rounded-xl flex gap-3">
                                <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                                    New admins will be required to change their temporary password upon their first login for security.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Enter admin name"
                                        value={newAdmin.name}
                                        onChange={e => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                    <input
                                        required
                                        type="email"
                                        placeholder="admin@example.com"
                                        value={newAdmin.email}
                                        onChange={e => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Temporary Password</label>
                                    <input
                                        required
                                        type="password"
                                        placeholder="Create a temporary password"
                                        value={newAdmin.password}
                                        onChange={e => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50"
                            >
                                {isUpdating ? 'Creating Account...' : 'Create Admin Account'}
                            </button>
                        </form>
                    </Card>
                </div>
            )}
            <ConfirmModal
                isOpen={!!batchActionToConfirm}
                onClose={() => !isUpdating && setBatchActionToConfirm(null)}
                onConfirm={handleBatchAction}
                title={batchActionToConfirm === 'DELETE' ? 'Bulk Delete Users' : 'Bulk Suspend Users'}
                message={batchActionToConfirm === 'DELETE' 
                    ? `Are you sure you want to permanently delete ${selectedUserIds.length} selected users and all their associated data?`
                    : `Are you sure you want to suspend ${selectedUserIds.length} selected users for 30 days?`}
                confirmText={batchActionToConfirm === 'DELETE' ? 'Delete Users' : 'Suspend Users'}
                variant={batchActionToConfirm === 'DELETE' ? 'danger' : 'warning'}
                isLoading={isUpdating}
            />
        </div>
    );
};
