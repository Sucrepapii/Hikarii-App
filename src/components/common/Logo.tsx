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
            {/* Custom Hikari Brand Icon: Modern Lightbulb */}
            <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={clsx('text-white', iconSizes[size])}
            >
                {/* Bulb Glass */}
                <path
                    d="M9 18H15M9 21H15M12 2C7.58172 2 4 5.58172 4 10C4 12.308 4.965 14.39 6.5 15.856V19C6.5 20.1046 7.39543 21 8.5 21H15.5C16.6046 21 17.5 20.1046 17.5 19V15.856C19.035 14.39 20 12.308 20 10C20 5.58172 16.4183 2 12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Filament */}
                <path
                    d="M12 6V11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
                {/* Glow stripes around the bulb base */}
                <path
                    d="M10 15H14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.6"
                />
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
