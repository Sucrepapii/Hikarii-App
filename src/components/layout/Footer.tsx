import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { Logo } from '../common/Logo';
import { LeadCaptureForm } from '../common/LeadCaptureForm';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-[#080910] border-t border-white/[0.06] pt-32 pb-12 overflow-hidden relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-1.5 mb-6 group">
                            <Logo variant="icon" size="md" suppressLink={true} />
                            <span className="text-2xl font-display font-bold text-white tracking-tight">Hikari</span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
                            Master your life and money with a methodology that actually works.
                            Gain clarity, find focus, and achieve financial freedom.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="https://www.instagram.com/hikariiapp?igsh=ejNzOGsybWltMWk4&utm_source=qr" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://x.com/hikariiapp?s=21&t=QnoqdrIaByUDrhoWj0KuLA" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/company/hikari-world/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/#features" className="hover:text-cyan-400 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-cyan-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/help/article/ultimate-guide-hikari-method" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">The Ultimate Guide</Link></li>
                            <li><a href="https://www.linkedin.com/company/hikari-world/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Blog</a></li>
                            <li><Link to="/help" className="hover:text-cyan-400 transition-colors">Help Center</Link></li>
                            <li><Link to="/faq" className="hover:text-cyan-400 transition-colors">FAQ</Link></li>
                            <li><Link to="/feedback" className="hover:text-cyan-400 transition-colors">Feedback</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-[10px] font-black tracking-[0.3em] text-slate-500 uppercase mb-8">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact</Link></li>
                            <li className="pt-2">
                                <span className="block text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">Support</span>
                                <a href="tel:+2349024129891" className="text-cyan-400 hover:text-white transition-all font-bold">+234 902 412 9891</a>
                            </li>
                        </ul>
                    </div>

                    {/* Subscription / Lead Magnet Column */}
                    <div className="col-span-2 md:col-span-2 lg:col-span-1 flex flex-col justify-start">
                        <LeadCaptureForm
                            variant="footer"
                            source="FOOTER_SIGNUP"
                            title="STAY FOCUSED"
                            description="Radical clarity delivered to your inbox."
                        />
                    </div>
                </div>

                <div className="pt-12 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-slate-600 text-xs font-medium tracking-wide">
                        &copy; {new Date().getFullYear()} Hikari. Systems for Living.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/security" className="hover:text-white transition-colors">Security</Link>
                        <Link to="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
                        <a href="#" className="flex items-center gap-3 hover:text-emerald-400 transition-colors group">
                            <div className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500/40 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </div>
                            Status
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
