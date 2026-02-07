import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Download, Database, Shield, DollarSign, CreditCard, Calendar as CalendarIcon } from 'lucide-react';
import { useTaskStore } from '../stores/taskStore';
import { useBudgetStore } from '../stores/budgetStore';
import { exportTasks, exportExpenses } from '../utils/exportUtils';
import { useAuthStore } from '../stores/authStore';
import apiClient from '../api/client';
import toast from 'react-hot-toast';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { TaskArchive } from '../components/settings/TaskArchive';
import { ProjectArchive } from '../components/settings/ProjectArchive';



type TabId = 'data' | 'currency' | 'profile' | 'integrations' | 'support' | 'archive';

export const Settings: React.FC = () => {
    const { tasks } = useTaskStore();
    const { expenses } = useBudgetStore();
    const { user, checkAuth } = useAuthStore(); // We need checkAuth to update user in store after profile update
    const [searchParams] = useSearchParams();
    const activeTab = (searchParams.get('tab') as TabId) || 'profile';

    const [isCanceling, setIsCanceling] = React.useState(false);
    const [isGoogleConnected, setIsGoogleConnected] = React.useState(false);

    // Profile Edit State
    const [isEditingName, setIsEditingName] = React.useState(false);
    const [newName, setNewName] = React.useState(user?.name || '');
    const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);

    // Password Change State
    const [passwordData, setPasswordData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);

    React.useEffect(() => {
        if (user?.name) setNewName(user.name);
    }, [user]);

    // Check Google Status
    React.useEffect(() => {
        apiClient.get('/google/status')
            .then(res => setIsGoogleConnected(res.data.isConnected))
            .catch(err => console.error(err));
    }, []);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const res = await apiClient.post('/google/connect', { code: tokenResponse.code });
                if (res.data.success) {
                    setIsGoogleConnected(true);
                    toast.success("Connected to Google Calendar!");
                }
            } catch (error: any) {
                console.error("Google connect error", error);
                toast.error("Failed to connect Google Calendar.");
            }
        },
        onError: () => toast.error("Google Login Failed"),
        flow: 'auth-code',
        scope: "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events"
    });

    const handleDisconnectGoogle = async () => {
        try {
            await apiClient.post('/google/disconnect');
            setIsGoogleConnected(false);
            toast.success("Disconnected from Google Calendar");
        } catch (error) {
            toast.error("Failed to disconnect");
        }
    }

    const handleCancelSubscription = async () => {
        if (!confirm("Are you sure you want to cancel your Pro subscription? You will lose access to premium features at the end of your billing period.")) return;

        setIsCanceling(true);
        try {
            await apiClient.post('/stripe/cancel-subscription');
            toast.success("Subscription cancelled. Access remains until period end.");
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
            await apiClient.put('/auth/profile', { name: newName });
            // Update local store
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
            await apiClient.put('/auth/password', {
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
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                    Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Manage your preferences and account
                </p>
            </div>

            <div className="space-y-6">
                {/* Content Area */}
                {activeTab === 'profile' && (

                    <>
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

                        <Card>
                            {/* ... Subscription ... */}
                            {/* Re-using existing subscription code but I need to make sure I don't lose it. 
                                The previous replace block for Settings.tsx showed the subscription logic. 
                                I need to include it here or replace carefully.
                                Since I am replacing the 'profile' block, I should output the subscription card content too.
                            */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
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
                                    {user?.subscriptionStatus === 'PRO' ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-brand text-white shadow-sm">
                                            PRO
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                            FREE
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {user?.subscriptionStatus === 'PRO' ? (
                                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                                            <div>
                                                <h3 className="font-semibold text-slate-900 dark:text-white">Pro Plan</h3>
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                    {user?.currentPeriodEnd
                                                        ? `Renews on ${new Date(user.currentPeriodEnd).toLocaleDateString()}`
                                                        : "Active"}
                                                </p>
                                            </div>
                                            <Button
                                                variant="danger"
                                                onClick={handleCancelSubscription}
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
                                        <Button variant="primary" onClick={() => window.location.href = '/dashboard/pricing'}>
                                            Upgrade to Pro
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </>
                )}

                {/* Data Management */}
                {activeTab === 'data' && (
                    <Card>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                    Data Export
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Download your data for external analysis or backup
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h3 className="font-medium text-slate-800 dark:text-slate-200">Export Tasks</h3>
                                    <p className="text-sm text-slate-500">
                                        Download all your task data as a CSV file
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => exportTasks(tasks)}
                                    className="gap-2 w-full sm:w-auto"
                                    disabled={tasks.length === 0}
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h3 className="font-medium text-slate-800 dark:text-slate-200">Export Expenses</h3>
                                    <p className="text-sm text-slate-500">
                                        Download all your expenses and budget data as a CSV file
                                    </p>
                                </div>
                                <Button
                                    variant="secondary"
                                    onClick={() => exportExpenses(expenses)}
                                    className="gap-2 w-full sm:w-auto"
                                    disabled={expenses.length === 0}
                                >
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Currency Preferences */}
                {activeTab === 'currency' && (
                    <Card>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                    Currency Preferences
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Select your preferred display currency
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Display Currency
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {['NGN', 'USD', 'GBP', 'EUR', 'CAD'].map((code) => (
                                    <button
                                        key={code}
                                        onClick={() => useBudgetStore.getState().setCurrency(code)}
                                        className={`
                                            p-3 rounded-xl border font-medium transition-all
                                            ${useBudgetStore.getState().currency === code
                                                ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary-300'}
                                        `}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Note: Exchange rates are estimated (Base: NGN).
                            </p>
                        </div>
                    </Card>
                )}

                {/* Integrations */}
                {activeTab === 'integrations' && (
                    <Card>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                <CalendarIcon className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                                    Integrations
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Connect with third-party tools
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                            <div>
                                <h3 className="font-medium text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    Google Calendar
                                    {isGoogleConnected && <span className="text-xs text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Connected</span>}
                                </h3>
                                <p className="text-sm text-slate-500">
                                    Sync individual tasks to Google Calendar (optional per task).
                                </p>
                            </div>
                            {isGoogleConnected ? (
                                <Button
                                    variant="danger"
                                    onClick={handleDisconnectGoogle}
                                    className="w-full sm:w-auto"
                                >
                                    Disconnect
                                </Button>
                            ) : (
                                <button
                                    onClick={() => googleLogin()}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap touch-manipulation"
                                >
                                    <GoogleIcon className="w-5 h-5" />
                                    <span>Connect Google Calendar</span>
                                </button>
                            )}
                        </div>
                    </Card>
                )}

                {/* Support Tab with FAQ */}
                {activeTab === 'support' && (
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                    <h3 className="font-medium text-slate-800 dark:text-white">Is Hikari really free?</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Yes, the core features are free forever. Pro offers advanced AI and unlimited history.</p>
                                </div>
                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                    <h3 className="font-medium text-slate-800 dark:text-white">How do I export my data?</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Go to the Data Management tab in settings to download CSV files.</p>
                                </div>
                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                                    <h3 className="font-medium text-slate-800 dark:text-white">Can I share my plan?</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Currently, plans are for individual users only.</p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Need more help?</h2>
                                    <p className="text-slate-500">Our support team is always ready to help you.</p>
                                </div>
                                <Button onClick={() => window.location.href = '/contact'} variant="primary">
                                    Contact Us
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Archive Tab (Tasks and Projects) */}
                {activeTab === 'archive' && (
                    <div className="space-y-8">
                        <TaskArchive />
                        <div className="border-t border-slate-200 dark:border-slate-700 pt-8" />
                        <ProjectArchive />
                    </div>
                )}
            </div>
        </div>
    );
};
