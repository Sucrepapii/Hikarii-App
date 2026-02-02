import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Mail, MessageSquare } from 'lucide-react';

export const Contact: React.FC = () => {
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

            <main className="flex-grow pt-32 px-6 max-w-4xl mx-auto w-full">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">Contact Us</h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
                    We'd love to hear from you. Whether you have a question about features, pricing, or need support, our team is ready to answer all your questions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <Mail className="w-8 h-8 text-indigo-500 mb-6" />
                        <h3 className="text-xl font-bold mb-2">Email Support</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">For general inquiries and technical assistance.</p>
                        <a href="mailto:support@hikariapp.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">support@hikariapp.com</a>
                    </div>

                    <div className="p-8 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                        <MessageSquare className="w-8 h-8 text-purple-500 mb-6" />
                        <h3 className="text-xl font-bold mb-2">Sales & Partnerships</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6">For enterprise solutions and partnership opportunities.</p>
                        <a href="mailto:sales@hikariapp.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">sales@hikariapp.com</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
