import { useEffect } from 'react';
import { FAQ } from './pages/FAQ';
import { Feedback } from './pages/Feedback';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Budget } from './pages/Budget';
import { Tracker } from './pages/Tracker';
import { Calendar } from './pages/Calendar';
import { Auth } from './pages/Auth';
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
import { LoadingScreen } from './components/common/LoadingScreen';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUserManagement } from './pages/AdminUserManagement';
import { AdminReport } from './pages/AdminReport';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import { AdminMarketing } from './pages/AdminMarketing';
import { AdminFeedback } from './pages/AdminFeedback';
import { AIAdvisor } from './pages/AIAdvisor';
import { Pricing } from './pages/Pricing';
import ForcedPasswordChange from './pages/ForcedPasswordChange';
import { ResetPassword } from './pages/ResetPassword';
import { AcceptInvite } from './pages/AcceptInvite';
import { Method } from './pages/Method';
import { FloatingChatbot } from './components/intelligence/FloatingChatbot';
import { NotFound } from './pages/NotFound';
import { ThankYou } from './pages/ThankYou';
import './index.css';

import { useInactivity } from './hooks/useInactivity';
import toast from 'react-hot-toast';

function AuthRoute({ children }: { children: JSX.Element }) {
    const { token, user } = useAuthStore((state) => ({ token: state.token, user: state.user }));
    const isAuthenticated = !!token;
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect');
    
    if (isAuthenticated) {
        if (user?.role === 'ADMIN' && !redirectTo) {
            return <Navigate to="/admin" replace />;
        }
        return <Navigate to={redirectTo || "/dashboard"} replace />;
    }
    return children;
}

function App() {
    const { isAuthenticated, isLoading, logout } = useAuthStore((state) => ({
        isAuthenticated: !!state.token,
        isLoading: state.isLoading,
        logout: state.logout
    }));
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

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <>
            <ScrollToTop />
            <Toaster position="top-right" />
            <Routes>
                <Route
                    path="/"
                    element={<LandingPage />}
                />
                <Route
                    path="/login"
                    element={<AuthRoute><Auth defaultMode="login" /></AuthRoute>}
                />
                <Route
                    path="/signup"
                    element={<AuthRoute><Auth defaultMode="signup" /></AuthRoute>}
                />
                <Route
                    path="/forgot-password"
                    element={<AuthRoute><ForgotPassword /></AuthRoute>}
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>
                            <ForcedPasswordChange />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
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
                    path="/tracker"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <Tracker />
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
                <Route path="/insights/coach" element={
                    <ProtectedRoute>
                        <DashboardLayout>
                            <AIAdvisor />
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
                <Route path="/feedback" element={<Feedback />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/method" element={<Method />} />
                <Route
                    path="/invites/:token"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AcceptInvite />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
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
                <Route
                    path="/admin/marketing"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AdminMarketing />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/feedback"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout>
                                <AdminFeedback />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route path="/thank-you" element={<ThankYou />} />
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
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

            <FloatingChatbot />
        </>
    );
}

export default App;
