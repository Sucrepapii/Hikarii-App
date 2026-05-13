import React, { useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageSquare, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { Logo } from '../components/common/Logo';
import { Helmet } from 'react-helmet-async';

export const FAQ: React.FC = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const faqs = [
        {
            q: "Do I really get to use Hikari for free?",
            a: "Yes! We give you the core features—like task management, basic budgeting, and the calendar view—completely free, forever. We believe in proving our value to you first. When you're ready, our Pro plan unlocks advanced AI insights and unlimited history."
        },
        {
            q: "How do I get my notifications on WhatsApp?",
            a: "It's easy! Just head over to Settings > Profile and drop in your phone number. From there, you can toggle exactly what you want to be alerted about—like overdue tasks, budget limits, and project deadlines."
        },
        {
            q: "How does your AI Smart Split actually help me?",
            a: "Think of it as your personal assistant. When you give Hikari a massive, overwhelming project (like 'Plan a wedding'), our AI analyzes it and instantly breaks it down into bite-sized, actionable tasks. We take the mental load of planning off your shoulders."
        },
        {
            q: "Can I sync my schedule with Google Calendar?",
            a: "Absolutely! You can securely connect your Google account in Settings > Integrations. Once you're linked up, you can seamlessly push individual tasks or entire projects straight to your Google Calendar."
        },
        {
            q: "Is Hikari a good fit for my freelance business?",
            a: "Definitely. We have tons of freelancers and small business owners using Hikari to manage client projects and track business expenses. Plus, our data export feature makes it a breeze to hand everything over to your accountant."
        },
        {
            q: "How do you keep my financial data secure?",
            a: "Your security is our absolute top priority. We lock down all your data using bank-grade encryption, both in transit and at rest. And we promise: we will never sell your personal data to third parties."
        },
        {
            q: "How do I upgrade my account to Pro?",
            a: "Whenever you're ready, you can upgrade to Pro directly from your account settings. Becoming a Pro member instantly gives you access to our advanced AI intelligence, unlimited task history, and customizable budget categories."
        },
        {
            q: "Am I locked in if I subscribe to Pro?",
            a: "Not at all. You have full control, and you can cancel your Pro subscription at any time with just a few clicks. Even after you cancel, we'll make sure you keep your Pro access until the end of your current billing cycle."
        }
    ];

    return (
        <div className="min-h-screen bg-[#080910] text-slate-100 selection:bg-purple-500/30 overflow-x-hidden">
            <Helmet>
                <title>FAQ | Hikari Support & Help Center</title>
                <meta name="description" content="Find answers to frequently asked questions about Hikari. Learn about AI Smart Split, WhatsApp notifications, and how to master your budget." />
                <meta name="keywords" content="hikari faq, hikariiapp support, help center, AI task manager help, budget app nigeria, whatsapp notifications" />
                <link rel="canonical" href="https://www.hikarii.org/faq" />
            </Helmet>
            <Navbar />

            {/* Hero Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#080910]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
                        <HelpCircle className="w-3.5 h-3.5" />
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 tracking-tight leading-tight">
                        Frequently Asked <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Questions</span>
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
                        <div key={i} className="group bg-[#0D0F1A] border border-white/[0.06] rounded-3xl hover:border-indigo-500/30 transition-all duration-300">
                            <details className="p-8 cursor-pointer [&_svg]:open:rotate-180">
                                <summary className="flex items-center justify-between gap-4 font-bold text-white text-xl list-none">
                                    {item.q}
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                                        <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                                    </div>
                                </summary>
                                <div className="mt-6 text-slate-400 leading-relaxed border-t border-white/[0.06] pt-6 text-lg">
                                    {item.a}
                                </div>
                            </details>
                        </div>
                    ))}

                    {/* Support CTA */}
                    <div className="mt-16 p-12 rounded-[2.5rem] bg-gradient-to-br from-[#121421] to-[#080910] border border-white/[0.06] text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[80px] -z-10" />
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                            <MessageSquare className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">Still have questions?</h3>
                        <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto leading-relaxed">
                            Can't find the answer you're looking for? Please chat to our friendly team.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center justify-center px-10 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase text-xs transition-all hover:scale-105 shadow-xl shadow-indigo-500/25"
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
