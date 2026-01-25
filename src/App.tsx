// import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Budget } from './pages/Budget';
import { Calendar } from './pages/Calendar';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { Settings } from './pages/Settings';
import { Analytics } from './pages/Analytics';
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
                <Route
                    path="/forgot-password"
                    element={isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />}
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
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Analytics />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Settings />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
