import React from 'react';
import { Link } from 'react-router-dom';
import { Link2, Calendar, Zap, Star, Users, ArrowRight, Check } from 'lucide-react';
import { Logo } from '../common/Logo';

export interface MethodRuleItem {
    rule: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    styles: {
        bg: string;
        text: string;
        border: string;
        shadow: string;
    };
}

export const Hikarii_METHOD_RULES: MethodRuleItem[] = [
    {
        rule: "Rule 1",
        title: "Give Every Task a Budget",
        description: "Stop managing tasks in one app and budgets in another. Connect your task checklist directly to your budget.",
        icon: <Link2 className="w-6 h-6" />,
        color: "cyan",
        styles: {
            bg: "bg-primary-500/10",
            text: "text-primary-500 dark:text-primary-400",
            border: "hover:border-primary-500/50",
            shadow: "hover:shadow-primary-500/10"
        }
    },
    {
        rule: "Rule 2",
        title: "Plan Project Expenses",
        description: "Never get surprised by unexpected costs. Set clear budget limits before you start executing your goals.",
        icon: <Calendar className="w-6 h-6" />,
        color: "amber",
        styles: {
            bg: "bg-amber-500/10",
            text: "text-amber-500 dark:text-amber-400",
            border: "hover:border-amber-500/50",
            shadow: "hover:shadow-amber-500/10"
        }
    },
    {
        rule: "Rule 3",
        title: "Adjust As You Go",
        description: "Life happens and plans change. Move budget between tasks smoothly as project priorities shift.",
        icon: <Zap className="w-6 h-6" />,
        color: "sky",
        styles: {
            bg: "bg-sky-500/10",
            text: "text-sky-500 dark:text-sky-400",
            border: "hover:border-sky-500/50",
            shadow: "hover:shadow-sky-500/10"
        }
    },
    {
        rule: "Rule 4",
        title: "See Real-Time Progress",
        description: "Know exactly how much money you have spent versus how many tasks you have completed.",
        icon: <Star className="w-6 h-6" />,
        color: "emerald",
        styles: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-500 dark:text-emerald-400",
            border: "hover:border-emerald-500/50",
            shadow: "hover:shadow-emerald-500/10"
        }
    },
    {
        rule: "Rule 5",
        title: "Team Collaboration",
        description: "Invite teammates to projects, discuss tasks in real time, and keep everyone aligned on budget goals.",
        icon: <Users className="w-6 h-6" />,
        color: "blue",
        styles: {
            bg: "bg-accent-500/10",
            text: "text-accent-500 dark:text-accent-400",
            border: "hover:border-accent-500/50",
            shadow: "hover:shadow-accent-500/10"
        }
    }
];

export const MethodRules: React.FC = () => {
    return (
        <section className="py-16 px-6 max-w-7xl mx-auto relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-[420px,1fr] lg:grid-cols-[480px,1fr] gap-16 lg:gap-24 items-center">
                {/* Left: text */}
                <div className="space-y-10">
                    <div>
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-6 tracking-wide">The Philosophy</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5 leading-tight tracking-tight">The Hikarii Method</h2>
                        <p className="text-base md:text-lg text-slate-400 leading-relaxed">
                            92% of Hikarii users feel more in control of their time and money within the first week. Our method is built on clarity and intentionality. <Link to="/help/article/ultimate-guide-Hikarii-method" className="text-primary-400 font-semibold hover:underline">Read the Guide &rarr;</Link>
                        </p>
                    </div>

                    <div className="space-y-6">
                        {Hikarii_METHOD_RULES.slice(0, 3).map((rule, idx) => (
                            <div key={idx} className="group flex gap-5 p-5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 cursor-default">
                                <div className={`shrink-0 w-12 h-12 rounded-xl ${rule.styles.bg} flex items-center justify-center ${rule.styles.text} group-hover:scale-110 transition-transform duration-400`}>
                                    {rule.icon}
                                </div>
                                <div>
                                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 mb-1">{rule.rule}</div>
                                    <h3 className="text-lg font-bold text-white mb-1.5 tracking-tight">{rule.title}</h3>
                                    <p className="text-slate-400 leading-relaxed text-sm">{rule.description}</p>
                                </div>
                            </div>
                        ))}
                        <Link to="/method" className="inline-flex items-center gap-2 text-primary-400 font-bold hover:text-primary-300 transition-colors ml-5 pt-4">
                            Learn all 5 rules of our philosophy <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Right: mockup */}
                <div className="relative group pb-16">
                    <div className="absolute -inset-8 bg-gradient-to-r from-primary-500/8 via-amber-500/8 to-pink-500/8 rounded-3xl blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative w-full aspect-[16/10] bg-[#0F111A] rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transform perspective-[2000px] rotate-y-[-5deg] rotate-x-[2deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-all duration-700 ease-out">
                        <div className="h-full bg-[#0B0C15]">
                            <img src="/hikari_hero_desk.png?v=2" alt="Hikarii Desktop Dashboard" loading="lazy" className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* Floating iPhone */}
                    <div className="absolute -bottom-12 -right-6 md:-right-10 w-[170px] md:w-[200px] z-30 transform perspective-[2000px] rotate-y-[5deg] rotate-x-[-2deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-all duration-700 ease-out group-hover:translate-x-3 group-hover:-translate-y-4">
                        <div className="relative rounded-[2.5rem] bg-[#1C1C1E] p-[8px] shadow-2xl border border-white/10">
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[60px] h-[16px] bg-black rounded-full" />
                            <div className="relative rounded-[2rem] overflow-hidden bg-[#0B0C15] aspect-[9/19.5]">
                                {/* Native Vector Crisp App Screen */}
                                <div className="w-full h-full bg-[#0B0C15] p-3 text-left flex flex-col justify-between pt-8 pb-3 select-none">
                                    <div>
                                        <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-white/10">
                                            <div className="flex items-center gap-1.5">
                                                <Logo variant="icon" size="sm" suppressLink />
                                                <span className="font-extrabold text-white text-xs tracking-tight">Hikarii</span>
                                            </div>
                                            <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">PRO ACTIVE</span>
                                        </div>

                                        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500/15 via-primary-500/10 to-transparent border border-emerald-500/30 mb-2.5">
                                            <div className="text-[7px] text-emerald-400 font-bold uppercase tracking-wider">Net Profit Momentum</div>
                                            <div className="text-base font-black text-white flex items-center gap-1 mt-0.5">
                                                <span>+$1,250</span>
                                                <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-emerald-500/20 text-emerald-300">↗ +34%</span>
                                            </div>
                                            <p className="text-[7px] text-slate-400 mt-0.5">Tasks-to-budget trajectory: Strong</p>
                                        </div>

                                        <div className="space-y-1.5 mb-2">
                                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Active Milestones</div>
                                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[8px]">
                                                <div className="flex items-center gap-1.5 text-white font-medium">
                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                    <span>Payment Integration</span>
                                                </div>
                                                <span className="text-amber-400 font-bold">$450</span>
                                            </div>
                                            <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[8px]">
                                                <div className="flex items-center gap-1.5 text-white font-medium">
                                                    <Check className="w-3 h-3 text-emerald-400" />
                                                    <span>Launch Campaign</span>
                                                </div>
                                                <span className="text-primary-400 font-bold">$1,200</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-[8px]">
                                        <span className="text-slate-400">Total Budget Managed</span>
                                        <span className="font-extrabold text-white">$4,850</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default MethodRules;
