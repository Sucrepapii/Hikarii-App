import React from 'react';
import { Logo } from './Logo';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0C15] transition-colors duration-500">
            {/* Ambient background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent-500/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex flex-col items-center gap-6">
                <Logo size="xl" variant="icon" className="scale-150" suppressLink={true} />
                
                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-display font-bold gradient-text animate-pulse">
                        Hikari
                    </h2>
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map((i) => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 rounded-full bg-primary-500/40 animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium glass border/overlay effect */}
            <div className="absolute inset-4 border border-slate-200/50 dark:border-white/5 rounded-[2rem] pointer-events-none backdrop-blur-[2px]" />
        </div>
    );
};
