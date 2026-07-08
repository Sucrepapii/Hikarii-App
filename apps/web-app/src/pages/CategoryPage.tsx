import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { helpArticles } from '../data/helpArticles';
import { Footer } from '../components/layout/Footer';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { ArrowLeft, Book, HelpCircle, FileQuestion, ArrowRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();

    // Decode the category from the URL
    const decodedCategory = decodeURIComponent(category || '');
    const articles = helpArticles.filter(a => a.category === decodedCategory);

    const getIcon = (cat: string) => {
        switch (cat) {
            case 'Getting Started': return <Book className="w-8 h-8 text-primary-500" />;
            case 'Account & Billing': return <FileQuestion className="w-8 h-8 text-accent-500" />;
            case 'Troubleshooting': return <HelpCircle className="w-8 h-8 text-pink-500" />;
            default: return <Book className="w-8 h-8 text-slate-500" />;
        }
    };

    if (articles.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#080910] text-white">
                <h1 className="text-2xl font-bold mb-4">Category not found</h1>
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
                        <Button onClick={() => navigate('/help')} variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Help
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-32 px-6 max-w-4xl mx-auto w-full pb-20">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-white/5 border border-white/10 mb-6 shadow-lg shadow-black/20">
                        {getIcon(decodedCategory)}
                    </div>
                    <h1 className="text-4xl font-display font-bold mb-4 text-white">{decodedCategory}</h1>
                    <p className="text-slate-400 text-lg">Browse all articles in this category</p>
                </div>

                <div className="grid gap-4">
                    {articles.map((article) => (
                        <Link key={article.id} to={`/help/article/${article.slug}`} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary-500/30 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md">
                            <div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-400 transition-colors text-white">{article.title}</h3>
                                <p className="text-slate-400">{article.excerpt}</p>
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-500 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
};
