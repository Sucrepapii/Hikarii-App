
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Link2, FileText, Split, ArrowRight, Menu, X, ChevronDown, Star, Calendar } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/layout/Footer';
import { useAuthStore } from '../stores/authStore';

const ONBOARDING_STEPS = [
    {
        title: "Create account",
        body: "Sign up easily and get instant access to your centralized dashboard.",
        image: "/step1_realistic_1774274821092.png"
    },
    {
        title: "Dump your thoughts",
        body: "Add all your pending tasks, goals, and recurring expenses into one secure vault.",
        image: "/step2_realistic_1774274840396.png"
    },
    {
        title: "Organize & Split",
        body: "Use our AI to break down massive projects into focused, bite-sized blocks.",
        image: "/step3_realistic_1774274858410.png"
    },
    {
        title: "Execute & Track",
        body: "Check off tasks and watch your financial progress update in real-time.",
        image: "/step4_realistic_1774274876575.png"
    }
];

const SEED_TESTIMONIALS = [
    {
        topic: "FINANCIAL GOALS",
        quote: "Hikari helped me save my first ₦500,000 in 3 months. Having my tasks and budget perfectly synchronized changed the way I work.",
        name: "OLUWASEUN ADEYEMI",
        location: "Lagos",
        rating: 5,
        initials: "OA",
        color: "from-indigo-500 to-purple-500"
    },
    {
        topic: "AI SPLIT",
        quote: "I used to be paralyzed by my own ambitions. The AI smart split broke down my entire product launch into daily 15-minute blocks. Unbelievable.",
        name: "MARCUS THORNE",
        location: "Abuja",
        rating: 5,
        initials: "MT",
        color: "from-fuchsia-500 to-purple-500"
    },
    {
        topic: "SUBSCRIPTION TRACKING",
        quote: "Finally, a tool that respects my time. Finding out I was losing $200/mo on dead subscriptions while organizing my daily tasks was a wake-up call.",
        name: "ELENA RODRIGUEZ",
        location: "Nairobi",
        rating: 5,
        initials: "ER",
        color: "from-orange-500 to-rose-500"
    }
];

const GRADIENT_COLORS = [
    "from-indigo-500 to-purple-500",
    "from-fuchsia-500 to-purple-500",
    "from-orange-500 to-rose-500",
    "from-teal-500 to-emerald-500",
    "from-sky-500 to-blue-500",
    "from-pink-500 to-rose-500",
];

