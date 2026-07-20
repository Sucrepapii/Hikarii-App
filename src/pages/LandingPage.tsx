
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, Zap, Link2, FileText, Split, ArrowRight, Menu, X, ChevronDown, Star, Calendar, Users, MessageSquare, Bell, Shield, Sun, Trophy, WifiOff, Wallet, Smartphone } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { useAuthStore } from '../stores/authStore';
import { Helmet } from 'react-helmet-async';
import { clsx } from 'clsx';

const ONBOARDING_STEPS = [
    {
        title: "Create Account",
        body: "Sign up easily and get instant access to your centralized dashboard.",
        image: "/step1_flat.png?v=3"
    },
    {
        title: "Link the Money",
        body: "Assign a dollar value to every milestone. See the real cost of your time.",
        image: "/step2_flat.png?v=3"
    },
    {
        title: "Split with AI",
        body: "Our AI breaks massive projects into pre-funded, bite-sized blocks automatically.",
        image: "/step3_flat.png?v=3"
    },
    {
        title: "Execute with ROI",
        body: "Check off tasks and watch your financial progress update with absolute ROI clarity.",
        image: "/step4_flat.png?v=3"
    }
];

const GRADIENT_COLORS = [
    "from-primary-500 to-amber-500",
    "from-sky-500 to-amber-500",
    "from-orange-500 to-rose-500",
    "from-teal-500 to-emerald-500",
    "from-sky-500 to-accent-500",
    "from-pink-500 to-rose-500",
];

