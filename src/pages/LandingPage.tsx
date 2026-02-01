
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Check, Zap, ChevronRight, Link2, FileText, Split, ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';

// Assets (Using URLs for the generated images - in a real app these would be imported or in public)
// Note: In this environment, we will assume the files are placed in public or handled via typical asset workflow.
// For the sake of this edit, I'll allow the user to visualize where they go.

const HeroDashboard = "/hero_dashboard_v2.png"; // Updated with user provided screenshot
const MethodClarity = "/method_clarity_1769981543788.png";
const MethodFocus = "/method_focus_1769981556726.png";
const MethodFreedom = "/method_freedom_1769981571479.png";

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const isAuthenticated = !!token;

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
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-purple-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                            Hikari
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
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
                </div>
            </nav>

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
                {/* Background Gradients - Toned Down */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute top-40 left-1/3 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 backdrop-blur-sm mb-8 animate-fade-in-up shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Hikari 2.0 is here</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100 text-slate-900 dark:text-white">
                    Clarity for your <br />
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        Financial Life
                    </span>
                </h1>

                <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-12 animate-fade-in-up delay-200">
                    Stop drowning in chaos. Hikari combines elite task management with ruthless financial tracking in one beautiful workspace.
                </p>

                {/* 3D Dashboard Mockup */}
                <div
                    className="relative w-full max-w-5xl aspect-[16/9] transition-transform duration-200 ease-out animate-fade-in-up delay-300 group"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Reduced shadow intensity */}
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/5 rounded-2xl blur-2xl transform translate-y-10 scale-95 opacity-50 transition-opacity duration-500 group-hover:opacity-70"></div>

                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0F111A]">
                        <img
                            src={HeroDashboard}
                            alt="Hikari Dashboard"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-slate-100', 'to-slate-200', 'dark:from-gray-900', 'dark:to-gray-800');
                                e.currentTarget.parentElement!.innerHTML += '<div class="flex items-center justify-center h-full text-slate-400 font-display text-4xl">Dashboard Preview</div>';
                            }}
                        />

                        {/* Subtle Glass Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"></div>
                    </div>
                </div>
            </section>

            {/* METHODOLOGY SECTION */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-display font-bold mb-4">The Hikari Method</h2>
                    <p className="text-slate-400">Total control in three steps.</p>
                </div>

                <div className="space-y-32">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 order-2 md:order-1">
                            <div className="text-indigo-400 font-mono text-sm mb-4">01. CLARITY</div>
                            <h3 className="text-3xl font-bold mb-4">Visualize the Chaos</h3>
                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                Dump every task, thought, and expense into one secure vault.
                                Stop holding it all in your head. See your entire life mapped out
                                before you start executing.
                            </p>
                            <ul className="space-y-3">
                                {['Unified Inbox', 'Brain Dump Mode', 'Endless Scroll Prevention'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-indigo-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 order-1 md:order-2 relative group">
                            <div className="absolute inset-0 bg-indigo-500/20 blur-[80px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700"></div>
                            <img src={MethodClarity} alt="Clarity" className="relative z-10 w-full h-auto rounded-2xl border border-white/10 shadow-2xl transition-transform hover:scale-[1.02] duration-500" />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="flex-1 relative group">
                            <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full group-hover:bg-purple-500/30 transition-all duration-700"></div>
                            <img src={MethodFocus} alt="Focus" className="relative z-10 w-full h-auto rounded-2xl border border-white/10 shadow-2xl transition-transform hover:scale-[1.02] duration-500" />
                        </div>
                        <div className="flex-1">
                            <div className="text-purple-400 font-mono text-sm mb-4">02. FOCUS</div>
                            <h3 className="text-3xl font-bold mb-4">Split to Conquer</h3>
                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                Overwhelmed by "Write Thesis"? Hikari's AI splits massive projects
                                into 15-minute bite-sized blocks. Focus on one block, forget the rest.
                            </p>
                            <ul className="space-y-3">
                                {['AI Smart Splitter', 'Focus Mode', 'Pomodoro Timer'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-purple-400" />
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
                            <div className="text-pink-400 font-mono text-sm mb-4">03. FREEDOM</div>
                            <h3 className="text-3xl font-bold mb-4">Watch it Grow</h3>
                            <p className="text-lg text-slate-400 leading-relaxed mb-6">
                                Productivity is profit. Track every dollar saved and earned alongside
                                your tasks. See the direct correlation between your focus and your finances.
                            </p>
                            <ul className="space-y-3">
                                {['Expense Tracking', 'Net Worth Graph', 'Subscription Manager'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-pink-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-1 order-1 md:order-2 relative group">
                            <div className="absolute inset-0 bg-pink-500/20 blur-[80px] rounded-full group-hover:bg-pink-500/30 transition-all duration-700"></div>
                            <img src={MethodFreedom} alt="Freedom" className="relative z-10 w-full h-auto rounded-2xl border border-white/10 shadow-2xl transition-transform hover:scale-[1.02] duration-500" />
                        </div>
                    </div>
                </div>
            </section>

            {/* BENTO FEATURES */}
            <section className="py-32 px-6 max-w-7xl mx-auto bg-white/50 dark:bg-[#0F111A]/50 backdrop-blur-3xl rounded-[3rem] my-20 border border-slate-200 dark:border-white/5 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]"></div>

                <div className="relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-4 text-slate-900 dark:text-white">Premium Power</h2>
                        <p className="text-slate-500 dark:text-slate-400">Unlock the full potential of your productivity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px] p-6">
                        {/* Large Card: Task-Expense Linking */}
                        <div className="col-span-1 md:col-span-2 row-span-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group">
                            <div>
                                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
                                    <Link2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Task-Expense Linking</h3>
                                <p className="text-slate-500 dark:text-slate-400">Directly connect your spending to your projects. See the true cost of every task and the ROI of your time.</p>
                            </div>
                            <div className="mt-8 bg-slate-50 dark:bg-black/40 rounded-xl p-6 border border-slate-100 dark:border-white/5 flex items-center gap-4">
                                <div className="bg-white dark:bg-white/10 p-3 rounded-lg shadow-sm">
                                    <div className="text-xs text-slate-400 mb-1">Project</div>
                                    <div className="font-semibold text-slate-900 dark:text-white">Website Launch</div>
                                </div>
                                <ArrowRight className="text-slate-300 w-5 h-5" />
                                <div className="bg-white dark:bg-white/10 p-3 rounded-lg shadow-sm">
                                    <div className="text-xs text-slate-400 mb-1">Cost</div>
                                    <div className="font-semibold text-red-500">-$450.00</div>
                                </div>
                            </div>
                        </div>

                        {/* Tall Card: Advanced Reporting */}
                        <div className="col-span-1 md:col-span-1 row-span-2 bg-slate-50 dark:bg-gradient-to-br dark:from-white/5 dark:to-white/10 border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col hover:border-indigo-300 dark:hover:border-indigo-500/30 transition-colors">
                            <div className="mb-auto">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Advanced Reporting</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Export professional CSV/PDF reports for tax season or client billing.</p>
                            </div>
                            <div className="mt-6 space-y-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-2 items-center opacity-50">
                                        <div className="w-8 h-8 rounded bg-slate-200 dark:bg-white/10"></div>
                                        <div className="h-2 bg-slate-200 dark:bg-white/10 rounded w-full"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wide Card: AI Insights */}
                        <div className="col-span-1 md:col-span-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-center hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                            <Zap className="w-8 h-8 text-amber-500 mb-3" />
                            <h3 className="font-bold text-slate-900 dark:text-white">AI Insights</h3>
                            <p className="text-xs text-slate-500 mt-1">Predictive analytics for your wallet.</p>
                        </div>

                        {/* Last Card: Context Splitting */}
                        <div className="col-span-1 md:col-span-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col justify-center hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                            <Split className="w-8 h-8 text-green-500 mb-3" />
                            <h3 className="font-bold text-slate-900 dark:text-white">Smart Split</h3>
                            <p className="text-xs text-slate-500 mt-1">Break down tasks contextually.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 text-center">
                <h2 className="text-5xl md:text-7xl font-display font-bold mb-8">
                    Start <span className="text-indigo-500">Living</span>.<br />
                    Stop <span className="text-slate-600">Managing</span>.
                </h2>
                <Button onClick={() => navigate('/signup')} size="lg" className="rounded-full px-10 h-14 text-lg bg-white text-black hover:bg-slate-200">
                    Get Started Free <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 text-center text-slate-500">
                <p>&copy; {new Date().getFullYear()} Hikari App. Crafted for the focused.</p>
            </footer>
        </div>
    );
};
