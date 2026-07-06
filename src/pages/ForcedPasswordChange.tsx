import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ForcedPasswordChange: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    if (!user || !user.requiresPasswordChange) {
        navigate('/dashboard');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            toast.error('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post('/auth/change-password', {
                currentPassword,
                newPassword
            });

            toast.success('Password updated successfully! Please log in again.');
            logout();
            navigate('/');
        } catch (error: any) {
            console.error('Password change failed:', error);
            const message = error.response?.data?.error || 'Failed to update password';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 animate-scale-in border-none shadow-2xl relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400" />

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-100 dark:border-primary-800 shadow-sm">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white">Security Update Required</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                        Welcome, <span className="font-bold text-slate-700 dark:text-slate-200">{user.name}</span>. As a new administrator, you must update your password before proceeding.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Temporary Password</label>
                        <div className="relative">
                            <input
                                required
                                type={showPasswords ? "text" : "password"}
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                placeholder="Enter temp password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 mx-2" />

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">New Password</label>
                            <input
                                required
                                type={showPasswords ? "text" : "password"}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                placeholder="Create new password"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Confirm New Password</label>
                            <input
                                required
                                type={showPasswords ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                placeholder="Repeat new password"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Requirements</h4>
                        <div className="flex items-center gap-2 text-xs">
                            {newPassword.length >= 8 ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-300" />}
                            <span className={newPassword.length >= 8 ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500"}>Minimum 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            {newPassword === confirmPassword && newPassword !== '' ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-300" />}
                            <span className={newPassword === confirmPassword && newPassword !== '' ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500"}>Passwords match</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold hover:from-primary-700 hover:to-accent-700 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50"
                    >
                        {isLoading ? 'Updating Security...' : 'Update Password & Access Dashboard'}
                    </button>

                    <button
                        type="button"
                        onClick={logout}
                        className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        Cancel and Log Out
                    </button>
                </form>
            </Card>
        </div>
    );
};

export default ForcedPasswordChange;
