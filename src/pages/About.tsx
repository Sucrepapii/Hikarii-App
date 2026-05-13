import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Lightbulb, Target, Users, Heart, Globe, Shield } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Helmet } from 'react-helmet-async';

export const About: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#080910] font-sans text-slate-100 flex flex-col selection:bg-purple-500/30 overflow-x-hidden">
            <Helmet>
                <title>About Us | Hikari - Radical Clarity in Tasks & Budgeting</title>
                <meta name="description" content="Discover the Hikari Method. We build tools for the Focused Few to bring radical clarity to the intersection of life's work and costs." />
                <meta name="keywords" content="hikari mission, hikariiapp, tasks, budget, AI, collaboration, focused few" />
                <link rel="canonical" href="https://www.hikarii.org/about" />
            </Helmet>
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6 w-full">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-20 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
                    <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tight">
                        We build tools for the <br />
                        <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Focused Few.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
                        Hikari means <span className="text-white font-semibold">"Light"</span>. We exist to bring radical clarity to the chaotic intersection of your life's work and your life's costs.
                    </p>
                </div>

                {/* The Philosophy */}
                <section className="max-w-5xl mx-auto mb-40 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono text-[10px] font-black tracking-widest mb-8 uppercase">OUR PHILOSOPHY</div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">Why we started</h2>
                        <div className="prose prose-invert text-lg text-slate-400 space-y-6">
                            <p>
                                The modern professional is drowning. Tasks in one app, budgets in another, calendars in a third. The mental overhead of switching contexts is costing us our most valuable asset: our attention.
                            </p>
                            <p className="text-white font-medium italic">
                                "What if your task list knew what your bank account looked like?"
                            </p>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[2.5rem] rotate-3 blur-2xl group-hover:rotate-6 transition-transform duration-700"></div>
                        <div className="relative bg-[#0D0F1A] border border-white/[0.06] p-12 rounded-[2.5rem] md:aspect-square flex items-center justify-center overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                            <div className="text-center relative z-10">
                                <div className="w-20 h-20 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                                    <Lightbulb className="w-10 h-10 text-amber-500" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">Clarity via Integration</h3>
                                <p className="text-slate-500 leading-relaxed max-w-[240px] mx-auto">When data flows together, insight follows naturally.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Targeted Niche Section */}
                <section className="max-w-7xl mx-auto mb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight">Who is Hikari For?</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">We're not trying to be everything to everyone. We build specific tools for specific problems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="group p-10 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-indigo-500/20">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Freelancers</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Stop losing track of billable time vs. actual expenses. Hikari links your tasks directly to your receipts, ensuring every hour worked accounts for every dollar spent.
                            </p>
                        </div>

                        <div className="group p-10 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-8 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-purple-500/20">
                                <Heart className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Home Renovators</h3>
                            <p className="text-slate-400 leading-relaxed">
                                For the project that always goes over budget. Map out your renovation tasks and see exactly how each purchase impacts your bottom line in real-time.
                            </p>
                        </div>

                        <div className="group p-10 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-emerald-500/20">
                                <Target className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-white">Small Biz Owners</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Bridge the gap between operations and finance. See the ROI of your team's tasks and forecast your cash flow without the spreadsheet nightmare.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="max-w-7xl mx-auto mb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">Our Core Values</h2>
                        <p className="text-slate-500 text-lg">The principles that guide every pixel we push.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mb-8 border border-red-500/20 shadow-lg shadow-red-500/10">
                                <Target className="w-6 h-6 text-red-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Ruthless Focus</h3>
                            <p className="text-slate-400 leading-relaxed">
                                We don't add features for the sake of it. If it doesn't help you enter a flow state or gain financial clarity, it doesn't belong in Hikari.
                            </p>
                        </div>
                        <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">User Sovereignty</h3>
                            <p className="text-slate-400 leading-relaxed">
                                Your data is yours. We believe in privacy by design, exportable data, and no lock-in. We earn your subscription every single month.
                            </p>
                        </div>
                        <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
                            <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center mb-8 border border-pink-500/20 shadow-lg shadow-pink-500/10">
                                <Heart className="w-6 h-6 text-pink-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Craftsmanship</h3>
                            <p className="text-slate-400 leading-relaxed">
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
