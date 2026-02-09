import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, token } = useAuthStore();
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (user?.requiresPasswordChange && window.location.pathname !== '/change-password') {
        return <Navigate to="/change-password" replace />;
    }

    return <>{children}</>;
};
