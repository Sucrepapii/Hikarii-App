import React, { useState } from 'react';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900/90 dark:border-t-slate-800/90',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900/90 dark:border-b-slate-800/90',
        left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900/90 dark:border-l-slate-800/90',
        right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900/90 dark:border-r-slate-800/90'
    };

    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div className={`absolute z-50 pointer-events-none whitespace-nowrap bg-slate-900/95 dark:bg-slate-800/95 backdrop-blur-md text-white text-[11px] font-medium py-1 px-2.5 rounded-md shadow-lg border border-white/10 dark:border-white/5 transition-opacity duration-150 ease-out animate-fade-in ${positionClasses[position]}`}>
                    {content}
                    <div className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`} />
                </div>
            )}
        </div>
    );
};
