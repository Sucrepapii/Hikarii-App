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
    const iconSizes = {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-10 h-10',
        xl: 'w-14 h-14'
    };

    const textSizes = {
        sm: 'text-lg',
        md: 'text-xl md:text-2xl',
        lg: 'text-3xl',
        xl: 'text-4xl'
    };

    // Unique gradient IDs to avoid collisions if multiple Logos render
    const gradId = `hikari-bulb-grad`;
    const glowId = `hikari-bulb-glow`;

    const IconComponent = (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={clsx('transition-transform duration-300 hover:scale-105', iconSizes[size])}
            aria-label="Hikari logo"
        >
            <defs>
                <linearGradient id={`${gradId}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#a5b4fc" />
                </linearGradient>
                <linearGradient id={`${gradId}-right`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c084fc" />
                    <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
                {/* Soft glow filter for premium effect */}
                <filter id={`${glowId}-filter`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>

            {/* Background glow for depth */}
            <path
                d="M 40 15 Q 70 50 20 85"
                stroke="#a5b4fc"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.3"
                filter={`url(#${glowId}-filter)`}
            />
            <path
                d="M 80 15 Q 30 50 60 85"
                stroke="#8b5cf6"
                strokeWidth="16"
                strokeLinecap="round"
                opacity="0.3"
                filter={`url(#${glowId}-filter)`}
            />

            {/* Main interlocking strokes */}
            {/* Right purple stroke (background layer) */}
            <path
                d="M 80 15 Q 30 50 60 85"
                stroke={`url(#${gradId}-right)`}
                strokeWidth="16"
                strokeLinecap="round"
            />

            {/* Left white/blue stroke (foreground layer) */}
            <path
                d="M 40 15 Q 70 50 20 85"
                stroke={`url(#${gradId}-left)`}
                strokeWidth="16"
                strokeLinecap="round"
            />
        </svg>
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
