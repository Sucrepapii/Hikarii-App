import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Sun, ArrowLeft, Key, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
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
    }, [searchParams, resetForm]);

    const onEmailSubmit = async (data: EmailFormData) => {
        setIsLoading(true);
        try {
            await forgotPassword(data.email);
            setEmail(data.email);
            setStep('reset');
            toast.success('Reset code sent to your email!');
        } catch (error: any) {
            toast.error(error.message || 'Failed to send reset code');
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#080910] text-slate-100 selection:bg-purple-500/30 overflow-x-hidden relative">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            
            {/* Back Button */}
            <Link
                to="/login"
                className="absolute top-8 left-4 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold group z-10"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm tracking-widest uppercase"><span className="hidden sm:inline">Back to </span>Login</span>
            </Link>

            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-12 animate-fade-in">
                    <Logo size="xl" className="!gap-6 !pointer-events-none flex-col" suppressLink={true} />
                    <p className="text-xs font-black tracking-[0.3em] text-slate-500 uppercase mt-4">
                        Light & Clarity
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-[#0D0F1A] p-10 rounded-[2.5rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group animate-slide-up">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-[60px] -z-10" />
                    
                    <h2 className="text-3xl font-display font-bold mb-10 text-white tracking-tight">
                        {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                    </h2>

                    {step === 'email' ? (
                        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Enter your email and we'll send you a 6-digit code to reset your password.
                            </p>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...emailForm.register('email')}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500/50"
                                        autoComplete="email"
                                    />
                                </div>
                                {emailForm.formState.errors.email && (
                                    <p className="mt-2 text-sm text-danger-500">{emailForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase text-xs border-0 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                Enter the 6-digit code sent to <strong className="text-white">{email}</strong> and your new password.
                            </p>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...resetForm.register('code')}
                                        type="text"
                                        placeholder="123456"
                                        maxLength={6}
                                        className="pl-14 text-center tracking-[0.5em] text-xl h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500/50"
                                    />
                                </div>
                                {resetForm.formState.errors.code && (
                                    <p className="mt-2 text-sm text-danger-500">{resetForm.formState.errors.code.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...resetForm.register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-14 pr-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {resetForm.formState.errors.password && (
                                    <p className="mt-2 text-sm text-danger-500">{resetForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...resetForm.register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-14 pr-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-indigo-500/50"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {resetForm.formState.errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-danger-500">{resetForm.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest uppercase text-xs border-0 shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>

                            <div className="text-center mt-6">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    className={clsx(
                                        "text-xs font-black tracking-widest uppercase transition-all",
                                        resendTimer > 0
                                            ? "text-slate-600 cursor-not-allowed"
                                            : "text-indigo-400 hover:text-white"
                                    )}
                                >
                                    {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
