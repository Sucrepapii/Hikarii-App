import { useState } from 'react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

export interface UserData {
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

export function useAdminUserActions(onRefresh?: () => void) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);

    // Batch Operations State
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [batchActionToConfirm, setBatchActionToConfirm] = useState<'DELETE' | 'SUSPEND' | null>(null);

    // Suspension State
    const [suspensionReason, setSuspensionReason] = useState('');
    const [suspensionDuration, setSuspensionDuration] = useState('7'); // days

    // Create Admin State
    const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });

    const toggleUserSelection = (id: string) => {
        setSelectedUserIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleUpdateUser = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!editingUser) return;

        setIsUpdating(true);
        try {
            await apiClient.put(`/admin/users/${editingUser.id}`, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                subscriptionStatus: editingUser.subscriptionStatus,
            });

            toast.success('User updated successfully');
            setEditingUser(null);
            if (onRefresh) onRefresh();
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
            if (onRefresh) onRefresh();
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
                durationDays: parseInt(suspensionDuration),
            });
            toast.success('User suspended');
            setEditingUser(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            toast.error('Failed to suspend user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReactivateUser = async (id: string) => {
        setIsUpdating(true);
        try {
            await apiClient.post(`/admin/users/${id}/reactivate`);
            toast.success('User reactivated');
            if (onRefresh) onRefresh();
        } catch (error) {
            toast.error('Failed to reactivate user');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCreateAdmin = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsUpdating(true);
        try {
            await apiClient.post('/admin/create-admin', newAdmin);
            toast.success('Admin account created successfully');
            setIsCreatingAdmin(false);
            setNewAdmin({ name: '', email: '', password: '' });
            if (onRefresh) onRefresh();
        } catch (error: any) {
            console.error('Failed to create admin:', error);
            const message = error.response?.data?.message || 'Failed to create admin';
            toast.error(message);
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
                details: action === 'SUSPEND' ? { reason: 'Batch suspension', durationDays: 30 } : {},
            });
            toast.success(`Batch ${action.toLowerCase()} successful`);
            setSelectedUserIds([]);
            setBatchActionToConfirm(null);
            if (onRefresh) onRefresh();
        } catch (error) {
            toast.error('Batch operation failed');
        } finally {
            setIsUpdating(false);
        }
    };

    return {
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
    };
}

export default useAdminUserActions;
