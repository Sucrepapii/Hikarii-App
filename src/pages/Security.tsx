import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Shield, Lock, Server } from 'lucide-react';

export const Security: React.FC = () => {
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
                <div className="text-center mb-16">
                    <Shield className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Security at Hikari</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300">Your data is your business. Protecting it is ours.</p>
                </div>

                <div className="space-y-12">
                    <section>
                        <div className="flex items-start gap-4">
                            <Lock className="w-6 h-6 text-indigo-500 mt-1" />
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Encryption</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    All data is encrypted in transit using TLS 1.2+ and at rest using AES-256 encryption.
                                    We use industry-standard protocols to ensure that your financial and task data remains private.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-start gap-4">
                            <Server className="w-6 h-6 text-indigo-500 mt-1" />
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Infrastructure</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                    Hikari is hosted on secure, compliant cloud infrastructure providers.
                                    We maintain rigorous access controls and conduct regular security audits.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
};
