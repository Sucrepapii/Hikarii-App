import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Wallet, X, Calendar, LineChart, Settings, RefreshCw, LogOut, ChevronDown, ChevronRight, User, Database, DollarSign, Link2, HelpCircle, Shield, Archive, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

interface NavItem {
    to: string;
    icon: any;
    label: string;
    end?: boolean;
    subItems?: { to: string; icon: any; label: string }[];
}

const navItems: NavItem[] = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/budget', icon: Wallet, label: 'Budget' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/analytics', icon: LineChart, label: 'Analytics' },
    { to: '/subscriptions', icon: RefreshCw, label: 'Subscriptions' },
    {
        to: '/settings',
        icon: Settings,
        label: 'Settings',
        end: false,
        subItems: [
            { to: '/settings?tab=profile', icon: User, label: 'Profile' },
            { to: '/settings?tab=data', icon: Database, label: 'Data Management' },
            { to: '/settings?tab=currency', icon: DollarSign, label: 'Currency' },
            { to: '/settings?tab=integrations', icon: Link2, label: 'Integrations' },
            { to: '/settings?tab=archive', icon: Archive, label: 'Archive' },
            { to: '/settings?tab=support', icon: HelpCircle, label: 'Support & FAQ' },
        ]
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { logout, user } = useAuthStore();
    const location = useLocation();
    const [expandedItem, setExpandedItem] = useState<string | null>('/settings');

    let displayNavItems;
    if (user?.role === 'ADMIN') {
        displayNavItems = [
            { to: '/admin', icon: Shield, label: 'Admin Overview', end: true },
            { to: '/admin/users', icon: User, label: 'Manage Accounts' },
            { to: '/admin/reports', icon: FileText, label: 'Full Report' },
        ];
    } else {
        displayNavItems = [...navItems];
    }

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        onClose();
    };

    const toggleExpand = (path: string, e: React.MouseEvent) => {
        e.preventDefault();
        setExpandedItem(expandedItem === path ? null : path);
    };

    const NavContent = () => (
        <div className="flex flex-col h-full">
            <nav className="space-y-1 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {displayNavItems.map((item: any) => {
                    const isActive = location.pathname === item.to || (item.subItems && location.pathname.startsWith(item.to));
                    const isExpanded = expandedItem === item.to;
                    const hasSubItems = !!item.subItems;

                    return (
                        <div key={item.to} className="space-y-1">
                            <div className="relative">
                                <NavLink
                                    to={item.to}
                                    end={item.end !== undefined ? item.end : item.to === '/'}
                                    onClick={() => {
                                        if (!hasSubItems && onClose) onClose();
                                    }}
                                    className={({ isActive: isLinkActive }) =>
                                        clsx(
                                            'flex items-center justify-between px-4 py-3 rounded-2xl transition-smooth w-full',
                                            'hover:bg-white/20 dark:hover:bg-black/30',
                                            (isLinkActive && !hasSubItems)
                                                ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-lg'
                                                : isLinkActive ? 'text-primary-600 dark:text-primary-400 font-semibold' : 'text-slate-700 dark:text-slate-300'
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={clsx('w-5 h-5', (isActive && !hasSubItems) && 'animate-pulse')} />
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                    {hasSubItems && (
                                        <button
                                            onClick={(e) => toggleExpand(item.to, e)}
                                            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
                                        >
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </button>
                                    )}
                                </NavLink>
                            </div>

                            {/* Submenu */}
                            {hasSubItems && isExpanded && (
                                <div className="pl-4 space-y-1 animate-slide-down origin-top">
                                    {item.subItems?.map((sub: any) => {
                                        const isSubActive = location.pathname + location.search === sub.to;
                                        return (
                                            <NavLink
                                                key={sub.to}
                                                to={sub.to}
                                                onClick={() => {
                                                    if (onClose) onClose();
                                                }}
                                                className={
                                                    clsx(
                                                        'flex items-center gap-3 px-4 py-2.5 rounded-xl transition-smooth text-sm',
                                                        isSubActive
                                                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                                    )
                                                }
                                            >
                                                {sub.icon && <sub.icon className="w-4 h-4 opacity-70" />}
                                                <span>{sub.label}</span>
                                            </NavLink>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-smooth text-slate-700 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar - Drawer */}
            <aside
                className={clsx(
                    'fixed top-0 left-0 h-full w-72 glass-card z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <span className="font-display font-bold text-xl gradient-text">Menu</span>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/30 transition-smooth"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <NavContent />
                </div>
            </aside>

            {/* Desktop Sidebar - Static */}
            <aside className="hidden lg:block w-72 glass-card p-6 h-[calc(100vh-6rem)] sticky top-24 animate-slide-up overflow-hidden">
                <NavContent />
            </aside>
        </>
    );
};
