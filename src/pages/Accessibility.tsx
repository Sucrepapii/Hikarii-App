import { Link } from 'react-router-dom';
import { ArrowLeft, Keyboard, Eye, Monitor, CheckCircle2, MessageSquareText } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const Accessibility: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#080910] text-slate-100 selection:bg-purple-500/30 overflow-x-hidden flex flex-col deep-dark">
            <Navbar />

            {/* Content */}
            <div className="container mx-auto px-6 py-20 max-w-5xl relative">
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-[700px] h-[700px] bg-pink-600/5 rounded-full blur-[130px] pointer-events-none -z-10" />
                
                <div className="mb-24">
                    <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-8 tracking-tight">
                        Inclusive Design
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl">
                        At Hikari, we believe digital sovereignty and productivity should be accessible to everyone. We are committed to ensuring that our platform is usable by all individuals, regardless of ability.
                    </p>
                </div>

                <div className="space-y-12 mb-32">
                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-pink-500/50 group-hover:bg-pink-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Accessibility Statement</h2>
                        <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
                            <p>
                                Hikari is committed to facilitating the accessibility and usability of its digital properties for all people with disabilities. We strive to implement the relevant portions of the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> as our web accessibility standard.
                            </p>
                            <p>
                                Our efforts are ongoing as we incorporate accessibility into every phase of our design and development lifecycle. We conduct regular manual and automated testing to identify and remediate potential barriers.
                            </p>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: Keyboard,
                                title: "Keyboard Operability",
                                desc: "Full interface operability via keyboard interface, including focus management and skip-links for efficient navigation."
                            },
                            {
                                icon: Eye,
                                title: "Perceivable Content",
                                desc: "High-contrast text ratios, scalable typography, and support for high-contrast OS themes to assist users with visual impairments."
                            },
                            {
                                icon: Monitor,
                                title: "Assistive Tech Support",
                                desc: "Semantic HTML5 and ARIA (Accessible Rich Internet Applications) attributes to ensure compatibility with screen readers like NVDA and VoiceOver."
                            },
                            {
                                icon: CheckCircle2,
                                title: "Cognitive Clarity",
                                desc: "Consistent navigation patterns and simplified interaction models to reduce cognitive load and improve predictability."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-pink-500/20 transition-all group">
                                <feature.icon className="w-8 h-8 text-pink-400 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#12141F] p-16 rounded-[4rem] border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                        <MessageSquareText className="w-32 h-32 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Feedback and Barriers</h2>
                        <p className="text-slate-400 mb-10 max-w-2xl text-lg leading-relaxed">
                            If you encounter any accessibility barriers while using Hikari, please let us know. We take all feedback seriously and will work to provide an alternative or remediate the issue promptly.
                        </p>
                        <a href="mailto:accessibility@hikarii.org" className="inline-flex items-center justify-center px-12 py-5 rounded-2xl bg-pink-600 text-white font-black tracking-[0.2em] uppercase text-xs hover:bg-pink-500 transition-all shadow-xl shadow-pink-500/20">
                            Contact Accessibility Support
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
