import React, { useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Logo } from '../components/common/Logo';

export const FAQ: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            q: "Is Hikari really free?",
            a: "Yes! Our core features including task management, basic budgeting, and calendar view are free forever. We believe in providing value first. Our Pro plan unlocks advanced AI insights and unlimited history."
        },
        {
            q: "How does the AI Smart Split work?",
            a: "Hikari uses advanced AI models to analyze your complex tasks (like 'Plan a wedding') and breaks them down into actionable sub-tasks automatically. It saves you the mental load of planning every detail."
        },
        {
            q: "Can I use Hikari for my business?",
            a: "Absolutely. Many freelancers and small business owners use Hikari to track client projects and expenses. The data export feature makes it easy to send reports to accountants."
        },
        {
            q: "Is my financial data safe?",
            a: "Security is our top priority. We use bank-grade encryption for all data transmission and storage. We never sell your data to third parties."
        },
        {
            q: "How do I upgrade to Pro?",
            a: "You can upgrade to Pro at any time from your account settings. Pro gives you access to advanced AI features, unlimited task history, and custom budget categories."
        },
        {
            q: "Can I cancel my subscription?",
            a: "Yes, you can cancel your Pro subscription at any time. You will continue to have access to Pro features until the end of your current billing period."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-900 selection:bg-primary-500/30">
            {/* Header/Nav */}
            <nav className="sticky top-0 z-50 glass border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <Logo variant="icon" size="sm" />
                        <span className="font-display font-bold text-xl text-white">Hikari</span>
                    </Link>
                    <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                        Frequently Asked <br />
                        <span className="gradient-text">Questions</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Find answers to common questions about Hikari and learn how to make the most of our tools.
                    </p>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="pb-24 px-6">
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((item, i) => (
                        <div key={i} className="group bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300">
                            <details className="p-6 cursor-pointer [&_svg]:open:rotate-180">
                                <summary className="flex items-center justify-between gap-4 font-semibold text-white text-lg list-none">
                                    {item.q}
                                    <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-300" />
                                </summary>
                                <div className="mt-4 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                    {item.a}
                                </div>
                            </details>
                        </div>
                    ))}

                    {/* Support CTA */}
                    <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-primary-500/10 via-slate-800 to-slate-900 border border-white/10 text-center">
                        <div className="w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-400">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
                        <p className="text-slate-400 mb-6">
                            Can't find the answer you're looking for? Please chat to our friendly team.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-50 text-white font-bold transition-all hover:scale-105"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};
