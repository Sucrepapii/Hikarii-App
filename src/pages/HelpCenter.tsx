import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Search, Book, HelpCircle, FileQuestion } from 'lucide-react';

export const HelpCenter: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate('/')} variant="ghost" size="sm">Back to Home</Button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-32 px-6 max-w-6xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">How can we help?</h1>
                    <div className="max-w-2xl mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full px-6 py-4 pl-14 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-[#0F111A] outline-none transition-all text-lg"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50 transition-colors group cursor-pointer">
                        <Book className="w-10 h-10 text-indigo-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-3">Getting Started</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Everything you need to know to get your tasks and budget set up.</p>
                        <span className="text-indigo-600 dark:text-indigo-400 font-medium">Read Articles &rarr;</span>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 transition-colors group cursor-pointer">
                        <FileQuestion className="w-10 h-10 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-3">Account & Billing</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Manage your subscription, payment methods, and account settings.</p>
                        <span className="text-purple-600 dark:text-purple-400 font-medium">Read Articles &rarr;</span>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-pink-500/50 transition-colors group cursor-pointer">
                        <HelpCircle className="w-10 h-10 text-pink-500 mb-6 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold mb-3">Troubleshooting</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-4">Solutions for common issues and how to contact support.</p>
                        <span className="text-pink-600 dark:text-pink-400 font-medium">Read Articles &rarr;</span>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
