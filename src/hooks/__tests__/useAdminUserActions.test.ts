import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminUserActions, UserData } from '../useAdminUserActions';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

vi.mock('../../api/client', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useAdminUserActions Hook Unit Tests', () => {
    const mockOnRefresh = vi.fn();

    const mockUser: UserData = {
        id: 'user-001',
        name: 'Test Subject',
        email: 'subject@hikarii.org',
        role: 'USER',
        subscriptionStatus: 'FREE',
        lastLoginAt: null,
        createdAt: new Date().toISOString(),
        isSuspended: false,
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should toggle user selection in batch list', () => {
        const { result } = renderHook(() => useAdminUserActions(mockOnRefresh));

        act(() => {
            result.current.toggleUserSelection('user-1');
        });
        expect(result.current.selectedUserIds).toEqual(['user-1']);

        act(() => {
            result.current.toggleUserSelection('user-2');
        });
        expect(result.current.selectedUserIds).toEqual(['user-1', 'user-2']);

        act(() => {
            result.current.toggleUserSelection('user-1');
        });
        expect(result.current.selectedUserIds).toEqual(['user-2']);
    });

    it('should update user permissions and trigger refresh', async () => {
        (apiClient.put as any).mockResolvedValueOnce({ data: { success: true } });
        const { result } = renderHook(() => useAdminUserActions(mockOnRefresh));

        act(() => {
            result.current.setEditingUser(mockUser);
        });

        await act(async () => {
            await result.current.handleUpdateUser();
        });

        expect(apiClient.put).toHaveBeenCalledWith('/admin/users/user-001', expect.objectContaining({
            name: 'Test Subject',
            email: 'subject@hikarii.org',
        }));
        expect(toast.success).toHaveBeenCalledWith('User updated successfully');
        expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should delete user and trigger refresh', async () => {
        (apiClient.delete as any).mockResolvedValueOnce({ data: { success: true } });
        const { result } = renderHook(() => useAdminUserActions(mockOnRefresh));

        act(() => {
            result.current.setUserToDelete(mockUser);
        });

        await act(async () => {
            await result.current.handleDeleteUser();
        });

        expect(apiClient.delete).toHaveBeenCalledWith('/admin/users/user-001');
        expect(toast.success).toHaveBeenCalledWith('User and all associated data deleted');
        expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should suspend user with duration and reason', async () => {
        (apiClient.post as any).mockResolvedValueOnce({ data: { success: true } });
        const { result } = renderHook(() => useAdminUserActions(mockOnRefresh));

        act(() => {
            result.current.setEditingUser(mockUser);
            result.current.setSuspensionReason('Abusive language');
            result.current.setSuspensionDuration('14');
        });

        await act(async () => {
            await result.current.handleSuspendUser();
        });

        expect(apiClient.post).toHaveBeenCalledWith('/admin/users/user-001/suspend', {
            reason: 'Abusive language',
            durationDays: 14,
        });
        expect(toast.success).toHaveBeenCalledWith('User suspended');
        expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should reactivate user by id', async () => {
        (apiClient.post as any).mockResolvedValueOnce({ data: { success: true } });
        const { result } = renderHook(() => useAdminUserActions(mockOnRefresh));

        await act(async () => {
            await result.current.handleReactivateUser('suspended-user-id');
        });

        expect(apiClient.post).toHaveBeenCalledWith('/admin/users/suspended-user-id/reactivate');
        expect(toast.success).toHaveBeenCalledWith('User reactivated');
        expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });

    it('should execute batch actions for selected users', async () => {
        (apiClient.post as any).mockResolvedValueOnce({ data: { success: true } });
        const { result } = renderHook(() => useAdminUserActions(mockOnRefresh));

        act(() => {
            result.current.setSelectedUserIds(['u1', 'u2']);
            result.current.setBatchActionToConfirm('DELETE');
        });

        await act(async () => {
            await result.current.handleBatchAction();
        });

        expect(apiClient.post).toHaveBeenCalledWith('/admin/batch', expect.objectContaining({
            userIds: ['u1', 'u2'],
            action: 'DELETE',
        }));
        expect(result.current.selectedUserIds).toEqual([]);
        expect(result.current.batchActionToConfirm).toBeNull();
        expect(mockOnRefresh).toHaveBeenCalledTimes(1);
    });
});
