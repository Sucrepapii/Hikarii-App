import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hover = false, elevated = false }) => {
    return (
        <div
            className={clsx(
                elevated ? 'card-elevated' : 'glass-card',
                'card-padding animate-fade-in',
                hover && 'cursor-pointer',
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
};
