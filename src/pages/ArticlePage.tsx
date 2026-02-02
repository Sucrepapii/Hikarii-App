import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { helpArticles } from '../data/helpArticles';
import { Footer } from '../components/layout/Footer';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { ArrowLeft, Clock, Tag } from 'lucide-react';

export const ArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const article = helpArticles.find(a => a.slug === slug);

    if (!article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0B0C15] text-slate-900 dark:text-white">
                <h1 className="text-2xl font-bold mb-4">Article not found</h1>
                <Button onClick={() => navigate('/help')}>Return to Help Center</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate('/help')} variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Help
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-32 pb-20 px-6 max-w-3xl mx-auto w-full">
                <div className="mb-8">
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-6">
                        <span className="flex items-center gap-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full">
                            <Tag className="w-3 h-3" /> {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 3 min read
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-6">{article.title}</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-light">{article.excerpt}</p>
                </div>

                <article className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-indigo-600 dark:prose-a:text-indigo-400">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </article>

                <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/10">
                    <h3 className="font-bold text-lg mb-4">Was this article helpful?</h3>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-sm font-medium transition-colors">Yes, thanks!</button>
                        <button className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-sm font-medium transition-colors">Not really</button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
