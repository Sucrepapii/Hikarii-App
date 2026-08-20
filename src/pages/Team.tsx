import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/layout/Footer';
import { Logo } from '../components/common/Logo';
import { ArrowRight, Linkedin, Twitter, Globe, Instagram, Sparkles, Rocket, Globe2, ShieldCheck } from 'lucide-react';

interface TeamMember {
    name: string;
    role: string;
    bio: string;
    initials: string;
    gradient: string;
    imageUrl?: string;
    links?: { linkedin?: string; twitter?: string; website?: string; instagram?: string };
}

const team: TeamMember[] = [
    {
        name: 'Samuel Olatomide Akinboro',
        role: 'Founder & Software Developer',
        bio: 'An expert Frontend Engineer with over five years in the JS ecosystem, specializing in React and TypeScript. He builds robust, high-performance design systems that cut UI rework and elevate the user experience, driven by a desire to create impactful digital solutions and mentor his team.',
        initials: 'AS',
        gradient: 'from-primary-600 to-accent-600',
        imageUrl: '/samuel_nobg.png',
        links: { linkedin: 'https://www.linkedin.com/in/samuelakinboro/', twitter: 'https://x.com/Hikariiiapp', instagram: 'https://www.instagram.com/sucre_papii' },
    },
    {
        name: 'Product Team',
        role: 'Design & Engineering',
        bio: 'A distributed team of designers and engineers obsessed with crafting experiences that feel effortless, powerful, and alive.',
        initials: 'PT',
        gradient: 'from-violet-600 to-fuchsia-600',
        links: {},
    },
    {
        name: 'Growth & Community',
        role: 'Marketing & Partnerships',
        bio: 'Growing a global community of focused individuals — from Lagos to London to Singapore — who believe clarity is a competitive advantage.',
        initials: 'GC',
        gradient: 'from-emerald-600 to-teal-600',
        links: { linkedin: 'https://www.linkedin.com/company/Hikarii-world/' },
    },
];

const values = [
    { icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', title: 'Clarity Over Complexity', desc: 'We strip away noise. Every feature earns its place by making life simpler, not noisier.' },
    { icon: Rocket, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', title: 'Momentum First', desc: 'Progress compounds. We design for the next action, not the perfect plan.' },
    { icon: Globe2, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', title: 'Built for the World', desc: 'From Africa to Asia, our users live globally. Hikarii adapts to every timezone, currency, and context.' },
    { icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', title: 'Trust as a Feature', desc: 'Your financial data is sacred. Privacy, security, and transparency are non-negotiable.' },
];

export const Team: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#080910] text-white">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#080910]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-1.5">
                        <Logo variant="icon" size="sm" suppressLink />
                        <span className="text-xl font-display font-bold text-white tracking-tight">Hikarii</span>
                    </Link>
                    <Link
                        to="/signup"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white text-sm font-bold hover:from-primary-500 hover:to-accent-500 transition-all hover:scale-105"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-40 pb-24 px-6 relative overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary-600/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="relative max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-300 text-sm font-semibold mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
                        The People Behind Hikarii
                    </div>
                    <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight mb-6 leading-[1.05]">
                        Built by people who{' '}
                        <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                            live this too
                        </span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                        We got tired of juggling spreadsheets, reminder apps, and budget trackers separately.
                        So we built the one system we always wanted.
                    </p>
                </div>
            </section>

            {/* Team Cards */}
            <section className="py-16 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className="group relative bg-[#0F111A] border border-white/[0.07] rounded-3xl overflow-hidden hover:bg-[#151824] hover:border-white/10 transition-all duration-500 flex flex-col"
                        >
                            {/* Top Color Block */}
                            <div className={`h-32 w-full bg-gradient-to-r ${member.gradient}`}></div>

                            {/* Content Block */}
                            <div className="px-8 pb-8 pt-0 flex flex-col items-center flex-grow text-center">
                                {/* Avatar (overlapping) */}
                                <div className="relative -mt-16 mb-5">
                                    {member.imageUrl ? (
                                        <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full object-cover border-[6px] border-[#0F111A] shadow-xl group-hover:border-[#151824] transition-colors duration-500 bg-[#0F111A]" />
                                    ) : (
                                        <div className={`w-32 h-32 rounded-full border-[6px] border-[#0F111A] shadow-xl group-hover:border-[#151824] transition-colors duration-500 bg-gradient-to-br ${member.gradient} flex items-center justify-center text-4xl font-black text-white`}>
                                            {member.initials}
                                        </div>
                                    )}
                                </div>

                                {/* Text */}
                                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-400 mb-5">{member.role}</p>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{member.bio}</p>

                                {/* Social Links */}
                                {member.links && Object.keys(member.links).length > 0 && (
                                    <div className="flex items-center justify-center gap-4 w-full border-t border-white/[0.06] pt-6 mt-auto">
                                        {member.links.linkedin && (
                                            <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.links.twitter && (
                                            <a href={member.links.twitter} target="_blank" rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.links.website && (
                                            <a href={member.links.website} target="_blank" rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                                <Globe className="w-4 h-4" />
                                            </a>
                                        )}
                                        {member.links.instagram && (
                                            <a href={member.links.instagram} target="_blank" rel="noopener noreferrer"
                                                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
                                                <Instagram className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Values */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">What drives us</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Our values are baked into every pixel and line of code.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {values.map((v) => (
                            <div key={v.title} className="flex gap-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-7 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500 group">
                                <div className={`shrink-0 w-16 h-16 rounded-2xl ${v.bg} border flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl`}>
                                    <v.icon className={`w-8 h-8 ${v.color}`} strokeWidth={1.5} />
                                </div>
                                <div className="flex-1 pt-1">
                                    <h3 className="text-white font-bold text-lg mb-2 tracking-wide group-hover:text-primary-400 transition-colors">{v.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-5">Want to join us?</h2>
                    <p className="text-slate-400 mb-10 leading-relaxed">
                        We are always looking for passionate people who believe that clarity is a superpower. Reach out.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 text-white font-bold hover:from-primary-500 hover:to-accent-500 transition-all hover:scale-105 shadow-xl shadow-primary-600/20"
                    >
                        Get in Touch <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

