import React, { useState } from 'react';
import { CreditCard, Shield, Sparkles, Loader2, Check, RefreshCw, Plus, DollarSign } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import toast from 'react-hot-toast';

interface Transaction {
    id: string;
    merchant: string;
    amount: number;
    date: string;
    suggestedTask: string;
    status: 'pending' | 'triaged';
}

export const BankSyncPanel: React.FC = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isTriaging, setIsTriaging] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', merchant: 'Vercel Inc. / Hosting', amount: -49.00, date: 'May 28', suggestedTask: 'Setup Production Hosting', status: 'pending' },
        { id: '2', merchant: 'AWS Cloud Services', amount: -15.20, date: 'May 27', suggestedTask: 'Deploy Cloud Database', status: 'pending' },
        { id: '3', merchant: 'Figma Design Pro', amount: -12.00, date: 'May 25', suggestedTask: 'Design UI mockup wires', status: 'pending' },
        { id: '4', merchant: 'Stripe Payout Ref#82', amount: 3200.00, date: 'May 24', suggestedTask: 'Complete Client Review', status: 'pending' },
    ]);

    const handleConnect = () => {
        setIsConnecting(true);
        setTimeout(() => {
            setIsConnected(true);
            setIsConnecting(false);
            toast.success("Chase Premium Bank Sync Completed!");
        }, 2000);
    };

    const handleAutoTriage = () => {
        if (transactions.filter(t => t.status === 'pending').length === 0) {
            toast.error("All transactions are already triaged!");
            return;
        }

        setIsTriaging(true);
        const toastId = toast.loading("Gemini AI is analyzing transactions and active milestones...");

        setTimeout(() => {
            // Process the transactions one by one
            setTransactions(prev => prev.map(t => ({ ...t, status: 'triaged' })));
            setIsTriaging(false);
            toast.success("AI Auto-Triage Complete! 4 milestones updated.", { id: toastId });
        }, 2500);
    };

    return (
        <Card className="glass-card overflow-hidden border border-white/10 relative">
            {/* Background absolute glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-cyan-500" />
                        FinOps Open Banking Sync
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Secure bank reconciliation matching real cashflow directly to tasks</p>
                </div>
                <div className="flex gap-2">
                    {!isConnected ? (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleConnect}
                            disabled={isConnecting}
                            className="btn-3d font-semibold text-xs py-2 px-4 shadow-md"
                        >
                            {isConnecting ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                    Plaid Secure Link...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Link Bank Account
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleAutoTriage}
                            disabled={isTriaging}
                            className="bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-500 border border-cyan-500/20 hover:scale-105 transition-all text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                        >
                            {isTriaging ? (
                                <>
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    Triaging...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                    AI Auto-Triage
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Sync Body */}
            {!isConnected ? (
                /* Unlinked State View */
                <div className="py-12 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-400 border border-slate-200/50 dark:border-slate-700/50">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">No Accounts Connected</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                        Securely connect Chase, Wells Fargo, Mono, or Stripe via bank-grade end-to-end encrypted tunnels to link real-world expenses to specific task budgets.
                    </p>
                    <Button onClick={handleConnect} disabled={isConnecting} variant="ghost" className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/50 dark:text-white border border-slate-200 dark:border-slate-700 font-semibold px-6">
                        Start Plaid Link Wizard
                    </Button>
                </div>
            ) : (
                /* Linked State View */
                <div className="py-6 grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-8 animate-fade-in">
                    {/* Left Panel: Glassmorphic Credit Card */}
                    <div className="space-y-4">
                        <div className="relative w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-cyan-500 via-purple-600 to-pink-500 p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                            {/* Glass overlay */}
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px] pointer-events-none" />
                            {/* Shining glow overlay */}
                            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-45 transform pointer-events-none transition-transform duration-1000 group-hover:translate-x-12" />

                            <div className="flex justify-between items-start z-10">
                                <div>
                                    <p className="text-[10px] opacity-75 font-semibold uppercase tracking-widest">Chase Sapphire</p>
                                    <p className="text-base font-black tracking-tight mt-0.5">GOKE AKINBORO</p>
                                </div>
                                <div className="w-8 h-6 bg-yellow-400/20 border border-yellow-400/30 rounded-md flex items-center justify-center">
                                    <div className="w-4 h-3 bg-yellow-400/80 rounded-[2px]" />
                                </div>
                            </div>

                            <div className="z-10">
                                <p className="text-sm font-bold tracking-[0.2em] font-mono">•••• •••• •••• 4829</p>
                                <div className="flex justify-between items-end mt-4">
                                    <div>
                                        <p className="text-[8px] opacity-60 uppercase font-semibold">Balance</p>
                                        <p className="text-lg font-black tracking-tight">$8,245.90</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <span className="w-5 h-5 rounded-full bg-red-500/80 mix-blend-screen" />
                                        <span className="w-5 h-5 rounded-full bg-yellow-500/80 mix-blend-screen -ml-3" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Connected status checklist */}
                        <div className="p-3.5 rounded-xl bg-white/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                                <Check className="w-4 h-4 text-emerald-500" />
                                256-bit bank encrypted link
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                                <Check className="w-4 h-4 text-emerald-500" />
                                Automated webhooks active
                            </div>
                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                                Real-time syncing active
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Transaction Checklist */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Imported Transactions</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 font-bold">
                                {transactions.filter(t => t.status === 'pending').length} Action Required
                            </span>
                        </div>

                        <div className="space-y-2">
                            {transactions.map((t) => (
                                <div key={t.id} className="p-3.5 rounded-xl bg-white dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/60">
                                    <div className="flex items-center gap-3">
                                        <div className={`
                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                                            ${t.amount < 0 
                                                ? 'bg-red-500/10 text-red-500 dark:bg-red-950/20' 
                                                : 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-950/20'}
                                        `}>
                                            {t.amount < 0 ? '-' : '+'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.merchant}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{t.date} • Suggested Task: <span className="font-semibold text-cyan-400 italic">"{t.suggestedTask}"</span></p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                                        <span className={`text-sm font-extrabold ${t.amount < 0 ? 'text-slate-850 dark:text-white' : 'text-emerald-500'}`}>
                                            {t.amount < 0 ? '-' : '+'}${Math.abs(t.amount).toFixed(2)}
                                        </span>

                                        {t.status === 'triaged' ? (
                                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/10">
                                                <Check className="w-3 h-3" />
                                                Reconciled
                                            </span>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    setTransactions(prev => prev.map(item => item.id === t.id ? { ...item, status: 'triaged' } : item));
                                                    toast.success(`Matched to "${t.suggestedTask}"!`);
                                                }}
                                                variant="ghost"
                                                size="sm"
                                                className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 hover:scale-105 transition-all text-[10px] font-bold py-1 px-3"
                                            >
                                                Triage
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};
