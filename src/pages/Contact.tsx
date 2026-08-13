import React, { useState } from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Mail, MessageSquare, Send, Globe, Shield } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to send message');

            toast.success("Message sent! Check your inbox for confirmation.");
            (e.target as HTMLFormElement).reset();
            navigate('/thank-you');
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#080910] font-sans text-slate-100 flex flex-col selection:bg-accent-500/30 overflow-x-hidden deep-dark">
            <Navbar />

            <main className="flex-grow pt-32 pb-20 px-6 w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Info */}
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-600/10 rounded-full blur-[100px] -z-10" />
                        <h1 className="text-4xl md:text-7xl font-display font-bold mb-8 tracking-tight">Get in touch</h1>
                        <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-lg">
                            Have a question about the platform? Interested in enterprise plans?
                            Just want to say hello? We're listening. <br/><br/>
                            <span className="text-emerald-400 font-semibold">Our promise: We respond to all inquiries within 24 hours.</span>
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-start gap-5 p-8 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-primary-500/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-400 border border-primary-500/20 shadow-lg shadow-primary-500/10 group-hover:scale-110 transition-transform">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-white">Email Support</h3>
                                    <p className="text-slate-500 text-sm mb-3 leading-relaxed">For general inquiries and technical help.</p>
                                    <a href="mailto:support@Hikariii.org" className="text-primary-400 font-black tracking-widest text-[10px] uppercase hover:text-white transition-colors">support@Hikariii.org</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 p-8 rounded-[2rem] bg-[#0D0F1A] border border-white/[0.06] hover:border-accent-500/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-accent-500/10 rounded-2xl flex items-center justify-center text-accent-400 border border-accent-500/20 shadow-lg shadow-accent-500/10 group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1 text-white">Sales & Enterprise</h3>
                                    <p className="text-slate-500 text-sm mb-3 leading-relaxed">For teams larger than 20 people.</p>
                                    <a href="mailto:support@Hikariii.org" className="text-accent-400 font-black tracking-widest text-[10px] uppercase hover:text-white transition-colors">support@Hikariii.org</a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Interactive Form */}
                    <div className="bg-[#0D0F1A] p-8 md:p-12 rounded-[2.5rem] border border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-600/5 rounded-full blur-[100px] -z-10" />

                        <h2 className="text-2xl font-bold mb-8 relative z-10 tracking-tight text-white">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">First Name</label>
                                    <input
                                        name="firstName"
                                        required
                                        type="text"
                                        className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 focus:border-primary-500/50 outline-none transition-all"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">Last Name</label>
                                    <input
                                        name="lastName"
                                        required
                                        type="text"
                                        className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 focus:border-primary-500/50 outline-none transition-all"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">Email Address</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 focus:border-primary-500/50 outline-none transition-all"
                                    placeholder="jane@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">Subject</label>
                                <div className="relative">
                                    <select
                                        name="subject"
                                        className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white focus:border-primary-500/50 outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="General Support" className="bg-[#0F111A] text-white">General Support</option>
                                        <option value="Billing Question" className="bg-[#0F111A] text-white">Billing Question</option>
                                        <option value="Feature Request" className="bg-[#0F111A] text-white">Feature Request</option>
                                        <option value="Enterprise Sales" className="bg-[#0F111A] text-white">Enterprise Sales</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none opacity-30">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-5 py-4 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-slate-700 focus:border-primary-500/50 outline-none transition-all resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 text-xs font-black tracking-widest uppercase rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-xl shadow-primary-500/25 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] border-0"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <>
                                        Send Message <Send className="w-4 h-4" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
