import React from 'react';
import { Card } from '../common/Card';
import { Shield, X, UserPlus } from 'lucide-react';

interface CreateAdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    isUpdating: boolean;
    onSubmit: (e: React.FormEvent) => void;
    newAdmin: { name: string; email: string; password: string };
    setNewAdmin: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string }>>;
}

export const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
    isOpen,
    onClose,
    isUpdating,
    onSubmit,
    newAdmin,
    setNewAdmin,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => !isUpdating && onClose()} />
            <Card className="relative w-full max-w-md animate-scale-in overflow-hidden border-none shadow-2xl">
                <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                    <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white flex items-center justify-center">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        Create New Admin
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors shadow-sm">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-8 space-y-6">
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
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold hover:from-primary-700 hover:to-accent-700 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50"
                    >
                        {isUpdating ? 'Creating Account...' : 'Create Admin Account'}
                    </button>
                </form>
            </Card>
        </div>
    );
};
export default CreateAdminModal;
