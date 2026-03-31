import React from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Shield, Lock, Server, Eye, Key, FileCheck } from 'lucide-react';

export const Security: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-[#0B0C15] font-sans text-slate-900 dark:text-slate-100 flex flex-col">
            <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0B0C15]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                        <Logo variant="full" size="md" suppressLink={true} />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate('/')} variant="ghost" size="sm">Back to Home</Button>
                    </div>
                </div>
            </nav>

            <main className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
                <div className="text-center mb-20">
                    <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 animate-fade-in-up">
                        <Shield className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">Security First</h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        We treat your financial and task data with bank-grade security protocols.
                        Your privacy is not an afterthought—it's the foundation of our architecture.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    {/* Encryption */}
                    <section className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <Lock className="w-8 h-8 text-indigo-500" />
                            <h2 className="text-2xl font-bold">End-to-End Protection</h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            <strong>Data in Transit:</strong> All data sent between your browser and our servers is encrypted using industry-standard TLS 1.2+ (Transport Layer Security).
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            <strong>Data at Rest:</strong> Your sensitive data stored in our databases is encrypted using AES-256 encryption algorithms. Even if a physical disk were compromised, your data would remain unreadable.
                        </p>
                    </section>

                    {/* Infrastructure */}
                    <section className="bg-slate-50 dark:bg-white/5 p-8 rounded-3xl border border-slate-200 dark:border-white/10">
                        <div className="flex items-center gap-4 mb-6">
                            <Server className="w-8 h-8 text-blue-500" />
                            <h2 className="text-2xl font-bold">Secure Infrastructure</h2>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            Hikari runs on <strong>Amazon Web Services (AWS)</strong>, using logically isolated Virtual Private Clouds (VPCs). We utilize multi-zone redundancy to ensure high availability and protect against data loss.
                        </p>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            We perform regular automated backups and strictly limit employee access to production servers via Zero Trust principles.
                        </p>
                    </section>
                </div>

                <h2 className="text-3xl font-bold mb-10 text-center">Compliance & Monitoring</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="text-center p-6">
                        <Eye className="w-10 h-10 text-purple-500 mx-auto mb-4" />
                        <h3 className="font-bold text-lg mb-2">24/7 Monitoring</h3>
                        <p className="text-sm text-slate-500">Real-time threat detection systems monitor our network for suspicious activity.</p>
                    </div>
                    <div className="text-center p-6">
                        <Key className="w-10 h-10 text-pink-500 mx-auto mb-4" />
                        <h3 className="font-bold text-lg mb-2">Access Control</h3>
                        <p className="text-sm text-slate-500">Strict role-based access control (RBAC) ensures only authorized personnel can access system internals.</p>
                    </div>
                    <div className="text-center p-6">
                        <FileCheck className="w-10 h-10 text-orange-500 mx-auto mb-4" />
                        <h3 className="font-bold text-lg mb-2">Regular Audits</h3>
                        <p className="text-sm text-slate-500">We conduct third-party vulnerability assessments and penetration testing annually.</p>
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 text-center">
                    <h3 className="text-2xl font-bold mb-4">Report a Vulnerability</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
                        Security is a community effort. If you believe you’ve found a security bug in Hikari, please report it to our security team. We engage in specific bug bounties for severe disclosures.
                    </p>
                    <a href="mailto:support@hikarii.org" className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors">
                        Contact Security Team
                    </a>
                </div>

            </main>
            <Footer />
        </div>
    );
};
