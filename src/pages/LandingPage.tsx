
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Check, Zap, Shield, Globe, ChevronRight } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuthStore } from '../stores/authStore';

// Assets (Using URLs for the generated images - in a real app these would be imported or in public)
// Note: In this environment, we will assume the files are placed in public or handled via typical asset workflow.
// For the sake of this edit, I'll allow the user to visualize where they go.

const HeroDashboard = "/hero_dashboard_1769981528943.png"; // Placeholder for the actual moved file
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
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
                    <div className="absolute top-40 left-1/3 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] mix-blend-screen"></div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 animate-fade-in-up">
                    <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                    <span className="text-sm font-medium text-slate-300">New: AI Auto-Splitting v2.0</span>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-8 leading-[1.1] animate-fade-in-up delay-100">
                    Clarity for your <br />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Chaotic Life
                    </span>
                </h1>

                <p className="text-xl text-slate-400 max-w-2xl mb-12 animate-fade-in-up delay-200">
                    Stop drowning in tasks and debt. Hikari combines elite task management with ruthless financial tracking.
                </p>

                {/* 3D Dashboard Mockup */}
                <div
                    className="relative w-full max-w-5xl aspect-[16/9] transition-transform duration-200 ease-out animate-fade-in-up delay-300"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-purple-500/5 rounded-2xl blur-2xl transform translate-y-10 scale-95 opacity-50"></div>
                    {/* Using the generated hero image here. In a real app we'd import it. */}
                    {/* For this edit, since file path isn't valid src in browser, we'd assume a valid public path */}
                    {/* Users will need to move the files. */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0F111A]">
                        {/* If image is missing, show a placeholder gradient block */}
                        <img
                            src={HeroDashboard}
                            alt="Hikari Dashboard"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-gray-900', 'to-gray-800');
                                e.currentTarget.parentElement!.innerHTML += '<div class="flex items-center justify-center h-full text-white/20 font-display text-4xl">Dashboard Preview</div>';
                            }}
                        />

                        {/* Glass Overlay sheen */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
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
            <section className="py-32 px-6 max-w-7xl mx-auto bg-[#0F111A] rounded-[3rem] my-20 border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-display font-bold mb-4">Everything in one place</h2>
                        <p className="text-slate-400">Replace 5 different apps with Hikari.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[800px] md:h-[600px]">
                        {/* Large Card */}
                        <div className="col-span-1 md:col-span-2 row-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:bg-white/10 transition-colors group cursor-default">
                            <div>
                                <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">AI-Powered Breakdown</h3>
                                <p className="text-slate-400">Just type "Plan Vacation" and our Gemini-powered engine creates a full itinerary with estimated costs and time blocks.</p>
                            </div>
                            <div className="mt-8 bg-black/40 rounded-xl p-4 border border-white/5">
                                <div className="flex gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs">AI</div>
                                    <div className="bg-white/10 rounded-lg p-3 text-sm text-slate-300">
                                        Sure, I've split "Launch Website" into 5 actionable subtasks.
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-8 bg-white/5 rounded w-full animate-pulse" style={{ animationDelay: `${i * 100}ms` }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="col-span-1 md:col-span-1 row-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-indigo-500/50 transition-colors">
                            <div className="mb-auto">
                                <h3 className="text-xl font-bold mb-2">Calendar Sync</h3>
                                <p className="text-sm text-slate-400">Two-way sync with Google Calendar.</p>
                            </div>
                            <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                                {Array.from({ length: 28 }).map((_, i) => (
                                    <div key={i} className={`aspect-square rounded-sm ${i === 14 ? 'bg-indigo-500 text-white' : 'bg-white/5'}`}>
                                        {i === 14 ? 15 : ''}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wide Card */}
                        <div className="col-span-1 md:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors">
                            <Shield className="w-10 h-10 text-green-400 mb-4" />
                            <h3 className="font-bold">Bank-Grade Security</h3>
                        </div>

                        {/* Last Card */}
                        <div className="col-span-1 md:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors">
                            <Globe className="w-10 h-10 text-pink-400 mb-4" />
                            <h3 className="font-bold">Access Anywhere</h3>
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
