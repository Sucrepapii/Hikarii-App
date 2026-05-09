import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Users, Activity, Crown, Shield, Wallet, ListTodo, Split, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import apiClient from '../api/client';

interface DashboardData {
    stats: {
        totalUsers: number;
        activeUsers: number;
        proUsers: number;
        totalTasks: number;
        totalAiSplits: number;
        totalExpenses: number;
        estimatedMRR: number;
    };
    engagement: {
        clarity: number;
        focus: number;
        freedom: number;
    };
    users: any[];
}

export const AdminDashboard: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchAdminData();
    }, [user, navigate]);

    const fetchAdminData = async () => {
        try {
            const response = await apiClient.get('/admin/dashboard');
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            setError('Failed to load dashboard data. The backend might be starting up or has an issue.');
        } finally {
            setLoading(false);
        }
    };

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

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md mx-auto px-4">
                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">System Unavailable</h2>
                    <p className="text-slate-500 mt-2">{error || 'Unable to load dashboard data.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const engagementData = [
        { name: 'Clarity (Dump)', value: data.engagement.clarity, color: '#6366f1' },
        { name: 'Focus (Split)', value: data.engagement.focus, color: '#a855f7' },
        { name: 'Freedom (Track)', value: data.engagement.freedom, color: '#10b981' },
    ];

    return (
        <div className="space-y-4 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Admin Header */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-primary-300 font-medium mb-1">
                            <Shield className="w-5 h-5" />
                            <span>Admin Portal</span>
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white">System Overview</h1>
                        <p className="text-slate-300 mt-1 max-w-xl">Monitor user growth, subscription status, and platform activity.</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                        <span className="text-sm font-medium text-white flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                            Live System
                        </span>
                    </div>
                </div>
            </div>

            {/* Platform Health Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Active Users</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{data.stats.activeUsers}</h3>
                            <p className="text-xs text-slate-400 mt-1">Last 7 days</p>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tasks Created</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{data.stats.totalTasks}</h3>
                            <p className="text-xs text-slate-400 mt-1">Lifetime</p>
                        </div>
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <ListTodo className="w-5 h-5" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">AI Splits</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{data.stats.totalAiSplits}</h3>
                            <p className="text-xs text-slate-400 mt-1">Total Breakdowns</p>
                        </div>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <Split className="w-5 h-5" />
                        </div>
                    </div>
                </Card>

                <Card className="bg-white dark:bg-slate-800 border-none shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Expenses Tracked</p>
                            <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{data.stats.totalExpenses}</h3>
                            <p className="text-xs text-slate-400 mt-1">Entries Logged</p>
                        </div>
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Wallet className="w-5 h-5" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Method Engagement Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Method Engagement</h3>
                                <p className="text-sm text-slate-500">Activity active distribution by feature (Last 30 Days)</p>
                            </div>
                            <Activity className="text-slate-400 w-5 h-5" />
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={engagementData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={32}>
                                        {engagementData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Revenue & Pro Stats */}
                    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-bold">Revenue Health</h3>
                                <p className="text-slate-400 text-sm">Estimated Monthly Recurring Revenue</p>
                            </div>
                            <Crown className="text-yellow-400 w-5 h-5" />
                        </div>
                        <div className="flex items-end gap-4">
                            <h2 className="text-4xl font-bold text-white">${data.stats.estimatedMRR.toFixed(2)}</h2>
                            <span className="text-emerald-400 font-medium mb-1.5 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                +{data.stats.proUsers} Pro Users
                            </span>
                        </div>
                        <div className="mt-6 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Free Users</span>
                                <span className="font-medium">{data.stats.totalUsers - data.stats.proUsers}</span>
                            </div>
                            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-primary-500 h-full rounded-full"
                                    style={{ width: `${(data.stats.proUsers / data.stats.totalUsers) * 100}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-slate-500 text-right">
                                {data.stats.totalUsers > 0 ? ((data.stats.proUsers / data.stats.totalUsers) * 100).toFixed(1) : 0}% Conversion Rate
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions Panel */}
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button 
                                onClick={() => navigate('/admin/users')}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-200 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm font-medium">Manage Users</span>
                                </div>
                                <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button 
                                onClick={() => navigate('/admin/marketing')}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-200 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <TrendingUp className="w-4 h-4 text-purple-500" />
                                    <span className="text-sm font-medium">Marketing Insights</span>
                                </div>
                                <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                            <button 
                                onClick={() => navigate('/admin/audit')}
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-700 dark:text-slate-200 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-emerald-500" />
                                    <span className="text-sm font-medium">Security Logs</span>
                                </div>
                                <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">System Alerts</h3>
                        <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 relative">
                                    <div className="absolute inset-0 bg-emerald-400 blur-sm opacity-20 rounded-full"></div>
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full relative z-10"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">All Systems Operational</p>
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Database, AI Service, and Mailer are running smoothly.</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
