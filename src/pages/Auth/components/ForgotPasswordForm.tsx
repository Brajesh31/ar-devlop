import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth'; // ✅ Use the Hook for consistent Toast handling
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from 'lucide-react';

// Validation Schema
const forgotSchema = z.object({
    email: z.string().email("Please enter a valid email address")
});

type ForgotFormData = z.infer<typeof forgotSchema>;

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
}

export const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
    const { forgotPassword } = useAuth(); // ✅ Destructure helper from useAuth
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const form = useForm<ForgotFormData>({
        resolver: zodResolver(forgotSchema),
        defaultValues: { email: '' }
    });

    const onSubmit = async (data: ForgotFormData) => {
        setIsSubmitting(true);
        try {
            // ✅ Call forgotPassword from useAuth (handles API + Toasts)
            const result = await forgotPassword(data.email);

            if (result && result.success) {
                setIsSent(true);
            }
        } catch (error) {
            console.error("Forgot Password Error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSent) {
        // SUCCESS STATE (Check Inbox UI)
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-10"
            >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Check your inbox</h3>
                <p className="text-slate-500 mb-6 text-sm">
                    We've sent a password reset link to <br/>
                    <span className="font-semibold text-slate-900">{form.getValues('email')}</span>
                </p>
                <Button onClick={onBackToLogin} variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50">
                    Back to Login
                </Button>
            </motion.div>
        );
    }

    // FORM STATE
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <button
                onClick={onBackToLogin}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600 mb-6 transition-colors group"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
            </button>

            <div className="mb-8">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                    <Mail size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Reset Password</h2>
                <p className="text-slate-500 mt-2 text-sm">Enter your registered email to receive a recovery link.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    className="bg-white/50 h-12"
                                    placeholder="name@example.com"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF6B35] hover:bg-[#E85D2A] text-white h-11 shadow-md">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Send Reset Link"}
                    </Button>
                </form>
            </Form>
        </motion.div>
    );
};