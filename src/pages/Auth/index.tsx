
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
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Award, Users, Calendar, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { PageTransition } from '@/components/layout/PageTransition';

// --- VALIDATION SCHEMAS ---

const loginSchema = z.object({
    identifier: z.string().min(1, "Email or Phone is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

// Dynamic Signup Schema
const signupSchema = z.object({
    first_name: z.string().min(2, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().length(10, "Phone must be exactly 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),

    // User Type & Conditional Fields
    user_type: z.enum(['school', 'undergraduate', 'graduate', 'professional']),

    // School Fields
    school_name: z.string().optional(),
    class_grade: z.string().optional(),

    // College Fields
    college_name: z.string().optional(),
    branch: z.string().optional(),
    stream: z.string().optional(),

    // Professional Fields
    job_role: z.string().optional(),

    // Socials
    linkedin_url: z.string().optional(),
    github_url: z.string().optional(),
}).refine((data) => {
    // Custom Validation Logic based on Type
    if (data.user_type === 'school') {
        return !!data.school_name && !!data.class_grade;
    }
    if (data.user_type === 'undergraduate' || data.user_type === 'graduate') {
        return !!data.college_name && !!data.branch && !!data.stream;
    }
    if (data.user_type === 'professional') {
        return !!data.job_role;
    }
    return true;
}, {
    message: "Please fill in all required fields for your selected role",
    path: ["user_type"], // Error will appear on user_type if validation fails
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

const AuthPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, signup } = useAuth();
    const [mode, setMode] = useState<'login' | 'signup'>(
        searchParams.get('mode') === 'signup' ? 'signup' : 'login'
    );

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Forms
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { identifier: '', password: '' }
    });

    const signupForm = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            phone: '',
            password: '',
            user_type: 'undergraduate', // Default
            school_name: '',
            class_grade: '',
            college_name: '',
            branch: '',
            stream: '',
            job_role: '',
            linkedin_url: '',
            github_url: ''
        }
    });

    // Watch user type to conditionally render fields
    const userType = signupForm.watch('user_type');

    useEffect(() => {
        const modeParam = searchParams.get('mode');
        if (modeParam === 'signup') setMode('signup');
        else if (modeParam === 'login') setMode('login');
    }, [searchParams]);

    // --- HANDLERS ---

    const onLoginSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        const result = await login(data);
        setIsSubmitting(false);
        if (result.success) {
            navigate(result.redirect || '/'); // Redirect to dashboard
        }
    };

    const onSignupSubmit = async (data: SignupFormData) => {
        setIsSubmitting(true);
        const result = await signup(data);
        setIsSubmitting(false);
        if (result.success) {
            // Switch to login mode after successful signup
            setMode('login');
            // Optional: Pre-fill login email
            loginForm.setValue('identifier', data.email);
        }
    };

    const trustSignals = [
        { icon: Calendar, text: 'Workshops & Events' },
        { icon: Award, text: 'Hackathons' },
        { icon: Users, text: 'Community Access' },
        { icon: Sparkles, text: 'XR Resources' }
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-background flex">
                {/* Brand Panel (Left) */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-10 flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <Link to="/" className="inline-block">
                            <h1 className="text-2xl font-bold text-foreground">
                                Bharat<span className="text-accent">XR</span>
                            </h1>
                        </Link>
                    </div>

                    <motion.div
                        className="relative z-10 space-y-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                            Building India's XR Ecosystem
                        </h2>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Join India's largest community of XR creators, developers, and educators.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {trustSignals.map((signal, index) => (
                                <div key={signal.text} className="flex items-center gap-3 text-muted-foreground">
                                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                                        <signal.icon className="w-4 h-4 text-accent" />
                                    </div>
                                    <span className="text-sm font-medium">{signal.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <div className="relative z-10">
                        <p className="text-sm text-muted-foreground">© 2026 Bharat XR</p>
                    </div>
                </div>

                {/* Auth Form Panel (Right) */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10 overflow-y-auto">
                    <div className="w-full max-w-md my-auto">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center">
                            <Link to="/" className="inline-block">
                                <h1 className="text-2xl font-bold text-foreground">
                                    Bharat<span className="text-accent">XR</span>
                                </h1>
                            </Link>
                        </div>

                        <AnimatePresence mode="wait">
                            {mode === 'login' ? (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
                                        <p className="text-muted-foreground text-sm">Sign in to continue</p>
                                    </div>

                                    <Form {...loginForm}>
                                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                                            <FormField
                                                control={loginForm.control}
                                                name="identifier"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email or Phone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="user@example.com or 9876543210" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={loginForm.control}
                                                name="password"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <div className="flex items-center justify-between">
                                                            <FormLabel>Password</FormLabel>
                                                            <Link to="/forgot-password" className="text-xs text-accent hover:underline">
                                                                Forgot password?
                                                            </Link>
                                                        </div>
                                                        <FormControl>
                                                            <div className="relative">
                                                                <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                                                                <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign In'}
                                            </Button>
                                        </form>
                                    </Form>

                                    <p className="mt-6 text-center text-sm text-muted-foreground">
                                        Don't have an account?{' '}
                                        <button onClick={() => setMode('signup')} className="text-accent font-medium hover:underline">
                                            Create one
                                        </button>
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="signup"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
                                        <p className="text-muted-foreground text-sm">Join the Bharat XR ecosystem</p>
                                    </div>

                                    <Form {...signupForm}>
                                        <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                                            {/* Name Fields */}
                                            <div className="grid grid-cols-3 gap-2">
                                                <FormField control={signupForm.control} name="first_name" render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel>First Name*</FormLabel>
                                                        <FormControl><Input placeholder="John" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={signupForm.control} name="middle_name" render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel>Middle</FormLabel>
                                                        <FormControl><Input placeholder="" {...field} /></FormControl>
                                                    </FormItem>
                                                )} />
                                                <FormField control={signupForm.control} name="last_name" render={({ field }) => (
                                                    <FormItem className="col-span-1">
                                                        <FormLabel>Last Name*</FormLabel>
                                                        <FormControl><Input placeholder="Doe" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>

                                            {/* Contact Fields */}
                                            <div className="grid grid-cols-2 gap-2">
                                                <FormField control={signupForm.control} name="email" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email*</FormLabel>
                                                        <FormControl><Input type="email" placeholder="john@doe.com" {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                                <FormField control={signupForm.control} name="phone" render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone (10 digits)*</FormLabel>
                                                        <FormControl><Input placeholder="9876543210" maxLength={10} {...field} /></FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )} />
                                            </div>

                                            {/* Password */}
                                            <FormField control={signupForm.control} name="password" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Password*</FormLabel>
                                                    <FormControl>
                                                        <div className="relative">
                                                            <Input type={showPassword ? 'text' : 'password'} placeholder="Min 8 chars" {...field} />
                                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            {/* User Type Selection */}
                                            <FormField control={signupForm.control} name="user_type" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>I am a...*</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select Role" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="school">School Student</SelectItem>
                                                            <SelectItem value="undergraduate">Undergraduate Student</SelectItem>
                                                            <SelectItem value="graduate">Graduate Student</SelectItem>
                                                            <SelectItem value="professional">Working Professional</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />

                                            {/* CONDITIONAL FIELDS */}

                                            {/* School Fields */}
                                            {userType === 'school' && (
                                                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                    <FormField control={signupForm.control} name="school_name" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>School Name*</FormLabel>
                                                            <FormControl><Input placeholder="e.g. DPS Mathura" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                    <FormField control={signupForm.control} name="class_grade" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Class/Grade*</FormLabel>
                                                            <FormControl><Input placeholder="e.g. 10th" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                </div>
                                            )}

                                            {/* College Fields */}
                                            {(userType === 'undergraduate' || userType === 'graduate') && (
                                                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                    <FormField control={signupForm.control} name="college_name" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>College Name*</FormLabel>
                                                            <FormControl><Input placeholder="e.g. IIT Delhi" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <FormField control={signupForm.control} name="branch" render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Branch*</FormLabel>
                                                                <FormControl><Input placeholder="e.g. CSE" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <FormField control={signupForm.control} name="stream" render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Stream*</FormLabel>
                                                                <FormControl><Input placeholder="e.g. B.Tech" {...field} /></FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Professional Fields */}
                                            {userType === 'professional' && (
                                                <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                                                    <FormField control={signupForm.control} name="job_role" render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Job Role*</FormLabel>
                                                            <FormControl><Input placeholder="e.g. Unity Developer" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )} />
                                                </div>
                                            )}

                                            {/* Social Links (Optional) */}
                                            <div className="space-y-3 pt-2">
                                                <FormLabel className="text-xs uppercase text-muted-foreground font-semibold">Socials (Optional)</FormLabel>
                                                <FormField control={signupForm.control} name="linkedin_url" render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl><Input placeholder="LinkedIn Profile URL" {...field} /></FormControl>
                                                    </FormItem>
                                                )} />
                                                <FormField control={signupForm.control} name="github_url" render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl><Input placeholder="GitHub Profile URL" {...field} /></FormControl>
                                                    </FormItem>
                                                )} />
                                            </div>

                                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
                                                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : 'Create Account'}
                                            </Button>
                                        </form>
                                    </Form>

                                    <p className="mt-6 text-center text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <button onClick={() => setMode('login')} className="text-accent font-medium hover:underline">
                                            Sign in
                                        </button>
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default AuthPage;