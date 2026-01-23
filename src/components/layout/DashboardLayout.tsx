import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen flex flex-col">
            <Header onMenuClick={toggleSidebar} />

            <div className="flex flex-1 relative">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
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
