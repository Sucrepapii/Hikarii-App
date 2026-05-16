
import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Link2, Calendar, Zap, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RULES = [
    {
        rule: "Rule 1",
        title: "Give Every Task a Job",
        description: "Directly connect your spending to your productivity. Stop guessing where your money goes and start seeing what it achieves. Every task you create is a container for value.",
        icon: <Link2 className="w-8 h-8" />,
        color: "indigo"
    },
    {
        rule: "Rule 2",
        title: "Embrace Your True Expenses",
        description: "Large project costs shouldn't be surprises. Break down massive goals into manageable, pre-funded milestones. We help you look ahead at the total cost of ownership for any goal.",
        icon: <Calendar className="w-8 h-8" />,
        color: "purple"
    },
    {
        rule: "Rule 3",
        title: "Roll With the Punches",
        description: "Life happens, and plans change. Move budget between tasks in real-time without losing track of your overall goals. Flexibility is the key to maintaining momentum.",
        icon: <Zap className="w-8 h-8" />,
        color: "fuchsia"
    },
    {
        rule: "Rule 4",
        title: "Age Your Productivity",
        description: "Gain peace of mind by tracking the ROI of your time. Spend against clarity, not your current stress level. The longer you use Hikari, the more predictable your success becomes.",
        icon: <Star className="w-8 h-8" />,
        color: "emerald"
    },
    {
        rule: "Rule 5",
        title: "Scale with Collaboration",
        description: "Success is better when shared. Invite teammates to projects, discuss tasks in real-time, and manage permissions with absolute precision. Financial transparency builds team trust.",
        icon: <Users className="w-8 h-8" />,
        color: "blue"
    }
];

export const Method: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#0D0F1A] text-white selection:bg-indigo-500/30">
            <Navbar />
            
            <main className="pt-32 pb-20 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-20 animate-fade-in">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-semibold mb-6 tracking-wide">Our Philosophy</span>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">The Hikari Method</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Clarity is not a state of being; it's a practice. We built Hikari on five foundational rules that transform how you manage your most precious resources: time and money.
                    </p>
                </div>

                <div className="space-y-12 mb-20">
                    {RULES.map((rule, idx) => (
                        <div key={rule.rule} className="grid grid-cols-1 md:grid-cols-[100px,1fr] gap-8 items-start p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-${rule.color}-500/10 text-${rule.color}-400 shrink-0`}>
                                {rule.icon}
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{rule.rule}</span>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <h2 className="text-2xl font-bold mb-4 group-hover:text-indigo-300 transition-colors">{rule.title}</h2>
                                <p className="text-lg text-slate-400 leading-relaxed">
                                    {rule.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] p-12 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6 italic">"The secret to wealth is simple: Spend less than you earn. The secret to peace is simpler: Know exactly why you're spending."</h2>
                        <p className="text-indigo-100 mb-8 font-medium">— The Hikari Philosophy</p>
                        <Link 
                            to="/signup" 
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-full hover:scale-105 transition-transform shadow-xl"
                        >
                            Start Living with Clarity <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-black/10 rounded-full blur-[100px]" />
                </div>
            </main>

            <Footer />
        </div>
    );
};
