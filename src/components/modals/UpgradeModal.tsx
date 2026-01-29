import React, { useState } from 'react';
import { X, Check, Zap, Shield, Crown } from 'lucide-react';
import { Button } from '../common/Button';
import { loadStripe } from '@stripe/stripe-js';
import { STRIPE_CONFIG } from '../../config/stripe';

// Initialize Stripe
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

    if (!isOpen) return null;

    const handleSubscribe = async () => {
        setIsLoading(true);
        try {
            const stripe = await stripePromise;
            if (!stripe) throw new Error('Stripe failed to load');

            // Create checkout session
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth-token')}`
                },
                body: JSON.stringify({ billingPeriod })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create session');
            }

            const { sessionId } = await response.json();

            if (sessionId) {
                // @ts-ignore
                const { error } = await stripe.redirectToCheckout({ sessionId });
                if (error) throw error;
            } else {
                toast.error('Failed to start checkout');
            }

        } catch (error: any) {
            console.error("Upgrade Modal Error:", error);
            toast.error(error.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transform transition-all overflow-hidden border border-slate-200 dark:border-slate-700">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    style={{ zIndex: 60 }}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="bg-gradient-brand p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="p-3 bg-white/20 rounded-xl mb-4 backdrop-blur-md">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold font-display mb-2">Unlock Unlimited Potential</h2>
                        <p className="text-primary-100">You've reached the free plan limit.</p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 pt-6">
                    {/* Billing Toggle */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
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

                    <div className="flex items-end justify-center gap-2 mb-8">
                        <span className="text-4xl font-bold text-slate-900 dark:text-white">
                            {billingPeriod === 'monthly' ? '$8.99' : '$89'}
                        </span>
                        <span className="text-slate-500 mb-1">
                            /{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded-full bg-green-100 text-green-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300">Create <span className="font-bold text-slate-900 dark:text-white">Unlimited Projects</span> (vs 1)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded-full bg-green-100 text-green-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300">Unlimited Expenses & Tasks</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 rounded-full bg-green-100 text-green-600">
                                <Check className="w-4 h-4" />
                            </div>
                            <span className="text-slate-700 dark:text-slate-300">AI-Powered Financial Insights</span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full shadow-lg shadow-primary-500/20"
                        onClick={handleSubscribe}
                        isLoading={isLoading}
                    >
                        Upgrade Now
                    </Button>

                    <p className="text-xs text-center text-slate-400 mt-4">
                        Secure payment powered by Stripe. Cancel anytime.
                    </p>
                </div>
            </div>
        </div>
    );
};
