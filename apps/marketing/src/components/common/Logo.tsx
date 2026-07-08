import React from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';

interface LogoProps {
    className?: string;
    variant?: 'full' | 'icon' | 'text';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    suppressLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
    className,
    variant = 'full',
    size = 'md',
    suppressLink = false
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
        <div className="relative group/logo">
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx(
                    'transition-all duration-500 hover:scale-110 animate-logo-float',
                    iconSizes[size]
                )}
                aria-label="Hikari logo"
            >
                <defs>
                    <linearGradient id={`${gradId}-left`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e9d5ff" />
                        <stop offset="100%" stopColor="#c084fc" />
                    </linearGradient>
                    <linearGradient id={`${gradId}-right`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#6b21a8" />
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
                    stroke="#d8b4fe"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity="0.3"
                    filter={`url(#${glowId}-filter)`}
                    className="animate-logo-draw"
                />
                <path
                    d="M 80 15 Q 30 50 60 85"
                    stroke="#f59e0b"
                    strokeWidth="16"
                    strokeLinecap="round"
                    opacity="0.4"
                    filter={`url(#${glowId}-filter)`}
                    className="animate-logo-draw"
                    style={{ animationDelay: '0.2s' }}
                />

                {/* Main interlocking strokes */}
                {/* Right purple stroke (background layer) */}
                <path
                    d="M 80 15 Q 30 50 60 85"
                    stroke={`url(#${gradId}-right)`}
                    strokeWidth="16"
                    strokeLinecap="round"
                    className="animate-logo-draw"
                    style={{ animationDelay: '0.4s' }}
                />

                {/* Left white/blue stroke (foreground layer) */}
                <path
                    d="M 40 15 Q 70 50 20 85"
                    stroke={`url(#${gradId}-left)`}
                    strokeWidth="16"
                    strokeLinecap="round"
                    className="animate-logo-draw"
                    style={{ animationDelay: '0.6s' }}
                />
            </svg>
            
            {/* Subtle radial glow on hover */}
            <div className="absolute inset-0 bg-primary-400/20 blur-2xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 -z-10" />
        </div>
    );

    const TextComponent = (
        <span className={clsx(
            'font-display font-bold gradient-text tracking-tight animate-fade-in-up',
            textSizes[size]
        )}>
            Hikari
        </span>
    );

    if (variant === 'icon') {
        const content = IconComponent;
        return suppressLink ? (
            <div className={className}>{content}</div>
        ) : (
            <Link href="/" className={clsx("inline-flex hover:opacity-90 transition-opacity", className)}>
                {content}
            </Link>
        );
    }

    if (variant === 'text') {
        const content = TextComponent;
        return suppressLink ? (
            <div className={className}>{content}</div>
        ) : (
            <Link href="/" className={clsx("inline-flex hover:opacity-90 transition-opacity", className)}>
                {content}
            </Link>
        );
    }

    const content = (
        <>
            {IconComponent}
            {TextComponent}
        </>
    );

    return suppressLink ? (
        <div className={clsx("flex items-center gap-3", className)}>
            {content}
        </div>
    ) : (
        <Link href="/" className={clsx("flex items-center gap-3 hover:opacity-90 transition-opacity group", className)}>
            {content}
        </Link>
    );
};
