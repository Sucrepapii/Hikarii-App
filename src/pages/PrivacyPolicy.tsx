import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#080910] text-slate-100 selection:bg-accent-500/30 overflow-x-hidden flex flex-col deep-dark">
            <Navbar />

            {/* Content */}
            <div className="container mx-auto px-6 py-20 max-w-5xl relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px] pointer-events-none -z-10" />

                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
                    Privacy Policy
                </h1>
                <p className="text-xs font-black tracking-[0.4em] uppercase text-slate-500 mb-20 border-b border-white/[0.06] pb-10">
                    Date Modified: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="space-y-12">
                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary-500/50 group-hover:from-primary-500 hover:to-accent-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">1. Scope of Data Processing</h2>
                        <p className="text-slate-400 leading-relaxed text-lg mb-6">
                            This Privacy Policy describes the policies and procedures of Hikari World Ltd ("Company," "we," "us," or "our") on the collection, use, and disclosure of your information when you use the Service and tells you about your privacy rights and how the law protects you.
                        </p>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            We use your Personal Data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this Privacy Policy. This document is drafted to comply with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
                        </p>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-accent-500/50 group-hover:bg-accent-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">2. Information Collection and Categorization</h2>
                        <div className="space-y-10">
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4">Personal Identifiable Information (PII)</h3>
                                <p className="text-slate-400 mb-6">Under Art. 6(1)(b) of the GDPR, we process the following for contract fulfillment:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['Legal Name', 'Email Address', 'Hashed Credentials', 'Billing Telemetry'].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 rounded-2xl bg-white/5 border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-4">Device and Network Telemetry</h3>
                                <p className="text-slate-400 mb-6">Processed under legitimate interest (Art. 6(1)(f) GDPR) for security and performance optimization:</p>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['IP Addresses', 'Browser Fingerprints', 'Session Logs', 'Geographical Metadata'].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-slate-300">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">3. Data Subject Rights (GDPR/CCPA)</h2>
                        <p className="text-slate-400 leading-relaxed text-lg mb-10">
                            Regardless of your residency, Hikari extends enterprise-grade privacy rights to all users globally:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Right to Access', desc: 'Request full disclosure of all data points we hold.' },
                                { title: 'Right to Rectification', desc: 'Update or correct any inaccurate personal data.' },
                                { title: 'Right to Erasure', desc: 'The "Right to be Forgotten" - complete data deletion.' },
                                { title: 'Data Portability', desc: 'Export your data in a machine-readable format.' },
                                { title: 'Opt-Out Rights', desc: 'Object to processing or withdraw consent at any time.' },
                                { title: 'Non-Discrimination', desc: 'Equal service quality even if privacy rights are exercised.' }
                            ].map((right, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all">
                                    <h4 className="text-white font-bold mb-2">{right.title}</h4>
                                    <p className="text-slate-500 text-sm leading-relaxed">{right.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-accent-500/50 group-hover:bg-accent-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">4. International Transfers and Security</h2>
                        <p className="text-slate-400 leading-relaxed text-lg mb-8">
                            Your information may be transferred to, and maintained on, computers located outside of your state, province, or country. We utilize <strong>Standard Contractual Clauses (SCCs)</strong> approved by the European Commission to ensure a high level of data protection.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                                <h4 className="text-white font-bold mb-4">Encryption Standards</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">All data is encrypted in transit via TLS 1.3 and at rest using FIPS 140-2 validated AES-256 cryptographic modules.</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                                <h4 className="text-white font-bold mb-4">Data Retention</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">We retain personal data only for as long as necessary to fulfill the purposes outlined in this policy or as required by statutory retention periods.</p>
                            </div>
                        </div>
                    </section>

                    <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-primary-500/10" />
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight relative">Data Protection Officer</h2>
                        <p className="text-slate-400 mb-10 max-w-2xl mx-auto relative text-lg">For all inquiries regarding data processing, cross-border transfers, or to exercise your statutory rights, please contact our DPO.</p>
                        <a href="mailto:privacy@hikarii.org" className="relative inline-flex items-center justify-center px-12 py-5 rounded-2xl bg-white text-black font-black tracking-[0.2em] uppercase text-xs hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
                            Contact DPO
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
