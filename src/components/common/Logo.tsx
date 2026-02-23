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
            viewBox="0 0 100 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={clsx('transition-transform duration-300 hover:scale-105', iconSizes[size])}
            aria-label="Hikari logo"
        >
            <defs>
                {/* Brand gradient: indigo → purple */}
                <radialGradient id={gradId} cx="50%" cy="38%" r="55%" fx="50%" fy="30%">
                    <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
                    <stop offset="40%" stopColor="#6366f1" stopOpacity="1" />
                    <stop offset="100%" stopColor="#4338ca" stopOpacity="1" />
                </radialGradient>
                {/* Soft inner glow */}
                <radialGradient id={glowId} cx="50%" cy="35%" r="35%">
                    <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* === Bulb globe === */}
            <path
                d="M50 5
                   C27 5 10 22 10 44
                   C10 58 17 70 28 78
                   L28 90
                   L72 90
                   L72 78
                   C83 70 90 58 90 44
                   C90 22 73 5 50 5Z"
                fill={`url(#${gradId})`}
            />
            {/* Inner glow overlay */}
            <path
                d="M50 5
                   C27 5 10 22 10 44
                   C10 58 17 70 28 78
                   L28 90
                   L72 90
                   L72 78
                   C83 70 90 58 90 44
                   C90 22 73 5 50 5Z"
                fill={`url(#${glowId})`}
            />

            {/* === Filament (white vertical line inside bulb) === */}
            <line
                x1="50" y1="30"
                x2="50" y2="72"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.9"
            />

            {/* === Screw base ribs === */}
            {/* Top collar separator */}
            <line x1="28" y1="90" x2="72" y2="90" stroke={`url(#${gradId})`} strokeWidth="2" />

            {/* Rib 1 */}
            <rect x="28" y="93" width="44" height="6" rx="1" fill={`url(#${gradId})`} />
            {/* Rib 2 */}
            <rect x="30" y="102" width="40" height="6" rx="1" fill={`url(#${gradId})`} />
            {/* Rib 3 */}
            <rect x="33" y="111" width="34" height="6" rx="1" fill={`url(#${gradId})`} />

            {/* === Bottom cap === */}
            <ellipse cx="50" cy="120" rx="16" ry="5" fill="#4338ca" />
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
