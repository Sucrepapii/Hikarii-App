import React from 'react';
import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

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

    const IconComponent = (
        <div className="relative group/logo">
            <img 
                src="/logo.png" 
                alt="Hikarii Logo" 
                className={clsx(
                    'transition-transform duration-500 hover:scale-105 object-contain',
                    iconSizes[size]
                )}
            />
            {/* Subtle radial glow on hover */}
            <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-700 -z-10" />
        </div>
    );

    const TextComponent = (
        <span className={clsx(
            'font-display font-bold gradient-text tracking-tight animate-fade-in-up',
            textSizes[size]
        )}>
            Hikarii
        </span>
    );

    if (variant === 'icon') {
        const content = IconComponent;
        return suppressLink ? (
            <div className={className}>{content}</div>
        ) : (
            <Link to="/" className={clsx("inline-flex hover:opacity-90 transition-opacity", className)}>
                {content}
            </Link>
        );
    }

    if (variant === 'text') {
        const content = TextComponent;
        return suppressLink ? (
            <div className={className}>{content}</div>
        ) : (
            <Link to="/" className={clsx("inline-flex hover:opacity-90 transition-opacity", className)}>
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
        <Link to="/" className={clsx("flex items-center gap-3 hover:opacity-90 transition-opacity group", className)}>
            {content}
        </Link>
    );
};
