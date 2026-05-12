import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Lightbulb, Target, Users, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 flex flex-col">
            <Helmet>
                <title>About Us | Hikari - Radical Clarity in Tasks & Budgeting</title>
                <meta name="description" content="Discover the Hikari Method. We build tools for the Focused Few to bring radical clarity to the intersection of life's work and costs." />
                <meta name="keywords" content="hikari mission, hikariiapp, tasks, budget, AI, collaboration, focused few" />
                <link rel="canonical" href="https://www.hikarii.org/about" />
            </Helmet>
            {/* Minimal Header */}
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

            <main className="flex-grow pt-32 pb-20 px-6 w-full">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-20">
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-8">
                        We build tools for the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Focused Few.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed">
                        Hikari means "Light". We exist to bring radical clarity to the chaotic intersection of your life's work and your life's costs.
                    </p>
                </div>

                {/* The Philosophy */}
                <section className="max-w-5xl mx-auto mb-32 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold mb-6">OUR PHILOSOPHY</div>
                        <h2 className="text-3xl font-bold mb-6">Why we started</h2>
                        <div className="prose dark:prose-invert text-lg text-slate-600 dark:text-slate-300">
                            <p className="mb-6">
                                The modern professional is drowning. Tasks in one app, budgets in another, calendars in a third. The mental overhead of switching contexts is costing us our most valuable asset: our attention.
                            </p>
                            <p>
                                We asked a simple question: <strong>What if your task list knew what your bank account looked like?</strong>
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl rotate-3 opacity-20 blur-xl"></div>
                        <div className="relative bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl md:aspect-square flex items-center justify-center">
                            <div className="text-center">
                                <Lightbulb className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold">Clarity via Integration</h3>
                                <p className="mt-2 text-slate-500">When data flows together, insight follows.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Targeted Niche Section */}
                <section className="max-w-7xl mx-auto mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Who is Hikari For?</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg">Specific tools for specific problems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Freelancers</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Stop losing track of billable time vs. actual expenses. hikari links your tasks directly to your receipts, ensuring every hour worked accounts for every dollar spent.
                            </p>
                        </div>

                        <div className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Home Reno Projects</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                For the project that always goes over budget. Map out your renovation tasks and see exactly how each purchase impacts your bottom line in real-time.
                            </p>
                        </div>

                        <div className="group p-8 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-500 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                <Target className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">Small Biz Owners</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Bridge the gap between operations and finance. See the ROI of your team's tasks and forecast your cash flow without the spreadsheet nightmare.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="max-w-7xl mx-auto mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-slate-500 dark:text-slate-400">The principles that guide every pixel we push.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300">
                            <Target className="w-10 h-10 text-red-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Ruthless Focus</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                We don't add features for the sake of it. If it doesn't help you enter a flow state or gain financial clarity, it doesn't belong in Hikari.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300">
                            <Users className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">User Sovereignty</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Your data is yours. We believe in privacy by design, exportable data, and no lock-in. We earn your subscription every month.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 transition-transform duration-300">
                            <Heart className="w-10 h-10 text-pink-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Craftsmanship</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Speed matters. Aesthetics matter. The feeling of a button click matters. We build software that feels like a premium tool, not a chore.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};
