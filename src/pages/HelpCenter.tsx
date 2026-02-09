import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate, Link } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Search, Book, HelpCircle, FileQuestion, ArrowRight, Zap } from 'lucide-react';
import { helpArticles } from '../data/helpArticles';

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
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for articles (e.g., 'workspace', 'cancel subscription')"
                                className="w-full px-6 py-5 pl-14 rounded-full bg-white dark:bg-[#0F111A] border-2 border-slate-100 dark:border-white/10 focus:border-indigo-500 focus:outline-none transition-all text-lg shadow-xl"
                            />
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
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
                        <h2 className="text-2xl font-bold mb-8 text-center">Browse by Category</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                            <Link to="/help/category/Getting%20Started" className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group block">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Book className="w-6 h-6 text-indigo-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Getting Started</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Account setup, first project, and interface tour.</p>
                                {getCount('Getting Started') > 0 && (
                                    <span className="text-indigo-600 dark:text-indigo-400 text-sm font-bold">{getCount('Getting Started')} Articles</span>
                                )}
                            </Link>

                            <Link to="/help/category/Account%20&%20Billing" className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group block">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <FileQuestion className="w-6 h-6 text-purple-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Account & Billing</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Plans, payments, invoices, and settings.</p>
                                {getCount('Account & Billing') > 0 && (
                                    <span className="text-purple-600 dark:text-purple-400 text-sm font-bold">{getCount('Account & Billing')} Articles</span>
                                )}
                            </Link>

                            <Link to="/help/category/Troubleshooting" className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group block">
                                <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <HelpCircle className="w-6 h-6 text-pink-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Troubleshooting</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Error messages, sync issues, and bugs.</p>
                                {getCount('Troubleshooting') > 0 && (
                                    <span className="text-pink-600 dark:text-pink-400 text-sm font-bold">{getCount('Troubleshooting')} Articles</span>
                                )}
                            </Link>

                            <Link to="/help/category/Features%20&%20Integrations" className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer group block">
                                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Zap className="w-6 h-6 text-green-500" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Features & Integrations</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">WhatsApp, AI Smart Split, and more.</p>
                                {getCount('Features & Integrations') > 0 && (
                                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">{getCount('Features & Integrations')} Articles</span>
                                )}
                            </Link>
                        </div>
                    </>
                )}

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
