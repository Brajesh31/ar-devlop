import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom'; // ✅ Added import
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// Validation Schema
const loginSchema = z.object({
    identifier: z.string().min(1, "Email or Phone is required"),
    password: z.string().min(1, "Password is required")
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onForgotPassword: () => void;
    onSignup: () => void;
}

export const LoginForm = ({ onForgotPassword, onSignup }: LoginFormProps) => {
    const { login } = useAuth();
    const navigate = useNavigate(); // ✅ Initialize navigation
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initialize Form
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { identifier: '', password: '' }
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsSubmitting(true);
        try {
            // @ts-ignore
            const result = await login(data); // ✅ Capture login result

            // ✅ Check if login was successful and redirect
            if (result && result.success) {
                navigate('/dashboard'); // Redirect to dashboard
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>
                <p className="text-slate-500 mt-2 text-sm">Welcome back! Please enter your details.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Identifier Field */}
                    <FormField control={form.control} name="identifier" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email or Phone</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="john@example.com"
                                    className="bg-white/50 border-slate-200 focus:bg-white transition-all h-11"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {/* Password Field */}
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <div className="flex justify-between items-center">
                                <FormLabel>Password</FormLabel>
                                <button
                                    type="button"
                                    onClick={onForgotPassword}
                                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        {...field}
                                        className="bg-white/50 border-slate-200 focus:bg-white transition-all h-11 pr-10"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#FF6B35] hover:bg-[#E85D2A] text-white shadow-lg shadow-orange-500/20 h-11 text-base transition-all hover:scale-[1.01]"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Sign In"}
                    </Button>
                </form>
            </Form>

            <div className="mt-8 pt-6 border-t border-gray-200/60 text-center">
                <p className="text-gray-500 text-sm">
                    Don't have an account?
                    <button onClick={onSignup} className="text-[#FF6B35] font-bold hover:underline ml-1">Create free account</button>
                </p>
            </div>
        </motion.div>
    );
};