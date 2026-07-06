import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Server, Eye, Key, FileCheck, Cpu, Globe, Database } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const Security: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#080910] text-slate-100 selection:bg-secondary-500/30 overflow-x-hidden flex flex-col deep-dark">
            <Navbar />

            {/* Content */}
            <div className="container mx-auto px-6 py-20 max-w-6xl relative">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
                
                <div className="text-center mb-24">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-500/10 group">
                        <Shield className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <h1 className="text-5xl md:text-8xl font-display font-bold text-white mb-8 tracking-tight">
                        Institutional Security
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                        We deploy defense-in-depth architecture to safeguard your most sensitive data. Our security protocols are engineered for resilience and absolute privacy.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-32">
                    <section className="bg-[#0D0F1A] p-12 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Lock className="w-16 h-16 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Advanced Encryption</h2>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">In Transit</h4>
                                <p className="text-slate-400 leading-relaxed">All external communication is enforced over TLS 1.3 with Perfect Forward Secrecy, ensuring data cannot be intercepted or decrypted post-session.</p>
                            </div>
                            <div>
                                <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">At Rest</h4>
                                <p className="text-slate-400 leading-relaxed">Databases and object storage utilize AES-256 block-level encryption with keys managed via FIPS 140-2 Level 3 hardware security modules (HSMs).</p>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#0D0F1A] p-12 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Cpu className="w-16 h-16 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Compute Integrity</h2>
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-primary-400 font-bold text-sm uppercase tracking-widest mb-2">Runtime Protection</h4>
                                <p className="text-slate-400 leading-relaxed">Our application environment utilizes container isolation with read-only filesystems and real-time process monitoring to prevent unauthorized execution.</p>
                            </div>
                            <div>
                                <h4 className="text-primary-400 font-bold text-sm uppercase tracking-widest mb-2">Access Lifecycle</h4>
                                <p className="text-slate-400 leading-relaxed">Zero-trust administrative access requires multi-factor authentication (MFA) and is restricted via transient, short-lived IAM credentials.</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                    {[
                        { icon: Globe, title: "Edge Protection", desc: "Enterprise-grade WAF and DDoS mitigation to neutralize threats before they reach our core network." },
                        { icon: Database, title: "Data Isolation", desc: "Logically separated data environments with strict VPC peering and ingress/egress filtering." },
                        { icon: FileCheck, title: "Continuous Audits", desc: "Automated vulnerability scanning and regular third-party penetration testing to ensure defensive posture." }
                    ].map((item, i) => (
                        <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                            <item.icon className="w-8 h-8 text-slate-500 mb-6 group-hover:text-white transition-colors" />
                            <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-primary-500/10" />
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight relative">Responsible Disclosure</h2>
                    <p className="text-slate-400 mb-12 max-w-2xl mx-auto relative text-lg">If you are a security researcher and believe you have discovered a vulnerability, please reach out via our secure channel. We operate a private bug bounty program.</p>
                    <a href="mailto:security@hikarii.org" className="relative inline-flex items-center justify-center px-16 py-6 rounded-2xl bg-white text-black font-black tracking-[0.2em] uppercase text-xs hover:bg-slate-200 transition-all shadow-xl">
                        Contact Security Operations
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
};
