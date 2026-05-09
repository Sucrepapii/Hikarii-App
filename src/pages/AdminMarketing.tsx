import React, { useEffect, useState } from 'react';
import { Card } from '../components/common/Card';
import { TrendingUp, Users, FileText, CheckCircle, XCircle, Search, Mail } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import apiClient from '../api/client';

interface MarketingData {
    leads: {
        total: number;
        last7Days: number;
        sources: Array<{ source: string; _count: { id: number } }>;
    };
    contentPerformance: Array<{ articleSlug: string; isHelpful: boolean; _count: { id: number } }>;
}

export const AdminMarketing: React.FC = () => {
    const [data, setData] = useState<MarketingData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMarketingStats();
    }, []);

    const fetchMarketingStats = async () => {
        try {
            const response = await apiClient.get('/admin/marketing-stats');
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch marketing stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Process Sources for Pie Chart
    const sourceData = data.leads.sources.map(s => ({
        name: s.source || 'Direct',
        value: s._count.id
    }));

    const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981'];

    // Process Content Feedback
    const articleGroups: Record<string, { helpful: number; unhelpful: number }> = {};
    data.contentPerformance.forEach(item => {
        if (!articleGroups[item.articleSlug]) {
            articleGroups[item.articleSlug] = { helpful: 0, unhelpful: 0 };
        }
        if (item.isHelpful) articleGroups[item.articleSlug].helpful += item._count.id;
        else articleGroups[item.articleSlug].unhelpful += item._count.id;
    });

    const performanceData = Object.entries(articleGroups).map(([slug, counts]) => ({
        slug: slug.replace(/-/g, ' '),
        helpful: counts.helpful,
        unhelpful: counts.unhelpful,
        total: counts.helpful + counts.unhelpful,
        rate: counts.helpful + counts.unhelpful > 0 
            ? Math.round((counts.helpful / (counts.helpful + counts.unhelpful)) * 100) 
            : 0
    })).sort((a, b) => b.total - a.total);

    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Marketing & Growth</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Track lead generation and content effectiveness.</p>
                </div>
            </div>

            {/* Growth Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-none shadow-sm bg-white dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Leads</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{data.leads.total}</h3>
                            <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Lifetime capture
                            </p>
                        </div>
                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                            <Mail className="w-6 h-6" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-white dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Recent Growth</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">+{data.leads.last7Days}</h3>
                            <p className="text-xs text-slate-400 mt-1">New leads this week</p>
                        </div>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl text-purple-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-none shadow-sm bg-white dark:bg-slate-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Search Visibility</p>
                            <h3 className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">Live</h3>
                            <p className="text-xs text-indigo-500 mt-1">Technical SEO Active</p>
                        </div>
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600">
                            <Search className="w-6 h-6" />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Lead Sources Pie */}
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-6">Lead Sources</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sourceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sourceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Content Performance Table */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Content Performance</h3>
                        <FileText className="text-slate-400 w-5 h-5" />
                    </div>
                    <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
                        {performanceData.map((item, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-white/5">
                                <div className="min-w-0 flex-1 mr-4">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate capitalize">{item.slug}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle className="w-2.5 h-2.5" /> {item.helpful}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-rose-500">
                                            <XCircle className="w-2.5 h-2.5" /> {item.unhelpful}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`text-sm font-bold ${item.rate > 70 ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {item.rate}%
                                    </div>
                                    <p className="text-[10px] text-slate-400">Helpfulness</p>
                                </div>
                            </div>
                        ))}
                        {performanceData.length === 0 && (
                            <p className="text-center text-slate-500 py-8 italic">No feedback collected yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};
