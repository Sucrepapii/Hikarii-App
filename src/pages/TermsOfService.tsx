import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const TermsOfService: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#080910] text-slate-100 selection:bg-secondary-500/30 overflow-x-hidden flex flex-col deep-dark">
            <Navbar />

            {/* Content */}
            <div className="container mx-auto px-6 py-20 max-w-5xl relative">
                <div className="absolute top-0 right-1/2 translate-x-1/2 w-[800px] h-[800px] bg-primary-600/5 rounded-full blur-[150px] pointer-events-none -z-10" />

                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight">
                    Terms of Service
                </h1>
                <p className="text-xs font-black tracking-[0.4em] uppercase text-slate-500 mb-20 border-b border-white/[0.06] pb-10">
                    Last Modified: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <div className="space-y-12">
                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-primary-500/50 group-hover:from-primary-500 hover:to-accent-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">1. Preamble and Acceptance</h2>
                        <p className="text-slate-400 leading-relaxed text-lg mb-6">
                            These Terms of Service ("Agreement") constitute a legally binding contract between you ("User," "you," or "your") and Hikari World Ltd ("Company," "we," "us," or "our"). This Agreement governs your access to and use of the Hikari application, website, and associated services (collectively, the "Service").
                        </p>
                        <p className="text-slate-400 leading-relaxed text-lg italic border-l-2 border-white/10 pl-6">
                            BY ACCESSING, DOWNLOADING, OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS AGREEMENT. IF YOU DO NOT AGREE TO THESE TERMS, YOU ARE EXPRESSLY PROHIBITED FROM USING THE SERVICE AND MUST DISCONTINUE USE IMMEDIATELY.
                        </p>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary-500/50 group-hover:bg-secondary-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">2. Eligibility and Account Stewardship</h2>
                        <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
                            <p>To use the Service, you must be at least eighteen (18) years of age or the legal age of majority in your jurisdiction. By creating an account, you represent and warrant that all information provided is accurate, current, and complete.</p>
                            <p>You are solely responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. We reserve the right to suspend or terminate accounts that provide false information or compromise system integrity.</p>
                        </div>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-secondary-500/50 group-hover:bg-secondary-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">3. Intellectual Property Rights</h2>
                        <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
                            <p>The Service, including its "look and feel," proprietary algorithms, source code, and branding, is the exclusive property of Hikari and is protected by international copyright, trademark, and patent laws.</p>
                            <p><strong>License Grant:</strong> Subject to your compliance with this Agreement, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal or internal business purposes.</p>
                            <p><strong>User Content:</strong> You retain ownership of any data or content you upload ("User Content"). However, you grant us a worldwide, royalty-free license to host, store, and process User Content solely to provide the Service to you.</p>
                        </div>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-amber-500/50 group-hover:bg-amber-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">4. Prohibited Activities</h2>
                        <ul className="space-y-4 text-slate-400 leading-relaxed">
                            {[
                                "Reverse engineering, decompiling, or attempting to extract source code.",
                                "Using the Service for any illegal, fraudulent, or unauthorized purpose.",
                                "Circumventing technical measures designed to protect the Service.",
                                "Automated scraping or data extraction without express written consent.",
                                "Uploading malicious code, viruses, or disruptive technology."
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2.5" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-red-500/50 group-hover:bg-red-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">5. Limitation of Liability</h2>
                        <p className="text-slate-400 leading-relaxed text-lg mb-6">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, HIKARI AND ITS AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF YOUR USE OF THE SERVICE.
                        </p>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            OUR TOTAL LIABILITY FOR ANY CLAIM ARISING UNDER THIS AGREEMENT SHALL NOT EXCEED THE GREATER OF $100 USD OR THE AMOUNT PAID BY YOU FOR THE SERVICE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                        </p>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">6. Indemnification</h2>
                        <p className="text-slate-400 leading-relaxed text-lg">
                            You agree to indemnify, defend, and hold harmless Hikari and its officers from and against any claims, damages, liabilities, and expenses arising out of your breach of this Agreement, your use of the Service, or your violation of any third-party rights.
                        </p>
                    </section>

                    <section className="bg-[#0D0F1A] p-10 md:p-16 rounded-[3rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-2 h-full bg-pink-500/50 group-hover:bg-pink-500 transition-colors" />
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">7. Dispute Resolution and Governing Law</h2>
                        <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
                            <p><strong>Governing Law:</strong> This Agreement shall be governed by and construed in accordance with the laws of the United Kingdom, without regard to its conflict of law principles.</p>
                            <p><strong>Arbitration:</strong> Any dispute arising out of or relating to this Agreement shall be settled by binding arbitration conducted in London, UK. Each party shall bear its own costs and fees.</p>
                        </div>
                    </section>

                    <div className="bg-white/5 p-12 rounded-[3rem] border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/10 via-transparent to-secondary-500/10" />
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight relative">Questions or Concerns?</h2>
                        <p className="text-slate-400 mb-10 max-w-2xl mx-auto relative text-lg">Our legal department is available to clarify any aspects of these terms to ensure total transparency.</p>
                        <a href="mailto:legal@hikarii.org" className="relative inline-flex items-center justify-center px-12 py-5 rounded-2xl bg-white text-black font-black tracking-[0.2em] uppercase text-xs hover:bg-slate-200 transition-all shadow-xl shadow-white/5">
                            Contact Legal Counsel
                        </a>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
