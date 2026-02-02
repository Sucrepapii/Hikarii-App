import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';

export const Accessibility: React.FC = () => {
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
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-8">Accessibility Statement</h1>
                <div className="prose dark:prose-invert prose-lg max-w-none">
                    <p>
                        Hikari is committed to making our website and application accessible to everyone, including individuals with disabilities.
                    </p>
                    <p>
                        We strive to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                        We continuously test and improve our platform to ensure a seamless experience for all users.
                    </p>
                    <h3>Feedback</h3>
                    <p>
                        If you encounter any accessibility barriers on our site, please contact us at <a href="mailto:support@hikariapp.com" className="text-indigo-600 dark:text-indigo-400">support@hikariapp.com</a>.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};
