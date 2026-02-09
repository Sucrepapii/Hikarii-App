import { useEffect } from 'react';
import { FAQ } from './pages/FAQ';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
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
import { Subscriptions } from './pages/Subscriptions';
import { Projects } from './pages/Projects';
import { ProjectForm } from './pages/ProjectForm';
import { TermsOfService } from './pages/TermsOfService';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Security } from './pages/Security';
import { Accessibility } from './pages/Accessibility';
import { HelpCenter } from './pages/HelpCenter';
import { ArticlePage } from './pages/ArticlePage';
import { CategoryPage } from './pages/CategoryPage';
import { useAuthStore } from './stores/authStore';
import { useTaskStore } from './stores/taskStore';
import { TaskSplitModal } from './components/tasks/TaskSplitModal';
import { ScrollToTop } from './components/common/ScrollToTop';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUserManagement } from './pages/AdminUserManagement';
import { AdminReport } from './pages/AdminReport';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import ForcedPasswordChange from './pages/ForcedPasswordChange';
import './index.css';

import { useInactivity } from './hooks/useInactivity';
import toast from 'react-hot-toast';

function App() {
    const isAuthenticated = useAuthStore((state) => !!state.token);
    const logout = useAuthStore((state) => state.logout);
    const { activeSplitTaskId, closeSplitModal, tasks } = useTaskStore();

    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Auto-logout after 20 minutes (20 * 60 * 1000 = 1200000ms)
    useInactivity(20 * 60 * 1000, () => {
        if (isAuthenticated) {
            logout();
            toast.error('Session timed out due to inactivity');
        }
    });

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Toaster position="top-right" />
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
                />
                <Route
                    path="/signup"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
                />
                <Route
                    path="/forgot-password"
                    element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ForcedPasswordChange />
                        </ProtectedRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
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
                    path="/subscriptions"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Subscriptions />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Projects />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/new"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <ProjectForm />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/projects/edit/:id"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <ProjectForm />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="/settings" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <Settings />
                        </DashboardLayout>
                    </ProtectedRoute>
                } />
                <Route
                    path="/terms"
                    element={<TermsOfService />}
                />
                <Route
                    path="/privacy"
                    element={<PrivacyPolicy />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/security" element={<Security />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/help/category/:category" element={<CategoryPage />} />
                <Route path="/help/article/:slug" element={<ArticlePage />} />
                <Route path="/faq" element={<FAQ />} />
                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AdminDashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AdminUserManagement />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AdminReport />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/audit"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AdminAuditLogs />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes >

            {activeSplitTaskId && (() => {
                const activeTask = tasks.find(t => t.id === activeSplitTaskId);
                return activeTask ? (
                    <TaskSplitModal
                        isOpen={true}
                        onClose={closeSplitModal}
                        task={activeTask}
                    />
                ) : null;
            })()}
        </BrowserRouter >
    );
}

export default App;
