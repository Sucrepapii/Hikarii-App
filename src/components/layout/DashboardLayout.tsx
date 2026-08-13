import React, { useState } from 'react';
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
    useAmbientTheme();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen flex flex-col">
            <CanvasParticleOverlay />
            <Header onMenuClick={toggleSidebar} />

            <div className="flex flex-1 relative">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                <main className="flex-1 p-4 md:px-6 md:pt-2 md:pb-8 lg:px-8 lg:pt-2 lg:pb-12 overflow-auto">
                    <Breadcrumbs />
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={closeSidebar}
                />
            )}
        </div>
    );
};
