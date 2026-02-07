import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    hover?: boolean;
    elevated?: boolean;
    id?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, onClick, hover = false, elevated = false, id }) => {
    return (
        <div
            id={id}
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
