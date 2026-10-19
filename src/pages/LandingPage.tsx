import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Smartphone, ChevronDown } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { Hero } from '../components/landing/Hero';
import { Testimonials } from '../components/landing/Testimonials';
import { Pricing } from '../components/landing/Pricing';
import { MethodRules } from '../components/landing/MethodRules';
import { Stats } from '../components/landing/Stats';
import { OnboardingSteps } from '../components/landing/OnboardingSteps';
import { GlobalClarity } from '../components/landing/GlobalClarity';
import { BentoFeatures } from '../components/landing/BentoFeatures';
import { Helmet } from 'react-helmet-async';
import apiClient from '../api/client';

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

export const LandingPage: React.FC = () => {
    const navigate = useNavigate();
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
    const [statsData] = useState({ users: 900, countries: 5 });


    // Fetch real feedback from the API
    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await apiClient.get('/feedback');
                const data = res.data;
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
            } catch (err) {
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
            <Hero onGetStarted={() => navigate('/signup')} />

            {/* ── STATS STRIP ────────────────────────────────────────── */}
            <Stats />

            {/* ── Hikarii METHOD ──────────────────────────────────────── */}
            <MethodRules />

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── GLOBAL CLARITY (Combined) ─────────────────────────── */}
            <GlobalClarity statsData={statsData} onGetStarted={() => navigate('/signup')} />

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── FOUR STEPS ─────────────────────────────────────────── */}
            <OnboardingSteps />

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── TESTIMONIALS ───────────────────────────────────────── */}
            <Testimonials
                testimonials={testimonials}
                testimonialRef={testimonialRef}
                setIsHovered={setIsHovered}
                getInitials={getInitials}
            />

            {/* Subtle Divider */}
            <div className="max-w-4xl mx-auto h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50" />

            {/* ── BENTO FEATURES ─────────────────────────────────────── */}
            <BentoFeatures />


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
                                src="/hikari_mobile_mockup.png?v=2" 
                                alt="Hikarii Mobile App Interface" 
                                className="w-full h-auto object-contain drop-shadow-2xl mix-blend-lighten group-hover:scale-105 transition-transform duration-700 ease-out [mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_bottom,white_70%,transparent_100%)]"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── PRICING & CURRENCY ─────────────────────────────────── */}
            <Pricing
                currency={currency}
                setCurrency={setCurrency}
                onGetStarted={() => navigate('/signup')}
            />

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

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0B0C15]/90 backdrop-blur-md border-t border-white/10 z-50 md:hidden flex items-center justify-between shadow-2xl">
                <div>
                    <div className="text-white font-bold text-sm">Start for free</div>
                    <div className="text-slate-400 text-xs">No credit card required</div>
                </div>
                <Button 
                    size="sm" 
                    className="rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold px-6 shadow-lg shadow-primary-500/20"
                    onClick={() => navigate('/signup')}
                >
                    Get Started
                </Button>
            </div>
        </div>
    );
};