function getInitials(name: string): string {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

const Hikarii_METHOD_RULES = [
    {
        rule: "Rule 1",
        title: "Give Every Task a Job",
        description: "Directly connect your spending to your productivity. Stop guessing where your money goes and start seeing what it achieves.",
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
        title: "Embrace Your True Expenses",
        description: "Large project costs shouldn't be surprises. Break down massive goals into manageable, pre-funded milestones.",
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
        title: "Roll With the Punches",
        description: "Life happens, and plans change. Move budget between tasks in real-time without losing track of your overall goals.",
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
    },
    {
        rule: "Rule 5",
        title: "Scale with Collaboration",
        description: "Success is better when shared. Invite teammates to projects, discuss tasks in real-time, and manage permissions with absolute precision.",
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
    const [currency, setCurrency] = useState<'USD' | 'NGN'>('NGN');
    const [testimonials, setTestimonials] = useState<any[]>([
        {
            topic: "FREELANCE GROWTH",
            quote: "Hikarii changed how I view my billable hours. I finally see exactly where my time turns into profit.",
            name: "Sarah Chen",
            location: "Singapore",
            flag: "🇸🇬",
            rating: 5,
            color: "from-primary-500 to-amber-500"
        },
        {
            topic: "HOME RENO",
            quote: "I used to fear my contractor invoices. Now I map them to tasks and see the impact in real-time.",
            name: "James Wilson",
            location: "London, UK",
            flag: "🇬🇧",
            rating: 5,
            color: "from-emerald-500 to-teal-500"
        },
        {
            topic: "STARTUP OPS",
            quote: "The AI task splitting is pure magic. It takes my chaotic ideas and turns them into a financial roadmap.",
            name: "Amara Okoro",
            location: "Lagos, Nigeria",
            flag: "🇳🇬",
            rating: 5,
            color: "from-orange-500 to-rose-500"
        }
    ]);
    const [isHovered, setIsHovered] = useState(false);
    const testimonialRef = React.useRef<HTMLDivElement>(null);
    const [statsData, setStatsData] = useState({ users: 3000, countries: 20 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/stats`);
                if (res.ok) {
                    const data = await res.json();
                    setStatsData(data);
                }
            } catch {
                // Keep default
            }
        };
        fetchStats();
    }, []);

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
                            location: fb.country || new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short' }),
                            flag: fb.flag || null,
                            rating: fb.rating,
                            initials: getInitials(fb.name),
                            color: GRADIENT_COLORS[idx % GRADIENT_COLORS.length]
                        }));
                        setTestimonials(mapped);
                    }
                }
            } catch {
                // Keep fallbacks on error
            }
        };
        fetchFeedback();
    }, []);

    // Auto-scroll testimonials
    useEffect(() => {
        if (isHovered) return;

        const interval = setInterval(() => {
            if (testimonialRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = testimonialRef.current;
                if (scrollLeft + clientWidth >= scrollWidth - 10) {
                    testimonialRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    testimonialRef.current.scrollBy({ left: 400, behavior: 'smooth' });
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [isHovered]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#060814] to-[#04060a] font-sans text-slate-100 overflow-x-hidden selection:bg-amber-500/30 deep-dark">
            <Helmet>
                <link rel="canonical" href="https://www.Hikariii.org/" />
                <title>Hikarii | Radical Clarity in Tasks & Budgeting</title>
                <meta name="description" content="Master the Hikarii Method: A revolutionary approach to linking your tasks with your budget for ultimate financial and professional clarity." />
                <meta name="keywords" content="Hikarii, Hikariiiapp, tasks, budget, AI, collaboration, productivity app Nigeria, AI task manager, project budget tracker, financial clarity Lagos, Hikarii method, task budget linking, best task app West Africa" />
                <meta name="thumbnail" content="https://www.Hikariii.org/marketing/Hikarii_chaos_to_clarity_1778160537687.png" />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "Hikarii",
                        "operatingSystem": "All",
                        "applicationCategory": "ProductivityApplication",
                        "description": "Master the Hikarii Method: A revolutionary approach to linking your tasks with your budget for ultimate financial and professional clarity.",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.9",
                            "reviewCount": "100"
                        },
                        "sameAs": [
                            "https://www.instagram.com/Hikariiiapp",
                            "https://x.com/Hikariiiapp",
                            "https://www.linkedin.com/company/Hikarii-world/"
                        ]
                    })}
                </script>

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.Hikariii.org/" />
                <meta property="og:title" content="Hikarii | Radical Clarity in Tasks & Budgeting" />
                <meta property="og:description" content="Master the Hikarii Method: Link your tasks to your budget for ultimate clarity." />
                <meta property="og:image" content="https://www.Hikariii.org/marketing/Hikarii_chaos_to_clarity_1778160537687.png" />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://www.Hikariii.org/" />
                <meta property="twitter:title" content="Hikarii | Radical Clarity in Tasks & Budgeting" />
                <meta property="twitter:description" content="Master the Hikarii Method: Link your tasks to your budget for ultimate clarity." />
                <meta property="twitter:image" content="https://www.Hikariii.org/marketing/Hikarii_chaos_to_clarity_1778160537687.png" />
            </Helmet>

            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            {/* Navbar */}
            <Navbar />

            {/* ── HERO ───────────────────────────────────────────────── */}
            <section className="relative min-h-[88vh] flex flex-col items-center justify-center text-center px-6 pt-[68px] pb-16 overflow-hidden">
                {/* Layered background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#080910] via-[#0D0F1C] to-[#0A0B16] pointer-events-none" />
                {/* Animated orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
                <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
                {/* Subtle dot-grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

                <div className="relative z-10 max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 mb-8 animate-fade-in-up shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-sm font-semibold text-primary-300 tracking-wide">Clarity. Focus. Control.</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-8 leading-[1.1] tracking-tight">
                        The One Workspace Where <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">Tasks Meet Budgets.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Stop juggling Todoist and Mint. Track projects and expenses side-by-side. Gain total clarity on where your time and money actually go.
                    </p>

                    <div className="flex justify-center mb-6">
                        <Button
                            size="lg"
                            className="w-full sm:w-auto px-10 py-6 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-bold text-lg shadow-xl shadow-primary-600/20"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-12">
                        Connect every task to its budget – from daily errands to $1M projects.
                    </p>

                    {/* Floating social-proof pills */}
                    <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-in-up delay-300">
                        {["⭐ 4.9 rating", "🔒 Bank-grade security", "⚡ Free to start"].map((pill) => (
                            <span key={pill} className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold text-slate-400 bg-white/5 border border-white/[0.07] backdrop-blur-sm shadow-sm">
                                {pill}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── STATS STRIP ────────────────────────────────────────── */}
            <div className="border-y border-white/[0.06] bg-[#0D0F1A] py-10">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <div className="text-3xl font-extrabold text-white tracking-tight mb-1">{s.value}</div>
                            <div className="text-sm text-slate-400 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Hikarii METHOD ──────────────────────────────────────── */}
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
                                <div key={idx} className={`group flex gap-5 p-5 rounded-2xl border border-transparent hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300 cursor-default`}>
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
                                <img src="/hikari_hero_desk.png" alt="Hikarii Desktop Dashboard" loading="lazy" className="w-full h-full object-cover" />
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

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── GLOBAL CLARITY (Combined) ─────────────────────────── */}
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
                                {["Task: \"Fix website\" — no budget, no deadline.", "Expense: \"$200 Hosting\" — where does the money go?", "Stress: \"Is this project even profitable?\"", "Chaos: Fragmented focus across 5 disconnected apps."].map((item, i) => (
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
                                {["Task: \"Fix website\" — budget $300 allocated.", "Expense linked to task — remaining $100 tracked.", "Clarity: ROI automatically calculated per milestone.", "Peace: One institutional workspace for everything."].map((item, i) => (
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
                                onClick={() => navigate('/signup')}
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

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── FOUR STEPS ─────────────────────────────────────────── */}
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

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── TESTIMONIALS ───────────────────────────────────────── */}
            {testimonials.length > 0 && (
                <section className="py-16 relative z-20 w-full overflow-hidden">
                    <div className="absolute inset-0 bg-[#0D0F1A] pointer-events-none" />
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-10 md:mb-14">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-semibold mb-5 tracking-wide">Reviews</span>
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight">Customer Testimonials</h2>
                            <p className="text-base md:text-lg text-slate-400 mt-4">See how others are taking back control of their time and money.</p>
                        </div>
                    </div>

                    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
                        <div
                            ref={testimonialRef}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className="flex overflow-x-auto gap-6 pb-6 snap-x px-6 md:px-[calc((100vw-1280px)/2)]"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {testimonials.map((testimonial, idx) => (
                                <div key={idx} className="min-w-[340px] md:min-w-[420px] snap-center bg-[#13151F] p-8 rounded-[1.75rem] shadow-[0_4px_24px_rgba(0,0,0,0.2)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-400 border border-white/[0.06] hover:-translate-y-1 flex flex-col justify-between group">
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="px-3 py-1 bg-white/5 rounded-full text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                                {testimonial.topic}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                ))}
                                            </div>
                                        </div>
                                        {/* Decorative quote mark */}
                                        <div className="text-5xl font-serif text-primary-800/60 leading-none mb-2 select-none">"</div>
                                        <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8">
                                            {testimonial.quote}
                                        </p>
                                    </div>
                                    <div className="pt-5 border-t border-white/[0.07] flex items-center gap-4">
                                        {testimonial.image ? (
                                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shadow-lg group-hover:border-primary-500/50 transition-colors">
                                                <img src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${testimonial.color} flex items-center justify-center text-white text-xs font-black shadow-md border-2 border-white/5`}>
                                                {testimonial.initials || getInitials(testimonial.name)}
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-sm text-white flex items-center gap-2">
                                                {testimonial.name}
                                                {testimonial.flag && <span className="text-base leading-none" title={testimonial.location}>{testimonial.flag}</span>}
                                            </div>
                                            <div className="text-xs text-slate-400 mt-0.5">{testimonial.location}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── BENTO FEATURES ─────────────────────────────────────── */}
            <section id="features" className="py-16 px-6 max-w-7xl mx-auto">
                <div className="bg-gradient-to-br from-[#0E1021] via-[#111530] to-[#0A0C1B] rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]">
                    {/* Background glows */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/15 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow delay-700" />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

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
                                    <div className="w-13 h-13 w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center mb-6 text-white shadow-lg shadow-primary-500/30">
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

                            {/* New: Real-time Collaboration */}
                            <div className="md:col-span-1 bg-gradient-to-br from-primary-900/30 to-amber-900/10 border border-primary-500/20 rounded-2xl p-7 flex flex-col justify-between hover:border-primary-500/40 transition-all duration-500 backdrop-blur-md group relative overflow-hidden min-h-[340px]">
                                {/* Animated background elements */}
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

                                {/* Animated Avatars Mockup */}
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

                            {/* Offline Synchronization (Premium Bento Item) */}
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

                            {/* Tall: AI Autopilot Scoper (Magic Moment) */}
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


            {/* ── MEET THE TEAM ──────────────────────────────────────── */}
            {/* <section className="py-28 px-6 max-w-7xl mx-auto relative z-20">
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 text-primary-600 dark:text-primary-300 text-sm font-semibold mb-5 tracking-wide">Behind Hikarii</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Meet the Founder</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto">The human building the methodology for your radical clarity.</p>
                </div>

                <div className="max-w-md mx-auto">
                    {[
                        {
                            name: "Samuel O. Akinboro",
                            role: "Founder & Software Developer",
                            image: "/samuel_akinboro_professional.png",
                            bio: "Passionate about building high-performance systems that turn chaos into clarity. Samuel is the architect behind the Hikarii Method, dedicated to helping individuals master their life and money through intentional design."
                        }
                    ].map((member, idx) => (
                        <div key={idx} className="group relative text-center">
                            <div className="relative aspect-square overflow-hidden rounded-[3rem] mb-8 shadow-2xl shadow-slate-200 dark:shadow-black/40 transition-transform duration-500 group-hover:-translate-y-2 max-w-sm mx-auto border-4 border-white dark:border-white/5">
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">{member.name}</h3>
                            <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">{member.role}</p>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </section> */}

            {/* ── MOBILE APP COMING SOON ────────────────────────────── */}
            <section className="py-24 relative overflow-hidden bg-gradient-to-b from-[#060814] to-[#04060a] border-t border-white/5">
                {/* Cyan glow */}
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
                {/* Amber glow */}
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold mb-6 tracking-wide">
                            <Smartphone className="w-4 h-4" />
                            Mobile App
                        </div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                            Radical Clarity, <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-amber-400">
                                in your pocket.
                            </span>
                        </h2>
                        <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            Take the Hikarii Method wherever you go. Track expenses on the fly, manage tasks seamlessly, and get real-time ROI notifications directly to your phone.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="text-slate-300">
                                    <p className="text-sm font-bold">iOS & Android</p>
                                    <p className="text-xs text-amber-400 font-semibold mt-1">COMING SOON</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mobile Mockup Image */}
                    <div className="flex-1 flex justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 to-amber-500/10 blur-3xl rounded-full" />
                        <div className="relative z-10 w-full max-w-[320px] mx-auto">
                            <img 
                                src="/Hikarii_mobile_mockup.png" 
                                alt="Hikarii Mobile App Interface" 
                                className="w-full h-auto object-contain drop-shadow-2xl mix-blend-lighten group-hover:scale-105 transition-transform duration-700 ease-out [mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CURRENCY SWITCHER ──────────────────────────────────── */}
            <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-bold text-white mb-1">Regional Pricing</h3>
                        <p className="text-sm text-slate-400">View pricing in your local currency for better clarity.</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/10">
                        <button
                            onClick={() => setCurrency('NGN')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === 'NGN' ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                        >
                            ₦ NGN
                        </button>
                        <button
                            onClick={() => setCurrency('USD')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${currency === 'USD' ? 'bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
                        >
                            $ USD
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FAQ / CTA ──────────────────────────────────────────── */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0E1022] to-slate-900 pointer-events-none" />
                {/* Accent glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-semibold mb-8 tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                        Next Steps
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5 tracking-tight px-4">
                        Ready to stop guessing?
                    </h2>
                    <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed px-4">
                        Start living with clarity. Connect your tasks and budgets in minutes. Start free – no credit card required.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/signup"
                            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold hover:from-primary-500 hover:to-accent-500 transition-all duration-300 hover:scale-105 shadow-xl shadow-primary-600/20"
                        >
                            Get Started Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/faq"
                            className="inline-flex items-center gap-3 px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                        >
                            Have Questions? <ChevronDown className="w-5 h-5 -rotate-90 shrink-0 text-primary-400" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />

        </div>
    );
};
