import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Check, Keyboard, Eye, Monitor } from 'lucide-react';

export const Accessibility: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" suppressLink={true} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate('/')} variant="ghost" size="sm">Back to Home</Button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">Accessibility Commitment</h1>
                <div className="prose dark:prose-invert prose-lg max-w-none text-slate-600 dark:text-slate-300">
                    <p className="lead text-xl">
                        Hikari is committed to making our digital experience accessible to everyone, regardless of ability or technology. We believe productivity tools should empower <strong>all</strong> users.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-white">Our Standards</h2>
                    <p>
                        We strive to meet or exceed the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standards. This is an ongoing process of improvement and testing.
                    </p>

                    <h2 className="text-2xl font-bold mt-12 mb-6 text-slate-900 dark:text-white">Key Features</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Keyboard className="w-6 h-6 text-indigo-500" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Keyboard Navigation</h3>
                            </div>
                            <p className="text-sm">All interactive elements are reachable and usable via keyboard (Tab/Enter/Space), with visible focus indicators.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Eye className="w-6 h-6 text-purple-500" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Color Contrast</h3>
                            </div>
                            <p className="text-sm">We maintain high color contrast ratios for text and UI elements to assist users with low vision.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Monitor className="w-6 h-6 text-pink-500" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Screen Readers</h3>
                            </div>
                            <p className="text-sm">Pages use semantic HTML (ARAI labels, roles) to ensure compatibility with screen readers like NVDA, Jaws, and VoiceOver.</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-3">
                                <Check className="w-6 h-6 text-emerald-500" />
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Reduced Motion</h3>
                            </div>
                            <p className="text-sm">We respect `prefers-reduced-motion` settings to limit animations for users with vestibular disorders.</p>
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold mt-12 mb-4 text-slate-900 dark:text-white">Feedback & Support</h3>
                    <p>
                        Accessibility is a journey. If you encounter a barrier on Hikari, please let us know so we can fix it.
                    </p>
                    <div className="mt-8">
                        <a href="mailto:support@hikarii.org" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-medium hover:opacity-90 transition-opacity no-underline">
                            Contact Accessibility Support
                        </a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
