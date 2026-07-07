import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, className, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={clsx(
                            'w-full px-4 py-3 sm:py-3 rounded-2xl glass input-3d transition-smooth',
                            'text-base sm:text-sm md:text-base', // Prevent zoom on iOS
                            'text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                            'focus:outline-none touch-manipulation', error
                            ? 'border-danger-500 focus:ring-danger-500'
                            : 'border-transparent',
                            icon && 'pl-10',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-danger-500 animate-slide-down">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
