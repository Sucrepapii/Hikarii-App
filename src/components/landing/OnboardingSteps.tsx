import React from 'react';
import { Logo } from '../common/Logo';
import { Zap, Check } from 'lucide-react';

export interface OnboardingStep {
    title: string;
    body: string;
    image: string;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        title: "Create Account",
        body: "Sign up in seconds to access your personalized workspace.",
        image: "/step1_flat.png?v=3"
    },
    {
        title: "Link Tasks to Budget",
        body: "Assign a budget to each task so you know the financial cost of every milestone.",
        image: "/step2_flat.png?v=3"
    },
    {
        title: "Break Down Goals",
        body: "Easily break big projects into bite-sized tasks with realistic budget limits.",
        image: "/step3_flat.png?v=3"
    },
    {
        title: "Track Spending & Progress",
        body: "Check off tasks and watch your live budget and spending update in real time.",
        image: "/step4_flat.png?v=3"
    }
];

export const OnboardingSteps: React.FC = () => {
    return (
        <section className="py-16 px-6 max-w-7xl mx-auto relative z-20">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary-400/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-400/8 rounded-full blur-[120px]" />
            </div>

            <div className="text-center mb-12 md:mb-16 relative z-10">
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-4 tracking-wide">How It Works</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">Four simple steps to get started</h2>
                <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto px-4">Join Hikarii and take control of your tasks and finances in minutes.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 relative z-10">
                {/* Connecting progress line on desktop */}
                <div className="hidden lg:block absolute top-[18px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary-500/40 via-amber-500/40 to-emerald-500/40 -z-10" />

                {ONBOARDING_STEPS.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center">
                        {/* Step badge */}
                        <div className="mb-6 flex items-center justify-center">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-amber-600 text-white text-base font-bold shadow-lg shadow-primary-500/30 ring-4 ring-[#060814]">
                                {idx + 1}
                            </span>
                        </div>

                        {/* Clean, Steady iPhone Mockup */}
                        <div className="relative mx-auto w-[210px] md:w-[230px]">
                            <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#2A2A2E] via-[#1C1C1E] to-[#1C1C1E] p-[10px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.08)]">
                                <div className="absolute -left-[2.5px] top-[100px] w-[3px] h-[30px] bg-[#3A3A3E] rounded-l-sm" />
                                <div className="absolute -left-[2.5px] top-[140px] w-[3px] h-[30px] bg-[#3A3A3E] rounded-l-sm" />
                                <div className="absolute -right-[2.5px] top-[110px] w-[3px] h-[45px] bg-[#3A3A3E] rounded-r-sm" />
                                
                                <div className="relative rounded-[2rem] bg-black aspect-[9/19.5] overflow-hidden">
                                    {/* Dynamic Notch */}
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[80px] h-[22px] bg-black rounded-full flex items-center justify-center">
                                        <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a2e] border border-[#2a2a3e] mr-3" />
                                    </div>
                                    
                                    {/* Top Bar Status */}
                                    <div className="absolute top-0 left-0 right-0 h-10 z-20 flex items-end justify-between px-6 pb-1">
                                        <span className="text-[9px] font-semibold text-white/80">Hikarii</span>
                                        <div className="flex items-center gap-1">
                                            <div className="flex gap-[2px]">
                                                <div className="w-[3px] h-[4px] bg-white/70 rounded-[0.5px]" />
                                                <div className="w-[3px] h-[6px] bg-white/70 rounded-[0.5px]" />
                                                <div className="w-[3px] h-[8px] bg-white/70 rounded-[0.5px]" />
                                                <div className="w-[3px] h-[10px] bg-white/30 rounded-[0.5px]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Native Vector Pixel-Perfect UI Screens */}
                                    {idx === 0 && (
                                        <div className="w-full h-full bg-[#0B0C15] p-3 text-left flex flex-col justify-between pt-11 pb-4 select-none">
                                            <div>
                                                <div className="flex items-center gap-1.5 mb-3">
                                                    <Logo variant="icon" size="sm" suppressLink />
                                                    <span className="font-bold text-white text-xs tracking-tight">Hikarii</span>
                                                </div>
                                                <h4 className="text-xs font-bold text-white mb-1">Welcome to Hikarii</h4>
                                                <p className="text-[9px] text-slate-400 mb-3 leading-tight">Bring Light & Clarity to Your Tasks & Finances</p>
                                                
                                                <div className="space-y-2">
                                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px]">
                                                        <div className="text-[7px] text-slate-400">Full Name</div>
                                                        <div className="text-white font-medium">Alex Morgan</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[9px]">
                                                        <div className="text-[7px] text-slate-400">Email Address</div>
                                                        <div className="text-white font-medium">alex@hikarii.org</div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="w-full py-1.5 rounded-lg bg-gradient-to-r from-primary-600 to-amber-500 text-white font-bold text-[9px] text-center shadow-lg shadow-primary-500/20">
                                                    Create Free Account
                                                </div>
                                                <div className="text-[7px] text-center text-slate-500 mt-1">14-day free trial • No card needed</div>
                                            </div>
                                        </div>
                                    )}

                                    {idx === 1 && (
                                        <div className="w-full h-full bg-[#0B0C15] p-3 text-left flex flex-col pt-11 pb-4 select-none">
                                            <div className="flex items-center justify-between mb-2 pb-1 border-b border-white/10">
                                                <div className="text-[10px] font-bold text-white">Tasks & Budgets</div>
                                                <span className="text-[7px] px-1.5 py-0.5 rounded bg-primary-500/20 text-primary-300 font-bold">LIVE LINK</span>
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                                                    <div className="flex justify-between text-[9px] font-bold text-white mb-1">
                                                        <span>Brand Assets</span>
                                                        <span className="text-amber-400">$450 / $600</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-1">
                                                        <div className="h-full bg-gradient-to-r from-primary-500 to-amber-500 w-[75%]" />
                                                    </div>
                                                    <div className="flex justify-between text-[7px] text-slate-400">
                                                        <span>75% allocated</span>
                                                        <span className="text-emerald-400">+$150 safe</span>
                                                    </div>
                                                </div>

                                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                                                    <div className="flex justify-between text-[9px] font-bold text-white mb-1">
                                                        <span>App Dev Sprint</span>
                                                        <span className="text-primary-400">$1,200 / $1,500</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden mb-1">
                                                        <div className="h-full bg-gradient-to-r from-sky-500 to-primary-500 w-[80%]" />
                                                    </div>
                                                    <div className="flex justify-between text-[7px] text-slate-400">
                                                        <span>80% allocated</span>
                                                        <span className="text-emerald-400">+$300 safe</span>
                                                    </div>
                                                </div>

                                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10">
                                                    <div className="flex justify-between text-[9px] font-bold text-white mb-1">
                                                        <span>Video Shoot</span>
                                                        <span className="text-emerald-400">$800 / $1,000</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-emerald-500 w-[80%]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {idx === 2 && (
                                        <div className="w-full h-full bg-[#0B0C15] p-3 text-left flex flex-col pt-11 pb-4 select-none">
                                            <div className="flex items-center gap-1 mb-1.5 px-1.5 py-0.5 rounded-full bg-primary-500/15 border border-primary-500/30 w-fit">
                                                <Zap className="w-2.5 h-2.5 text-primary-400" />
                                                <span className="text-[7px] font-bold text-primary-300">GEMINI AI SPLITTER</span>
                                            </div>
                                            
                                            <div className="text-[10px] font-bold text-white mb-2">Goal: Launch E-commerce Store</div>
                                            
                                            <div className="space-y-1.5">
                                                <div className="p-1.5 rounded-lg bg-white/5 border border-primary-500/30 flex items-center justify-between text-[8px]">
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-3 h-3 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-[7px]">1</span>
                                                        <span className="text-white font-medium">Domain Setup</span>
                                                    </div>
                                                    <span className="text-amber-400 font-bold text-[8px]">$150</span>
                                                </div>

                                                <div className="p-1.5 rounded-lg bg-white/5 border border-primary-500/30 flex items-center justify-between text-[8px]">
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-3 h-3 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-[7px]">2</span>
                                                        <span className="text-white font-medium">Stripe Billing</span>
                                                    </div>
                                                    <span className="text-amber-400 font-bold text-[8px]">$300</span>
                                                </div>

                                                <div className="p-1.5 rounded-lg bg-white/5 border border-primary-500/30 flex items-center justify-between text-[8px]">
                                                    <div className="flex items-center gap-1">
                                                        <span className="w-3 h-3 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-[7px]">3</span>
                                                        <span className="text-white font-medium">Product Catalog</span>
                                                    </div>
                                                    <span className="text-amber-400 font-bold text-[8px]">$500</span>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-auto p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[7px] text-emerald-400 font-semibold flex items-center justify-between">
                                                <span>Pre-funded AI Budget</span>
                                                <span className="font-bold text-white">$950 total</span>
                                            </div>
                                        </div>
                                    )}

                                    {idx === 3 && (
                                        <div className="w-full h-full bg-[#0B0C15] p-3 text-left flex flex-col pt-11 pb-4 select-none">
                                            <div className="text-[10px] font-bold text-white mb-2">Execution & ROI Dashboard</div>
                                            
                                            <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/30 mb-2">
                                                <div className="text-[7px] text-emerald-400 font-bold uppercase tracking-wider">Net Profit Momentum</div>
                                                <div className="text-xs font-extrabold text-white flex items-center gap-1 mt-0.5">
                                                    <span>+$1,250</span>
                                                    <span className="text-[7px] px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300">↗ +34%</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 mb-2">
                                                <div className="flex items-center justify-between text-[8px] p-1 rounded bg-white/5">
                                                    <span className="text-slate-200 flex items-center gap-1">
                                                        <Check className="w-2.5 h-2.5 text-emerald-400" /> Payment Gateways
                                                    </span>
                                                    <span className="text-emerald-400 font-bold text-[7px]">Done</span>
                                                </div>
                                                <div className="flex items-center justify-between text-[8px] p-1 rounded bg-white/5">
                                                    <span className="text-slate-200 flex items-center gap-1">
                                                        <Check className="w-2.5 h-2.5 text-emerald-400" /> Email Campaign
                                                    </span>
                                                    <span className="text-emerald-400 font-bold text-[7px]">Done</span>
                                                </div>
                                            </div>

                                            <div className="mt-auto p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[7px]">
                                                <span className="text-slate-400">Total Spent</span>
                                                <span className="font-bold text-white">$4,850</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Glass Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none rounded-[2rem]" />
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90px] h-[4px] bg-white/40 rounded-full z-20" />
                                </div>
                            </div>
                        </div>

                        {/* Title and Body text */}
                        <div className="mt-6">
                            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm max-w-[230px] mx-auto">{step.body}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
export default OnboardingSteps;
