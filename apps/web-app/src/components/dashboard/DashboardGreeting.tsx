import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Moon, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { useUIStore } from '../../stores/uiStore';

interface DashboardGreetingProps {
    userName?: string;
    onFocusModeToggle?: (isFocus: boolean) => void;
}

export const DashboardGreeting: React.FC<DashboardGreetingProps> = ({ 
    userName = 'User',
    onFocusModeToggle 
}) => {
    const [greeting, setGreeting] = useState('');
    const [Icon, setIcon] = useState<React.ElementType>(Sun);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Good Morning');
            setIcon(Sun);
        } else if (hour < 18) {
            setGreeting('Good Afternoon');
            setIcon(CloudSun);
        } else {
            setGreeting('Good Evening');
            setIcon(Moon);
        }
    }, []);

    const { isFocusMode, toggleFocusMode } = useUIStore();

    const messages = [
        "Ready to make some progress?",
        "Your financial clarity starts here.",
        "Let's turn your tasks into results.",
        "Small steps lead to big successes.",
        "Focus on what matters most today."
    ];
    
    // Pick a message based on the day of the year or just random on mount
    const [randomMsg] = useState(() => messages[Math.floor(Math.random() * messages.length)]);

    return (
        <div className="mb-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 shadow-sm ambient-card">
                        <Icon className="w-8 h-8 ambient-text" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight">
                            {greeting}, {userName.split(' ')[0]}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            {randomMsg}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleFocusMode}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all duration-300 font-medium text-sm",
                            isFocusMode 
                                ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg shadow-primary-500/30 scale-105" 
                                : "bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                        )}
                    >
                        {isFocusMode ? (
                            <>Focus mode: ON</>
                        ) : (
                            <>Focus Mode</>
                        )}
                    </button>
                    
                    <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">System Stable</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
