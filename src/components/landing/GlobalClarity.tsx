import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface GlobalClarityProps {
    statsData: {
        users: number;
        countries: number;
        activeProjects?: number;
    };
    onGetStarted: () => void;
}

export const GlobalClarity: React.FC<GlobalClarityProps> = ({ statsData, onGetStarted }) => {
    return (
        <>
            {/* Global Clarity (Combined) */}
            <section className="py-16 px-6 max-w-7xl mx-auto relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary-600/5 rounded-full blur-[160px] pointer-events-none -z-10" />

                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-6">A Global Movement</span>
                    <h2 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">Radical Clarity is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Choice.</span></h2>
                    <p className="text-lg md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        Built for the <span className="text-white font-bold">Global Professional</span>. From Lagos to London, Nairobi to New York—Hikarii empowers you to architect your growth with institutional precision.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                    {/* Before Card */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-[#0D0F1A] border border-white/5 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-rose-400 mb-8 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                                    <X className="w-5 h-5" />
                                </div>
                                Before Hikarii
                            </h3>
                            <ul className="space-y-6">
                                {["Task: \"Redesign homepage\" — no budget or cost limits.", "Expenses in Excel — lost receipts and hidden costs.", "Confusion: Are we staying within our budget?", "Chaos: Switching between 5 separate tools."].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-slate-500">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-700 shrink-0" />
                                        <span className="text-sm leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* After Card */}
                    <div className="p-8 md:p-12 rounded-[2.5rem] bg-primary-600/5 border border-primary-500/20 relative group overflow-hidden shadow-2xl shadow-primary-500/10">
                        <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-bold text-primary-400 mb-8 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500">
                                    <Check className="w-5 h-5" />
                                </div>
                                After Hikarii
                            </h3>
                            <ul className="space-y-6">
                                {["Task: \"Redesign homepage\" — $300 budget linked directly.", "Expense linked to task — remaining $100 tracked automatically.", "Clarity: Real-time budget vs. spending progress on every task.", "Peace: All project tasks and finances in one workspace."].map((item, i) => (
                                    <li key={i} className="flex gap-4 text-white">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                        <span className="text-sm font-medium leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="space-y-16">
                    {/* Stats & Quote */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-[2.5rem]">
                        <div className="flex gap-12">
                            <div>
                                <div className="text-4xl font-black text-white mb-1 tracking-tighter">{statsData.countries}+</div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Countries</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-white mb-1 tracking-tighter">
                                    {new Intl.NumberFormat('en-US').format(statsData.users)}
                                </div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Users</div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                            <p className="text-lg md:text-xl text-slate-400 leading-relaxed italic relative pl-8 border-l border-primary-500/30">
                                "Hikarii is the first tool that understands the complex interplay between my time in London and my business in Nairobi."
                            </p>
                        </div>
                    </div>

                    {/* Images in a straight line */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { src: "/diverse_professional_woman_laptop_1778667210443.png", label: "Lagos, Nigeria" },
                            { src: "/asian_man_smartphone_urban_1778667228092.png", label: "Singapore" },
                            { src: "/european_professional_woman_office_1778667268916.png", label: "London, UK" },
                            { src: "/diverse_team_meeting_1778667244641.png", label: "Global Teams" }
                        ].map((img, i) => (
                            <div key={i} className="relative group overflow-hidden rounded-2xl aspect-[4/5] shadow-2xl transition-all duration-700 hover:-translate-y-2">
                                <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                                    <div className="text-white text-[10px] font-bold uppercase tracking-wider">{img.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mid-page CTA */}
            <section className="py-20 px-6 relative overflow-hidden">
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-block p-[1px] rounded-[3rem] bg-gradient-to-r from-primary-500/30 via-amber-500/30 to-pink-500/30 shadow-2xl">
                        <div className="px-8 md:px-16 py-12 md:py-20 rounded-[2.9rem] bg-[#0D0F1A]/90 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="text-left md:max-w-md">
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">Ready to experience radical clarity?</h3>
                                <p className="text-slate-400 text-lg">Join 3,000+ professionals who have already mastered their life and money.</p>
                            </div>
                            <Button 
                                size="lg" 
                                className="w-full md:w-auto px-12 py-7 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold text-xl shadow-2xl shadow-primary-600/30 transition-all hover:scale-105"
                                onClick={onGetStarted}
                            >
                                Get Started Now <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </div>
                    </div>
                </div>
                {/* Background decorative glows */}
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-primary-600/10 rounded-full blur-[100px] -translate-y-1/2 -ml-32 pointer-events-none" />
                <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-amber-600/10 rounded-full blur-[100px] -translate-y-1/2 -mr-32 pointer-events-none" />
            </section>
        </>
    );
};
