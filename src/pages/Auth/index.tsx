import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import {
    Eye, EyeOff, ArrowRight, Loader2, Sparkles,
    School, GraduationCap, Briefcase, Award, ArrowLeft, CheckCircle2
} from 'lucide-react';

// --- 1. VALIDATION SCHEMAS ---

const loginSchema = z.object({
    identifier: z.string().min(1, "Email or Phone is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

const forgotSchema = z.object({
    email: z.string().email("Please enter a valid email address")
});

const signupSchema = z.object({
    first_name: z.string().min(2, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().length(10, "Phone must be exactly 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    user_type: z.enum(['school', 'undergraduate', 'graduate', 'professional']),
    school_name: z.string().optional(),
    class_grade: z.string().optional(),
    college_name: z.string().optional(),
    branch: z.string().optional(),
    stream: z.string().optional(),
    job_role: z.string().optional(),
    linkedin_url: z.string().optional(),
    github_url: z.string().optional(),
}).refine((data) => {
    if (data.user_type === 'school') return !!data.school_name && !!data.class_grade;
    if (data.user_type === 'undergraduate' || data.user_type === 'graduate') return !!data.college_name && !!data.branch && !!data.stream;
    if (data.user_type === 'professional') return !!data.job_role;
    return true;
}, {
    message: "Required fields missing for selected role",
    path: ["user_type"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;
type ForgotFormData = z.infer<typeof forgotSchema>;

// --- 2. ANIMATED BACKGROUND (3D Floating Objects) ---

const FloatingObject = ({ className, delay, duration }: { className: string, delay: number, duration: number }) => (
    <motion.div
        className={`absolute mix-blend-multiply filter blur-xl opacity-60 pointer-events-none ${className}`}
        animate={{
            y: [0, -40, 0],
            x: [0, 30, 0],
            scale: [1, 1.1, 1],
            rotate: [0, 20, -20, 0],
        }}
        transition={{
            duration: duration,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut"
        }}
    />
);

// --- 3. MAIN COMPONENT ---

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, signup } = useAuth();

    // View State: 'login' | 'signup' | 'forgot'
    const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [forgotSent, setForgotSent] = useState(false);

    // Forms
    const loginForm = useForm<LoginFormData>({ resolver: zodResolver(loginSchema), defaultValues: { identifier: '', password: '' } });
    const signupForm = useForm<SignupFormData>({ resolver: zodResolver(signupSchema), defaultValues: {
            first_name: '', middle_name: '', last_name: '', email: '', phone: '', password: '',
            user_type: 'undergraduate', school_name: '', class_grade: '', college_name: '',
            branch: '', stream: '', job_role: '', linkedin_url: '', github_url: ''
        }});
    const forgotForm = useForm<ForgotFormData>({ resolver: zodResolver(forgotSchema), defaultValues: { email: '' } });

    const userType = signupForm.watch('user_type');

    // Sync URL mode
    useEffect(() => {
        const modeParam = searchParams.get('mode');
        if (modeParam === 'signup') setView('signup');
        else if (view !== 'forgot') setView('login');
    }, [searchParams]);

    // --- HANDLERS ---

    const onLoginSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        const result = await login(data);
        setIsSubmitting(false);
        if (result.success) navigate(result.redirect || '/');
    };

    const onSignupSubmit = async (data: SignupFormData) => {
        setIsSubmitting(true);
        const result = await signup(data);
        setIsSubmitting(false);
        if (result.success) {
            setView('login');
            loginForm.setValue('identifier', data.email);
        }
    };

    const onForgotSubmit = async (data: ForgotFormData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(r => setTimeout(r, 1500));
        setIsSubmitting(false);
        setForgotSent(true);
    };

    // --- ANIMATION VARIANTS ---
    const panelVariants = {
        hidden: (direction: number) => ({ opacity: 0, x: direction * 50 }),
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
        exit: (direction: number) => ({ opacity: 0, x: direction * -50, transition: { duration: 0.3 } })
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">

            {/* --- BACKGROUND ANIMATIONS --- */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Large Orbs */}
                <FloatingObject className="w-96 h-96 bg-orange-300 rounded-full top-[-10%] left-[-5%]" delay={0} duration={15} />
                <FloatingObject className="w-[500px] h-[500px] bg-green-200 rounded-full bottom-[-10%] right-[-10%]" delay={2} duration={20} />

                {/* 3D-ish Shapes */}
                <motion.div
                    className="absolute top-[20%] right-[15%] w-24 h-24 border-4 border-orange-400/20 rounded-xl"
                    animate={{ rotateX: 360, rotateY: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute bottom-[20%] left-[10%] w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-20"
                    animate={{ y: [0, -30, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* --- MAIN GLASS CARD --- */}
            <motion.div
                layout
                className={`
          relative z-10 w-full max-w-[1100px] 
          bg-white/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
          border border-white/60 rounded-[2rem]
          flex flex-col lg:flex-row overflow-hidden
          transition-all duration-700 ease-[0.22, 1, 0.36, 1]
          ${view === 'signup' ? 'min-h-[800px] lg:h-[800px]' : 'min-h-[600px] lg:h-[600px]'}
        `}
            >
                {/* --- LEFT PANEL (Brand Visuals) --- */}
                <motion.div
                    layout
                    className={`
            hidden lg:flex flex-col justify-between p-12 text-white relative
            bg-gradient-to-br from-[#FF6B35] to-[#E85D2A] overflow-hidden
            ${view === 'signup' ? 'w-[40%]' : 'w-[45%]'}
            transition-all duration-700
          `}
                >
                    {/* Decorative Pattern overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

                    <div className="relative z-10">
                        <Link to="/">
                            <motion.div
                                className="flex items-center gap-3"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <img src="/Bharatxr.png" alt="Logo" className="w-8 h-8 object-contain" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight">BharatXR</span>
                            </motion.div>
                        </Link>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={view}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-4xl font-bold leading-tight mb-4 text-white drop-shadow-sm">
                                    {view === 'login' && "Welcome Back!"}
                                    {view === 'signup' && "Start Your Journey."}
                                    {view === 'forgot' && "Don't Worry."}
                                </h2>
                                <p className="text-orange-50 text-lg font-medium leading-relaxed">
                                    {view === 'login' && "Access premium XR resources, connect with mentors, and track your progress."}
                                    {view === 'signup' && "Join India's fastest growing ecosystem for Extended Reality enthusiasts."}
                                    {view === 'forgot' && "It happens to the best of us. We'll help you recover your account."}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Bottom Floating Stats */}
                    <div className="relative z-10 flex gap-4 mt-8">
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                            <p className="text-xs text-orange-100 uppercase">Community</p>
                            <p className="text-xl font-bold">5000+</p>
                        </div>
                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                            <p className="text-xs text-orange-100 uppercase">Events</p>
                            <p className="text-xl font-bold">50+</p>
                        </div>
                    </div>
                </motion.div>

                {/* --- RIGHT PANEL (Forms) --- */}
                <motion.div
                    layout
                    className={`
            w-full flex flex-col p-6 sm:p-10 lg:p-14 bg-white/50
            ${view === 'signup' ? 'lg:w-[60%]' : 'lg:w-[55%]'}
            relative transition-all duration-700
          `}
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-6 flex justify-center">
                        <img src="/Bharatxr.png" alt="Logo" className="w-12 h-12" />
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">

                        <AnimatePresence mode="wait" custom={view === 'signup' ? 1 : -1}>

                            {/* === LOGIN VIEW === */}
                            {view === 'login' && (
                                <motion.div
                                    key="login"
                                    custom={-1}
                                    variants={panelVariants}
                                    initial="hidden" animate="visible" exit="exit"
                                    className="w-full"
                                >
                                    <div className="mb-8">
                                        <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                                        <p className="text-gray-500 mt-2">Enter your credentials to access your account.</p>
                                    </div>

                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                                            <FormField control={loginForm.control} name="identifier" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email or Phone</FormLabel>
                                                    <FormControl><Input placeholder="john@example.com" className="bg-white/80 h-11 focus:ring-orange-500/20 focus:border-orange-500" {...field} /></FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <FormField control={loginForm.control} name="password" render={({ field }) => (
                                                <FormItem>
                                                    <div className="flex justify-between items-center">
                                                        <FormLabel>Password</FormLabel>
                                                        <button type="button" onClick={() => setView('forgot')} className="text-xs text-orange-600 font-semibold hover:underline">Forgot Password?</button>
                                                    </div>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input type={showPassword ? 'text' : 'password'} className="bg-white/80 h-11 pr-10 focus:ring-orange-500/20 focus:border-orange-500" {...field} />
                                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600">
                                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            <Button type="submit" className="w-full h-11 text-base bg-[#FF6B35] hover:bg-[#E85D2A] text-white shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.01]" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
                                            </Button>
                                        </form>
                                    </Form>

                                    <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
                                        <p className="text-gray-500">Don't have an account? <button onClick={() => setView('signup')} className="text-[#FF6B35] font-bold hover:underline ml-1">Create free account</button></p>
                                    </div>
                                </motion.div>
                            )}

                            {/* === FORGOT PASSWORD VIEW === */}
                            {view === 'forgot' && (
                                <motion.div
                                    key="forgot"
                                    custom={1}
                                    variants={panelVariants}
                                    initial="hidden" animate="visible" exit="exit"
                                    className="w-full"
                                >
                                    <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 mb-6 transition-colors">
                                        <ArrowLeft size={16} /> Back to Login
                                    </button>

                                    {!forgotSent ? (
                                        <>
                                            <div className="mb-8">
                                                <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                                                <p className="text-gray-500 mt-2">Enter your email and we'll send you a recovery link.</p>
                                            </div>
                                            <Form {...forgotForm}>
                                                <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-5">
                                                    <FormField control={forgotForm.control} name="email" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email Address</FormLabel>
                                                            <FormControl><Input placeholder="john@example.com" className="bg-white/80 h-11" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                    <Button type="submit" className="w-full h-11 bg-[#FF6B35] hover:bg-[#E85D2A]" disabled={isSubmitting}>
                                                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                                                    </Button>
                                                </form>
                                            </Form>
                                        </>
                                    ) : (
                                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h3>
                                            <p className="text-gray-500 mb-6">We've sent a password reset link to <br/> <span className="font-semibold text-gray-900">{forgotForm.getValues('email')}</span></p>
                                            <Button onClick={() => setView('login')} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">Back to Login</Button>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {/* === SIGNUP VIEW === */}
                            {view === 'signup' && (
                                <motion.div
                                    key="signup"
                                    custom={1}
                                    variants={panelVariants}
                                    initial="hidden" animate="visible" exit="exit"
                                    className="w-full h-full overflow-y-auto pr-2 custom-scrollbar"
                                >
                                    <div className="mb-6">
                                        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                                        <p className="text-gray-500 mt-1">Join the community in seconds.</p>
                                    </div>

                                    <Form {...signupForm}>
                                        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                                            {/* Name Row */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <FormField control={signupForm.control} name="first_name" render={({ field }) => (
                                                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={signupForm.control} name="last_name" render={({ field }) => (
                                                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>

                                            {/* Contact Row */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <FormField control={signupForm.control} name="email" render={({ field }) => (
                                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john@doe.com" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                                <FormField control={signupForm.control} name="phone" render={({ field }) => (
                                                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="9876543210" maxLength={10} className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                                                )} />
                                            </div>

                                            <FormField control={signupForm.control} name="password" render={({ field }) => (
                                                <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Create Password" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />

                                            {/* User Type */}
                                            <FormField control={signupForm.control} name="user_type" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold text-gray-800">I am a...</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-12 border-orange-200 bg-orange-50/50 focus:ring-orange-500/20">
                                                                <SelectValue placeholder="Select Role" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="school"><span className="flex items-center gap-2"><School className="w-4 h-4 text-green-600"/> School Student</span></SelectItem>
                                                            <SelectItem value="undergraduate"><span className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-orange-600"/> Undergraduate</span></SelectItem>
                                                            <SelectItem value="graduate"><span className="flex items-center gap-2"><Award className="w-4 h-4 text-orange-600"/> Graduate</span></SelectItem>
                                                            <SelectItem value="professional"><span className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-600"/> Professional</span></SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            {/* CONDITIONAL FIELDS ANIMATION */}
                                            <AnimatePresence mode='wait'>
                                                {userType === 'school' && (
                                                    <motion.div
                                                        key="school-fields"
                                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                        className="space-y-3 bg-green-50/50 p-4 rounded-xl border border-green-100 overflow-hidden"
                                                    >
                                                        <FormField control={signupForm.control} name="school_name" render={({ field }) => (
                                                            <FormItem><FormLabel>School Name</FormLabel><FormControl><Input placeholder="e.g. DPS Mathura" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <FormField control={signupForm.control} name="class_grade" render={({ field }) => (
                                                            <FormItem><FormLabel>Class/Grade</FormLabel><FormControl><Input placeholder="e.g. 10th" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                    </motion.div>
                                                )}

                                                {(userType === 'undergraduate' || userType === 'graduate') && (
                                                    <motion.div
                                                        key="college-fields"
                                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                        className="space-y-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100 overflow-hidden"
                                                    >
                                                        <FormField control={signupForm.control} name="college_name" render={({ field }) => (
                                                            <FormItem><FormLabel>College Name</FormLabel><FormControl><Input placeholder="e.g. IIT Delhi" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <FormField control={signupForm.control} name="branch" render={({ field }) => (
                                                                <FormItem><FormLabel>Branch</FormLabel><FormControl><Input placeholder="e.g. CSE" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                                            )} />
                                                            <FormField control={signupForm.control} name="stream" render={({ field }) => (
                                                                <FormItem><FormLabel>Stream</FormLabel><FormControl><Input placeholder="e.g. B.Tech" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                                            )} />
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {userType === 'professional' && (
                                                    <motion.div
                                                        key="pro-fields"
                                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                                        className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 overflow-hidden"
                                                    >
                                                        <FormField control={signupForm.control} name="job_role" render={({ field }) => (
                                                            <FormItem><FormLabel>Job Role</FormLabel><FormControl><Input placeholder="e.g. Unity Developer" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                                        )} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <Button type="submit" className="w-full h-11 mt-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/20" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Account"}
                                            </Button>
                                        </form>
                                    </Form>

                                    <div className="mt-6 text-center">
                                        <p className="text-gray-500">Already have an account? <button onClick={() => setView('login')} className="text-[#FF6B35] font-bold hover:underline ml-1">Sign in</button></p>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default AuthPage;