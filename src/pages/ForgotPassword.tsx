import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Sun, ArrowLeft, Key, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../supabase/client';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const emailSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

const resetSchema = z.object({
    code: z.string().length(6, 'Reset code must be 6 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

export const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { forgotPassword, resetPassword } = useAuthStore();
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isSupabaseRecovery, setIsSupabaseRecovery] = useState(false);

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const resetForm = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
    });

    useEffect(() => {
        let interval: any;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    useEffect(() => {
        const queryEmail = searchParams.get('email');
        const queryCode = searchParams.get('code');
        
        if (queryEmail && queryCode) {
            setEmail(queryEmail);
            resetForm.setValue('code', queryCode);
            setStep('reset');
        }

        // Handle Supabase password recovery (Magic Link)
        const hash = window.location.hash;
        if (hash.includes('type=recovery') || searchParams.get('type') === 'recovery') {
            setIsSupabaseRecovery(true);
            setStep('reset');
            resetForm.setValue('code', '123456'); // satisfy zod schema
        }

        const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setIsSupabaseRecovery(true);
                setStep('reset');
                resetForm.setValue('code', '123456'); // satisfy zod schema
            }
        });

        return () => authListener.subscription.unsubscribe();
    }, [searchParams, resetForm]);

    const onEmailSubmit = async (data: EmailFormData) => {
        setIsLoading(true);
        try {
            await forgotPassword(data.email);
            toast.success('Check your email for the reset link!');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    const onResetSubmit = async (data: ResetFormData) => {
        setIsLoading(true);
        try {
            await resetPassword(email, data.code, data.password);
            toast.success('Password reset successfully!');
            navigate('/login');
        } catch (error: any) {
            toast.error(error.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;
        try {
            await forgotPassword(email);
            toast.success('Code resent! Check your email.');
            setResendTimer(60);
        } catch (error: any) {
            toast.error(error.message || 'Failed to resend code');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#05060A] overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans text-slate-100">
            {/* The Main Container */}
            <div className="relative w-full max-w-6xl aspect-video min-h-[700px] bg-white rounded-3xl overflow-hidden shadow-2xl flex items-stretch">
                
                {/* Global Back Button */}
                <Link
                    to="/login"
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-700 hover:text-slate-900 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full transition-all font-bold group z-[100] shadow-md border border-slate-200/50"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs tracking-widest uppercase">Login</span>
                </Link>

                {/* Fixed Blade (Left Side) */}
                <div className="relative hidden md:flex w-[50%] lg:w-[55%] h-full overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 z-20 flex-col items-center justify-center p-16 text-center">
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="relative z-10 w-full max-w-sm">
                        <Logo size="xl" className="mx-auto mb-8 text-white drop-shadow-lg" suppressLink />
                        <h2 className="text-5xl font-display font-bold text-white mb-6">Password Reset</h2>
                        <p className="text-slate-300 text-lg mb-10 leading-relaxed">
                            No worries, it happens. We'll get you back into your account in no time.
                        </p>
                    </div>
                </div>

                {/* Form (Right Side) */}
                <div className="w-full md:w-[50%] lg:w-[45%] h-full bg-white flex flex-col justify-center items-center p-8 sm:p-12 overflow-y-auto">
                    <div className="block md:hidden mb-10 mt-4 text-center">
                        <Logo size="xl" suppressLink className="text-slate-900 drop-shadow-md" />
                    </div>
                    <div className="w-full max-w-sm text-slate-800">
                        <h2 className="text-3xl font-display font-bold text-slate-900 mb-8 tracking-tight text-center">
                            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                        </h2>

                        {step === 'email' ? (
                            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 text-center">
                                    Enter your email and we'll send you a 6-digit code to reset your password.
                                </p>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            {...emailForm.register('email')}
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-12 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full"
                                            autoComplete="email"
                                        />
                                    </div>
                                    {emailForm.formState.errors.email && (
                                        <p className="mt-1 text-xs text-danger-500">{emailForm.formState.errors.email.message}</p>
                                    )}
                                </div>
                                <Button type="submit" disabled={isLoading} variant="primary" className="w-full h-12 mt-2 rounded-xl bg-[#084B3E] hover:bg-[#063b31] text-white font-bold text-sm shadow-lg transition-all">
                                    {isLoading ? 'Sending...' : 'Send Reset Code'}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                                <p className="text-slate-500 text-sm leading-relaxed mb-4 text-center">
                                    {isSupabaseRecovery ? 
                                        "Please enter your new password below." : 
                                        <>Enter the 6-digit code sent to <strong className="text-slate-800">{email}</strong> and your new password.</>
                                    }
                                </p>
                                {!isSupabaseRecovery && (
                                    <div>
                                        <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Verification Code</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <Input
                                                {...resetForm.register('code')}
                                                type="text"
                                                placeholder="123456"
                                                maxLength={6}
                                                className="pl-12 tracking-[0.5em] text-center h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full"
                                            />
                                        </div>
                                        {resetForm.formState.errors.code && (
                                            <p className="mt-1 text-xs text-danger-500">{resetForm.formState.errors.code.message}</p>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            {...resetForm.register('password')}
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="pl-12 pr-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {resetForm.formState.errors.password && (
                                        <p className="mt-1 text-xs text-danger-500">{resetForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            {...resetForm.register('confirmPassword')}
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            className="pl-12 pr-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full"
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {resetForm.formState.errors.confirmPassword && (
                                        <p className="mt-1 text-xs text-danger-500">{resetForm.formState.errors.confirmPassword.message}</p>
                                    )}
                                </div>
                                <Button type="submit" disabled={isLoading} variant="primary" className="w-full h-12 mt-4 rounded-xl bg-[#084B3E] hover:bg-[#063b31] text-white font-bold text-sm shadow-lg transition-all">
                                    {isLoading ? 'Resetting...' : 'Reset Password'}
                                </Button>
                                <div className="text-center mt-4">
                                    <button type="button" onClick={handleResend} disabled={resendTimer > 0} className="text-xs font-bold uppercase text-primary-600 hover:text-primary-700 disabled:text-slate-400">
                                        {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