function getInitials(name: string): string {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const HIKARI_METHOD_RULES = [
    {
        rule: "Rule 1",
        title: "Give Every Task a Job",
        description: "Directly connect your spending to your productivity. Stop guessing where your money goes and start seeing what it achieves.",
        icon: <Link2 className="w-6 h-6" />,
        color: "indigo",
        styles: {
            bg: "bg-indigo-500/10",
            text: "text-indigo-500 dark:text-indigo-400",
            border: "hover:border-indigo-500/50",
            shadow: "hover:shadow-indigo-500/10"
        }
    },
    {
        rule: "Rule 2",
        title: "Embrace Your True Expenses",
        description: "Large project costs shouldn't be surprises. Break down massive goals into manageable, pre-funded milestones.",
        icon: <Calendar className="w-6 h-6" />,
        color: "purple",
        styles: {
            bg: "bg-purple-500/10",
            text: "text-purple-500 dark:text-purple-400",
            border: "hover:border-purple-500/50",
            shadow: "hover:shadow-purple-500/10"
        }
    },
    {
        rule: "Rule 3",
        title: "Roll With the Punches",
        description: "Life happens, and plans change. Move budget between tasks in real-time without losing track of your overall goals.",
        icon: <Zap className="w-6 h-6" />,
        color: "fuchsia",
        styles: {
            bg: "bg-fuchsia-500/10",
            text: "text-fuchsia-500 dark:text-fuchsia-400",
            border: "hover:border-fuchsia-500/50",
            shadow: "hover:shadow-fuchsia-500/10"
        }
    },
    {
        rule: "Rule 4",
        title: "Age Your Productivity",
        description: "Gain peace of mind by tracking the ROI of your time. Spend against clarity, not your current stress level.",
        icon: <Star className="w-6 h-6" />,
        color: "emerald",
        styles: {
            bg: "bg-emerald-500/10",
            text: "text-emerald-500 dark:text-emerald-400",
            border: "hover:border-emerald-500/50",
            shadow: "hover:shadow-emerald-500/10"
        }
    }
];

const STATS = [
    { value: "1K+", label: "Active Users" },
    { value: "92%", label: "Feel More in Control" },
    { value: "$1.2M", label: "Budgets Managed" },
    { value: "4.9★", label: "Average Rating" },
];

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const isAuthenticated = !!token;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
    const [testimonials, setTestimonials] = useState<any[]>(SEED_TESTIMONIALS);

    // Fetch real feedback from the API
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/feedback`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const mapped = data.map((fb: any, idx: number) => ({
                            topic: (fb.topic || (fb.rating >= 4 ? "HIGHLY RATED" : "USER REVIEW")).toUpperCase(),
                            quote: fb.comment,
                            name: fb.name.toUpperCase(),
                            location: new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                            rating: fb.rating,
                            initials: getInitials(fb.name),
                            color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length]
                        }));
                        setTestimonials(mapped);
                    }
                }
            } catch {
                // Keep seed testimonials on error
            }
        };
        fetchFeedback();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#080910] font-sans text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-purple-500/30">

            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-[#080910]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
                    <div className="flex items-center gap-2 group">
                        <Logo variant="full" size="md" />
                        <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer overflow-hidden whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs transition-all duration-700 ease-out pl-2 border-l border-slate-200 dark:border-white/10 hidden md:block">
                            Clarity. Focus. Control.
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/pricing" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Pricing
                        </Link>
                        <Link to="/about" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Who is Hikari For?
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/login" className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Login</Link>
                        )}
                        <Button
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                            className="bg-indigo-600 text-white hover:bg-indigo-500 rounded-full px-5 h-9 text-sm font-semibold border-0 shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Get Started'}
                        </Button>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600 dark:text-slate-300 focus:outline-none">
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden absolute top-[68px] left-0 w-full bg-white dark:bg-[#0D0F1A] border-b border-slate-200 dark:border-white/5 py-4 px-6 flex flex-col gap-4 shadow-2xl animate-fade-in-up">
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
                            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 rounded-full h-12 mt-2 border-0"
                        >
                            {isAuthenticated ? 'Dashboard' : 'Get Started'}
                        </Button>
                    </div>
                )}
            </nav>

            {/* ── HERO ───────────────────────────────────────────────── */}
            <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-[68px] pb-16 overflow-hidden">
                {/* Layered background */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50/60 dark:from-[#080910] dark:via-[#0D0F1C] dark:to-[#0A0B16] pointer-events-none" />
                {/* Animated orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-indigo-400/10 dark:bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
                {/* Subtle dot-grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.025] dark:opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10 mb-8 animate-fade-in-up shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 tracking-wide">Clarity. Focus. Control.</span>
                    </div>

                    <h1 className="text-6xl md:text-[84px] font-display font-extrabold tracking-tight mb-6 leading-[1.05] animate-fade-in-up delay-100 text-slate-900 dark:text-white">
                        Master Your <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Life & Money
                        </span>
                    </h1>

                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 animate-fade-in-up delay-200 leading-relaxed">
                        The all-in-one workspace for task management and financial tracking. Organize your projects, track expenses, and reach your goals.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-in-up delay-300">
                        <Button
                            onClick={() => navigate('/signup')}
                            size="lg"
                            className="rounded-full px-8 h-[52px] text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-xl shadow-indigo-500/30 transition-all hover:scale-105 hover:shadow-indigo-500/40"
                        >
                            Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <Link
                            to="/pricing"
                            className="inline-flex items-center gap-1.5 h-[52px] px-8 rounded-full border border-slate-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all bg-white/60 dark:bg-white/[0.04] backdrop-blur-sm"
                        >
                            View Pricing
                        </Link>
                    </div>

                    {/* Floating social-proof pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-300">
                        {["⭐ 4.9 rating", "🔒 Bank-grade security", "⚡ Free to start"].map((pill) => (
                            <span key={pill} className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 bg-white/80 dark:bg-white/5 border border-slate-200/80 dark:border-white/[0.07] backdrop-blur-sm shadow-sm">
                                {pill}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ────────────────────────────────────────── */}
            <div className="border-y border-slate-200 dark:border-white/[0.06] bg-white dark:bg-[#0D0F1A] py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">{s.value}</div>
                            <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FOUR STEPS ─────────────────────────────────────────── */}
            <section className="py-28 px-6 max-w-7xl mx-auto relative z-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] pointer-events-none">
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-400/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-400/8 rounded-full blur-[120px]" />
                </div>

                <div className="text-center mb-20 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-5 tracking-wide">How It Works</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Four simple steps to get started</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Join Hikari and take control of your tasks and finances in minutes.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 relative z-10">
                    {ONBOARDING_STEPS.map((step, idx) => {
                        const tilt = idx % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1';
                        return (
                            <div key={idx} className="flex flex-col items-center text-center group cursor-default">
                                {/* Step badge */}
                                <div className="mb-6 flex items-center gap-3">
                                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-500/10">
                                        {idx + 1}
                                    </span>
                                </div>

                                {/* iPhone Mockup */}
                                <div className={`relative mx-auto w-[210px] md:w-[230px] transition-all duration-700 ease-out ${tilt} hover:scale-105`} style={{ perspective: '1000px' }}>
                                    <div className="relative rounded-[2.5rem] bg-gradient-to-b from-[#2A2A2E] via-[#1C1C1E] to-[#1C1C1E] p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.05)] group-hover:shadow-[0_40px_70px_-15px_rgba(0,0,0,0.55),0_0_80px_rgba(99,102,241,0.2)] transition-shadow duration-700">
                                        <div className="absolute -left-[2.5px] top-[100px] w-[3px] h-[30px] bg-[#3A3A3E] rounded-l-sm" />
                                        <div className="absolute -left-[2.5px] top-[140px] w-[3px] h-[30px] bg-[#3A3A3E] rounded-l-sm" />
                                        <div className="absolute -right-[2.5px] top-[110px] w-[3px] h-[45px] bg-[#3A3A3E] rounded-r-sm" />
                                        <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[9/19.5]">
                                            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-[80px] h-[22px] bg-black rounded-full flex items-center justify-center">
                                                <div className="w-[8px] h-[8px] rounded-full bg-[#1a1a2e] border border-[#2a2a3e] mr-3" />
                                            </div>
                                            <div className="absolute top-0 left-0 right-0 h-12 z-20 flex items-end justify-between px-6 pb-1">
                                                <span className="text-[9px] font-semibold text-white/80">9:41</span>
                                                <div className="flex items-center gap-1">
                                                    <div className="flex gap-[2px]">
                                                        <div className="w-[3px] h-[4px] bg-white/70 rounded-[0.5px]" />
                                                        <div className="w-[3px] h-[6px] bg-white/70 rounded-[0.5px]" />
                                                        <div className="w-[3px] h-[8px] bg-white/70 rounded-[0.5px]" />
                                                        <div className="w-[3px] h-[10px] bg-white/30 rounded-[0.5px]" />
                                                    </div>
                                                    <div className="w-[14px] h-[7px] border border-white/70 rounded-[1.5px] ml-1 relative">
                                                        <div className="absolute inset-[1px] bg-white/70 rounded-[0.5px] w-[60%]" />
                                                        <div className="absolute -right-[2px] top-1/2 -translate-y-1/2 w-[1.5px] h-[4px] bg-white/70 rounded-r-[0.5px]" />
                                                    </div>
                                                </div>
                                            </div>
                                            <img src={step.image} alt={step.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none z-10" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none z-10" />
                                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[100px] h-[4px] bg-white/40 rounded-full z-20" />
                                        </div>
                                    </div>
                                    {/* Glow on hover */}
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-gradient-to-t from-indigo-500/20 to-transparent blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{step.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm max-w-[220px] mx-auto">{step.body}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── HIKARI METHOD ──────────────────────────────────────── */}
            <section className="py-28 px-6 max-w-7xl mx-auto relative z-20">
                {/* Subtle section divider */}
                <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                <div className="grid grid-cols-1 md:grid-cols-[420px,1fr] lg:grid-cols-[480px,1fr] gap-16 lg:gap-24 items-center">
                    {/* Left: text */}
                    <div className="space-y-10">
                        <div>
                            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-6 tracking-wide">The Philosophy</span>
                            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-5 leading-tight">The Hikari Method</h2>
                            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                                92% of Hikari users feel more in control of their time and money within the first week. Our method is built on clarity and intentionality.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {HIKARI_METHOD_RULES.map((rule, idx) => (
                                <div key={idx} className={`group flex gap-5 p-5 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/[0.03] transition-all duration-300 cursor-default`}>
                                    <div className={`shrink-0 w-12 h-12 rounded-xl ${rule.styles.bg} flex items-center justify-center ${rule.styles.text} group-hover:scale-110 transition-transform duration-400`}>
                                        {rule.icon}
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500 mb-1">{rule.rule}</div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">{rule.title}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{rule.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <Button onClick={() => navigate('/signup')} size="lg" className="rounded-full px-8 h-[52px] text-base font-semibold bg-indigo-600 hover:bg-indigo-500 text-white border-0 shadow-xl shadow-indigo-500/25 transition-all hover:scale-105">
                                Create Free Account <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Right: mockup */}
                    <div className="relative group pb-16">
                        <div className="absolute -inset-8 bg-gradient-to-r from-indigo-500/8 via-purple-500/8 to-pink-500/8 rounded-3xl blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="relative w-full aspect-[16/10] bg-white dark:bg-[#0F111A] rounded-2xl overflow-hidden border border-slate-200 dark:border-white/[0.08] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transform perspective-[2000px] rotate-y-[-5deg] rotate-x-[2deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-all duration-700 ease-out">
                            <div className="h-full bg-slate-100 dark:bg-[#0B0C15]">
                                <img src="/hikari_hero_desk.png" alt="Hikari Desktop Dashboard showing task-budget integration" className="w-full h-full object-cover" />
                            </div>
                        </div>

                        {/* Floating iPhone */}
                        <div className="absolute -bottom-12 -right-6 md:-right-10 w-[170px] md:w-[200px] z-30 transform perspective-[2000px] rotate-y-[5deg] rotate-x-[-2deg] group-hover:rotate-y-0 group-hover:rotate-x-0 transition-all duration-700 ease-out group-hover:translate-x-3 group-hover:-translate-y-4">
                            <div className="relative rounded-[2.5rem] bg-[#1C1C1E] p-[8px] shadow-2xl border border-white/10">
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[60px] h-[16px] bg-black rounded-full" />
                                <div className="relative rounded-[2rem] overflow-hidden bg-black aspect-[9/19.5]">
                                    <img src="/step4_realistic_1774274876575.png" alt="Hikari Mobile App" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent pointer-events-none" />
                                </div>
                            </div>

                            {/* Floating detail card */}
                            <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-44 p-4 bg-white dark:bg-[#1A1C30] backdrop-blur-xl rounded-2xl border border-slate-100 dark:border-white/10 shadow-2xl animate-float z-40 hidden md:block">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 dark:text-white">Task Linked!</div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 w-[75%] rounded-full" />
                                </div>
                                <div className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium">$250.00 / $300.00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ───────────────────────────────────────── */}
            <section className="py-28 relative z-20 w-full overflow-hidden">
                <div className="absolute inset-0 bg-slate-50 dark:bg-[#0D0F1A] pointer-events-none" />
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-14">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-5 tracking-wide">Reviews</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Customer Testimonials</h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 mt-4">See how others are taking back control of their time and money.</p>
                    </div>
                </div>

                <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                    <div className="flex overflow-x-auto gap-6 pb-6 snap-x px-6 md:px-[calc((100vw-1280px)/2)]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {testimonials.map((testimonial, idx) => (
                            <div key={idx} className="min-w-[340px] md:min-w-[420px] snap-center bg-white dark:bg-[#13151F] p-8 rounded-[1.75rem] shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-400 border border-slate-100 dark:border-white/[0.06] hover:-translate-y-1 flex flex-col justify-between group">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-[11px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
                                            {testimonial.topic}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                    </div>
                                    {/* Decorative quote mark */}
                                    <div className="text-5xl font-serif text-indigo-200 dark:text-indigo-800/60 leading-none mb-2 select-none">"</div>
                                    <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 leading-relaxed mb-8">
                                        {testimonial.quote}
                                    </p>
                                </div>
                                <div className="pt-5 border-t border-slate-100 dark:border-white/[0.07] flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${testimonial.color} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
                                        {testimonial.initials}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-slate-900 dark:text-white">{testimonial.name}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{testimonial.location}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── BENTO FEATURES ─────────────────────────────────────── */}
            <section id="features" className="py-12 px-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-[#0E1021] via-[#111530] to-[#0A0C1B] rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-700" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                    <div className="relative z-10">
                        <div className="text-center mb-14">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.08] border border-white/[0.12] text-indigo-200 text-sm font-semibold mb-5 tracking-wide">Premium Features</span>
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-white tracking-tight">Everything You Need</h2>
                            <p className="text-indigo-200/70 text-lg max-w-2xl mx-auto">Unlock the full potential of your productivity with our suite of powerful tools.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-5 h-auto md:h-[580px]">
                            {/* Large: Task-Expense Linking */}
                            <div className="col-span-1 md:col-span-2 row-span-2 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-8 flex flex-col justify-between hover:bg-white/[0.07] transition-all duration-300 group backdrop-blur-md hover:border-white/[0.14]">
                                <div>
                                    <div className="w-13 h-13 w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-indigo-500/30">
                                        <Link2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">Task-Expense Linking</h3>
                                    <p className="text-indigo-100/70 leading-relaxed text-sm">Directly connect your spending to your projects. See the true cost of every task and the ROI of your time.</p>
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
                                                <span className="text-emerald-400">$2,400</span> <span className="text-slate-600 font-normal">/</span> <span className="text-slate-300">$600</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="absolute inset-0 p-5 flex items-center gap-4 transition-all duration-500 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
                                        <div className="bg-white/[0.08] p-3.5 rounded-xl border border-white/5 flex-1 w-1/2">
                                            <div className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">Task</div>
                                            <div className="font-semibold text-white flex items-center gap-2 text-sm">
                                                <Check className="w-3.5 h-3.5 text-emerald-400" /> <span className="line-through text-slate-500 truncate">Book Venue</span>
                                            </div>
                                        </div>
                                        <ArrowRight className="text-white/30 w-4 h-4 shrink-0" />
                                        <div className="bg-white/[0.08] p-3.5 rounded-xl border border-white/5 flex-1">
                                            <div className="text-[10px] text-white/50 mb-1 font-medium uppercase tracking-wider">Task</div>
                                            <div className="font-semibold text-white relative w-fit text-sm">
                                                <span className="invisible">Order Dress</span>
                                                <span className="absolute top-0 left-0 overflow-hidden whitespace-nowrap w-0 group-hover:w-full transition-[width] duration-[1500ms] ease-linear border-r-2 border-transparent group-hover:border-indigo-400/50 delay-100">
                                                    Order Dress
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tall: Smart Split */}
                            <div className="col-span-1 row-span-2 bg-gradient-to-b from-emerald-900/30 to-emerald-900/5 border border-emerald-500/15 rounded-2xl p-7 flex flex-col hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-md hover:-translate-y-1 group">
                                <div className="mb-auto">
                                    <div className="w-11 h-11 bg-emerald-500/15 rounded-xl flex items-center justify-center mb-5 text-emerald-400 border border-emerald-500/20">
                                        <Split className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-white">Smart Split</h3>
                                    <p className="text-sm text-emerald-100/60 leading-relaxed">Automatically break down complex projects into actionable steps.</p>
                                </div>
                                <div className="mt-6 space-y-2.5 font-mono text-[11px]">
                                    <div className="bg-white/5 p-2.5 rounded-lg border border-white/[0.07] flex items-center justify-between">
                                        <span className="text-white font-medium truncate mr-2">Family Adventure Fund</span>
                                        <span className="text-emerald-400 text-[9px] bg-emerald-400/10 px-1.5 py-0.5 rounded shrink-0">Project</span>
                                    </div>
                                    <div className="relative pl-5 space-y-2 before:absolute before:left-2 before:top-0 before:bottom-0 before:w-px before:bg-white/[0.08]">
                                        {[
                                            { label: "Research flights", amount: "$0", color: "text-slate-400" },
                                            { label: "Book hotel stay", amount: "-$850", color: "text-red-300" },
                                            { label: "Excursion tickets", amount: "-$120", color: "text-red-300" },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-emerald-500/8 p-2 rounded-lg border border-emerald-500/10 flex items-center justify-between opacity-100 translate-x-0 md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-500 ease-out" style={{ transitionDelay: `${(i + 1) * 100}ms` }}>
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                                                    <span className="text-emerald-100/80 truncate">{item.label}</span>
                                                </div>
                                                <span className={item.color}>{item.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* AI Insights */}
                            <div className="col-span-1 bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/15 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 backdrop-blur-md group">
                                <div>
                                    <div className="w-10 h-10 bg-amber-500/15 rounded-xl flex items-center justify-center mb-4 text-amber-400 border border-amber-500/20">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-white text-base mb-1">AI Insights</h3>
                                    <p className="text-xs text-slate-400">Predictive analytics for your wallet.</p>
                                </div>
                                <div className="mt-4 flex items-end gap-1.5 h-14 w-full px-1">
                                    <div className="flex-1 bg-white/[0.07] rounded-t-sm h-[40%]" />
                                    <div className="flex-1 bg-white/[0.07] rounded-t-sm h-[60%]" />
                                    <div className="flex-1 bg-white/[0.07] rounded-t-sm h-[50%]" />
                                    <div className="flex-1 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-sm h-[80%] shadow-[0_0_12px_rgba(245,158,11,0.4)] animate-pulse" />
                                </div>
                            </div>

                            {/* Reporting */}
                            <div className="col-span-1 bg-gradient-to-br from-indigo-500/10 to-violet-600/5 border border-indigo-500/15 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-md group">
                                <div>
                                    <div className="w-10 h-10 bg-indigo-500/15 rounded-xl flex items-center justify-center mb-4 text-indigo-400 border border-indigo-500/20">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-white text-base mb-1">Reporting</h3>
                                    <p className="text-xs text-slate-400">Export professional CSV/PDF reports.</p>
                                </div>
                                <div className="mt-4 bg-white/[0.04] border border-white/[0.08] rounded-lg p-3 w-full transform group-hover:rotate-1 transition-transform duration-300">
                                    <div className="flex gap-1.5 mb-2.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="h-[3px] bg-white/20 rounded-full w-3/4" />
                                        <div className="h-[3px] bg-white/10 rounded-full w-full" />
                                        <div className="h-[3px] bg-white/10 rounded-full w-5/6" />
                                        <div className="h-[3px] bg-indigo-400/30 rounded-full w-1/2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MEET THE TEAM ──────────────────────────────────────── */}
            <section className="py-28 px-6 max-w-7xl mx-auto relative z-20">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-5 tracking-wide">Behind Hikari</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Meet the Founder</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">The human building the methodology for your radical clarity.</p>
                </div>

                <div className="max-w-md mx-auto">
                    {[
                        {
                            name: "Samuel O. Akinboro",
                            role: "Founder & Software Developer",
                            image: "/samuel_akinboro_professional.png",
                            bio: "Passionate about building high-performance systems that turn chaos into clarity. Samuel is the architect behind the Hikari Method, dedicated to helping individuals master their life and money through intentional design."
                        }
                    ].map((member, idx) => (
                        <div key={idx} className="group relative text-center">
                            <div className="relative aspect-square overflow-hidden rounded-[3rem] mb-8 shadow-2xl shadow-slate-200 dark:shadow-black/40 transition-transform duration-500 group-hover:-translate-y-2 max-w-sm mx-auto border-4 border-white dark:border-white/5">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{member.name}</h3>
                            <p className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-4">{member.role}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CURRENCY SWITCHER ──────────────────────────────────── */}
            <section className="py-12 border-y border-slate-200 dark:border-white/5 bg-white/30 dark:bg-black/20 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Regional Pricing</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">View pricing in your local currency for better clarity.</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/10">
                        <button 
                            onClick={() => setCurrency('NGN')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === 'NGN' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            ₦ NGN
                        </button>
                        <button 
                            onClick={() => setCurrency('USD')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === 'USD' ? 'bg-white dark:bg-indigo-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            $ USD
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FAQ / CTA ──────────────────────────────────────────── */}
            <section className="py-28 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0E1022] to-slate-900 pointer-events-none" />
                {/* Accent glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-semibold mb-8 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                        Support
                    </div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-5 tracking-tight">
                        Got Questions?
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Everything you need to know about Hikari and how it can organize your life.
                    </p>
                    <Link
                        to="/faq"
                        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/[0.06] border border-white/[0.12] text-white font-semibold hover:bg-white/[0.12] hover:border-white/20 transition-all duration-300 hover:scale-105 text-base backdrop-blur-sm shadow-xl shadow-black/20"
                    >
                        <span>Have a different question? We're here to help — Just ask!</span>
                        <ChevronDown className="w-5 h-5 -rotate-90 shrink-0 text-indigo-400" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
