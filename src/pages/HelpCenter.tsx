import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Search, Book, HelpCircle, FileQuestion, ArrowRight, Video, Zap } from 'lucide-react';

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

            <main className="flex-grow pt-32 px-6 max-w-6xl mx-auto w-full pb-20">
                {/* Search Hero */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 text-sm font-medium mb-6">
                        Hikari Support
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">How can we help?</h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search for articles (e.g., 'how to connect bank', 'cancel subscription')"
                                className="w-full px-6 py-5 pl-14 rounded-full bg-white dark:bg-[#0F111A] border-2 border-slate-100 dark:border-white/10 focus:border-indigo-500 focus:outline-none transition-all text-lg shadow-xl"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                        </div>
                    </div>
                </div>

                {/* Popular Articles */}
                <div className="mb-20">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Popular Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {['Connecting your first bank account', 'How specifically does Smart Split work?', 'Understanding your Net Worth graph'].map((article, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{article}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Book className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Getting Started</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Account setup, first project, and interface tour.</p>
                        <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">6 Articles</span>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileQuestion className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Account & Billing</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Plans, payments, invoices, and settings.</p>
                        <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">4 Articles</span>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <HelpCircle className="w-6 h-6 text-pink-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Troubleshooting</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Error messages, sync issues, and bugs.</p>
                        <span className="text-pink-600 dark:text-pink-400 text-sm font-bold">8 Articles</span>
                    </div>

                    <div className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Video className="w-6 h-6 text-amber-500" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Video Tutorials</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Deep dives into advanced workflows.</p>
                        <span className="text-amber-600 dark:text-amber-400 text-sm font-bold">3 Videos</span>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-slate-900 dark:bg-indigo-900/10 rounded-3xl p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]"></div>
                    <div className="relative z-10">
                        <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
                        <p className="text-indigo-200 mb-8">Our support team is available Mon-Fri, 9am - 5pm EST.</p>
                        <Button onClick={() => navigate('/contact')} size="lg" className="bg-white text-indigo-900 hover:bg-slate-100">Contact Support</Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
