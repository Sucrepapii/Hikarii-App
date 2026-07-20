import React, { useState, useEffect } from 'react';
import { Card } from '../common/Card';
import { CheckCircle2, Circle, Rocket, ArrowRight, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

interface OnboardingChecklistProps {
    hasTasks: boolean;
    hasBudgets: boolean;
    hasExpenses: boolean;
}

export const OnboardingChecklist: React.FC<OnboardingChecklistProps> = ({
    hasTasks,
    hasBudgets,
    hasExpenses
}) => {
    const [isDismissed, setIsDismissed] = useState(() => {
        return localStorage.getItem('Hikarii_onboarding_dismissed') === 'true';
    });

    const [isSuccess, setIsSuccess] = useState(false);

    const steps = [
        {
            id: 'task',
            title: 'Create your first task',
            description: 'Start managing your time by adding a task.',
            isCompleted: hasTasks,
            link: '/tasks'
        },
        {
            id: 'budget',
            title: 'Set up a budget',
            description: 'Define your financial limits to track spending.',
            isCompleted: hasBudgets,
            link: '/budget'
        },
        {
            id: 'expense',
            title: 'Log an expense',
            description: 'Track your first cost against your budget.',
            isCompleted: hasExpenses,
            link: '/budget'
        }
    ];

    const completedCount = steps.filter(s => s.isCompleted).length;
    const isAllCompleted = completedCount === steps.length;
    const progress = (completedCount / steps.length) * 100;

    useEffect(() => {
        if (isAllCompleted && !isDismissed) {
            localStorage.setItem('Hikarii_onboarding_dismissed', 'true');
            setIsDismissed(true);
        }
    }, [isAllCompleted, isDismissed]);

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem('Hikarii_onboarding_dismissed', 'true');
    };

    if (isDismissed || isAllCompleted) return null;

    if (isSuccess) {
        return (
            <Card className="mb-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-none animate-slide-up relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
                <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">You're all set!</h3>
                            <p className="text-emerald-50 text-sm">Your Hikarii foundation is built. Time to achieve radical clarity.</p>
                        </div>
                    </div>
                    <button onClick={handleDismiss} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="mb-6 border-primary-100 dark:border-primary-900/30 bg-gradient-to-br from-white to-primary-50/30 dark:from-[#0D0F1A] dark:to-primary-900/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl transform translate-x-32 -translate-y-32" />
            
            <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-display font-bold gradient-text mb-2">Getting Started with Hikarii</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Complete these steps to unlock the full power of the Hikarii Method.</p>
                    </div>
                    <button onClick={handleDismiss} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                        <span>Setup Progress</span>
                        <span>{completedCount} of {steps.length} completed</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-1000 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {steps.map((step) => (
                        <Link 
                            key={step.id} 
                            to={step.link}
                            className={clsx(
                                "flex items-start gap-3 p-4 rounded-xl border transition-all duration-300",
                                step.isCompleted 
                                    ? "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20"
                                    : "bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md"
                            )}
                        >
                            <div className="shrink-0 mt-0.5">
                                {step.isCompleted ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                ) : (
                                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                                )}
                            </div>
                            <div>
                                <h4 className={clsx(
                                    "font-semibold text-sm mb-1",
                                    step.isCompleted ? "text-emerald-900 dark:text-emerald-400" : "text-slate-900 dark:text-slate-100"
                                )}>
                                    {step.title}
                                </h4>
                                <p className={clsx(
                                    "text-xs leading-relaxed",
                                    step.isCompleted ? "text-emerald-700/70 dark:text-emerald-400/70" : "text-slate-500 dark:text-slate-400"
                                )}>
                                    {step.description}
                                </p>
                                {!step.isCompleted && (
                                    <div className="flex items-center gap-1 mt-2 text-xs font-medium text-primary-600 dark:text-primary-400">
                                        Do it now <ArrowRight className="w-3 h-3" />
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </Card>
    );
};
