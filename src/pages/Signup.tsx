import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    phoneNumber: z.string().min(10, 'Please enter a valid phone number (e.g. +234...)'),
    confirmPassword: z.string(),
    agreementAccepted: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the Terms of Use and Privacy Policy',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup: React.FC = () => {
    const navigate = useNavigate();
    const { signup, verifyEmail, resendCode } = useAuthStore();
    const [error, setError] = useState<string>('');
    const [verificationMode, setVerificationMode] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);

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
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setError('');
        setLoading(true);
        const { confirmPassword, ...signupData } = data;

        try {
            const response = await signup(signupData.name, signupData.email, signupData.password, signupData.phoneNumber);

            // If verification is required, switch mode
            if (response && response.requiresVerification) {
                setEmailToVerify(signupData.email);
                setVerificationMode(true);
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed');
        } finally {
            setLoading(false);
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
        if (resendTimer > 0) return;

        try {
            await resendCode(emailToVerify); // This remains resendCode, as per its function
            toast.success('Code resent! Check your email.');
            setResendTimer(60);
        } catch (err: any) {
            setError(err.message || 'Failed to resend code');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            {/* Back Button */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
            </Link>

            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-10 animate-fade-in">
                    <Logo size="xl" className="!gap-4 !pointer-events-none flex-col" />
                    <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">
                        Light & Clarity
                    </p>
                </div>

                {/* Signup / Verification Form */}
                <div className="glass-card p-10 animate-slide-up">
                    <h2 className="text-3xl font-display font-semibold mb-8 text-slate-900 dark:text-white">
                        {verificationMode ? 'Check your email' : 'Create Account'}
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
                    ) : (
                        /* Standard Signup Form */
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...register('name')}
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-12"
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.name.message}</p>
                                )}
                            </div>

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

                            {/* Phone Number Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Phone Number (WhatsApp)
                                </label>
                                <div className="relative">
                                    <Logo variant="icon" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                                    <Input
                                        {...register('phoneNumber')}
                                        type="tel"
                                        placeholder="+234 812 345 6789"
                                        className="pl-12"
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.phoneNumber.message}</p>
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
                                        autoComplete="new-password"
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
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <Input
                                        {...register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-12 pr-12"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>



                            {/* Terms and Privacy Agreement */}
                            <div className="flex items-start gap-3">
                                <input
                                    {...register('agreementAccepted')}
                                    type="checkbox"
                                    id="terms-agreement"
                                    className="mt-1 w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-primary-600 focus:ring-primary-500 focus:ring-offset-0"
                                />
                                <label htmlFor="terms-agreement" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                                    I agree to the{' '}
                                    <Link to="/terms" target="_blank" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium underline">
                                        Terms of Use
                                    </Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" target="_blank" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium underline">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {errors.agreementAccepted && (
                                <p className="text-sm text-danger-500">{errors.agreementAccepted.message}</p>
                            )}

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
                                disabled={isSubmitting || loading}
                            >
                                <UserPlus className="w-5 h-5 mr-2" />
                                {isSubmitting || loading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </form>
                    )}

                    {/* Login Link */}
                    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
