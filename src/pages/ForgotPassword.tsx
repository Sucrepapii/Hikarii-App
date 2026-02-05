import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Sun, ArrowLeft, Key, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
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
    const { forgotPassword, resetPassword } = useAuthStore();
    const [step, setStep] = useState<'email' | 'reset'>('email');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const resetForm = useForm<ResetFormData>({
        resolver: zodResolver(resetSchema),
    });

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
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-10 animate-fade-in group">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-300">
                        <Sun className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-display font-bold gradient-text mb-3">
                        Hikari
                    </h1>
                </div>

                {/* Form Card */}
                <div className="glass-card p-10 animate-slide-up">
                    <div className="mb-8">
                        <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-primary-600 transition-colors mb-4">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>
                        <h2 className="text-3xl font-display font-semibold text-slate-900 dark:text-white">
                            {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">
                            {step === 'email'
                                ? "Enter your email and we'll send you a 6-digit code to reset your password."
                                : `Enter the code sent to ${email} and your new password.`}
                        </p>
                    </div>

                    {step === 'email' ? (
                        <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...emailForm.register('email')}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-12"
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
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Verification Code
                                </label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...resetForm.register('code')}
                                        type="text"
                                        placeholder="123456"
                                        maxLength={6}
                                        className="pl-12 text-center tracking-widest text-lg"
                                    />
                                </div>
                                {resetForm.formState.errors.code && (
                                    <p className="mt-2 text-sm text-danger-500">{resetForm.formState.errors.code.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...resetForm.register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-12 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {resetForm.formState.errors.password && (
                                    <p className="mt-2 text-sm text-danger-500">{resetForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...resetForm.register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-12 pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
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
                                size="lg"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </Button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    className={clsx(
                                        "text-sm font-medium transition-colors",
                                        resendTimer > 0
                                            ? "text-slate-400 cursor-not-allowed"
                                            : "text-primary-600 hover:text-primary-700 dark:text-primary-400"
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
