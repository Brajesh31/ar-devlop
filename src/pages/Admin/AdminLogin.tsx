import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, ShieldCheck, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { authService } from '@/services/api';

// --- Schemas ---
const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

const forgotSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Types derived from Zod
type LoginForm = z.infer<typeof loginSchema>;
type ForgotForm = z.infer<typeof forgotSchema>;

const AdminLogin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [isLoading, setIsLoading] = useState(false);

    // --- Forms ---
    const loginForm = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });

    const forgotForm = useForm<ForgotForm>({
        resolver: zodResolver(forgotSchema),
        defaultValues: { email: '' },
    });

    // --- Handlers ---
    const onLogin = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            // FIX: Explicitly assert the type here.
            // The zodResolver ensures 'data' is valid, but TS fears 'data' might be partial
            // coming from the form hook. This cast satisfies the 'LoginCredentials' requirement.
            const payload = {
                email: data.email,
                password: data.password
            };

            const response = await authService.adminLogin(payload);

            if (response.status === 'success' && (response.user || response.data)) {
                const adminUser = response.user || response.data;
                toast({
                    title: "Access Granted",
                    description: `Welcome, ${adminUser?.name || 'Admin'}`,
                    className: "bg-green-50 border-green-200 text-green-900"
                });
                localStorage.setItem('bharatxr_admin_user', JSON.stringify(adminUser));
                navigate('/admin/dashboard');
            } else {
                toast({
                    title: "Access Denied",
                    description: response.message || "Invalid credentials",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({ title: "Error", description: "Network error.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const onForgot = async (data: ForgotForm) => {
        setIsLoading(true);
        try {
            const response = await authService.adminForgotPassword(data.email);

            if (response.status === 'success') {
                toast({
                    title: "Email Sent",
                    description: "Check your inbox for the reset link.",
                    className: "bg-blue-50 border-blue-200 text-blue-900"
                });
                setView('login');
            } else {
                toast({
                    title: "Error",
                    description: response.message || "Could not send email.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast({ title: "Error", description: "Network error.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Helmet>
                <title>Admin Portal | BharatXR</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* --- Animated Background Blobs --- */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#FF6B35]/10 rounded-full blur-[100px]"
            />
            <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, -60, 0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#22C55E]/10 rounded-full blur-[120px]"
            />

            <div className="w-full max-w-[420px] relative z-10 perspective-[1000px]">
                <AnimatePresence mode="wait">

                    {/* === LOGIN VIEW === */}
                    {view === 'login' ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, rotateY: -10, x: -20 }}
                            animate={{ opacity: 1, rotateY: 0, x: 0 }}
                            exit={{ opacity: 0, rotateY: 10, x: 20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B35] to-[#FF8F6B] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF6B35]/20">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
                                <p className="text-slate-500 text-sm mt-1">Enter your credentials to access the panel</p>
                            </div>

                            <Form {...loginForm}>
                                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                                    <FormField
                                        control={loginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-[#FF6B35] transition-colors" />
                                                        <Input {...field} className="pl-10 h-12 bg-white border-slate-200 focus:border-[#FF6B35] focus:ring-[#FF6B35]/10 rounded-xl" placeholder="Email" />
                                                    </div>
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
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-[#22C55E] transition-colors" />
                                                        <Input type="password" {...field} className="pl-10 h-12 bg-white border-slate-200 focus:border-[#22C55E] focus:ring-[#22C55E]/10 rounded-xl" placeholder="Password" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end">
                                        <button type="button" onClick={() => setView('forgot')} className="text-xs font-medium text-slate-500 hover:text-[#FF6B35] transition-colors">
                                            Forgot Password?
                                        </button>
                                    </div>

                                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]">
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Sign In"}
                                    </Button>
                                </form>
                            </Form>
                        </motion.div>
                    ) : (

                        /* === FORGOT PASSWORD VIEW === */
                        <motion.div
                            key="forgot"
                            initial={{ opacity: 0, rotateY: 10, x: 20 }}
                            animate={{ opacity: 1, rotateY: 0, x: 0 }}
                            exit={{ opacity: 0, rotateY: -10, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8"
                        >
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#4ADE80] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#22C55E]/20">
                                    <KeyRound className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-800">Reset Password</h1>
                                <p className="text-slate-500 text-sm mt-1">We'll send a recovery link to your email</p>
                            </div>

                            <Form {...forgotForm}>
                                <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-6">
                                    <FormField
                                        control={forgotForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-[#22C55E] transition-colors" />
                                                        <Input {...field} className="pl-10 h-12 bg-white border-slate-200 focus:border-[#22C55E] focus:ring-[#22C55E]/10 rounded-xl" placeholder="Enter your registered email" />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" disabled={isLoading} className="w-full h-12 bg-[#22C55E] hover:bg-[#16a34a] text-white rounded-xl shadow-lg shadow-[#22C55E]/20 transition-all hover:scale-[1.02]">
                                        {isLoading ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                                    </Button>

                                    <div className="text-center">
                                        <button type="button" onClick={() => setView('login')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
                                            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
                                        </button>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminLogin;