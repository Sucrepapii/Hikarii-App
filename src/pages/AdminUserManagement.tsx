import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Search, Shield, Clock, X, Users } from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    subscriptionStatus: string;
    createdAt: string;
    lastLoginAt: string | null;
}

export const AdminUserManagement: React.FC = () => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Mocking user fetch from dashboard data or a separate endpoint
            // Assuming the backend provides users now
            setUsers(response.data.users || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Failed to load user directory');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsUpdating(true);
        try {
            await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id}`, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                subscriptionStatus: editingUser.subscriptionStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
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

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-display font-bold">Manage Accounts</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">View and manage user accounts</p>
                </div>
            </div>

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                    <h3 className="text-lg font-bold">User Directory</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-10 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md">
                                <X className="w-3.5 h-3.5 text-slate-400" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Joined</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium">{u.name}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                                            u.subscriptionStatus === 'PRO' ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"
                                        )}>
                                            {u.subscriptionStatus}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5 text-sm">
                                            {u.role === 'ADMIN' ? <Shield className="w-3.5 h-3.5 text-primary-600" /> : <Users className="w-3.5 h-3.5 text-slate-400" />}
                                            {u.role}
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {format(new Date(u.createdAt), 'MMM d, yyyy')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => setEditingUser(u)} className="text-primary-600 hover:text-primary-700 text-sm font-medium">Manage</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {editingUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingUser(null)} />
                    <Card className="relative w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                            <h3 className="text-xl font-bold">Edit User</h3>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Role</label>
                                    <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                        <option value="USER">USER</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select value={editingUser.subscriptionStatus} onChange={e => setEditingUser({ ...editingUser, subscriptionStatus: e.target.value })} className="w-full px-3 py-2 border rounded-lg">
                                        <option value="FREE">FREE</option>
                                        <option value="PRO">PRO</option>
                                        <option value="TRIAL">TRIAL</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                                <button type="submit" disabled={isUpdating} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg">
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
};
