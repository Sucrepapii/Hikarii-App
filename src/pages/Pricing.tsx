import React, { useState } from 'react';
import { Check, X, Shield, Zap, BarChart, Clock, ArrowLeft, Briefcase, Users, GraduationCap, Building2, Target, Link2, TrendingUp, FileText } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

export const Pricing: React.FC = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    const handleSubscribe = async () => {
        if (!user) {
            toast.error('Please log in to subscribe');
            return;
        }

        console.log("Pricing: Starting subscription flow...");
        setIsLoading(true);
        try {
            const stripe = await stripePromise;
            if (!stripe) {
                console.error("Pricing Error: Stripe failed to load. Check VITE_STRIPE_PUBLISHABLE_KEY.");
                throw new Error('Stripe failed to load');
            }

            console.log("Pricing: Calling backend to create session...");
            // Call backend to create session
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ billingPeriod })
            });

            console.log("Pricing: Backend response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Pricing Error: Backend returned error:", errorData);
                throw new Error(errorData.message || 'Failed to create session');
            }

            const { url } = await response.json();
            console.log("Pricing: Redirecting to Stripe:", url);

            if (url) {
                window.location.href = url;
            } else {
                console.error("Pricing Error: No URL returned");
                toast.error('Failed to start checkout');
            }

        } catch (error: any) {
            console.error("Pricing Catch Error:", error);
            toast.error(`Something went wrong: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const targetUsers = [
        { icon: Briefcase, title: "Busy Professionals", desc: "Juggling multiple projects, deadlines, and expenses. Combine task and budget tracking in one tool." },
        { icon: Users, title: "Freelancers & Solopreneurs", desc: "Track client projects, deadlines, and irregular income. Forecast cash flow alongside timelines." },
        { icon: GraduationCap, title: "Students", desc: "Manage assignments, study schedules, and tight budgets. Visual clarity balances academic and financial goals." },
        { icon: Building2, title: "Small Business Owners", desc: "Oversee operations and finances in a single platform. See correlations between productivity and financial health." },
        { icon: Target, title: "Financial Discipline Seekers", desc: "Pay off debt, save, or control spending while staying productive. Reduce overwhelm with light and clarity." }
    ];

    const premiumFeatures = [
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
    ];

    const features = [
        { name: "Unlimited Tasks", free: true, pro: true },
        { name: "Active Projects", free: "1 Project", pro: "Unlimited" },
        { name: "Task-Expense Linking", free: "Max 3", pro: "Unlimited" },
        { name: "Recurring Expense Scanning", free: false, pro: true, icon: <Clock className="w-4 h-4" /> },
        { name: "AI Insights & Suggestions", free: false, pro: true, icon: <Zap className="w-4 h-4" /> },
        { name: "Net Cash Flow Analytics", free: false, pro: true, icon: <BarChart className="w-4 h-4" /> },
        { name: "Priority Support", free: false, pro: true, icon: <Shield className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header with Back Button */}
            <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Back</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 animate-fade-in">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">
                        Simple pricing for powerful organization
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
                        Choose the plan that fits your needs. Start for free, upgrade for clarity.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${billingPeriod === 'monthly'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingPeriod === 'yearly'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Yearly <span className="text-[10px] bg-green-100 text-green-700 px-1.5 rounded-full font-bold">-17%</span>
                        </button>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
                    {/* Free Plan */}
                    <Card className="p-8 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition relative">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free</h3>
                            <p className="text-slate-500 dark:text-slate-400">Essential tools for personal tasks.</p>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
                                <span className="text-slate-500 ml-2">/month</span>
                            </div>
                        </div>

                        <Button variant="secondary" className="w-full mb-8" disabled>
                            Current Plan
                        </Button>

                        <ul className="space-y-4">
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-sm">
                                    {feature.free ? (
                                        <Check className="w-5 h-5 text-green-500 mr-3 shrink-0" />
                                    ) : (
                                        <X className="w-5 h-5 text-slate-300 mr-3 shrink-0" />
                                    )}
                                    <span className={feature.free ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400'}>
                                        {typeof feature.free === 'string' ? feature.free : feature.name}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="p-8 border-2 border-primary-500 relative overflow-hidden ring-4 ring-primary-500/10">
                        <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            RECOMMENDED
                        </div>
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Hikari Pro</h3>
                            <p className="text-slate-500 dark:text-slate-400">Advanced insights & limitless potential.</p>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">
                                    {billingPeriod === 'monthly' ? '$8.99' : '$89'}
                                </span>
                                <span className="text-slate-500 ml-2">
                                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                                </span>
                            </div>
                            {billingPeriod === 'yearly' && (
                                <p className="text-sm text-green-600 font-medium mt-2">
                                    Equivalent to $7.42/month
                                </p>
                            )}
                            {billingPeriod === 'monthly' && (
                                <p className="text-sm text-slate-400 mt-2">
                                    Billed monthly
                                </p>
                            )}
                        </div>

                        <Button
                            variant="primary"
                            className="w-full mb-8"
                            onClick={handleSubscribe}
                            isLoading={isLoading}
                        >
                            Upgrade to Pro
                        </Button>

                        <ul className="space-y-4">
                            {features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-sm">
                                    <Check className="w-5 h-5 text-primary-500 mr-3 shrink-0" />
                                    <span className="text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                        {typeof feature.pro === 'string'
                                            ? <><span>{feature.name}:</span> <span className="font-semibold">{feature.pro}</span></>
                                            : feature.name
                                        }
                                        {feature.icon && <span className="text-primary-500">{feature.icon}</span>}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                </div>

                {/* Target Users Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
                            Who is Hikari for?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Designed for anyone seeking clarity in their tasks and finances
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {targetUsers.map((user, idx) => (
                            <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 text-primary-600">
                                    <user.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{user.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{user.desc}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Premium Features Breakdown */}
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-4">
                            Premium Features
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            All included in your Pro subscription at $8.99/month
                        </p>
                    </div>
                    <div className="space-y-6">
                        {premiumFeatures.map((feature, idx) => (
                            <Card key={idx} className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
                                        <feature.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-primary-600 dark:text-primary-400 font-medium mb-3">
                                            {feature.value}
                                        </p>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                                            <span className="text-slate-600 dark:text-slate-400">
                                                Standalone Value: <span className="font-semibold">{feature.marketValue}</span>
                                            </span>
                                            <span className="hidden sm:inline text-slate-300">•</span>
                                            <span className="text-slate-500 dark:text-slate-500 italic">
                                                {feature.comparison}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        <div className="bg-gradient-to-r from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 p-6 rounded-xl border border-primary-200 dark:border-primary-800">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-6 h-6 text-primary-600" />
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Combined Value: $12-18/month
                                </h4>
                            </div>
                            <p className="text-slate-700 dark:text-slate-300">
                                Get all premium features for just <span className="font-bold text-primary-600">$8.99/month</span>,
                                saving you up to 50% compared to using separate tools for task management, budgeting, and analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
