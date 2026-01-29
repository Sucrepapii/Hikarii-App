import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, LayoutDashboard, Wallet, Calendar, Briefcase, Users, GraduationCap, Building2, Target, Link2, Zap, FileText, TrendingUp } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const isAuthenticated = !!token;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-tr from-primary-600 to-accent-600 p-2 rounded-xl">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                                Hikari
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <Button onClick={() => navigate('/dashboard')} variant="primary" size="sm">
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <>
                                    <Link to="/login" className="text-sm font-medium hover:text-primary-600 transition-colors">
                                        Login
                                    </Link>
                                    <Button onClick={() => navigate('/signup')} variant="primary" size="sm">
                                        Get Started
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
                <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in">
                    Master Your <span className="gradient-text">Life & Money</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in delay-100">
                    The all-in-one workspace for task management and financial tracking.
                    Organize your projects, track expenses, and reach your goals.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                    <Button onClick={() => navigate('/signup')} size="lg" className="rounded-full px-8">
                        Start for Free <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                    <Button onClick={() => navigate('/pricing')} variant="ghost" size="lg" className="rounded-full px-8">
                        View Pricing
                    </Button>
                </div>
            </div>

            {/* Features Grid */}
            <div className="py-20 bg-white dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold mb-4">Everything you need</h2>
                        <p className="text-slate-600 dark:text-slate-400">Powering your productivity and financial health.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Check, title: 'Task Management', desc: 'Organize tasks with Kanban boards, lists, and smart filters.' },
                            { icon: Wallet, title: 'Budget Tracking', desc: 'Monitor income and expenses with detailed analytics.' },
                            { icon: Calendar, title: 'Calendar View', desc: 'Visualize your schedule and financial deadlines.' }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Target Users Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold mb-4">Who is Hikari for?</h2>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Designed for anyone seeking clarity in their tasks and finances
                    </p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { icon: Briefcase, title: "Busy Professionals", desc: "Juggling multiple projects, deadlines, and expenses. Combine task and budget tracking in one tool." },
                        { icon: Users, title: "Freelancers & Solopreneurs", desc: "Track client projects, deadlines, and irregular income. Forecast cash flow alongside timelines." },
                        { icon: GraduationCap, title: "Students", desc: "Manage assignments, study schedules, and tight budgets. Visual clarity balances academic and financial goals." },
                        { icon: Building2, title: "Small Business Owners", desc: "Oversee operations and finances in a single platform. See correlations between productivity and financial health." },
                        { icon: Target, title: "Financial Discipline Seekers", desc: "Pay off debt, save, or control spending while staying productive. Reduce overwhelm with light and clarity." }
                    ].map((user, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                                <user.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{user.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{user.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Features Section */}
            <div className="py-20 bg-white dark:bg-slate-800/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-display font-bold mb-4">Premium Features</h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            All included in your Pro subscription at $8.99/month
                        </p>
                    </div>
                    <div className="space-y-6 mb-8">
                        {[
                            {
                                icon: Link2,
                                title: "Task-Expense Linking",
                                value: "See exactly what each project costs you",
                                marketValue: "$5-7/month standalone",
                                comparison: "Unique feature - no direct competition"
                            },
                            {
                                icon: Zap,
                                title: "Predictive Analytics & AI Insights",
                                value: "AI that helps you save before you overspend",
                                marketValue: "$3-5/month standalone",
                                comparison: "Similar to Mint's insights (free) but proactive"
                            },
                            {
                                icon: FileText,
                                title: "Advanced Reporting & Exports",
                                value: "Professional reports for tax, clients, or investors",
                                marketValue: "$4-6/month standalone",
                                comparison: "QuickBooks charges $10-30/month"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
                                        <feature.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                        <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">{feature.value}</p>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Standalone Value: <span className="font-semibold">{feature.marketValue}</span>
                                            </span>
                                            <span className="hidden sm:inline text-slate-300">•</span>
                                            <span className="text-slate-500 italic">{feature.comparison}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-6 h-6 text-primary-600" />
                                <h4 className="text-lg font-bold">Combined Value: $12-18/month</h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">
                                Get all premium features for just <span className="font-bold text-primary-600">$8.99/month</span>,
                                saving you up to 50% compared to using separate tools for task management, budgeting, and analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-display font-bold mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-slate-600 dark:text-slate-400">Choose the plan that fits your ambition.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Free Plan */}
                    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <div className="text-4xl font-bold mb-6">$0<span className="text-lg text-slate-500 font-medium">/mo</span></div>
                        <ul className="space-y-4 mb-8">
                            {['Up to 1 Project', 'Basic Task Management', 'Simple Budget Tracking', '7-Day History'].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-slate-400" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={() => navigate('/signup')} variant="secondary" className="w-full justify-center">
                            Get Started
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="p-8 rounded-3xl bg-slate-900 dark:bg-primary-900/20 border-2 border-primary-500 relative overflow-hidden text-white">
                        <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                            Most Popular
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Pro</h3>
                        <div className="text-4xl font-bold mb-6">$9<span className="text-lg text-slate-400 font-medium">/mo</span></div>
                        <ul className="space-y-4 mb-8">
                            {['Unlimited Projects', 'Advanced Analytics', 'Recurring Tasks', 'Priority Support', 'Custom Categories'].map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="bg-primary-500/20 p-1 rounded-full">
                                        <Check className="w-4 h-4 text-primary-400" />
                                    </div>
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={() => navigate('/signup')} variant="primary" className="w-full justify-center shadow-lg shadow-primary-500/25">
                            Start 14-Day Free Trial
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} Hikari App. All rights reserved.</p>
            </footer>
        </div>
    );
};
