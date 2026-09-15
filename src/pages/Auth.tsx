import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import { Helmet } from 'react-helmet-async';

// --- SCHEMAS ---
const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

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

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

interface AuthProps {
    defaultMode?: 'login' | 'signup';
}

export const Auth: React.FC<AuthProps> = ({ defaultMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
    
    // Switch state triggers the blade animation
    const toggleMode = () => {
        setMode(prev => prev === 'login' ? 'signup' : 'login');
    };

    // Shared UI state
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const redirectTo = searchParams.get('redirect') || '/dashboard';
    
    return (
        <div className="relative min-h-screen bg-white overflow-hidden flex font-sans text-slate-100">
            <Helmet>
                <title>{mode === 'login' ? 'Log In' : 'Sign Up'} | Hikarii</title>
            </Helmet>

            {/* The Main Container */}
            <div className="relative w-full h-screen flex items-stretch">
                
                {/* Global Back Button (Now inside flush with the container) */}
                <Link
                    to="/"
                    className="absolute top-8 left-8 flex items-center gap-2 text-slate-700 hover:text-slate-900 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-full transition-all font-bold group z-[100] shadow-md border border-slate-200/50"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs tracking-widest uppercase">Home</span>
                </Link>
                
                {/* 
                    BASE LAYER: 
                    The base layer holds the two forms.
                    Left side: Signup Form
                    Right side: Login Form
                */}
                <div className={`absolute inset-0 flex w-[200%] md:w-full transition-transform duration-500 ease-in-out md:!transform-none ${mode === 'login' ? 'max-md:-translate-x-1/2' : 'max-md:translate-x-0'}`}>
                    {/* LEFT SIDE (Signup Form Space) */}
                    <div className="w-1/2 md:w-1/2 h-full bg-white flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
                        <div className="block md:hidden mb-10 mt-8">
                            <Logo size="xl" suppressLink className="text-slate-900 drop-shadow-md" />
                        </div>
                        <SignupComponent redirectTo={redirectTo} onSwitch={toggleMode} isActive={mode === 'signup'} />
                    </div>
                    {/* RIGHT SIDE (Login Form Space) */}
                    <div className="w-1/2 md:w-1/2 h-full bg-white flex flex-col justify-center items-center p-6 sm:p-12 overflow-y-auto">
                        <div className="block md:hidden mb-10 mt-8">
                            <Logo size="xl" suppressLink className="text-slate-900 drop-shadow-md" />
                        </div>
                        <LoginComponent redirectTo={redirectTo} onSwitch={toggleMode} isActive={mode === 'login'} />
                    </div>
                </div>

                {/* 
                    BLADE LAYER:
                    The animated skewed overlay that covers the inactive form.
                    It has a background image, and untransforms its content so text is straight.
                    When mode is 'login', blade covers left side (Signup).
                    When mode is 'signup', blade covers right side (Login).
                */}
                <div 
                    className="hidden md:block absolute top-0 bottom-0 w-[55%] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-in-out origin-center"
                    style={{
                        transform: `translateX(${mode === 'login' ? '-5%' : '90%'}) skewX(-12deg)`,
                        left: 0,
                    }}
                >
                    {/* Untransform the content inside the blade */}
                    <div 
                        className="absolute inset-0 flex w-[200%] h-full transition-transform duration-1000 ease-in-out"
                        style={{
                            transform: `skewX(12deg) translateX(${mode === 'login' ? '0%' : '-50%'})`,
                        }}
                    >
                        {/* Blade Content Left (Shown when mode is Login, so blade covers Signup form) */}
                        <div className="relative w-1/2 h-full flex flex-col items-center justify-center p-16 text-center">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080910]/90 via-transparent to-[#080910]/80" />
                            <div className="relative z-10 w-full max-w-md">
                                <Logo size="xl" className="mx-auto mb-8 text-white drop-shadow-2xl" suppressLink />
                                <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">New here?</h2>
                                <p className="text-slate-200 text-lg md:text-xl mb-12 leading-relaxed font-light">
                                    Join Hikarii and discover a completely new way to merge your task tracking with financial clarity.
                                </p>
                                <Button 
                                    className="w-full h-14 rounded-xl bg-white text-[#084B3E] hover:bg-slate-100 font-black tracking-widest uppercase text-xs shadow-xl transition-all hover:scale-[1.02] border-0"
                                    onClick={toggleMode}
                                    type="button"
                                >
                                    Create Account
                                </Button>
                            </div>
                        </div>

                        {/* Blade Content Right (Shown when mode is Signup, so blade covers Login form) */}
                        <div className="relative w-1/2 h-full flex flex-col items-center justify-center p-16 text-center">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#080910]/90 via-transparent to-[#080910]/80" />
                            <div className="relative z-10 w-full max-w-md">
                                <Logo size="xl" className="mx-auto mb-8 text-white drop-shadow-2xl" suppressLink />
                                <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">Welcome back!</h2>
                                <p className="text-slate-200 text-lg md:text-xl mb-12 leading-relaxed font-light">
                                    To keep connected with us please login with your personal info.
                                </p>
                                <Button 
                                    className="w-full h-14 rounded-xl bg-white text-[#084B3E] hover:bg-slate-100 font-black tracking-widest uppercase text-xs shadow-xl transition-all hover:scale-[1.02] border-0"
                                    onClick={toggleMode}
                                    type="button"
                                >
                                    Log In
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const LoginComponent = ({ redirectTo, onSwitch, isActive }: { redirectTo: string, onSwitch: () => void, isActive: boolean }) => {
    const { login, verifyEmail, resendCode, loginWithGoogle } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [verificationMode, setVerificationMode] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const handleGoogleSignIn = async () => {
        try {
            await loginWithGoogle();
        } catch (err: any) {
            toast.error(err.message || 'Google sign-in failed');
        }
    };

    useEffect(() => {
        let interval: any;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError('');
        try {
            await login(data.email, data.password);
            const user = useAuthStore.getState().user;
            if (user?.role === 'ADMIN') navigate('/admin');
            else navigate(redirectTo);
        } catch (err: any) {
            if (err.requiresVerification) {
                setEmailToVerify(err.email || data.email);
                setVerificationMode(true);
                toast.error('Account not verified. Please check your email.');
            } else {
                setError(err.message || 'Login failed');
                toast.error(err.message || 'Login failed');
            }
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(emailToVerify, otp);
            const user = useAuthStore.getState().user;
            if (user?.role === 'ADMIN') navigate('/admin');
            else navigate(redirectTo);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
            toast.error(err.message || 'Verification failed');
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
        <div className={clsx("w-full max-w-sm text-slate-800 transition-opacity duration-500 delay-300", isActive ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-8 tracking-tight text-center">Log In to Hikarii</h2>
            {/* Same form markup but styled for light background */}
            {verificationMode ? (
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left">
                        <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">Email Confirmation Required</p>
                        <p className="text-sm text-emerald-900 leading-relaxed">
                            We sent a confirmation link to <strong className="font-bold">{emailToVerify}</strong>. Click the link in your email to complete sign in.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4 pt-2">
                        <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-semibold">Or enter verification code</p>
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-3xl tracking-[0.5em] bg-slate-50 border-slate-200 text-slate-900 h-16 rounded-xl"
                        />
                        {error && <p className="text-sm text-danger-500">{error}</p>}
                        <Button type="submit" variant="primary" className="w-full h-14 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-black shadow-lg">
                            Verify & Sign In
                        </Button>
                    </form>

                    <button 
                        type="button" 
                        onClick={handleResend} 
                        disabled={resendTimer > 0} 
                        className="w-full text-center text-xs font-bold text-slate-500 hover:text-primary-600 uppercase tracking-wider pt-2 disabled:opacity-50"
                    >
                        {resendTimer > 0 ? `Resend Confirmation Email (${resendTimer}s)` : 'Resend Confirmation Email'}
                    </button>
                </div>
            ) : (
                <div>
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full h-14 mb-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative my-4 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <span className="relative bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">or log in with email</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input {...register('email')} placeholder="you@example.com" className="pl-12 h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-xl w-full" />
                            </div>
                            {errors.email && <p className="mt-1 text-xs text-danger-500">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <Input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-12 pr-12 h-14 bg-slate-50 border-slate-200 text-slate-900 rounded-xl w-full" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-xs text-danger-500">{errors.password.message}</p>}
                            <div className="mt-3 text-right">
                                <Link to="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700">Forgot password?</Link>
                            </div>
                        </div>
                        {error && <p className="text-sm text-danger-500 bg-danger-50 p-3 rounded-lg">{error}</p>}
                        <Button type="submit" disabled={isSubmitting} variant="primary" className="w-full h-14 mt-4 rounded-xl bg-[#084B3E] hover:bg-[#063b31] text-white font-bold text-base shadow-lg transition-all">
                            {isSubmitting ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>
                </div>
            )}
            
            {/* Mobile fallback switch link */}
            <div className="mt-8 text-center md:hidden">
                <p className="text-sm text-slate-500">
                    Don't have an account? <button onClick={onSwitch} type="button" className="text-primary-600 font-bold underline">Sign up</button>
                </p>
            </div>
        </div>
    );
};

const SignupComponent = ({ redirectTo, onSwitch, isActive }: { redirectTo: string, onSwitch: () => void, isActive: boolean }) => {
    const { signup, verifyEmail, resendCode, loginWithGoogle } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [verificationMode, setVerificationMode] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [loading, setLoading] = useState(false);

    const handleGoogleSignIn = async () => {
        try {
            await loginWithGoogle();
        } catch (err: any) {
            toast.error(err.message || 'Google sign-in failed');
        }
    };

    useEffect(() => {
        let interval: any;
        if (resendTimer > 0) {
            interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        setError('');
        setLoading(true);
        const { confirmPassword, ...signupData } = data;
        try {
            const response = await signup(signupData.name, signupData.email, signupData.password, signupData.phoneNumber || '');
            if (response && response.requiresVerification) {
                toast.success('Registration successful! Please check your email.');
                setEmailToVerify(signupData.email);
                setVerificationMode(true);
            } else {
                toast.success('Welcome to Hikarii!');
                navigate(redirectTo === '/dashboard' ? '/thank-you' : redirectTo);
            }
        } catch (err: any) {
            setError(err.message || 'Signup failed');
            toast.error(err.message || 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await verifyEmail(emailToVerify, otp);
            toast.success('Email verified successfully! Welcome to Hikarii.');
            navigate(redirectTo === '/dashboard' ? '/thank-you' : redirectTo);
        } catch (err: any) {
            setError(err.message || 'Verification failed');
            toast.error(err.message || 'Verification failed');
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
        <div className={clsx("w-full max-w-sm text-slate-800 transition-opacity duration-500 delay-300", isActive ? "opacity-100" : "opacity-0 pointer-events-none")}>
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-8 tracking-tight text-center">Create account</h2>
            
            {verificationMode ? (
                <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left">
                        <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">Check Your Email</p>
                        <p className="text-sm text-emerald-900 leading-relaxed">
                            We sent a confirmation link to <strong className="font-bold">{emailToVerify}</strong>. Click the link in your email to complete registration.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-4 pt-2">
                        <p className="text-xs text-slate-500 text-center uppercase tracking-widest font-semibold">Or enter verification code</p>
                        <Input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="123456"
                            maxLength={6}
                            className="text-center text-3xl tracking-[0.5em] bg-slate-50 border-slate-200 text-slate-900 h-16 rounded-xl"
                        />
                        {error && <p className="text-sm text-danger-500">{error}</p>}
                        <Button type="submit" variant="primary" className="w-full h-14 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-black shadow-lg">
                            Verify & Sign In
                        </Button>
                    </form>

                    <button 
                        type="button" 
                        onClick={handleResend} 
                        disabled={resendTimer > 0} 
                        className="w-full text-center text-xs font-bold text-slate-500 hover:text-primary-600 uppercase tracking-wider pt-2 disabled:opacity-50"
                    >
                        {resendTimer > 0 ? `Resend Confirmation Email (${resendTimer}s)` : 'Resend Confirmation Email'}
                    </button>
                </div>
            ) : (
                <div>
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="w-full h-12 mb-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Continue with Google</span>
                    </button>

                    <div className="relative my-4 text-center">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                        <span className="relative bg-white px-3 text-xs text-slate-400 font-bold uppercase tracking-widest">or sign up with email</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Full name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input {...register('name')} placeholder="John Doe" className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full" />
                        </div>
                        {errors.name && <p className="mt-1 text-xs text-danger-500">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Email address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input {...register('email')} placeholder="you@example.com" className="pl-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full" />
                        </div>
                        {errors.email && <p className="mt-1 text-xs text-danger-500">{errors.email.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full" />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="mt-1 text-xs text-danger-500">{errors.password.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold tracking-widest text-slate-400 uppercase mb-2">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input {...register('confirmPassword')} type={showConfirmPassword ? 'text' : 'password'} placeholder="••••••••" className="pl-10 pr-10 h-12 bg-slate-50 border-slate-200 text-slate-900 rounded-lg w-full" />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.confirmPassword && <p className="mt-1 text-xs text-danger-500">{errors.confirmPassword.message}</p>}
                    </div>
                    
                    <div className="flex items-start gap-2 pt-2">
                        <input {...register('agreementAccepted')} type="checkbox" id="terms" className="mt-1" />
                        <label htmlFor="terms" className="text-xs text-slate-500">I agree to the <Link to="/terms" className="text-primary-600 underline">Terms of Use</Link> and <Link to="/privacy" className="text-primary-600 underline">Privacy Policy</Link></label>
                    </div>
                    {errors.agreementAccepted && <p className="text-xs text-danger-500">{errors.agreementAccepted.message}</p>}

                    {error && <p className="text-sm text-danger-500 bg-danger-50 p-2 rounded-lg">{error}</p>}
                    <Button type="submit" disabled={loading} variant="primary" className="w-full h-12 mt-2 rounded-xl bg-[#084B3E] hover:bg-[#063b31] text-white font-bold text-sm shadow-lg transition-all">
                        {loading ? 'Creating...' : 'Create account'}
                    </Button>
                </form>
                </div>
            )}

            {/* Mobile fallback switch link */}
            <div className="mt-6 text-center md:hidden">
                <p className="text-sm text-slate-500">
                    Already have an account? <button onClick={onSwitch} type="button" className="text-primary-600 font-bold underline">Log in</button>
                </p>
            </div>
        </div>
    );
};
