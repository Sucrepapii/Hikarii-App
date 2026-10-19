import React from 'react';
import { Link2, ArrowRight, Check, Users, WifiOff, Split, Wallet } from 'lucide-react';
import clsx from 'clsx';

export const BentoFeatures: React.FC = () => {
    return (
        <section id="features" className="py-16 px-6 max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-[#0E1021] via-[#111530] to-[#0A0C1B] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                {/* Background glows */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-700" />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="relative z-10">
                    <div className="text-center mb-10 md:mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-primary-200 text-sm font-semibold mb-5 tracking-wide">Premium Features</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white tracking-tight">Everything You Need</h2>
                        <p className="text-primary-200/70 text-base md:text-lg max-w-2xl mx-auto">Unlock the full potential of your productivity with our suite of powerful tools.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Large: Task-Expense Linking */}
                        <div className="md:col-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between hover:bg-white/[0.07] transition-all duration-300 group backdrop-blur-md hover:border-white/[0.14] min-h-[340px]">
                            <div>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-primary-500/30">
                                    <Link2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Task-Expense Linking</h3>
                                <p className="text-primary-100/70 leading-relaxed text-sm">Directly connect your spending to your projects. See the true cost of every task and the ROI of your time.</p>
                            </div>
                            <div className="mt-8 bg-black/50 rounded-xl border border-white/[0.08] relative h-[120px] overflow-hidden">
                                <div className="absolute inset-0 p-5 flex items-center gap-4 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:scale-95">
                                    <div className="bg-white/[0.08] p-3.5 rounded-xl border border-white/5 flex-1 w-1/2">
                                        <div className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">Project</div>
                                        <div className="font-semibold text-white text-sm truncate">Sarah's Dream Wedding</div>
                                    </div>
                                    <ArrowRight className="text-white/30 w-4 h-4 shrink-0" />
                                    <div className="bg-white/[0.08] p-3.5 rounded-xl border border-white/5 flex-1">
                                        <div className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">Spent / Remaining</div>
                                        <div className="font-semibold text-white text-sm">
                                            <span className="text-emerald-400">$2,400</span> <span className="text-slate-500 font-normal">/</span> <span className="text-slate-400 font-normal">$600</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 p-5 flex items-center gap-4 transition-all duration-500 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
                                    <div className="bg-white/[0.08] p-3.5 rounded-xl border border-white/5 flex-1 w-1/2">
                                        <div className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">Task</div>
                                        <div className="font-semibold text-white flex items-center gap-2 text-sm">
                                            <Check className="w-3.5 h-3.5 text-emerald-400" /> <span className="line-through text-slate-500/70 truncate">Book Venue</span>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-white/30 w-4 h-4 shrink-0" />
                                    <div className="bg-white/[0.08] p-3.5 rounded-xl border border-white/5 flex-1">
                                        <div className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">Task</div>
                                        <div className="font-semibold text-white relative w-fit text-sm">
                                            <span className="invisible">Order Dress</span>
                                            <span className="absolute top-0 left-0 overflow-hidden whitespace-nowrap w-0 group-hover:w-full transition-[width] duration-[1500ms] ease-linear border-r-2 border-transparent group-hover:border-primary-400/50 delay-100">
                                                Order Dress
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Collaboration */}
                        <div className="md:col-span-1 bg-gradient-to-br from-primary-900/30 to-amber-900/10 border border-primary-500/20 rounded-2xl p-7 flex flex-col justify-between hover:border-primary-500/40 transition-all duration-500 backdrop-blur-md group relative overflow-hidden min-h-[340px]">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12">
                                <Users className="w-24 h-24 text-primary-400" />
                            </div>
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/10 rounded-full blur-[50px] group-hover:bg-primary-500/20 transition-colors duration-700" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="w-11 h-11 bg-primary-500/15 rounded-xl flex items-center justify-center text-primary-400 border border-primary-500/20 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary-500/10">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Live Now</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-200 transition-colors">Real-time Collaboration</h3>
                                <p className="text-sm text-primary-200/60 leading-relaxed">
                                    Invite partners or teammates to your projects. Track shared budgets and see live updates as tasks are completed.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center -space-x-3 relative z-10 group-hover:translate-x-2 transition-transform duration-500">
                                {[
                                    { color: "bg-primary-500", label: "A" },
                                    { color: "bg-amber-500", label: "B" },
                                    { color: "bg-pink-500", label: "C" }
                                ].map((avatar, i) => (
                                    <div
                                        key={i}
                                        className={clsx(
                                            "w-10 h-10 rounded-full border-2 border-[#111530] flex items-center justify-center text-[10px] font-bold text-white shadow-xl transition-all duration-300",
                                            avatar.color,
                                            "group-hover:scale-110 group-hover:-translate-y-1"
                                        )}
                                        style={{ transitionDelay: `${i * 100}ms` }}
                                    >
                                        {avatar.label}
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-[#111530] bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300 shadow-xl group-hover:translate-x-1 transition-transform">
                                    +5
                                </div>
                            </div>
                        </div>

                        {/* Offline Synchronization */}
                        <div className="md:col-span-2 bg-gradient-to-br from-[#1E293B]/20 to-[#0F172A]/40 border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between hover:bg-white/[0.07] transition-all duration-300 backdrop-blur-md group hover:border-primary-500/30 min-h-[340px]">
                            <div>
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-sky-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-primary-500/30">
                                    <WifiOff className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Offline Synchronization</h3>
                                <p className="text-primary-100/70 leading-relaxed text-sm">Keep working, tracking projects, and logging expenses even without internet connection. Hikarii queues your updates locally and automatically syncs them to the cloud the moment you reconnect.</p>
                            </div>
                            <div className="mt-8 bg-black/50 rounded-xl border border-white/[0.08] relative h-[120px] overflow-hidden flex items-center justify-between p-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20 group-hover:scale-95 transition-all">
                                        <WifiOff className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">Offline Workspace</div>
                                        <div className="text-xs text-slate-500">2 changes pending sync</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Sync Pending</span>
                                </div>
                            </div>
                        </div>

                        {/* AI Autopilot Scoper */}
                        <div className="md:col-span-1 bg-gradient-to-b from-[#0F172A] to-[#0A0C1B] border border-white/[0.08] rounded-2xl p-7 flex flex-col hover:border-emerald-500/30 transition-all duration-500 backdrop-blur-md group relative overflow-hidden min-h-[380px]">
                            <div className="absolute inset-0 bg-emerald-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative z-10 mb-auto">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 text-emerald-400 border border-emerald-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                    <Split className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white tracking-tight">AI Autopilot Scoper</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">Enter a single sentence prompt and let Gemini auto-generate complete phases, checklist tasks, and pre-funded budget targets instantly!</p>
                            </div>
                            <div className="mt-8 space-y-3 font-mono text-[10px] relative z-10">
                                <div className="bg-white/5 p-3 rounded-lg border border-white/[0.1] flex items-center justify-between shadow-xl">
                                    <span className="text-white font-bold truncate mr-2">Personal Portfolio (AI)</span>
                                    <span className="text-emerald-400 text-[8px] bg-emerald-400/10 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter shrink-0">Processing...</span>
                                </div>
                                <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-emerald-500/50 before:via-emerald-500/20 before:to-transparent">
                                    {[
                                        { label: "Design UI Wires in Figma", amount: "$150", delay: "delay-[200ms]" },
                                        { label: "Setup Vercel Production", amount: "$50", delay: "delay-[400ms]" },
                                        { label: "Draft Copywriting Content", amount: "$100", delay: "delay-[600ms]" },
                                    ].map((item, i) => (
                                        <div key={i} className={clsx(
                                            "bg-[#13151F] p-2.5 rounded-lg border border-white/[0.05] flex items-center justify-between opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-700 ease-out shadow-lg",
                                            item.delay
                                        )}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" />
                                                <span className="text-slate-300 truncate">{item.label}</span>
                                            </div>
                                            <span className="text-emerald-400 font-bold">{item.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Financial Ledger */}
                        <div className="col-span-1 md:col-span-3 bg-[#0D0F1A] border border-white/5 rounded-2xl p-7 flex flex-col md:flex-row gap-8 justify-between hover:border-emerald-500/30 transition-all duration-500 group overflow-hidden relative">
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-colors" />
                            <div className="relative z-10 flex-1">
                                <div className="w-11 h-11 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-5 text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                    <Wallet className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-white text-xl mb-3 tracking-tight">Unified Financial Ledger</h3>
                                <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-md">
                                    Track daily expenditures and income across all your projects in real-time. Calculate totals instantly, filter by active tasks, and seamlessly connect every transaction with your daily workflow to eliminate financial chaos.
                                </p>
                            </div>
                            <div className="relative z-10 w-full md:w-[340px] shrink-0 bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 flex flex-col justify-center">
                                <div className="flex justify-between items-center pb-4 mb-4 border-b border-white/[0.05]">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Total Balance</span>
                                    <span className="text-emerald-400 font-bold text-lg">$4,520.00</span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                                            <span className="text-slate-300 text-sm font-medium">Client Retainer</span>
                                        </div>
                                        <span className="text-white text-sm font-bold">+$2,000.00</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-black/20 p-2.5 rounded-lg border border-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
                                            <span className="text-slate-300 text-sm font-medium">Server Hosting</span>
                                        </div>
                                        <span className="text-white text-sm font-bold">-$150.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
