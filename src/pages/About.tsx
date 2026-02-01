import React from 'react';
import { ArrowLeft, Briefcase, GraduationCap, Rocket, Palette, Brain, ChevronRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

export const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">H</span>
                        </div>
                        <span className="font-display font-bold text-xl tracking-tight">Hikari</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing</Link>
                        <Link to="/about" className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Who is Hikari For?</Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hidden md:block">
                            Log in
                        </Link>
                        <Button onClick={() => navigate('/signup')} size="sm" className="rounded-full px-6 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">
                        Built for <span className="text-indigo-600 dark:text-indigo-400">Doers</span>.
                    </h1>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Hikari isn't for everyone. It's for those who want to master their time and money in one unified system.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {[
                        {
                            role: "Freelancers",
                            desc: "Track billable hours, manage client projects, and separate business expenses from personal ones. Never lose track of an invoice again.",
                            icon: "Briefcase"
                        },
                        {
                            role: "Students",
                            desc: "Balance assignments, part-time jobs, and a tight budget. Plan your semester and your savings in one place.",
                            icon: "GraduationCap"
                        },
                        {
                            role: "Entrepreneurs",
                            desc: "See the big picture. Connect your daily grind to your bottom line and net worth. Watch your business grow alongside your habits.",
                            icon: "Rocket"
                        },
                        {
                            role: "Creatives",
                            desc: "Turn chaos into art. Manage the mess of creativity without killing the spark. Track expenses for equipment and manage project timelines.",
                            icon: "Palette"
                        },
                        {
                            role: "Neurodivergent Minds",
                            desc: "Structure your chaos. AI breakdown helps you start, focus mode helps you finish. Stop the overwhelm before it starts.",
                            icon: "Brain"
                        }
                    ].map((user, i) => (
                        <div key={i} className="bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 rounded-2xl hover:border-indigo-500/30 transition-colors">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                                {user.icon === 'Briefcase' && <Briefcase className="w-6 h-6" />}
                                {user.icon === 'GraduationCap' && <GraduationCap className="w-6 h-6" />}
                                {user.icon === 'Rocket' && <Rocket className="w-6 h-6" />}
                                {user.icon === 'Palette' && <Palette className="w-6 h-6" />}
                                {user.icon === 'Brain' && <Brain className="w-6 h-6" />}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{user.role}</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{user.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="text-center bg-indigo-900 text-white rounded-[3rem] p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

                    <div className="relative z-10">
                        <h2 className="text-4xl font-display font-bold mb-6">Ready to join them?</h2>
                        <Button onClick={() => navigate('/signup')} size="lg" className="rounded-full px-8 h-12 bg-white text-indigo-900 hover:bg-indigo-50">
                            Start Your Journey <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
};
