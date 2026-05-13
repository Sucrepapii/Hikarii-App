import React, { useState } from 'react';
import { Check, Shield, Zap, BarChart, Clock, ArrowRight, Globe, Lock } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../config/stripe';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import apiClient from '../api/client';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import toast from 'react-hot-toast';

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

        setIsLoading(true);
        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to load');

            const response = await apiClient.post('/stripe/create-checkout-session', {
                billingPeriod
            });

            const { url } = response.data;
            if (url) {
                window.location.href = url;
            } else {
                throw new Error('No checkout URL received');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to start checkout');
        } finally {
            setIsLoading(false);
        }
    };

    const plans = [
        {
            name: "Hikari Basic",
            price: billingPeriod === 'monthly' ? "0" : "0",
            description: "Essential tools for personal clarity and focus.",
            features: [
                "Unlimited Tasks & Notes",
                "Basic Budget Tracking",
                "Single Device Sync",
                "Community Support"
            ],
            cta: "Current Plan",
            highlight: false,
            color: "slate"
        },
        {
            name: "Hikari Pro",
            price: billingPeriod === 'monthly' ? "10" : "99",
            description: "Advanced intelligence for high-performance professionals.",
            features: [
                "AI Smart Task Splitting",
                "Advanced Financial Analytics",
                "Unlimited Projects & Teams",
                "Priority Support",
                "Cross-device Synchronization",
                "Custom Themes & Branding"
            ],
            cta: "Upgrade to Pro",
            highlight: true,
            color: "indigo"
        }
    ];

    return (
        <div className="min-h-screen bg-[#080910] text-slate-100 selection:bg-purple-500/30 overflow-x-hidden flex flex-col deep-dark">
            <Helmet>
                <title>Pricing | Hikari</title>
                <meta name="description" content="Choose the plan that fits your growth. Affordable, institutional-grade tools for personal and professional clarity." />
            </Helmet>

            <Navbar />

            <main className="flex-grow pt-32 pb-24 px-6 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-indigo-600/5 rounded-full blur-[180px] pointer-events-none -z-10" />

                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-20">
                        <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-8 tracking-tight">
                            Simple Pricing.
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Invest in your clarity. Choose the plan that aligns with your professional ambitions.
                        </p>

                        <div className="mt-12 inline-flex items-center p-1 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                            <button
                                onClick={() => setBillingPeriod('monthly')}
                                className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${billingPeriod === 'monthly' ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:text-white'}`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingPeriod('yearly')}
                                className={`px-8 py-3 rounded-xl text-sm font-bold tracking-widest uppercase transition-all ${billingPeriod === 'yearly' ? 'bg-white text-black shadow-xl' : 'text-slate-400 hover:text-white'}`}
                            >
                                Yearly <span className="text-[10px] ml-1 text-emerald-500 font-black">SAVE 20%</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-32">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative p-10 md:p-14 rounded-[3.5rem] border ${plan.highlight ? 'bg-white/[0.03] border-indigo-500/30 shadow-2xl shadow-indigo-500/10' : 'bg-[#0D0F1A] border-white/5 shadow-2xl'}`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-[10px] font-black tracking-[0.3em] uppercase text-white shadow-xl shadow-indigo-500/20">
                                        Most Popular
                                    </div>
                                )}

                                <div className="mb-10">
                                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{plan.name}</h3>
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-5xl font-black text-white">${plan.price}</span>
                                        <span className="text-slate-500 font-medium">{billingPeriod === 'monthly' ? '/month' : '/year'}</span>
                                    </div>
                                    <p className="text-slate-400 leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="space-y-5 mb-12">
                                    {plan.features.map((feature, j) => (
                                        <div key={j} className="flex items-center gap-4 group">
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-500'}`}>
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    disabled={plan.cta === 'Current Plan' || isLoading}
                                    onClick={handleSubscribe}
                                    className={`w-full py-6 rounded-2xl text-xs font-black tracking-[0.25em] uppercase transition-all ${plan.highlight ? 'bg-white text-black hover:bg-slate-200' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
                                >
                                    {isLoading ? 'Processing...' : plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Secure Checkout", desc: "Enterprise-grade encryption for all transactions." },
                            { icon: Globe, title: "Global Access", desc: "Sync your data across all your devices worldwide." },
                            { icon: Lock, title: "No Hidden Costs", desc: "Transparent pricing with no surprise charges." }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-8">
                                <item.icon className="w-8 h-8 text-slate-500 mx-auto mb-6" />
                                <h4 className="text-white font-bold mb-3">{item.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};
