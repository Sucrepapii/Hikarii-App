import React, { useState } from 'react';
import { Check, X, Shield, Zap, BarChart, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import apiClient from '../api/client';

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
            // Use apiClient for automatic base URL and token handling
            const response = await apiClient.post('/stripe/create-checkout-session', {
                billingPeriod
            });

            console.log("Pricing: Backend response success");

            const { url } = response.data;
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

    const features = [
        { name: "Unlimited Tasks", free: true, pro: true },
        { name: "Active Projects", free: "1 Project", pro: "Unlimited" },
        { name: "Task-Expense Linking", free: "Max 1 Task-Expense Linking", pro: "Unlimited" },
        { name: "Recurring Expense Scanning", free: false, pro: true, icon: <Clock className="w-4 h-4" /> },
        { name: "AI Insights & Suggestions", free: false, pro: true, icon: <Zap className="w-4 h-4" /> },
        { name: "Net Cash Flow Analytics", free: false, pro: true, icon: <BarChart className="w-4 h-4" /> },
        { name: "Priority Support", free: false, pro: true, icon: <Shield className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Helmet>
                <title>Pricing | Hikari - Radical Clarity in Tasks & Budgeting</title>
                <meta name="description" content="Choose the perfect plan for your productivity journey. Start for free or upgrade to Hikari Pro for AI insights and unlimited projects." />
                <meta name="keywords" content="hikari pricing, hikariiapp, tasks, budget, AI, collaboration" />
                <link rel="canonical" href="https://www.hikarii.org/pricing" />
            </Helmet>
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
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Free Plan */}
                    <Card className="p-8 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition relative">
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free</h3>
                            <p className="text-slate-500 dark:text-slate-400">Essential tools for personal tasks.</p>
                            <div className="mt-6 flex items-baseline">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">£0</span>
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
                                    {billingPeriod === 'monthly' ? '£8.99' : '£89'}
                                </span>
                                <span className="text-slate-500 ml-2">
                                    /{billingPeriod === 'monthly' ? 'month' : 'year'}
                                </span>
                            </div>
                            {billingPeriod === 'yearly' && (
                                <p className="text-sm text-green-600 font-medium mt-2">
                                    Equivalent to £7.42/month
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
            </div>
        </div>
    );
};
