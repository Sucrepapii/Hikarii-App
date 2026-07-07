import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/pages/LandingPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Imports
content = content.replace(
  "import { Check, Zap, Link2, FileText, Split, ArrowRight, Menu, X, ChevronDown } from 'lucide-react';",
  "import { Check, Zap, Link2, FileText, Split, ArrowRight, Menu, X, ChevronDown, UserPlus, BrainCircuit, Activity, TrendingUp, Star } from 'lucide-react';"
);

// 2. Add ONBOARDING_STEPS and Update TESTIMONIALS
const testRegex = /const TESTIMONIALS = \[\s*\{[\s\S]*?\}\s*\];/;
content = content.replace(testRegex, `const ONBOARDING_STEPS = [
    {
        title: "Create account",
        body: "Sign up easily and get instant access to your centralized dashboard.",
        icon: UserPlus,
        color: "bg-teal-50 dark:bg-teal-900/30",
        iconColor: "text-teal-600 dark:text-teal-400"
    },
    {
        title: "Dump your thoughts",
        body: "Add all your pending tasks, goals, and recurring expenses into one secure vault.",
        icon: BrainCircuit,
        color: "bg-orange-50 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
        title: "Organize & Split",
        body: "Use our AI to break down massive projects into focused, bite-sized blocks.",
        icon: Split,
        color: "bg-lime-50 dark:bg-lime-900/30",
        iconColor: "text-lime-600 dark:text-lime-400"
    },
    {
        title: "Execute & Track",
        body: "Check off tasks and watch your financial progress update in real-time.",
        icon: TrendingUp,
        color: "bg-pink-50 dark:bg-pink-900/30",
        iconColor: "text-pink-600 dark:text-pink-400"
    }
];

const TESTIMONIALS = [
    {
        topic: "FINANCIAL GOALS",
        quote: "Hikari helped me save my first ₦500,000 in 3 months. Having my tasks and budget perfectly synchronized changed the way I work.",
        name: "OLUWASEUN ADEYEMI",
        location: "Lagos",
        initials: "OA",
        color: "from-indigo-500 to-purple-500"
    },
    {
        topic: "AI SPLIT",
        quote: "I used to be paralyzed by my own ambitions. The AI smart split broke down my entire product launch into daily 15-minute blocks. Unbelievable.",
        name: "MARCUS THORNE",
        location: "Abuja",
        initials: "MT",
        color: "from-fuchsia-500 to-purple-500"
    },
    {
        topic: "SUBSCRIPTION TRACKING",
        quote: "Finally, a tool that respects my time. Finding out I was losing $200/mo on dead subscriptions while organizing my daily tasks was a wake-up call.",
        name: "ELENA RODRIGUEZ",
        location: "Nairobi",
        initials: "ER",
        color: "from-orange-500 to-rose-500"
    },
    {
        topic: "ONBOARDING",
        quote: "Great experience using the app, great design, great functionality. I highly recommend to anyone trying to get their life together.",
        name: "TAIWO OKUSANYA",
        location: "Lagos",
        initials: "TO",
        color: "from-teal-500 to-emerald-500"
    }
];`);

// 3. Remove state
content = content.replace(/const \[activeTestimonial, setActiveTestimonial\] = useState\(0\);[\s\S]*?return \(\) => clearInterval\(interval\);\n    \}, \[\]\);/, '');

// 4. Replace Testimonials Section
const carouselRegex = /\{\/\* TESTIMONIAL\/SOCIAL PROOF CAROUSEL \*\/\}[\s\S]*?(?=\{\/\* METHODOLOGY SECTION \*\/)/;
content = content.replace(carouselRegex, `
            {/* FOUR SIMPLE STEPS TO GET STARTED */}
            <section className="py-24 px-6 max-w-7xl mx-auto relative z-20">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">Four simple steps to get started</h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400">Join Hikari and take control of your tasks and finances in minutes.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ONBOARDING_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <div key={idx} className="flex flex-col text-center">
                                <div className={\`w-full aspect-[4/3] rounded-3xl mb-8 flex items-center justify-center \${step.color} border border-slate-100 dark:border-white/5 transition-transform hover:scale-105 duration-300 shadow-sm\`}>
                                    <Icon className={\`w-16 h-16 \${step.iconColor}\`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex flex-col items-center">
                                    {step.title}
                                    <div className="w-12 h-1.5 bg-yellow-400 rounded-full mt-3"></div>
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {step.body}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CUSTOMER TESTIMONIALS */}
            <section className="py-24 px-6 bg-[#f8f9fb] dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5 relative z-20">
                <div className="max-w-[1400px] mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white">Customer Testimonials</h2>
                    </div>

                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {TESTIMONIALS.map((testimonial, idx) => (
                            <div key={idx} className="min-w-[320px] md:min-w-[420px] snap-center bg-white dark:bg-[#1A1C29] p-8 rounded-[2rem] shadow-sm border border-slate-100 dark:border-white/5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-xs font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">{testimonial.topic}</span>
                                        <div className="flex gap-1 text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">5</span>
                                        </div>
                                    </div>
                                    <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-8">
                                        "{testimonial.quote}"
                                    </p>
                                </div>
                                <div>
                                    <div className="w-full h-px bg-slate-100 dark:bg-white/10 mb-6"></div>
                                    <div className="flex items-center gap-4">
                                        <div className={\`w-12 h-12 rounded-full bg-gradient-to-tr \${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-sm border-2 border-white/20\`}>
                                            {testimonial.initials}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.location}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

`);

// 5. Remove Methodology Section
const methodRegex = /\{\/\* METHODOLOGY SECTION \*\/\}[\s\S]*?(?=\{\/\* BENTO FEATURES \*\/)/;
content = content.replace(methodRegex, '');

fs.writeFileSync(filePath, content);
console.log('Update successful');
