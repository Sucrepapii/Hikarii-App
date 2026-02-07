import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Users, Activity, Shield, Wallet, ListTodo, Split } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
}

export const AdminDashboard: React.FC = () => {
    const { user, token } = useAuthStore();
    const navigate = useNavigate();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if ((user as any)?.role !== 'ADMIN') {
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
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    if (!user || (user as any).role !== 'ADMIN') return null;

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
                    <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const engagementData = [
        { name: 'Clarity', value: data.engagement.clarity, color: '#3b82f6' },
        { name: 'Focus', value: data.engagement.focus, color: '#8b5cf6' },
        { name: 'Freedom', value: data.engagement.freedom, color: '#10b981' },
    ];

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                        <p className="text-slate-300 mt-1 max-w-xl">Monitor user growth and platform activity.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Active Users</p>
                            <h3 className="text-2xl font-bold mt-1">{data.stats.activeUsers}</h3>
                        </div>
                        <Users className="text-blue-500" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Tasks Created</p>
                            <h3 className="text-2xl font-bold mt-1">{data.stats.totalTasks}</h3>
                        </div>
                        <ListTodo className="text-indigo-500" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">AI Splits</p>
                            <h3 className="text-2xl font-bold mt-1">{data.stats.totalAiSplits}</h3>
                        </div>
                        <Split className="text-purple-500" />
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Expenses</p>
                            <h3 className="text-2xl font-bold mt-1">{data.stats.totalExpenses}</h3>
                        </div>
                        <Wallet className="text-emerald-500" />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6">
                    <h3 className="text-lg font-bold mb-4">Engagement Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={engagementData} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                    {engagementData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="p-6 bg-slate-900 text-white">
                    <h3 className="text-lg font-bold mb-4">Revenue Health</h3>
                    <h2 className="text-4xl font-bold">${data.stats.estimatedMRR.toFixed(2)}</h2>
                    <p className="text-slate-400 mt-2">Estimated MRR</p>
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Pro Adoption</span>
                            <span>{((data.stats.proUsers / data.stats.totalUsers) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className="bg-primary-500 h-full" style={{ width: `${(data.stats.proUsers / data.stats.totalUsers) * 100}%` }} />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
