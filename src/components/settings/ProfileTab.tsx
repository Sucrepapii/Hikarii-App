import React from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Shield, CreditCard, MessageCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../common/ConfirmModal';

export const ProfileTab: React.FC = () => {
    const { user, checkAuth } = useAuthStore();
    const [isCanceling, setIsCanceling] = React.useState(false);
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [newName, setNewName] = React.useState(user?.name || '');
    const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
    const [phoneNumber, setPhoneNumber] = React.useState(user?.phoneNumber || '');
    const [waTasksEnabled, setWaTasksEnabled] = React.useState(user?.waTasksEnabled || false);
    const [waBudgetEnabled, setWaBudgetEnabled] = React.useState(user?.waBudgetEnabled || false);
    const [waProjectsEnabled, setWaProjectsEnabled] = React.useState(user?.waProjectsEnabled || false);

    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);
    const [showCancelModal, setShowCancelModal] = React.useState(false);

    React.useEffect(() => {
        if (user?.name) setNewName(user.name);
        setPhoneNumber(user?.phoneNumber || '');
        setWaTasksEnabled(user?.waTasksEnabled || false);
        setWaBudgetEnabled(user?.waBudgetEnabled || false);
        setWaProjectsEnabled(user?.waProjectsEnabled || false);
    }, [user]);

    const handleCancelSubscription = async () => {
        setShowCancelModal(false);
        setIsCanceling(true);
        try {
            await apiClient.post('/stripe/cancel-subscription');
            toast.success("Subscription cancelled. Access remains until period end.");
            await checkAuth();
        } catch (error) {
            toast.error("Failed to cancel subscription. Please try again.");
            console.error(error);
        } finally {
            setIsCanceling(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!newName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        setIsUpdatingProfile(true);
        try {
            await apiClient.put('/auth/profile', {
                name: newName,
                phoneNumber,
                waTasksEnabled,
                waBudgetEnabled,
                waProjectsEnabled
            });
            await checkAuth();
            toast.success("Profile updated successfully");
            setIsEditingName(false);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setIsChangingPassword(true);
        try {
            await apiClient.post('/auth/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            toast.success("Password changed successfully");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <>
            {/* Feedback Banner */}
            <Card className="mb-6 bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/10 dark:to-accent-900/10 border-primary-100 dark:border-primary-800/30">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <MessageCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                Have an idea or spotted a bug?
                            </h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                We'd love to hear from you. Help us shape the future of Hikarii.
                            </p>
                        </div>
                    </div>
                    <Button onClick={() => window.location.href = '/feedback'} className="w-full sm:w-auto shadow-sm">
                        Drop a Feedback
                    </Button>
                </div>
            </Card>

            <Card>
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Personal Details
                        </h2>
                        <p className="text-sm text-slate-500">
                            Your account information
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Full Name
                        </label>
                        {isEditingName ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="flex-1 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                />
                                <Button size="sm" onClick={handleUpdateProfile} isLoading={isUpdatingProfile}>Save</Button>
                                <Button size="sm" variant="secondary" onClick={() => setIsEditingName(false)}>Cancel</Button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                                <span>{user?.name}</span>
                                <button onClick={() => setIsEditingName(true)} className="text-xs text-primary-600 hover:underline">Edit</button>
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Email Address
                        </label>
                        <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            {user?.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            WhatsApp Phone Number
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+234..."
                                className="flex-1 p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
                            />
                            <Button size="sm" onClick={handleUpdateProfile} isLoading={isUpdatingProfile}>Save</Button>
                        </div>
                    </div>
                </div>

                {/* WhatsApp Notification Settings */}
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-green-500 opacity-60 grayscale" />
                            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 opacity-60">WhatsApp Notifications</h3>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Coming Soon</span>
                    </div>
                    <div className="space-y-4 max-w-md opacity-50 pointer-events-none grayscale relative">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Overdue Tasks</p>
                                <p className="text-xs text-slate-500">Get alerts for tasks past their due date</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={waTasksEnabled}
                                onChange={(e) => setWaTasksEnabled(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-primary-600"
                                disabled
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Budget Alerts</p>
                                <p className="text-xs text-slate-500">Get alerts when budget limits are reached</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={waBudgetEnabled}
                                onChange={(e) => setWaBudgetEnabled(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-primary-600"
                                disabled
                            />
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Project Deadlines</p>
                                <p className="text-xs text-slate-500">Get alerts for upcoming project ends</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={waProjectsEnabled}
                                onChange={(e) => setWaProjectsEnabled(e.target.checked)}
                                className="w-5 h-5 rounded border-slate-300 text-primary-600"
                                disabled
                            />
                        </div>
                        <Button disabled className="w-full bg-slate-200 dark:bg-slate-700 text-slate-400">
                            Save Notification Preferences
                        </Button>
                    </div>
                </div>

                {/* Change Password Section */}
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-4">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">New Password</label>
                            <input
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-600 dark:text-slate-400 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600"
                            />
                        </div>
                        <Button onClick={handleChangePassword} isLoading={isChangingPassword}>
                            Update Password
                        </Button>
                    </div>
                </div>
            </Card>

            {user?.role !== 'ADMIN' && (
                <Card>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                Subscription Plan
                            </h2>
                            <p className="text-sm text-slate-500">
                                Manage your plan and billing
                            </p>
                        </div>
                        <div className="ml-auto">
                            {user?.subscriptionStatus === 'PRO' || user?.subscriptionStatus === 'TRIAL' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-brand text-white shadow-sm">
                                    {user?.subscriptionStatus}
                                </span>
                            ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                    FREE
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {user?.subscriptionStatus === 'PRO' || user?.subscriptionStatus === 'TRIAL' ? (
                            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                    <div>
                                        <h3 className="font-semibold text-slate-900 dark:text-white">
                                            {user?.subscriptionStatus === 'TRIAL' ? 'Pro (Trial)' : 'Pro Plan'}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                            {user?.currentPeriodEnd
                                                ? `Renews/Expires on ${new Date(user.currentPeriodEnd).toLocaleDateString()}`
                                                : "Active"}
                                        </p>
                                    </div>
                                    <Button
                                        variant="danger"
                                        onClick={() => setShowCancelModal(true)}
                                        isLoading={isCanceling}
                                    >
                                        Cancel Subscription
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 mt-3">
                                    Your subscription will remain active until the end of the billing period.
                                </p>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Free Plan</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                        Upgrade to unlock advanced insights and features.
                                    </p>
                                </div>
                                <Button variant="primary" onClick={() => window.location.href = '/pricing'}>
                                    Upgrade to Pro
                                </Button>
                            </div>
                        )}
                    </div>

                    <ConfirmModal
                        isOpen={showCancelModal}
                        onClose={() => !isCanceling && setShowCancelModal(false)}
                        onConfirm={handleCancelSubscription}
                        title="Cancel Pro Subscription"
                        message="Are you sure you want to cancel your Pro subscription? You will lose access to premium features (AI insights, unlimited projects) at the end of your billing period."
                        confirmText="Yes, Cancel Subscription"
                        variant="danger"
                        isLoading={isCanceling}
                    />
                </Card>
            )}
        </>
    );
};
