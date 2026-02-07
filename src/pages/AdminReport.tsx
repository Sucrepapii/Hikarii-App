import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '../components/common/Card';
import { Users, Activity, Crown, Zap, Printer } from 'lucide-react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export const AdminReport: React.FC = () => {
    const { user, token } = useAuthStore();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch report data:', err);
            setError('Report Unavailable. Please check your connection or system status.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Generating report...</div>;

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md mx-auto">
                    <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Report Status</h2>
                    <p className="text-slate-500 mt-2">{error}</p>
                    <button onClick={fetchData} className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-lg">Retry</button>
                </div>
            </div>
        );
    }

    const chartData = [
        { name: 'Clarity', value: data.engagement.clarity, color: '#3b82f6' },
        { name: 'Focus', value: data.engagement.focus, color: '#8b5cf6' },
        { name: 'Freedom', value: data.engagement.freedom, color: '#10b981' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">Platform Report</h1>
                    <p className="text-slate-500">Comprehensive system performance and user engagement metrics</p>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-slate-50">
                    <Printer className="w-4 h-4" />
                    Print Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h3 className="text-xl font-bold mb-6">Engagement Overview</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" barSize={60}>
                                    {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-sm font-medium text-slate-500 uppercase">Growth Statistics</h3>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-3xl font-bold">{data.stats.totalUsers}</p>
                                <p className="text-xs text-slate-400">Total Users</p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-emerald-600">{((data.stats.activeUsers / data.stats.totalUsers) * 100).toFixed(1)}%</p>
                                <p className="text-xs text-slate-400">Activity Rate</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-slate-900 text-white border-none">
                        <h3 className="text-slate-400 text-sm font-medium uppercase">Financial Summary</h3>
                        <div className="mt-4">
                            <h2 className="text-4xl font-bold">${data.stats.estimatedMRR.toFixed(2)}</h2>
                            <p className="text-slate-500 text-sm mt-1">Current Estimated MRR</p>
                        </div>
                        <div className="mt-6 flex items-center justify-between p-4 bg-white/5 rounded-xl">
                            <div className="flex items-center gap-3">
                                <Crown className="text-amber-400 w-5 h-5" />
                                <div>
                                    <p className="font-bold">{data.stats.proUsers}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Pro Members</p>
                                </div>
                            </div>
                            <Zap className="text-primary-400 w-5 h-5" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
