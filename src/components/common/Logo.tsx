import React from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon' | 'text';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
    className,
    variant = 'full',
    size = 'md'
}) => {
    // Size maps
    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-10 h-10'
    };

    const containerSizes = {
        sm: 'p-1.5 rounded-lg',
        md: 'p-2.5 rounded-xl',
        lg: 'p-3 rounded-2xl',
        xl: 'p-4 rounded-3xl'
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl md:text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl'
    };

    const IconComponent = (
        <div className={clsx(
            containerSizes[size],
            'bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg flex items-center justify-center transition-transform duration-300 hover:scale-105 overflow-hidden relative'
        )}>
            {/* Custom Hikari Brand Icon: Abstract Sun/Lens Flare */}
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx('text-white', iconSizes[size])}
            >
                {/* Central Core */}
                <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 18L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 12L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M6 12L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

                {/* Diagonal Rays (finer) */}
                <path d="M14.828 9.172L16.242 7.758" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M7.758 16.242L9.172 14.828" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M14.828 14.828L16.242 16.242" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M7.758 7.758L9.172 9.172" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />

                {/* Inner 'H' implication / Prism cut */}
                <path d="M10 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
                <path d="M14 10L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
            </svg>
        </div>
    );

    const TextComponent = (
        <span className={clsx(
            'font-display font-bold gradient-text tracking-tight',
            textSizes[size]
        )}>
            Hikari
        </span>
    );

    if (variant === 'icon') {
        return (
            <Link to="/" className={clsx("inline-flex hover:opacity-90 transition-opacity", className)}>
                {IconComponent}
            </Link>
        );
    }

    if (variant === 'text') {
        return (
            <Link to="/" className={clsx("inline-flex hover:opacity-90 transition-opacity", className)}>
                {TextComponent}
            </Link>
        );
    }

    return (
        <Link to="/" className={clsx("flex items-center gap-3 hover:opacity-90 transition-opacity group", className)}>
            {IconComponent}
            {TextComponent}
        </Link>
    );
};
