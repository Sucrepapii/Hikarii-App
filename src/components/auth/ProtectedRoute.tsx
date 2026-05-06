import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { LoadingScreen } from '../common/LoadingScreen';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, token, isLoading } = useAuthStore();
    const isAuthenticated = !!token;

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        return <Navigate to={`/login?redirect=${encodeURIComponent(currentPath)}`} replace />;
    }

    if (user?.requiresPasswordChange && window.location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace />;
    }

    return <>{children}</>;
};
