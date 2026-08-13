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
        <div className="relative min-h-screen bg-[#05060A] overflow-hidden flex items-center justify-center p-4 sm:p-8 font-sans text-slate-100">
            <Helmet>
                <title>{mode === 'login' ? 'Log In' : 'Sign Up'} | Hikarii</title>
            </Helmet>

            {/* The Main Container */}
            <div className="relative w-full max-w-6xl aspect-video min-h-[700px] bg-white rounded-3xl overflow-hidden shadow-2xl flex items-stretch">
                
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
                <div className="absolute inset-0 flex">
                    {/* LEFT SIDE (Signup Form Space) */}
                    <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12">
                        <SignupComponent redirectTo={redirectTo} onSwitch={toggleMode} isActive={mode === 'signup'} />
                    </div>
                    {/* RIGHT SIDE (Login Form Space) */}
                    <div className="w-1/2 h-full bg-white flex flex-col justify-center items-center p-12">
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
                    className="absolute top-0 bottom-0 w-[55%] overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 z-20 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-1000 ease-in-out origin-center"
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
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="relative z-10 w-full max-w-sm">
                                <Logo size="xl" className="mx-auto mb-8 text-white drop-shadow-lg" suppressLink />
                                <h2 className="text-5xl font-display font-bold text-white mb-6">New here?</h2>
                                <p className="text-slate-300 text-lg mb-10 leading-relaxed">
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
                            <div className="absolute inset-0 bg-black/40" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="relative z-10 w-full max-w-sm">
                                <Logo size="xl" className="mx-auto mb-8 text-white drop-shadow-lg" suppressLink />
                                <h2 className="text-5xl font-display font-bold text-white mb-6">Welcome back!</h2>
                                <p className="text-slate-300 text-lg mb-10 leading-relaxed">
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
    const { login, verifyEmail, resendCode } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [verificationMode, setVerificationMode] = useState(false);
    const [emailToVerify, setEmailToVerify] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

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
                <form onSubmit={handleVerify} className="space-y-6">
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        We sent a code to <strong className="text-slate-800">{emailToVerify}</strong>.
                    </p>
                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-3xl tracking-[0.5em] bg-slate-50 border-slate-200 text-slate-900 h-16 rounded-xl"
                        autoFocus
                    />
                    {error && <p className="text-sm text-danger-500">{error}</p>}
                    <Button type="submit" variant="primary" className="w-full h-14 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-black shadow-lg">Verify Email</Button>
                    <button type="button" onClick={handleResend} disabled={resendTimer > 0} className="w-full text-center text-xs font-bold text-slate-500 mt-4 uppercase hover:text-primary-600">
                        {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                    </button>
                </form>
            ) : (
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
    const { signup, verifyEmail, resendCode } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState('');
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
                <form onSubmit={handleVerify} className="space-y-6">
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                        We sent a code to <strong className="text-slate-800">{emailToVerify}</strong>.
                    </p>
                    <Input
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        className="text-center text-3xl tracking-[0.5em] bg-slate-50 border-slate-200 text-slate-900 h-16 rounded-xl"
                        autoFocus
                    />
                    {error && <p className="text-sm text-danger-500">{error}</p>}
                    <Button type="submit" variant="primary" className="w-full h-14 rounded-xl bg-gradient-to-r from-primary-600 to-accent-600 text-white font-black shadow-lg">Verify Email</Button>
                    <button type="button" onClick={handleResend} disabled={resendTimer > 0} className="w-full text-center text-xs font-bold text-slate-500 mt-4 uppercase hover:text-primary-600">
                        {resendTimer > 0 ? `Resend Code (${resendTimer}s)` : 'Resend Code'}
                    </button>
                </form>
            ) : (
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
