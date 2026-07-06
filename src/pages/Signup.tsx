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
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
    phoneNumber: z.string().optional(),
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
            const response = await signup(signupData.name, signupData.email, signupData.password, signupData.phoneNumber || '');

            // If verification is required, switch mode
            if (response && response.requiresVerification) {
                toast.success('Registration successful! Please check your email for a verification code.');
                setEmailToVerify(signupData.email);
                setVerificationMode(true);
            } else {
                toast.success('Welcome to Hikari!');
                const searchParams = new URLSearchParams(window.location.search);
                const redirectTo = searchParams.get('redirect');
                navigate(redirectTo || '/dashboard');
            }
        } catch (err: any) {
            const msg = err.message || 'Signup failed';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(emailToVerify, otp);
            toast.success('Email verified successfully! Welcome to Hikari.');
            
            const searchParams = new URLSearchParams(window.location.search);
            const redirectTo = searchParams.get('redirect');
            navigate(redirectTo || '/dashboard');
        } catch (err: any) {
            const msg = err.message || 'Verification failed';
            setError(msg);
            toast.error(msg);
        }
    };

    const handleFormError = (formErrors: any) => {
        const firstError: any = Object.values(formErrors)[0];
        if (firstError?.message) {
            toast.error(firstError.message);
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
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#080910] text-slate-100 selection:bg-accent-500/30 overflow-x-hidden relative">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-600/10 rounded-full blur-[120px] pointer-events-none" />
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

                {/* Signup / Verification Form */}
                <div className="bg-[#0D0F1A] p-10 rounded-[2.5rem] border border-white/[0.06] shadow-2xl relative overflow-hidden group animate-slide-up">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[60px] -z-10" />
                    <h2 className="text-3xl font-display font-bold mb-10 text-white tracking-tight">
                        {verificationMode ? 'Check your email' : 'Create Account'}
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
                        /* Standard Signup Form */
                        <form onSubmit={handleSubmit(onSubmit, handleFormError)} className="space-y-6">
                            {/* Name Field */}
                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...register('name')}
                                        type="text"
                                        placeholder="John Doe"
                                        className="pl-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-primary-500/50"
                                        autoComplete="name"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.name.message}</p>
                                )}
                            </div>

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

                            {/* Phone Number Field */}
                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Phone Number (WhatsApp)
                                </label>
                                <div className="relative">
                                    <Logo variant="icon" className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20" suppressLink={true} />
                                    <Input
                                        {...register('phoneNumber')}
                                        type="tel"
                                        placeholder="+234 812 345 6789"
                                        className="pl-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-primary-500/50"
                                        autoComplete="tel"
                                    />
                                </div>
                                {errors.phoneNumber && (
                                    <p className="mt-2 text-sm text-danger-500">{errors.phoneNumber.message}</p>
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
                                        autoComplete="new-password"
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
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                    <Input
                                        {...register('confirmPassword')}
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pl-14 pr-14 h-14 bg-white/[0.03] border-white/10 text-white rounded-xl focus:border-primary-500/50"
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
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
                                    className="mt-1 w-4 h-4 rounded border-white/10 bg-white/[0.03] text-primary-600 focus:ring-primary-500/50 focus:ring-offset-0"
                                />
                                <label htmlFor="terms-agreement" className="text-sm text-slate-500 cursor-pointer leading-relaxed">
                                    I agree to the{' '}
                                    <Link to="/terms" target="_blank" className="text-primary-400 hover:text-white transition-colors font-bold">
                                        Terms of Use
                                    </Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" target="_blank" className="text-primary-400 hover:text-white transition-colors font-bold">
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
                                className="w-full h-14 mt-6 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-black tracking-widest uppercase text-xs border-0 shadow-lg shadow-primary-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={isSubmitting || loading}
                            >
                                <UserPlus className="w-4 h-4 mr-3" />
                                {isSubmitting || loading ? 'Creating account...' : 'Sign Up'}
                            </Button>
                        </form>
                    )}

                    {/* Login Link */}
                    <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
                        <p className="text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link
                                to={`/login${window.location.search}`}
                                className="font-bold text-primary-400 hover:text-white transition-colors"
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
