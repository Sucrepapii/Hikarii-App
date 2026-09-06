import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { CanvasParticleOverlay } from '../common/CanvasParticleOverlay';
import { useAmbientTheme } from '../../hooks/useAmbientTheme';
import { Breadcrumbs } from '../common/Breadcrumbs';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const mainRef = useRef<HTMLElement>(null);
    const location = useLocation();
    useAmbientTheme();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    // Scroll to top of main content when navigating between routes
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
    }, [location.pathname]);

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-transparent">
            <CanvasParticleOverlay />

            {/* Pinned / Sticky Top Navbar */}
            <div className="flex-shrink-0 z-40 px-3 pt-3 pb-1 md:px-6 md:pt-4">
                <Header onMenuClick={toggleSidebar} />
            </div>

            {/* Body Area: Sticky Sidebar + Scrollable Main Content */}
            <div className="flex flex-1 overflow-hidden relative px-3 pb-3 md:px-6 md:pb-4 gap-4 md:gap-6 min-h-0">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                <main
                    ref={mainRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar min-w-0 p-2 md:p-4 lg:p-6"
                >
                    <Breadcrumbs />
                    {children}
                </main>
            </div>

            {/* Overlay for mobile drawer */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={closeSidebar}
                />
            )}
        </div>
    );
};

