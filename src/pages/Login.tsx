import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Mail, Lock, Sun, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, verifyEmail, resendCode } = useAuthStore();
    const [error, setError] = useState<string>('');
    const [verificationMode, setVerificationMode] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
            navigate('/dashboard');
        } catch (err: any) {
            if (err.requiresVerification) {
                setEmailToVerify(err.email || data.email);
                setVerificationMode(true);
                setError('Account not verified. Please check your email for the code.');
            } else {
                setError(err.message || 'Login failed');
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(emailToVerify, otp);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Verification failed');
        }
    };

    const handleResend = async () => {
        try {
            await resendCode(emailToVerify);
            alert('Code resent! Check your email.');
        } catch (err: any) {
            setError(err.message || 'Failed to resend code');
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
                    <p className="text-lg text-slate-600 dark:text-slate-400">
                        Light & Clarity
                    </p>
                </div>

                {/* Login / Verification Form */}
                <div className="glass-card p-10 animate-slide-up">
                    <h2 className="text-3xl font-display font-semibold mb-8 text-slate-900 dark:text-white">
                        {verificationMode ? 'Check your email' : 'Welcome Back'}
                    </h2>

                    {verificationMode ? (
                        /* Verification Form */
                        <form onSubmit={handleVerify} className="space-y-6">
                            <p className="text-slate-600 dark:text-slate-400 text-sm">
                                We sent a 6-digit code to <strong>{emailToVerify}</strong>.
                                Enter it below to verify your account.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Verification Code
                                </label>
                                <Input
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    type="text"
                                    placeholder="123456"
                                    maxLength={6}
                                    className="text-center text-2xl tracking-widest"
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
                                size="lg"
                                className="w-full mt-4"
                            >
                                Verify Email
                            </Button>

                            <div className="text-center mt-4">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
                                >
                                    Resend Code
                                </button>
                            </div>
                        </form>
                    ) : (
                        /* Standard Login Form */
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        placeholder="you@example.com"
                                        className="pl-12"
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...register('password')}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-12 pr-12"
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.password.message}</p>
                                )}
                                <div className="mt-2 text-right">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
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
                                size="lg"
                                className="w-full mt-8"
                                disabled={isSubmitting}
                            >
                                <LogIn className="w-5 h-5 mr-2" />
                                {isSubmitting ? 'Logging in...' : 'Log In'}
                            </Button>
                        </form>
                    )}

                    {/* Signup Link */}
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
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
