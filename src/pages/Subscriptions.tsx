
import React, { useEffect, useState } from 'react';

import apiClient from '../api/client';
import { Card } from '../components/common/Card';
import {
    Calendar, CheckCircle,
    XCircle,
    RefreshCw,
    Trash2
} from "lucide-react";
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { UpgradeModal } from '../components/modals/UpgradeModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { useBudgetStore } from '../stores/budgetStore';
import { formatCurrency } from '../utils/currencyFormatter';

interface RecurringExpense {
    id: string;
    merchantName: string;
    amount: number;
    frequency: string;
    nextDueDate: string;
    confidenceScore: number;
    isConfirmed: boolean;
    isActive: boolean;
}

export const Subscriptions: React.FC = () => {
    // const { token } = useAuthStore();
    const [patterns, setPatterns] = useState<RecurringExpense[]>([]);
    const [loading, setLoading] = useState(false);
    const [scanning, setScanning] = useState(false);

    const { user } = useAuthStore();
    const { currency, getConvertedAmount } = useBudgetStore();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleScanClick = () => {
        if (user?.subscriptionStatus === 'PRO') {
            handleScan();
        } else {
            setShowUpgradeModal(true);
        }
    };

    const fetchPatterns = async () => {
        setLoading(true);
        try {
            const res = await apiClient.get('/patterns');
            setPatterns(res.data);
        } catch (err) {
            toast.error("Failed to load subscriptions");
        } finally {
            setLoading(false);
        }
    };

    const handleScan = async () => {
        setScanning(true);
        try {
            const res = await apiClient.post('/patterns/detect');
            toast.success(`Scan complete! Found ${res.data.newlyDetected} new patterns.`);
            setPatterns(res.data.patterns); // Update list
        } catch (err) {
            toast.error("Scan failed");
        } finally {
            setScanning(false);
        }
    };

    // ... (rest of methods)

    const confirmPattern = async (id: string) => {
        try {
            await apiClient.patch(`/patterns/${id}/confirm`);
            toast.success("Subscription confirmed");
            fetchPatterns();
        } catch (err) {
            toast.error("Action failed");
        }
    };

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (id: string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await apiClient.delete(`/patterns/${deleteId}`);
            toast.success("Subscription removed");
            setPatterns(patterns.filter(p => p.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            toast.error("Action failed");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchPatterns();
    }, []);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-8">
                <div>
                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        Subscriptions & Recurring
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Manage your predicted recurring expenses and bills
                    </p>
                </div>
                <button
                    onClick={handleScanClick}
                    disabled={scanning}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
                    {scanning ? 'Scanning...' : 'Scan for Patterns'}
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patterns.length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-slate-50 dark:bg-slate-900 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            <RefreshCw className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">No subscriptions detected yet</h3>
                            <p className="text-slate-500 mb-6">Run a scan to analyze your expense history</p>
                            <button onClick={handleScanClick} className="btn btn-secondary">Run Analysis</button>
                        </div>
                    ) : (
                        patterns.map(pattern => (
                            <Card key={pattern.id} className={`border-l-4 ${pattern.isConfirmed ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{pattern.merchantName}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {pattern.frequency} • Next: {format(new Date(pattern.nextDueDate), 'MMM dd')}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                            {formatCurrency(getConvertedAmount(pattern.amount, currency), currency)}
                                        </p>
                                        {!pattern.isConfirmed && (
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                                Unconfirmed
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {pattern.isConfirmed ? (
                                    <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => handleDeleteClick(pattern.id)}
                                            className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" /> Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <button
                                            onClick={() => confirmPattern(pattern.id)}
                                            className="flex-1 btn btn-sm bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-transparent"
                                        >
                                            <CheckCircle className="w-3 h-3 mr-1" /> Confirm
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(pattern.id)}
                                            className="flex-1 btn btn-sm bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent"
                                        >
                                            <XCircle className="w-3 h-3 mr-1" /> Ignore
                                        </button>
                                    </div>
                                )}
                            </Card>
                        ))
                    )}
                </div>
            )}

            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
            />

            <ConfirmModal
                isOpen={!!deleteId}
                onClose={() => !isDeleting && setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Remove Subscription?"
                message="Are you sure you want to remove this subscription from your recurring list?"
                confirmText="Remove"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
};
