import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Wallet, X, Calendar, LineChart, Settings, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/budget', icon: Wallet, label: 'Budget' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/analytics', icon: LineChart, label: 'Analytics' },
    { to: '/subscriptions', icon: RefreshCw, label: 'Subscriptions' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Mobile Sidebar - Drawer */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 h-full w-64 glass-card z-40 transform transition-transform duration-300 ease-in-out lg:hidden',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-6">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-smooth"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <nav className="space-y-2 mt-12">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                onClick={() => {
                                    if (onClose) onClose();
                                }}
                                className={({ isActive }) =>
                                    clsx(
                                        'flex items-center gap-3 px-4 py-3 rounded-2xl transition-smooth',
                                        'hover:bg-white/20 dark:hover:bg-black/30',
                                        isActive
                                            ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                            : 'text-slate-700 dark:text-slate-300'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={clsx('w-5 h-5', isActive && 'animate-pulse')} />
                                        <span className="font-medium">{item.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Desktop Sidebar - Static */}
            <aside className="hidden lg:block w-64 glass-card p-6 h-fit sticky top-24 animate-slide-up">
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                clsx(
                                    'flex items-center gap-3 px-4 py-3 rounded-2xl transition-smooth',
                                    'hover:bg-white/20 dark:hover:bg-black/30',
                                    isActive
                                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                        : 'text-slate-700 dark:text-slate-300'
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={clsx('w-5 h-5', isActive && 'animate-pulse')} />
                                    <span className="font-medium">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};
