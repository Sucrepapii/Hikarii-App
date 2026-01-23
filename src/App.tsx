import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Budget } from './pages/Budget';
import { Reports } from './pages/Reports';
import { Calendar } from './pages/Calendar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { useAuthStore } from './stores/authStore';
import './index.css';

function App() {
    const isAuthenticated = useAuthStore((state) => !!state.token);

    return (
        <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />}
                />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Dashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tasks"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Tasks />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/calendar"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Calendar />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/budget"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Budget />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Reports />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
