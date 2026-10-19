import React from 'react';
import { Card } from '../common/Card';
import { Shield, X, Trash2, Ban, AlertTriangle } from 'lucide-react';
import { UserData } from '../../hooks/useAdminUserActions';

interface EditUserModalProps {
    editingUser: UserData;
    onClose: () => void;
    isUpdating: boolean;
    onUpdate: (e: React.FormEvent) => void;
    onSuspend: () => void;
    onReactivate: (id: string) => void;
    onDelete: (user: UserData) => void;
    suspensionReason: string;
    setSuspensionReason: (val: string) => void;
    suspensionDuration: string;
    setSuspensionDuration: (val: string) => void;
    setEditingUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
    editingUser,
    onClose,
    isUpdating,
    onUpdate,
    onSuspend,
    onReactivate,
    onDelete,
    suspensionReason,
    setSuspensionReason,
    suspensionDuration,
    setSuspensionDuration,
    setEditingUser,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => !isUpdating && onClose()} />
            <Card className="relative w-full max-w-2xl animate-scale-in max-h-[90vh] overflow-y-auto border-none shadow-2xl">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                            {editingUser.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Account Permissions & Status</h3>
                            <p className="text-sm text-slate-500">{editingUser.email}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Role & Subscription Update */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">Account Access Role</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setEditingUser({ ...editingUser, role: 'USER' })}
                                className={`p-4 rounded-xl border text-left transition-all ${
                                    editingUser.role === 'USER'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-white ring-2 ring-primary-500/20'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                            >
                                <p className="font-bold text-sm">Regular User</p>
                                <p className="text-xs text-slate-500 mt-1">Standard member permissions</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingUser({ ...editingUser, role: 'ADMIN' })}
                                className={`p-4 rounded-xl border text-left transition-all ${
                                    editingUser.role === 'ADMIN'
                                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-900 dark:text-white ring-2 ring-primary-500/20'
                                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                }`}
                            >
                                <p className="font-bold text-sm flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
                                    <Shield className="w-4 h-4" /> Administrator
                                </p>
                                <p className="text-xs text-slate-500 mt-1">Full control of system & data</p>
                            </button>
                        </div>

                        {editingUser.role !== 'ADMIN' ? (
                            <div className="pt-2">
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subscription Tier</label>
                                <select
                                    value={editingUser.subscriptionStatus}
                                    onChange={(e) => setEditingUser({ ...editingUser, subscriptionStatus: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none"
                                >
                                    <option value="FREE">Free Tier</option>
                                    <option value="STUDENT_PRO">Student Pro</option>
                                    <option value="PRO">Professional</option>
                                    <option value="LIFETIME">Lifetime Access</option>
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
                                onClick={onUpdate}
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
                                    onClick={() => onReactivate(editingUser.id)}
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
                                    onClick={onSuspend}
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
                            onDelete(editingUser);
                            onClose();
                        }}
                        className="flex items-center gap-2 text-red-600 font-bold text-sm hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Permanently Delete Account
                    </button>
                </div>
            </Card>
        </div>
    );
};
export default EditUserModal;
