import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0 || location.pathname === '/') return null;

    return (
        <nav className="flex items-center text-sm font-medium text-slate-400 mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link to="/" className="inline-flex items-center hover:text-primary-400 transition-colors">
                        <Home className="w-4 h-4 mr-2.5" />
                        Home
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    // Format the path segment
                    const label = value.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                    return (
                        <li key={to}>
                            <div className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-slate-600 mx-1" />
                                {isLast ? (
                                    <span className="ml-1 text-slate-200 md:ml-2" aria-current="page">
                                        {label}
                                    </span>
                                ) : (
                                    <Link to={to} className="ml-1 hover:text-primary-400 transition-colors md:ml-2">
                                        {label}
                                    </Link>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};
