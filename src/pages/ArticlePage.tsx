import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { helpArticles } from '../data/helpArticles';
import { Footer } from '../components/layout/Footer';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const article = helpArticles.find(a => a.slug === slug);

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#080910] text-white">
                <h1 className="text-2xl font-bold mb-4">Article not found</h1>
                <Button onClick={() => navigate('/help')}>Return to Help Center</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080910] font-sans text-slate-100 flex flex-col deep-dark">
            <nav className="fixed top-0 w-full z-50 bg-[#080910]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" suppressLink={true} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-32 pb-20 px-6 max-w-3xl mx-auto w-full">
                <div className="mb-8">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                    <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full">
                        <Tag className="w-3 h-3" /> {article.category}
                    </div>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 3 min read
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white">{article.title}</h1>
                <p className="text-xl text-slate-400 leading-relaxed font-light">{article.excerpt}</p>
            </div>

            <article className="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-p:text-slate-300 prose-a:text-indigo-400">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </article>

                <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10">
                    <h3 className="font-bold text-lg mb-4 text-white">Was this article helpful?</h3>
                    <div className="flex gap-4">
                        <button
                            onClick={async () => {
                                try {
                                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                    await fetch(`${API_URL}/article-feedback`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ articleSlug: slug, isHelpful: true })
                                    });
                                    toast.success("Thanks for your feedback!");
                                } catch (error) {
                                    toast.success("Thanks for your feedback!"); // Still show success even if tracking fails
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-slate-300"
                        >
                            Yes, thanks!
                        </button>
                        <button
                            onClick={async () => {
                                try {
                                    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                                    await fetch(`${API_URL}/article-feedback`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ articleSlug: slug, isHelpful: false })
                                    });
                                    toast.success("Thanks for your feedback! We'll work on improving it.");
                                } catch (error) {
                                    toast.success("Thanks for your feedback!");
                                }
                            }}
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors text-slate-300"
                        >
                            Not really
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
