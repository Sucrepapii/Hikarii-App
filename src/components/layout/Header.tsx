import React, { useState, useEffect } from 'react';
import { Moon, Sun, LogOut, User, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { useAuthStore } from '../../stores/authStore';
import { NotificationBell } from '../intelligence/NotificationBell';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

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

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <header className="glass-card sticky top-0 z-40 mb-4 md:mb-8 animate-slide-down">
            <div className="flex items-center justify-between p-4 md:p-6">
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

                </Button>

                <Logo size="md" />
            </div>

            <div className="flex items-center gap-4">
                {/* User Profile */}
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

                {/* Logout Button */}
                {user && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="rounded-full p-2.5 text-danger-500 hover:bg-danger-500/10"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                )}
            </div>
        </div>
        </header >
    );
};
