import React, { useState, useEffect } from 'react';
import { Star, Send, MessageSquare, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';

interface FeedbackItem {
    id: string;
    name: string;
    rating: number;
    comment: string;
    topic?: string;
    date: string;
}

const FEATURE_TOPICS = [
    'General',
    'Task Management',
    'Budget Tracking',
    'AI Smart Split',
    'Dashboard',
    'Subscription Tracking',
    'Calendar Integration',
    'Projects',
    'Other'
];



export const FeedbackSection: React.FC = () => {
    const { token, user } = useAuthStore();
    const isAuthenticated = !!token;

    const [rating, setRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [comment, setComment] = useState('');
    const [name, setName] = useState('');
    const [topic, setTopic] = useState('General');
    const [countries, setCountries] = useState<{name: string, flag: string}[]>([]);
    const [country, setCountry] = useState('');
    const [flag, setFlag] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const [feedbacks, setFeedbacks] = useState<any[]>([]);

    // Auto-populate name from user profile
    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flag');
                if (res.ok) {
                    const data = await res.json();
                    const sorted = data.map((c: any) => ({
                        name: c.name.common,
                        flag: c.flag
                    })).sort((a: any, b: any) => a.name.localeCompare(b.name));
                    setCountries(sorted);
                    // Set default to Nigeria or first in list
                    const defaultCountry = sorted.find((c: any) => c.name === 'Nigeria') || sorted[0];
                    if (defaultCountry) {
                        setCountry(defaultCountry.name);
                        setFlag(defaultCountry.flag);
                    }
                }
            } catch (err) {
                console.error("Error fetching countries:", err);
            }
        };
        fetchCountries();
    }, []);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                const res = await fetch(`${API_URL}/feedback`);
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setFeedbacks(data.map((fb: any) => ({
                            id: fb.id,
                            name: fb.name,
                            rating: fb.rating,
                            comment: fb.comment,
                            topic: fb.topic,
                            country: fb.country,
                            flag: fb.flag,
                            date: new Date(fb.createdAt).toLocaleDateString()
                        })));
                    }
                }
            } catch (err) {
                console.error("Error fetching feedback:", err);
            }
        };
        fetchFeedbacks();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    name: name.trim() || 'Anonymous',
                    rating,
                    comment,
                    topic,
                    country,
                    flag
                })
            });

            if (res.ok) {
                const newlySaved = await res.json();
                const newFeedback: FeedbackItem = {
                    id: newlySaved.id,
                    name: newlySaved.name,
                    rating: newlySaved.rating,
                    comment: newlySaved.comment,
                    date: 'Just now'
                };
                
                setFeedbacks([newFeedback, ...feedbacks]);
                setIsSubmitted(true);
                toast.success("Feedback submitted!");
                
                setTimeout(() => {
                    setIsSubmitted(false);
                    setRating(0);
                    setComment('');
                    setTopic('General');
                    if (!user?.name) setName('');
                }, 3000);
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(errData.error || "Failed to submit feedback.");
            }
        } catch (err) {
            console.error("Error posting feedback:", err);
            toast.error("Failed to connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="py-24 px-6 max-w-5xl mx-auto relative z-20">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* FORM COLUMN */}
                <div className="lg:col-span-5 relative bg-white/5 dark:bg-[#0B0C15]/50 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-8 rounded-[2rem] shadow-2xl h-fit group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2rem]"></div>
                    
                    <div className="relative z-10 text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner ring-1 ring-indigo-500/20">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">
                            Leave Feedback
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                            Help us shape the future of Hikari.
                        </p>
                    </div>

                    {!isAuthenticated ? (
                        /* Sign-in prompt for unauthenticated users */
                        <div className="relative z-10 flex flex-col items-center gap-6 py-8">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                                <LogIn className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">Sign in to share your thoughts</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Your feedback helps us build a better product.</p>
                            </div>
                            <Link
                                to="/login?redirect=/feedback"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                            >
                                <LogIn className="w-4 h-4" /> Sign In to Leave Feedback
                            </Link>
                            <Link to="/signup" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    ) : (
                        /* Feedback form for authenticated users */
                        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                            {/* Rating Stars */}
                            <div className="flex flex-col items-center gap-3">
                                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                    Rate Your Experience
                                </label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-1"
                                        >
                                            <Star
                                                className={`w-8 h-8 transition-colors duration-200 ${
                                                    (hoverRating || rating) >= star
                                                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                                                        : 'text-slate-300 dark:text-slate-700 fill-transparent'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feature Topic Dropdown */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                        Feature Reviewing
                                    </label>
                                    <select
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm text-sm appearance-none cursor-pointer"
                                    >
                                        {FEATURE_TOPICS.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                                        Your Country
                                    </label>
                                    <select
                                        value={country}
                                        onChange={(e) => {
                                            const selected = countries.find(c => c.name === e.target.value);
                                            if (selected) {
                                                setCountry(selected.name);
                                                setFlag(selected.flag);
                                            }
                                        }}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select your country</option>
                                        {countries.map((c) => (
                                            <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm text-sm"
                                />
                                <textarea
                                    placeholder="Tell us what you think..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm resize-none text-sm"
                                ></textarea>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitted || rating === 0 || !comment.trim()}
                                className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 text-white font-semibold py-3.5 px-6 flex items-center justify-center gap-2 transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30"
                            >
                                <span className="relative z-10 flex items-center gap-2 text-sm">
                                    {isSubmitted ? (
                                        'Feedback Posted!'
                                    ) : (
                                        <>
                                            Post Feedback <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </button>
                            
                            {rating === 0 && !isSubmitted && (
                                <p className="text-center text-xs text-rose-500 dark:text-rose-400 mt-2">
                                    Please select a rating to submit.
                                </p>
                            )}
                        </form>
                    )}
                </div>

                {/* VISIBLE COMMUNITY COMMENTS COLUMN */}
                <div className="lg:col-span-7 flex flex-col pt-4 lg:pt-0">
                    <div className="mb-8 pl-4 border-l-2 border-indigo-500/30">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Community Voices</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">See what others are saying about their experience.</p>
                    </div>
                    
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '600px' }}>
                        {feedbacks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-white/5 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 rounded-2xl h-full">
                                <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                                <p className="text-slate-500 dark:text-slate-400">No feedback yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            feedbacks.map((fb) => (
                                <div key={fb.id} className="bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm border border-slate-200/50 dark:border-white/5 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                                                    {fb.name}
                                                    {fb.flag && <span className="text-base">{fb.flag}</span>}
                                                </h4>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{fb.country || fb.date}</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-0.5 bg-slate-100 dark:bg-black/20 px-2 py-1 rounded-full border border-slate-200/50 dark:border-white/5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-3.5 h-3.5 ${
                                                        fb.rating >= star
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-300 dark:text-slate-700 fill-transparent'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                        "{fb.comment}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
