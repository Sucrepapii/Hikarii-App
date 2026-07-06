import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirect') || '/dashboard';
    const { login, verifyEmail, resendCode } = useAuthStore();
    const [error, setError] = useState<string>('');
    const [verificationMode, setVerificationMode] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError('');

        try {
            await login(data.email, data.password);
            const user = useAuthStore.getState().user;
            if (user?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate(redirectTo);
            }
        } catch (err: any) {
            if (err.requiresVerification) {
                setEmailToVerify(err.email || data.email);
                setVerificationMode(true);
                const msg = 'Account not verified. Please check your email for the code.';
                setError(msg);
                toast.error(msg);
            } else {
                const msg = err.message || 'Login failed';
                setError(msg);
                toast.error(msg);
            }
        }
    };

    const handleFormError = (formErrors: any) => {
        const firstError: any = Object.values(formErrors)[0];
        if (firstError?.message) {
            toast.error(firstError.message);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(emailToVerify, otp);
            const user = useAuthStore.getState().user;
            if (user?.role === 'ADMIN') {
                navigate('/admin');
            } else {
                navigate(redirectTo);
            }
        } catch (err: any) {
            const msg = err.message || 'Verification failed';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        try {
            await resendCode(emailToVerify);
            toast.success('Code resent! Check your email.');
            setResendTimer(60);
        } catch (err: any) {
            setError(err.message || 'Failed to resend code');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#080910] text-slate-100 selection:bg-secondary-500/30 overflow-x-hidden relative">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary-600/10 rounded-full blur-[120px] pointer-events-none" />
            {/* Back Button */}
            <Link
                to="/"
                className="absolute top-8 left-4 sm:left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-all font-bold group z-10"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm tracking-widest uppercase"><span className="hidden sm:inline">Back to </span>Home</span>
            </Link>

            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-12 animate-fade-in">
                    <Logo size="xl" className="!gap-6 !pointer-events-none flex-col" suppressLink={true} />
                    <p className="text-xs font-black tracking-[0.3em] text-slate-500 uppercase mt-4">
                        Light & Clarity
                    </p>
                </div>

                {/* Login / Verification Form */}
                <div className="bg-[#0D0F1A] p-10 rounded-[2.5rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group animate-slide-up">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[60px] -z-10" />
                    <h2 className="text-3xl font-display font-bold mb-10 text-white tracking-tight">
                        {verificationMode ? 'Check your email' : 'Welcome Back'}
                    </h2>

                    {verificationMode ? (
                        /* Verification Form */
                        <form onSubmit={handleVerify} className="space-y-6">
                            <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                We sent a 6-digit code to <strong className="text-white">{emailToVerify}</strong>.
                                Enter it below to verify your account.
                            </p>

                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Verification Code
                                </label>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    className="text-center text-3xl tracking-[0.5em] bg-white/[0.03] border-white/10 text-white h-16 rounded-xl focus:border-primary-500/50"
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-2xl animate-fade-in">
                                    <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-black tracking-widest uppercase text-xs border-0 shadow-lg shadow-primary-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Verify Email
                            </Button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendTimer > 0}
                                    className={clsx(
                                        "text-xs font-black tracking-widest uppercase transition-all",
                                        resendTimer > 0
                                            ? "text-slate-600 cursor-not-allowed"
                                            : "text-primary-400 hover:text-white"
                                    )}
                                >
                                    {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Standard Login Form */
                        <form onSubmit={handleSubmit(onSubmit, handleFormError)} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-primary-500/50"
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-14 pr-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-primary-500/50"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.password.message}</p>
                                )}
                                <div className="mt-4 text-right">
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs font-black tracking-widest uppercase text-primary-400 hover:text-white transition-colors"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-2xl animate-fade-in">
                                    <p className="text-sm text-danger-600 dark:text-danger-400">{error}</p>
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full h-14 mt-6 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-black tracking-widest uppercase text-xs border-0 shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isSubmitting}
                            >
                                <LogIn className="w-4 h-4 mr-3" />
                                {isSubmitting ? 'Logging in...' : 'Log In'}
                            </Button>
                        </form>
                    )}

                    {/* Signup Link */}
                    <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
                        <p className="text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link
                                to={`/signup${window.location.search}`}
                                className="font-bold text-primary-400 hover:text-white transition-colors"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
