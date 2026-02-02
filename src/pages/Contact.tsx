import React, { useState } from 'react';
import { Footer } from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Mail, MessageSquare, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success("Message sent! We'll get back to you shortly.");
        }, 1500);
    };

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
                                    <a href="mailto:support@hikariapp.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">support@hikariapp.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-purple-500/30 transition-colors">
                                <MessageSquare className="w-6 h-6 text-purple-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Sales & Enterprise</h3>
                                    <p className="text-slate-500 dark:text-slate-400 mb-2">For teams larger than 20 people.</p>
                                    <a href="mailto:sales@hikariapp.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">sales@hikariapp.com</a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-pink-500/30 transition-colors">
                                <MapPin className="w-6 h-6 text-pink-500 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg mb-1">HQ</h3>
                                    <p className="text-slate-500 dark:text-slate-400">
                                        123 Innovation Dr, Suite 400<br />
                                        San Francisco, CA 94103
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Form */}
                    <div className="bg-white dark:bg-[#0F111A] p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none transition-colors" placeholder="Jane" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                                    <input required type="text" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none transition-colors" placeholder="Doe" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                                <input required type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none transition-colors" placeholder="jane@company.com" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none transition-colors">
                                    <option>General Support</option>
                                    <option>Billing Question</option>
                                    <option>Feature Request</option>
                                    <option>Enterprise Sales</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                                <textarea required rows={4} className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-indigo-500 outline-none transition-colors" placeholder="How can we help you?"></textarea>
                            </div>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 text-base font-medium rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                                rightIcon={isSubmitting ? undefined : <Send className="w-4 h-4" />}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};
