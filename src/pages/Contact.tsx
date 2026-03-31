import React, { useState } from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Mail, MessageSquare, Send } from 'lucide-react';
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
        } catch (error) {
            console.error(error);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

            <main className="flex-grow pt-32 pb-20 px-6 w-full max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Left Column: Info */}
                    <div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-8">Get in touch</h1>
                        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 leading-relaxed">
                            Have a question about the platform? Interested in enterprise plans?
                            Just want to say hello? We're listening.
                        </p>

                        <div className="space-y-8 mb-12">
                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-indigo-500/30 transition-colors">
                                <Mail className="w-6 h-6 text-indigo-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Email Support</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-2">For general inquiries and technical help.</p>
                                    <a href="mailto:support@hikarii.org" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">support@hikarii.org</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/30 transition-colors">
                                <MessageSquare className="w-6 h-6 text-purple-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Sales & Enterprise</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-2">For teams larger than 20 people.</p>
                                    <a href="mailto:support@hikarii.org" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">support@hikarii.org</a>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right Column: Interactive Form */}
                    <div className="bg-white dark:bg-[#0F111A] p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl relative overflow-hidden group">
                        {/* Decorative dark mode glow */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl opacity-0 dark:group-hover:opacity-100 transition-opacity"></div>

                        <h2 className="text-2xl font-bold mb-6 relative z-10">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">First Name</label>
                                    <input
                                        name="firstName"
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                                        placeholder="Jane"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Last Name</label>
                                    <input
                                        name="lastName"
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
                                <input
                                    name="email"
                                    required
                                    type="email"
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
                                    placeholder="jane@company.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Subject</label>
                                <div className="relative">
                                    <select
                                        name="subject"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer shadow-sm"
                                    >
                                        <option value="General Support" className="dark:bg-[#0F111A] text-slate-900 dark:text-white">General Support</option>
                                        <option value="Billing Question" className="dark:bg-[#0F111A] text-slate-900 dark:text-white">Billing Question</option>
                                        <option value="Feature Request" className="dark:bg-[#0F111A] text-slate-900 dark:text-white">Feature Request</option>
                                        <option value="Enterprise Sales" className="dark:bg-[#0F111A] text-slate-900 dark:text-white">Enterprise Sales</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-50">
                                        <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm resize-none"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 text-base font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
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
