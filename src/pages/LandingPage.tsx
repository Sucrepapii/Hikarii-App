
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Link2, FileText, Split, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/layout/Footer';
import { useAuthStore } from '../stores/authStore';

// Assets (Using URLs for the generated images - in a real app these would be imported or in public)
// Note: In this environment, we will assume the files are placed in public or handled via typical asset workflow.
// For the sake of this edit, I'll allow the user to visualize where they go.

const HeroDashboard = "/hero_dashboard_v2.png"; // Updated with user provided screenshot
const MethodClarity = "/method_clarity_1769981543788.png";
const MethodFocus = "/method_focus_1769981556726.png";
const MethodFreedom = "/method_freedom_v2.jpg";

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const isAuthenticated = !!token;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // 3D Tilt Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget: target, clientX: x, clientY: y } = e;
        const { left, top, width, height } = target.getBoundingClientRect();

        const cx = width / 2;
        const cy = height / 2;
        const dx = x - left - cx;
        const dy = y - top - cy;

        const rotateX = -(dy / cy) * 5; // Max 5 deg
        const rotateY = (dx / cx) * 5;

        target.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-purple-100 dark:from-[#0B0C15] dark:via-[#111322] dark:to-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" />
                    </div>

                    {/* Desktop Utility Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Pricing
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Who is Hikari For?
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">Login</Link>
                        )}
                        <Button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                            className="bg-white text-black hover:bg-slate-200 dark:bg-white dark:text-black rounded-full px-6"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Get Started'}
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300 focus:outline-none">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#0B0C15] border-b border-slate-200 dark:border-white/5 py-4 px-6 flex flex-col gap-4 shadow-xl animate-fade-in-up">
                        <Link to="/pricing" className="text-lg font-medium text-slate-600 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-white/5" onClick={() => setIsMenuOpen(false)}>
                            Pricing
                        </Link>
                        <Link to="/about" className="text-lg font-medium text-slate-600 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-white/5" onClick={() => setIsMenuOpen(false)}>
                            Who is Hikari For?
                        </Link>
                        <Link to="/login" className="text-lg font-medium text-slate-600 dark:text-slate-300 py-2 border-b border-slate-100 dark:border-white/5" onClick={() => setIsMenuOpen(false)}>
                            Login
                        </Link>
                        <Button
                            onClick={() => {
                                navigate(isAuthenticated ? '/dashboard' : '/signup');
                                setIsMenuOpen(false);
                            }}
                            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-full h-12 mt-2"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Get Started'}
                        </Button>
                    </div>
                )}
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Background Gradients - Boosted Vibrancy */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute top-40 left-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-100 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm mb-8 animate-fade-in-up shadow-sm">
                    <Zap className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900 dark:text-indigo-200">Bring clarity to your life</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100 text-slate-900 dark:text-white">
                    Master Your <br />
                    <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Life & Money
                    </span>
                </h1>

                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-12 animate-fade-in-up delay-200">
                    The all-in-one workspace for task management and financial tracking. Organize your projects, track expenses, and reach your goals.
                </p>

                <div className="flex items-center gap-6 mb-16 animate-fade-in-up delay-300">
                    <Button onClick={() => navigate('/signup')} size="lg" className="rounded-full px-8 h-12 text-base bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-lg shadow-indigo-500/30 transition-all hover:scale-105">
                        Start for Free <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Link to="/pricing" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        View Pricing
                    </Link>
                </div>

                {/* 3D Dashboard Mockup */}
                <div
                    className="relative w-full max-w-5xl aspect-[16/9] transition-transform duration-200 ease-out animate-fade-in-up delay-300 group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Vibrant Glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-purple-600/20 rounded-2xl blur-3xl transform translate-y-10 scale-95 opacity-60 transition-opacity duration-500 group-hover:opacity-80"></div>

                    <div className="relative rounded-2xl overflow-hidden border border-indigo-100/50 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0F111A]">
                        <img
                            src={HeroDashboard}
                            alt="Hikari Dashboard"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-indigo-50', 'to-purple-50', 'dark:from-gray-900', 'dark:to-gray-800');
                                e.currentTarget.parentElement!.innerHTML += '<div class="flex items-center justify-center h-full text-slate-400 font-display text-4xl">Dashboard Preview</div>';
                            }}
                        />

                        {/* Subtle Glass Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                    </div>
                </div>
            </section>

            {/* METHODOLOGY SECTION */}
            <section className="py-32 px-6 max-w-7xl mx-auto relative">
                {/* Background Decor */}
                <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

                <div className="text-center mb-20 relative z-10">
                    <h2 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">The Hikari Method</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Total control in three steps.</p>
                </div>

                <div className="space-y-32 relative z-10">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold mb-6">01. CLARITY</div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Visualize the Chaos</h3>
                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                Dump every task, thought, and expense into one secure vault.
                                Stop holding it all in your head. See your entire life mapped out
                                before you start executing.
                            </p>
                            <ul className="space-y-4">
                                {['Unified Inbox', 'Brain Dump Mode', 'Endless Scroll Prevention'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 order-1 md:order-2 relative group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 blur-[60px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                            <img src={MethodClarity} alt="Clarity" className="relative z-10 w-full h-auto rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl transition-transform hover:scale-[1.02] duration-500 hover:shadow-indigo-500/20" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 relative group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-[60px] rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>
                            <img src={MethodFocus} alt="Focus" className="relative z-10 w-full h-auto rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl transition-transform hover:scale-[1.02] duration-500 hover:shadow-purple-500/20" />
                        </div>
                        <div className="flex-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold mb-6">02. FOCUS</div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Split to Conquer</h3>
                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                Overwhelmed by "Write Thesis"? Hikari's AI splits massive projects
                                into 15-minute bite-sized blocks. Focus on one block, forget the rest.
                            </p>
                            <ul className="space-y-4">
                                {['AI Smart Splitter', 'Focus Mode', 'Pomodoro Timer'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="inline-block px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-mono text-xs font-bold mb-6">03. FREEDOM</div>
                            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Watch it Grow</h3>
                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
                                Productivity is profit. Track every dollar saved and earned alongside
                                your tasks. See the direct correlation between your focus and your finances.
                            </p>
                            <ul className="space-y-4">
                                {['Expense Tracking', 'Net Worth Graph', 'Subscription Manager'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center shrink-0">
                                            <Check className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 order-1 md:order-2 relative group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-orange-500/20 blur-[60px] rounded-full group-hover:bg-pink-500/30 transition-all duration-700"></div>
                            <img src={MethodFreedom} alt="Freedom" className="relative z-10 w-full h-auto rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl transition-transform hover:scale-[1.02] duration-500 hover:shadow-pink-500/20" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO FEATURES */}
            <section id="features" className="py-32 px-6 max-w-7xl mx-auto bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[3rem] my-20 relative overflow-hidden shadow-2xl">
                {/* Enhanced Background Effects - Reduced Purple */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-700"></div>

                <div className="relative z-10 p-4">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 text-sm font-medium mb-6">Premium Features</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-white tracking-tight">Everything You Need</h2>
                        <p className="text-indigo-200 text-lg max-w-2xl mx-auto">Unlock the full potential of your productivity with our suite of powerful tools.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                        {/* Large Card: Task-Expense Linking */}
                        <div className="col-span-1 md:col-span-2 row-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/10 transition-all duration-300 group backdrop-blur-md hover:scale-[1.01] hover:shadow-xl hover:shadow-black/20">
                            <div>
                                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg">
                                    <Link2 className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white">Task-Expense Linking</h3>
                                <p className="text-indigo-100 leading-relaxed">Directly connect your spending to your projects. See the true cost of every task and the ROI of your time.</p>
                            </div>
                            <div className="mt-8 bg-black/40 rounded-2xl border border-white/10 backdrop-blur-sm relative h-[120px] overflow-hidden">
                                {/* Entry 1: Static (Default Visible) */}
                                <div className="absolute inset-0 p-6 flex items-center gap-4 transition-all duration-500 opacity-100 group-hover:opacity-0 group-hover:scale-95">
                                    <div className="bg-white/10 p-4 rounded-xl shadow-inner border border-white/5 flex-1">
                                        <div className="text-xs text-white/60 mb-1 font-medium uppercase tracking-wider">Project</div>
                                        <div className="font-semibold text-white">Website Launch</div>
                                    </div>
                                    <ArrowRight className="text-white/40 w-5 h-5" />
                                    <div className="bg-white/10 p-4 rounded-xl shadow-inner border border-white/5 flex-1">
                                        <div className="text-xs text-white/60 mb-1 font-medium uppercase tracking-wider">Cost</div>
                                        <div className="font-semibold text-red-300">-$450.00</div>
                                    </div>
                                </div>

                                {/* Entry 2: Hover Reveal / Typing Effect (Hover Visible) */}
                                <div className="absolute inset-0 p-6 flex items-center gap-4 transition-all duration-500 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
                                    <div className="bg-white/10 p-4 rounded-xl shadow-inner border border-white/5 flex-1">
                                        <div className="text-xs text-white/60 mb-1 font-medium uppercase tracking-wider">Project</div>
                                        <div className="font-semibold text-white">Office Revamp</div>
                                    </div>
                                    <ArrowRight className="text-white/40 w-5 h-5" />
                                    <div className="bg-white/10 p-4 rounded-xl shadow-inner border border-white/5 flex-1">
                                        <div className="text-xs text-white/60 mb-1 font-medium uppercase tracking-wider">Cost</div>
                                        <div className="font-semibold text-red-300 relative w-fit">
                                            <span className="invisible">-$7,500</span>
                                            <span className="absolute top-0 left-0 overflow-hidden whitespace-nowrap w-0 group-hover:w-full transition-[width] duration-[1500ms] ease-linear border-r-2 border-transparent group-hover:border-red-300/50 delay-100">
                                                -$7,500
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tall Card: Smart Split (Moved here) */}
                        <div className="col-span-1 md:col-span-1 row-span-2 bg-gradient-to-b from-green-900/40 to-emerald-900/10 border border-green-500/20 rounded-3xl p-8 flex flex-col hover:border-green-500/40 transition-all duration-300 backdrop-blur-md hover:-translate-y-1 group">
                            <div className="mb-auto">
                                <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400 shadow-lg border border-green-500/20">
                                    <Split className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Smart Split</h3>
                                <p className="text-sm text-green-100/80 leading-relaxed">Automatically break down complex projects into actionable steps.</p>
                            </div>

                            {/* Visual Task Breakdown */}
                            <div className="mt-6 space-y-3 font-mono text-xs">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-between group-hover:bg-white/10 transition-colors duration-300">
                                    <span className="text-white font-medium">Vacation to the Maldives</span>
                                    <span className="text-green-400 text-[10px] bg-green-400/10 px-1.5 py-0.5 rounded">Project</span>
                                </div>
                                <div className="relative pl-6 space-y-2 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-px before:bg-white/10">
                                    <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/10 flex items-center gap-2 opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-500 delay-100 ease-out">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></div>
                                        <span className="text-green-100/90 truncate">Visa appointment</span>
                                    </div>
                                    <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/10 flex items-center gap-2 opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-500 delay-200 ease-out">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></div>
                                        <span className="text-green-100/90 truncate">Ticket purchase</span>
                                    </div>
                                    <div className="bg-green-500/10 p-2 rounded-lg border border-green-500/10 flex items-center gap-2 opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-500 delay-300 ease-out">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></div>
                                        <span className="text-green-100/90 truncate">Hotel Reservation</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Wide Card: AI Insights */}
                        <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col justify-between hover:bg-amber-500/20 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] group">
                            <div>
                                <Zap className="w-8 h-8 text-amber-400 mb-3 drop-shadow-lg" />
                                <h3 className="font-bold text-white text-lg mb-1">AI Insights</h3>
                                <p className="text-xs text-slate-300">Predictive analytics for your wallet.</p>
                            </div>
                            {/* Visual: Trend Projection */}
                            <div className="mt-4 flex items-end gap-2 h-16 w-full px-2">
                                <div className="w-1/4 bg-white/10 rounded-t-sm h-[40%]"></div>
                                <div className="w-1/4 bg-white/10 rounded-t-sm h-[60%]"></div>
                                <div className="w-1/4 bg-white/10 rounded-t-sm h-[50%]"></div>
                                <div className="w-1/4 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-sm h-[80%] shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"></div>
                            </div>
                        </div>

                        {/* Last Card: Advanced Reporting (Moved here) */}
                        <div className="col-span-1 md:col-span-1 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-3xl p-6 flex flex-col justify-between hover:bg-blue-500/20 transition-all duration-300 backdrop-blur-md hover:scale-[1.02] group">
                            <div>
                                <FileText className="w-8 h-8 text-blue-400 mb-3 drop-shadow-lg" />
                                <h3 className="font-bold text-white text-lg mb-1">Reporting</h3>
                                <p className="text-xs text-slate-300">Export professional CSV/PDF reports.</p>
                            </div>
                            {/* Visual: Document Preview */}
                            <div className="mt-4 bg-white/5 border border-white/10 rounded-lg p-2 w-full transform group-hover:rotate-2 transition-transform duration-300">
                                <div className="flex gap-1.5 mb-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400/80"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/80"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400/80"></div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="h-1 bg-white/20 rounded w-3/4"></div>
                                    <div className="h-1 bg-white/10 rounded w-full"></div>
                                    <div className="h-1 bg-white/10 rounded w-5/6"></div>
                                    <div className="h-1 bg-white/10 rounded w-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />


        </div>
    );
};
