import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from './Button';
import apiClient from '../../api/client';
import toast from 'react-hot-toast';

interface LeadCaptureFormProps {
    source?: string;
    variant?: 'hero' | 'footer' | 'inline';
    title?: string;
    description?: string;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
    source = 'GENERAL_INTEREST',
    variant = 'hero',
    title = "Get the 'Hikari Method' Notion Template",
    description = "Master your life and money with our proven system. Join 1,000+ others gaining radical clarity."
}) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !email.includes('@')) {
            toast.error("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        try {
            await apiClient.post('/leads', { email, source });
            setIsSubmitted(true);
            toast.success("Welcome to the Hikari Method!");
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to join. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className={`py-4 space-y-2 animate-fade-in ${variant === 'footer' ? '' : 'text-center max-w-lg mx-auto'}`}>
                <div className="flex items-center gap-2 text-emerald-500 font-bold tracking-tight">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Welcome to Hikari.</span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Check your inbox. Radical clarity is on its way.
                </p>
            </div>
        );
    }

    const containerClasses = {
        hero: "max-w-xl mx-auto p-8 rounded-3xl bg-white/50 dark:bg-white/5 backdrop-blur-xl border border-primary-100 dark:border-white/10 shadow-2xl",
        footer: "w-full space-y-4",
        inline: "w-full p-4 rounded-xl border border-slate-200 dark:border-white/5"
    }[variant];

    return (
        <div className={containerClasses}>
            {title && (
                <h4 className={`font-bold text-white ${variant === 'hero' ? 'font-display font-bold tracking-tight text-2xl mb-2' : 'mb-6'}`}>
                    {title}
                </h4>
            )}
            {description && variant === 'hero' && (
                <p className="text-slate-600 dark:text-slate-400 mb-6 text-base">
                    {description}
                </p>
            )}

            <form onSubmit={handleSubmit} className={`flex ${variant === 'footer' ? 'flex-col' : 'flex-col sm:flex-row'} gap-3`}>
                <div className="relative flex-1 group">
                    <input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={`w-full px-0 py-3 bg-transparent border-b border-slate-700 dark:border-white/10 text-white focus:border-primary-500 outline-none transition-all placeholder:text-slate-600 font-medium`}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 group-focus-within:w-full transition-all duration-500"></div>
                </div>

                <Button
                    type="submit"
                    isLoading={isLoading}
                    className={`
                        ${variant === 'footer'
                            ? 'h-11 bg-white text-slate-900 hover:bg-slate-100 dark:bg-white dark:text-slate-900 rounded-lg text-xs'
                            : 'rounded-xl px-6 h-12 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white'
                        } font-bold whitespace-nowrap transition-all active:scale-95
                    `}
                >
                    {variant === 'footer' ? 'Join the Focused Few' : 'Get Template'}
                    {variant !== 'footer' && <Send className="ml-2 w-4 h-4" />}
                </Button>
            </form>

            {variant === 'footer' && description && (
                <p className="text-xs text-slate-500 leading-relaxed mt-4">
                    {description}
                </p>
            )}

            {variant !== 'footer' && (
                <p className="mt-4 text-[10px] text-slate-400 dark:text-slate-500 text-center uppercase tracking-widest">
                    No spam. Just clarity. Unsubscribe anytime.
                </p>
            )}
        </div>
    );
};
