import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { clsx } from 'clsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    className,
}) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={clsx(
                "relative bg-white dark:bg-slate-800 shadow-2xl",
                "w-full sm:w-auto sm:max-w-lg sm:rounded-2xl",
                "max-h-[100dvh] sm:max-h-[90vh]",
                "rounded-t-3xl sm:rounded-2xl",
                "overflow-hidden",
                "animate-slide-up",
                className
            )}>
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors touch-manipulation"
                            aria-label="Close modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100dvh-4rem)] sm:max-h-[calc(90vh-8rem)]">
                    {children}
                </div>
            </div>
        </div>
    );
};
