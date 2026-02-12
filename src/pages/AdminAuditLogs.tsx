import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Card } from '..//components/common/Card';
import { Shield, Clock, FileText, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

interface AuditLog {
    id: string;
    adminId: string;
    admin: {
        name: string;
        email: string;
    };
    action: string;
    targetId: string | null;
    targetType: string | null;
    details: any;
    ipAddress: string | null;
    createdAt: string;
}

export const AdminAuditLogs: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        pages: 1,
        total: 0
    });

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/dashboard');
            return;
        }
        fetchLogs();
    }, [user, navigate, pagination.currentPage]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get(`/admin/audit-logs?page=${pagination.currentPage}&limit=10`);
            setLogs(response.data.logs);
            setPagination(prev => ({
                ...prev,
                pages: response.data.pagination.pages,
                total: response.data.pagination.total
            }));
        } catch (error) {
            console.error('Failed to fetch audit logs:', error);
            toast.error('Failed to load system audit trail');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    const filteredLogs = logs.filter(log =>
        log.admin?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.targetId && log.targetId.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading && logs.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white">Audit Trail</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Immutable log of system administrative actions</p>
                </div>
                <button
                    onClick={fetchLogs}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                    <Clock className="w-4 h-4" />
                    Refresh Logs
                </button>
            </div>

            <Card className="overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter on current page..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-500">Total {pagination.total} actions</span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Admin</th>
                                <th className="p-4 font-semibold">Action</th>
                                <th className="p-4 font-semibold">Target</th>
                                <th className="p-4 font-semibold">Details</th>
                                <th className="p-4 font-semibold">Date & IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                                                {log.admin.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-white text-sm">{log.admin.name}</p>
                                                <p className="text-[10px] text-slate-500">{log.admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${log.action.includes('DELETE') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            log.action.includes('SUSPEND') ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                log.action.includes('UPDATE') ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                                    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                            }`}>
                                            {log.action.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <span className="text-slate-400 text-xs block">{log.targetType || 'N/A'}</span>
                                            <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded">{log.targetId || 'N/A'}</code>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-500" title={JSON.stringify(log.details)}>
                                            {log.details ? JSON.stringify(log.details) : '-'}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm">
                                            <p className="text-slate-900 dark:text-white">{format(new Date(log.createdAt), 'MMM d, HH:mm:ss')}</p>
                                            <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                                <Shield className="w-2.5 h-2.5" />
                                                {log.ipAddress || 'Unknown IP'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredLogs.length === 0 && !loading && (
                        <div className="p-12 text-center">
                            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No matching audit records found</p>
                        </div>
                    )}
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div className="text-sm text-slate-500">
                        Page {pagination.currentPage} of {pagination.pages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1 || loading}
                            className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage === pagination.pages || loading}
                            className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
