import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Lock, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { authService } from '@/services/api';

const resetSchema = z.object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');
    const email = searchParams.get('email');

    useEffect(() => {
        if (!token || !email) {
            toast({
                title: "Invalid Link",
                description: "This password reset link is invalid or missing information.",
                variant: "destructive",
            });
            navigate('/bharatxrpannelpanneladmin');
        }
    }, [token, email, navigate, toast]);

    const form = useForm<ResetForm>({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetForm) => {
        if (!token || !email) return;

        setIsLoading(true);
        try {
            const response = await authService.adminResetPassword(token, email, data.password);

            if (response.status === 'success') {
                toast({
                    title: "Password Reset Successful",
                    description: "You can now login with your new password.",
                    className: "bg-green-50 border-green-200 text-green-900"
                });
                navigate('/bharatxrpannelpanneladmin');
            } else {
                toast({
                    title: "Reset Failed",
                    description: response.message || "Link expired or invalid.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Could not connect to server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <Helmet>
                <title>Reset Password | BharatXR</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FF6B35] to-transparent opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-8 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#22C55E]/20">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Set New Password</h1>
                    <p className="text-slate-500 text-sm mt-1">Make sure it's strong and secure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-[#22C55E] transition-colors" />
                                            <Input
                                                type="password"
                                                {...field}
                                                className="pl-10 h-12 bg-white border-slate-200 focus:border-[#22C55E] focus:ring-[#22C55E]/10 rounded-xl"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative group">
                                            <CheckCircle2 className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-[#22C55E] transition-colors" />
                                            <Input
                                                type="password"
                                                {...field}
                                                className="pl-10 h-12 bg-white border-slate-200 focus:border-[#22C55E] focus:ring-[#22C55E]/10 rounded-xl"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl shadow-lg transition-all hover:scale-[1.01] mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default ResetPassword;