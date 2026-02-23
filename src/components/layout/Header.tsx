import React, { useState, useEffect } from 'react';
import { Moon, Sun, User, Menu } from 'lucide-react';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';
import { useAuthStore } from '../../stores/authStore';
import { NotificationBell } from '../intelligence/NotificationBell';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const [darkMode, setDarkMode] = useState(false);
    const { user } = useAuthStore();

    useEffect(() => {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', String(newMode));

        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };



    return (
        <header className="glass-card sticky top-0 z-40 mb-2 md:mb-4 animate-slide-down">
            <div className="flex items-center justify-between p-3 md:p-4">
                <div className="flex items-center gap-3">
                    {/* Burger Menu Button - Mobile Only */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMenuClick}
                        className="lg:hidden rounded-full p-2.5"
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    {/* Logo + brand name grouped tightly */}
                    <div className="flex items-center gap-2">
                        <Logo variant="icon" size="md" />

                        {user ? (
                            <span className="font-display font-bold gradient-text text-xl md:text-2xl tracking-tight hidden sm:block">
                                Hi, {user.name.split(' ')[0]}
                            </span>
                        ) : (
                            <span className="font-display font-bold gradient-text text-xl md:text-2xl tracking-tight hidden sm:block">
                                Hikari
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* User Profile - Simplified to potentially remove name since it's in header now, but keeping for now or removing duplicate info? User asked to remove Hikari and put Hi User. */}
                    {/* Keeping the avatar but maybe removing the name block if it feels redundant, but user specifically asked to remove Hikari brand text. 
                        Let's keep the right side profile as is for now, or simplify it.
                        User said "when you login at the top, remove the hikari and put Hi, users name".
                    */}
                    {user && (
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/50 shadow-sm">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-slate-900 dark:text-white">
                                    {user.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Subscription Status Badge */}
                    {user && user.role !== 'ADMIN' && (
                        <div className={`
                            hidden sm:flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold
                            ${user.subscriptionStatus === 'PRO'
                                ? 'bg-gradient-brand text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                        `}>
                            {user.subscriptionStatus === 'PRO' ? 'PRO' : 'FREE'}
                        </div>
                    )}

                    {/* Mobile Subscription Status */}
                    {user && user.role !== 'ADMIN' && (
                        <div className={`
                            sm:hidden flex items-center justify-center px-2 py-1 rounded-md text-[10px] font-bold
                             ${user.subscriptionStatus === 'PRO'
                                ? 'bg-gradient-brand text-white'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}
                        `}>
                            {user.subscriptionStatus === 'PRO' ? 'PRO' : 'FREE'}
                        </div>
                    )}

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleDarkMode}
                        className="rounded-full p-2.5"
                    >
                        {darkMode ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </Button>

                    {/* Notification Bell */}
                    <NotificationBell />
                </div>
            </div>
        </header>
    );
};
