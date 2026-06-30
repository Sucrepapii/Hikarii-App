import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowRight, Check, X, ShieldAlert, DollarSign, Clock } from 'lucide-react';
import { projectService } from '../../services/project.service';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import toast from 'react-hot-toast';

interface AIProjectScoperProps {
    onScopeApplied: (phases: any[], title: string, description: string, budget: number) => void;
    onClose: () => void;
}

export const AIProjectScoper: React.FC<AIProjectScoperProps> = ({
    onScopeApplied,
    onClose
}) => {
    const [prompt, setPrompt] = useState('');
    const [budget, setBudget] = useState('1000');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<any | null>(null);

    const handleScope = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) {
            toast.error("Please describe your project first!");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await projectService.scopeProject(prompt, Number(budget) || 1000);
            setResult(data);
            toast.success("AI Blueprint Scoped Successfully!");
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.error || err.message || "Failed to contact Gemini Scoping engine");
            toast.error("Scoping Failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleApply = () => {
        if (!result) return;
        // Extract title from prompt (e.g. first 4-5 words) or prompt itself
        const title = prompt.split(' ').slice(0, 4).join(' ') + ' (AI)';
        onScopeApplied(result.phases, title, result.description, Number(budget) || 1000);
    };

    return (
        <Card className="glass-card shadow-2xl overflow-hidden border border-white/10 max-h-[85vh] flex flex-col p-6 animate-modal-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 animate-pulse">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">AI Autopilot Scoper</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Describe your project, Gemini structures your tasks & budgets</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6 custom-scrollbar pr-2">
                {!result ? (
                    <form onSubmit={handleScope} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                What project are you building?
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="input min-h-[120px] w-full"
                                placeholder="e.g., Rebuilding a personal designer portfolio website in React with high-end glassmorphic animations and clean contact page..."
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Total Budget Allocation ($)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <input
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="input pl-8 w-full"
                                    placeholder="e.g., 1000"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex gap-3 items-start">
                                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-bold">Scoping Error</p>
                                    <p className="opacity-90">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="pt-2">
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full py-4 text-base font-bold shadow-lg shadow-primary-500/20 hover:scale-[1.01]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Gemini is Scoping Project Blueprint...
                                    </>
                                ) : (
                                    <>
                                        Generate Dynamic AI Blueprint
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                ) : (
                    /* AI Scoping Result View */
                    <div className="space-y-6 animate-fade-in">
                        {/* Summary Description Box */}
                        <div className="p-4 rounded-2xl bg-cyan-600/5 border border-cyan-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                            <h3 className="text-sm font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4" />
                                Gemini Scoped Overview
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                {result.description}
                            </p>
                        </div>

                        {/* Project Phases */}
                        <div className="space-y-4">
                            <h3 className="text-base font-bold text-slate-800 dark:text-white">Structured Phases & Milestone Budget Allocations</h3>
                            {result.phases.map((phase: any, pIdx: number) => (
                                <div key={pIdx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-700/50">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                                        <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold flex items-center justify-center">
                                            {pIdx + 1}
                                        </span>
                                        {phase.name}
                                    </h4>
                                    <div className="space-y-2">
                                        {phase.tasks.map((task: any, tIdx: number) => (
                                            <div key={tIdx} className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{task.title}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-medium">
                                                        <Clock className="w-3 h-3" />
                                                        {task.duration}m
                                                    </div>
                                                    {task.amount > 0 && (
                                                        <div className={`
                                                            px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center
                                                            ${task.financialType === 'EXPENSE' 
                                                                ? 'bg-red-500/10 text-red-600 dark:text-red-400' 
                                                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}
                                                        `}>
                                                            <DollarSign className="w-2.5 h-2.5" />
                                                            {task.amount}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Buttons */}
            {result && (
                <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button variant="ghost" onClick={() => setResult(null)} className="flex-1">
                        Go Back
                    </Button>
                    <Button variant="primary" onClick={handleApply} className="flex-1 font-bold">
                        <Check className="w-4 h-4 mr-2" />
                        Apply AI Blueprint
                    </Button>
                </div>
            )}
        </Card>
    );
};
