import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, Zap, Shield } from 'lucide-react';
import { Button } from '../common/Button';

export interface PricingProps {
  currency: 'USD' | 'NGN';
  setCurrency: (c: 'USD' | 'NGN') => void;
  onGetStarted?: () => void;
}

export const Pricing: React.FC<PricingProps> = ({ currency, setCurrency, onGetStarted }) => {
  const isUSD = currency === 'USD';

  const plans = [
    {
      name: 'Starter',
      price: isUSD ? '$0' : '₦0',
      period: 'forever free',
      description: 'Ideal for individuals establishing intentional habits and task clarity.',
      features: [
        'Unlimited basic tasks',
        'Direct task-to-budget linking',
        'Standard expense tracking',
        'Mobile responsive dashboard',
        'Community support',
      ],
      cta: 'Start Free',
      popular: false,
      ctaVariant: 'secondary' as const,
    },
    {
      name: 'Pro Clarity',
      price: isUSD ? '$9.99' : '₦9,500',
      period: 'per month',
      description: 'Built for professionals and teams demanding institutional financial control.',
      features: [
        'Everything in Starter',
        'AI Task Splitting & Scoper (Gemini)',
        'Google Calendar 2-Way Synchronization',
        'Advanced Predictive Cashflow & Insights',
        'Team Collaboration & Role Permissions',
        'Automated Weekly & Monthly Wrap Reports',
        'Priority 24/7 Support',
      ],
      cta: 'Go Pro',
      popular: true,
      ctaVariant: 'primary' as const,
    },
  ];

  return (
    <div id="pricing" className="py-20 relative z-20">
      {/* ── CURRENCY SWITCHER ──────────────────────────────────── */}
      <div className="py-6 mb-12 border-y border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-lg font-bold text-white mb-1">Regional Pricing</h3>
            <p className="text-sm text-slate-400">
              View transparent pricing formatted in your preferred currency.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10">
            <button
              onClick={() => setCurrency('NGN')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                currency === 'NGN'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              ₦ NGN
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                currency === 'USD'
                  ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>
        </div>
      </div>

      {/* ── PRICING CARDS ───────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-4 tracking-wide">
            Transparent Investment
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
            Plans for Every Ambition
          </h2>
          <p className="text-base md:text-lg text-slate-400 mt-3 max-w-2xl mx-auto">
            Choose the level of clarity that matches your current growth stage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[2rem] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 ${
                plan.popular
                  ? 'bg-gradient-to-b from-[#14182E] to-[#0D1022] border-2 border-primary-500/50 shadow-2xl shadow-primary-500/10'
                  : 'bg-[#0D0F1A] border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                  {plan.popular ? (
                    <Zap className="w-6 h-6 text-primary-400" />
                  ) : (
                    <Shield className="w-6 h-6 text-slate-500" />
                  )}
                </div>
                <p className="text-sm text-slate-400 mb-6">{plan.description}</p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-slate-400 font-medium">/{plan.period}</span>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    What's included:
                  </div>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-3 text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-primary-500/10 text-primary-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link to="/signup" className="block w-full">
                  <Button
                    size="lg"
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-500 hover:to-accent-500 shadow-lg shadow-primary-600/25'
                        : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                    }`}
                    onClick={onGetStarted}
                  >
                    {plan.cta} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
