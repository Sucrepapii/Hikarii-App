import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Users, Activity, Crown, Zap, Printer } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, PieChart, Pie } from 'recharts';

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

export const AdminReport: React.FC = () => {
    const { token } = useAuthStore();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            setError('Failed to load report data. Please ensure the server is running.');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="text-center">
                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Report Unavailable</h2>
                    <p className="text-slate-500 mt-2">{error || 'Unable to load report data.'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const engagementData = [
        { name: 'Clarity (Dump)', value: data.engagement.clarity, color: '#3b82f6' },
        { name: 'Focus (Split)', value: data.engagement.focus, color: '#8b5cf6' },
        { name: 'Freedom (Track)', value: data.engagement.freedom, color: '#10b981' },
    ];

    const conversionData = [
        { name: 'Pro', value: data.stats.proUsers, color: '#f59e0b' },
        { name: 'Free', value: data.stats.totalUsers - data.stats.proUsers, color: '#94a3b8' },
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0">
            {/* Report Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">
                        Platform Sustainability Report
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Comprehensive overview of system health, growth, and user engagement.
                    </p>
                </div>
                <div className="flex items-center gap-3 no-print">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: data.stats.totalUsers, icon: Users, color: 'blue' },
                    { label: 'Active (7d)', value: data.stats.activeUsers, icon: Activity, color: 'emerald' },
                    { label: 'Pro Members', value: data.stats.proUsers, icon: Crown, color: 'amber' },
                    { label: 'MRR', value: `$${data.stats.estimatedMRR.toFixed(2)}`, icon: Zap, color: 'indigo' },
                ].map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">{stat.label}</p>
                                <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{stat.value}</h3>
                            </div>
                            <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Engagement Depth */}
                <Card className="p-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">User Lifecycle Engagement</h3>
                        <p className="text-sm text-slate-500">Distribution of activity across the 3-stage method.</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                                    {engagementData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-500">{data.stats.totalTasks}</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Tasks</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-500">{data.stats.totalAiSplits}</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Splits</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-500">{data.stats.totalExpenses}</p>
                            <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Expenses</p>
                        </div>
                    </div>
                </Card>

                {/* Conversion & Revenue Metrics */}
                <Card className="p-6">
                    <div className="mb-6 text-center">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">User Tiers & Conversion</h3>
                        <p className="text-sm text-slate-500">Free vs. Pro distribution and revenue health.</p>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={conversionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {conversionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-bold text-slate-800 dark:text-white">
                                {((data.stats.proUsers / data.stats.totalUsers) * 100).toFixed(1)}%
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-tighter">Conversion</span>
                        </div>
                    </div>
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-slate-600 dark:text-slate-400">Pro Users</span>
                            </div>
                            <span className="font-bold">{data.stats.proUsers}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                <span className="text-slate-600 dark:text-slate-400">Free Users</span>
                            </div>
                            <span className="font-bold">{data.stats.totalUsers - data.stats.proUsers}</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Detail Table */}
            <Card className="overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">Detailed System Totals</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Metric</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {[
                                { cat: 'Users', metric: 'Growth Rate', val: 'N/A', note: 'Historical tracking required' },
                                { cat: 'Activity', metric: 'Tasks per User', val: (data.stats.totalTasks / data.stats.totalUsers).toFixed(1), note: 'Average lifetime' },
                                { cat: 'Intelligence', metric: 'AI Split Adoption', val: `${((data.stats.totalAiSplits / data.stats.totalTasks) * 100).toFixed(1)}%`, note: 'Tasks utilizing smart splitting' },
                                { cat: 'Finance', metric: 'Expenses Logged', val: data.stats.totalExpenses, note: 'Manual and recurring entries' },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-white">{row.cat}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{row.metric}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">{row.val}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500 italic">{row.note}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};
