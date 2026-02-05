import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-slate-900 border-t border-white/5 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <Logo variant="icon" size="md" />
                            <span className="text-2xl font-display font-bold text-white tracking-tight">Hikari</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Master your life and money with a methodology that actually works.
                            Gain clarity, find focus, and achieve financial freedom.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Product</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/#features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                            <li><Link to="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Resources</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Blog</a></li>
                            <li><Link to="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                            <li><Link to="/faq" className="hover:text-indigo-400 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="font-bold text-white mb-6">Company</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} Hikari App. All rights reserved.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                        <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms</Link>
                        <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy</Link>
                        <Link to="/security" className="hover:text-indigo-400 transition-colors">Security</Link>
                        <Link to="/accessibility" className="hover:text-indigo-400 transition-colors">Accessibility</Link>
                        <a href="#" className="flex items-center gap-2 hover:text-emerald-400 transition-colors group">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            System Status
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
