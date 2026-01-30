import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, LayoutDashboard, Wallet, Calendar, Briefcase, Users, GraduationCap, Building2, Target, Link2, Zap, FileText, TrendingUp, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';
import { PRICING_PLANS, PREMIUM_FEATURES } from '../config/features';

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const isAuthenticated = !!token;
    const observerRef = useRef<IntersectionObserver | null>(null);

    // Scroll reveal animation using Intersection Observer
    useEffect(() => {
        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll('.reveal-on-scroll');
        elements.forEach((el) => observerRef.current?.observe(el));

        return () => observerRef.current?.disconnect();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 relative overflow-hidden">
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

            {/* Hero Section with Animated Background */}
            <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
                {/* Animated Gradient Background Orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 -left-4 w-72 h-72 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 float-slow"></div>
                    <div className="absolute top-20 -right-4 w-72 h-72 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 float-medium"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-br from-cyan-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10 float-fast"></div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-600 dark:text-primary-400 mb-8 animate-fade-in border border-primary-200/50 dark:border-primary-700/50">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-medium">Bring clarity to your life</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-8 animate-fade-in">
                        Master Your <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Life & Money</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in delay-100">
                        The all-in-one workspace for task management and financial tracking.
                        Organize your projects, track expenses, and reach your goals.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-200">
                        <Button
                            onClick={() => navigate('/signup')}
                            size="lg"
                            className="rounded-full px-8 pulse-glow relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        >
                            Start for Free <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button onClick={() => navigate('/pricing')} variant="ghost" size="lg" className="rounded-full px-8">
                            View Pricing
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="relative py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800/50 dark:via-purple-900/20 dark:to-pink-900/20 overflow-hidden">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 reveal-on-scroll">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            Everything you <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">need</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">Powering your productivity and financial health.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Check, title: 'Task Management', desc: 'Organize tasks with Kanban boards, lists, and smart filters.', gradient: 'from-blue-500 via-indigo-500 to-purple-500', bg: 'from-blue-50/50 to-indigo-50/50' },
                            { icon: Wallet, title: 'Budget Tracking', desc: 'Monitor income and expenses with detailed analytics.', gradient: 'from-emerald-500 via-teal-500 to-cyan-500', bg: 'from-emerald-50/50 to-teal-50/50' },
                            { icon: Calendar, title: 'Calendar View', desc: 'Visualize your schedule and financial deadlines.', gradient: 'from-orange-500 via-pink-500 to-rose-500', bg: 'from-orange-50/50 to-pink-50/50' }
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className={`p-8 rounded-2xl bg-gradient-to-br ${feature.bg} dark:bg-slate-800 border border-white/50 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 gradient-border-hover reveal-on-scroll stagger-${i + 1} relative overflow-hidden backdrop-blur-sm`}
                            >
                                {/* Decorative corner accent */}
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${feature.gradient} opacity-10 rounded-bl-full`}></div>

                                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 icon-bounce shadow-lg`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Target Users Section */}
            <div className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5 dark:opacity-10">
                    <div className="absolute top-20 left-10 w-32 h-32 bg-purple-400 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-400 rounded-full blur-2xl"></div>
                </div>

                <div className="relative z-10">
                    <div className="text-center mb-16 reveal-on-scroll">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            Who is <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Hikari</span> for?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                            Designed for anyone seeking clarity in their tasks and finances
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Briefcase, title: "Busy Professionals", desc: "Juggling multiple projects, deadlines, and expenses. Combine task and budget tracking in one tool.", scheme: { bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20', icon: 'from-blue-500 to-indigo-600' } },
                            { icon: Users, title: "Freelancers & Solopreneurs", desc: "Track client projects, deadlines, and irregular income. Forecast cash flow alongside timelines.", scheme: { bg: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20', icon: 'from-purple-500 to-pink-600' } },
                            { icon: GraduationCap, title: "Students", desc: "Manage assignments, study schedules, and tight budgets. Visual clarity balances academic and financial goals.", scheme: { bg: 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20', icon: 'from-green-500 to-teal-600' } },
                            { icon: Building2, title: "Small Business Owners", desc: "Oversee operations and finances in a single platform. See correlations between productivity and financial health.", scheme: { bg: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20', icon: 'from-orange-500 to-amber-600' } },
                            { icon: Target, title: "Financial Discipline Seekers", desc: "Pay off debt, save, or control spending while staying productive. Reduce overwhelm with light and clarity.", scheme: { bg: 'bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-sky-900/20', icon: 'from-cyan-500 to-sky-600' } }
                        ].map((user, idx) => (
                            <div
                                key={idx}
                                className={`p-6 rounded-2xl ${user.scheme.bg} border border-white/50 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 gradient-border-hover reveal-on-scroll stagger-${(idx % 3) + 1} backdrop-blur-sm`}
                            >
                                <div className={`w-14 h-14 bg-gradient-to-br ${user.scheme.icon} rounded-xl flex items-center justify-center mb-4 icon-bounce shadow-md`}>
                                    <user.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">{user.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{user.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Premium Features Section */}
            <div className="relative py-20 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-800/50 dark:via-indigo-900/20 dark:to-purple-900/20 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 left-0 w-72 h-72 bg-gradient-to-r from-indigo-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-0 w-72 h-72 bg-gradient-to-l from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16 reveal-on-scroll">
                        <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Premium</span> Features
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            All included in your Pro subscription at $8.99/month
                        </p>
                    </div>
                    <div className="space-y-6">
                        {[
                            { icon: Link2, title: "Task-Expense Linking", value: "See exactly what each project costs you", marketValue: "$5-7/month standalone", gradient: 'from-indigo-500 via-purple-500 to-pink-500' },
                            { icon: Zap, title: "Predictive Analytics & AI Insights", value: "AI that helps you save before you overspend", marketValue: "$3-5/month standalone", gradient: 'from-yellow-500 via-orange-500 to-red-500' },
                            { icon: FileText, title: "Advanced Reporting & Exports", value: "Professional reports for tax, clients, or investors", marketValue: "$4-6/month standalone", gradient: 'from-teal-500 via-cyan-500 to-blue-500' }
                        ].map((feature, idx) => (
                            <div
                                key={idx}
                                className={`p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/50 dark:border-slate-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 gradient-border-hover reveal-on-scroll stagger-${idx + 1} relative overflow-hidden`}
                            >
                                {/* Decorative gradient line */}
                                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient}`}></div>

                                <div className="flex items-start gap-6">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shrink-0 icon-bounce shadow-lg`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold mb-2">{feature.title}</h3>
                                        <p className={`bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent font-medium mb-4 text-lg`}>
                                            {feature.value}
                                        </p>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            Standalone Value: <span className="font-semibold">{feature.marketValue}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl reveal-on-scroll stagger-4">
                            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <TrendingUp className="w-7 h-7 text-purple-600" />
                                    <h4 className="text-xl md:text-2xl font-bold">
                                        Combined Value: $12-18/month
                                    </h4>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-lg">
                                    Get all premium features for just <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-xl">$8.99/month</span>,
                                    saving you up to 50% compared to using separate tools for task management, budgeting, and analytics.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16 reveal-on-scroll">
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                        Simple <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Start for free, upgrade for more power</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <div className="p-8 rounded-2xl bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 reveal-on-scroll stagger-1">
                        <h3 className="text-2xl font-bold mb-2">Free</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">Essential tools for personal tasks.</p>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">$0</span>
                            <span className="text-slate-500">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {PRICING_PLANS[0].features.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-green-500 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={() => navigate('/signup')} variant="secondary" size="lg" className="w-full">
                            Get Started
                        </Button>
                    </div>

                    <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 reveal-on-scroll stagger-2">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold">
                            POPULAR
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Hikari Pro</h3>
                        <p className="text-white/90 mb-6">Advanced insights & limitless potential.</p>
                        <div className="mb-8">
                            <span className="text-5xl font-bold">$8.99</span>
                            <span className="text-white/80">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            {PRICING_PLANS[1].features.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                        <Button onClick={() => navigate('/pricing')} variant="secondary" size="lg" className="w-full pulse-glow">
                            Upgrade to Pro
                        </Button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-slate-500 text-center md:text-left">
                            &copy; {new Date().getFullYear()} Hikari App. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link to="/terms" className="text-slate-500 hover:text-primary-600 transition-colors text-sm">
                                Terms of Use
                            </Link>
                            <Link to="/privacy" className="text-slate-500 hover:text-primary-600 transition-colors text-sm">
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
