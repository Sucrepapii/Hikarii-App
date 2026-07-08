import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Logo } from '../common/Logo';

export const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const isAuthenticated = false; // Static marketing site assumes unauthenticated state
    const router = useRouter();

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#080910]/80 backdrop-blur-xl border-b border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-6 h-[68px] flex items-center justify-between">
                <div className="flex items-center gap-2 group">
                    <Link href="/" className="flex items-center gap-2">
                        <Logo variant="full" size="md" suppressLink={true} />
                    </Link>
                    <span className="text-sm font-medium bg-gradient-to-r from-primary-500 via-amber-500 to-primary-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer overflow-hidden whitespace-nowrap opacity-0 max-w-0 group-hover:opacity-100 group-hover:max-w-xs transition-all duration-700 ease-out pl-2 border-l border-white/10 hidden md:block">
                        Clarity. Focus. Control.
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/pricing" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Pricing
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Who is Hikari For?
                    </Link>
                    <Link href="/help/article/ultimate-guide-hikari-method" className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors">
                        The Ultimate Guide
                    </Link>
                    {!isAuthenticated && (
                        <Link href="https://app.hikarii.org/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Login</Link>
                    )}
                    <Button
                        onClick={() => router.push('https://app.hikarii.org/signup')}
                        className="bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:from-primary-500 hover:to-accent-500 rounded-full px-5 h-9 text-sm font-semibold border-0 shadow-md shadow-primary-500/20 transition-all hover:scale-105"
                    >
                        {isAuthenticated ? 'Dashboard' : 'Get Started'}
                    </Button>
                </div>

                <div className="md:hidden flex items-center gap-4">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-300 focus:outline-none">
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {isMenuOpen && (
                <div className="md:hidden absolute top-[68px] left-0 w-full bg-[#0D0F1A] border-b border-white/5 py-4 px-6 flex flex-col gap-4 shadow-2xl animate-fade-in-up">
                    <Link href="/pricing" className="text-lg font-medium text-slate-300 py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>
                        Pricing
                    </Link>
                    <Link href="/about" className="text-lg font-medium text-slate-300 py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>
                        Who is Hikari For?
                    </Link>
                    <Link href="/help/article/ultimate-guide-hikari-method" className="text-lg font-medium text-primary-400 py-2 border-b border-white/5" onClick={() => setIsMenuOpen(false)}>
                        The Ultimate Guide
                    </Link>
                    {!isAuthenticated && (
                        <Link href="https://app.hikarii.org/login" className="text-lg font-medium text-slate-300 py-2" onClick={() => setIsMenuOpen(false)}>
                            Login
                        </Link>
                    )}
                    <Button
                        onClick={() => {
                            router.push('https://app.hikarii.org/signup');
                            setIsMenuOpen(false);
                        }}
                        className="bg-gradient-to-r from-primary-600 to-accent-600 text-white w-full py-4 rounded-xl font-bold"
                    >
                        {isAuthenticated ? 'Dashboard' : 'Get Started'}
                    </Button>
                </div>
            )}
        </nav>
    );
};
