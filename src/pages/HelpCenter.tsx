import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Search, Book, HelpCircle, FileQuestion, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import { helpArticles } from '../data/helpArticles';
import { Navbar } from '../components/layout/Navbar';

export const HelpCenter: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = React.useState('');

    // Get article counts by category
    const getCount = (category: string) => helpArticles.filter(a => a.category === category).length;

    // Get 3 random popular articles
    const popularArticles = helpArticles
        .filter(a => a.title !== 'Setting up your workspace')
        .slice(0, 3);

    // Search results
    const searchResults = searchQuery.length > 0
        ? helpArticles.filter(article =>
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.content.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <div className="min-h-screen bg-[#080910] font-sans text-slate-100 flex flex-col selection:bg-purple-500/30 overflow-x-hidden">
            <Navbar />

            <main className="flex-grow pt-32 px-6 max-w-6xl mx-auto w-full pb-20">
                {/* Search Hero */}
                <div className="text-center mb-20 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -z-10" />
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-8">
                        Hikari Support
                    </div>
                    <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tight">How can we help?</h1>
                    <div className="max-w-2xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for articles (e.g., 'workspace', 'cancel subscription')"
                                className="w-full px-8 py-6 pl-16 rounded-[2rem] bg-[#0D0F1A] border border-white/10 focus:border-indigo-500/50 focus:outline-none transition-all text-lg shadow-2xl placeholder:text-slate-600 text-white"
                            />
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                        </div>
                    </div>
                </div>

                {searchQuery.length > 0 ? (
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">
                            {searchResults.length} {searchResults.length === 1 ? 'Result' : 'Results'} for "{searchQuery}"
                        </h2>
                        {searchResults.length > 0 ? (
                            <div className="grid gap-4">
                                {searchResults.map((article) => (
                                    <Link key={article.id} to={`/help/article/${article.slug}`} className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xs font-medium px-2 py-1 rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">{article.category}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{article.title}</h3>
                                            <p className="text-slate-500 dark:text-slate-400">{article.excerpt}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">No results found</h3>
                                <p className="text-slate-500 dark:text-slate-400">Try adjusting your search terms or browse by category.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Popular Articles */}
                        <div className="mb-20">
                            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Popular Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {popularArticles.map((article) => (
                                    <Link key={article.id} to={`/help/article/${article.slug}`} className="p-4 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-between group">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{article.title}</span>
                                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        <h2 className="text-3xl font-bold mb-12 text-center tracking-tight">Browse by Category</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
                            <Link to="/help/category/Getting%20Started" className="p-8 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-indigo-500/30 transition-all duration-300 group block">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 shadow-lg shadow-indigo-500/10 group-hover:scale-110 transition-transform">
                                    <Book className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">Getting Started</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Account setup, first project, and interface tour.</p>
                                {getCount('Getting Started') > 0 && (
                                    <span className="text-indigo-400 text-xs font-black tracking-widest uppercase">{getCount('Getting Started')} Articles</span>
                                )}
                            </Link>

                            <Link to="/help/category/Account%20&%20Billing" className="p-8 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-purple-500/30 transition-all duration-300 group block">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 shadow-lg shadow-purple-500/10 group-hover:scale-110 transition-transform">
                                    <FileQuestion className="w-6 h-6 text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">Account & Billing</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Plans, payments, invoices, and settings.</p>
                                {getCount('Account & Billing') > 0 && (
                                    <span className="text-purple-400 text-xs font-black tracking-widest uppercase">{getCount('Account & Billing')} Articles</span>
                                )}
                            </Link>

                            <Link to="/help/category/Troubleshooting" className="p-8 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-pink-500/30 transition-all duration-300 group block">
                                <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 border border-pink-500/20 shadow-lg shadow-pink-500/10 group-hover:scale-110 transition-transform">
                                    <HelpCircle className="w-6 h-6 text-pink-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">Troubleshooting</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">Error messages, sync issues, and bugs.</p>
                                {getCount('Troubleshooting') > 0 && (
                                    <span className="text-pink-400 text-xs font-black tracking-widest uppercase">{getCount('Troubleshooting')} Articles</span>
                                )}
                            </Link>

                            <Link to="/help/category/Features%20&%20Integrations" className="p-8 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-emerald-500/30 transition-all duration-300 group block">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-lg shadow-emerald-500/10 group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">Features</h3>
                                <p className="text-sm text-slate-500 mb-6 leading-relaxed">WhatsApp, AI Smart Split, and more.</p>
                                {getCount('Features & Integrations') > 0 && (
                                    <span className="text-emerald-400 text-xs font-black tracking-widest uppercase">{getCount('Features & Integrations')} Articles</span>
                                )}
                            </Link>
                        </div>
                    </>
                )}

                {/* Contact CTA */}
                <div className="bg-[#0D0F1A] border border-white/[0.06] rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] -z-10" />
                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-yellow-400/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-yellow-400/20 shadow-lg shadow-yellow-400/10">
                            <Zap className="w-8 h-8 text-yellow-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Can't find what you're looking for?</h2>
                        <p className="text-slate-400 mb-10 text-lg max-w-md mx-auto leading-relaxed">Our support team is available Mon-Fri, 9am - 5pm EST. We usually respond in under 2 hours.</p>
                        <Button onClick={() => navigate('/contact')} size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white border-0 px-10 h-14 rounded-xl font-black tracking-widest uppercase text-xs shadow-xl shadow-indigo-500/25 transition-all hover:scale-105">Contact Support</Button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
