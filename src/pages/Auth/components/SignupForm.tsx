import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, School, GraduationCap, Briefcase, Award, Linkedin, Github } from 'lucide-react';

// Validation Schema
const signupSchema = z.object({
    first_name: z.string().min(2, "First name is required"),
    middle_name: z.string().optional(),
    last_name: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone must be exactly 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    linkedin_url: z.string().optional(),
    github_url: z.string().optional(),

    user_type: z.enum(['school', 'undergraduate', 'graduate', 'professional']),
    school_name: z.string().optional(),
    class_grade: z.string().optional(),
    college_name: z.string().optional(),
    branch: z.string().optional(),
    stream: z.string().optional(),
    job_role: z.string().optional(),
}).refine((data) => {
    if (data.user_type === 'school') return !!data.school_name && !!data.class_grade;
    if (data.user_type === 'undergraduate' || data.user_type === 'graduate') return !!data.college_name && !!data.branch && !!data.stream;
    if (data.user_type === 'professional') return !!data.job_role;
    return true;
}, {
    message: "Required fields missing for selected role",
    path: ["user_type"],
});

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
    onLogin: () => void;
}

export const SignupForm = ({ onLogin }: SignupFormProps) => {
    const { signup } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            first_name: '', middle_name: '', last_name: '', email: '', phone: '', password: '',
            linkedin_url: '', github_url: '',
            user_type: 'undergraduate',
        }
    });

    const userType = form.watch('user_type');

    const onSubmit = async (data: SignupFormData) => {
        setIsSubmitting(true);
        try {
            const result = await signup(data);
            if (result?.success) {
                onLogin();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full overflow-y-auto pr-2 custom-scrollbar max-h-[600px]"
        >
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                <p className="text-slate-500 mt-1 text-sm">Join the community in seconds.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                    {/* Name Row */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="first_name" render={({ field }) => (
                            <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="last_name" render={({ field }) => (
                            <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    {/* Middle Name (Optional) */}
                    <FormField control={form.control} name="middle_name" render={({ field }) => (
                        <FormItem><FormLabel>Middle Name <span className="text-gray-400 text-xs">(Optional)</span></FormLabel><FormControl><Input placeholder="" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    {/* Contact Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="john@doe.com" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="9876543210" maxLength={10} className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="Create Password" className="bg-white/80" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    {/* Social Links Row (Optional) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <FormField control={form.control} name="linkedin_url" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Linkedin size={14} className="text-blue-600"/> LinkedIn <span className="text-gray-400 text-xs">(Optional)</span></FormLabel>
                                <FormControl><Input placeholder="Profile URL" className="bg-white/80" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="github_url" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2"><Github size={14}/> GitHub <span className="text-gray-400 text-xs">(Optional)</span></FormLabel>
                                <FormControl><Input placeholder="Profile URL" className="bg-white/80" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    {/* User Type Selection */}
                    <div className="pt-2">
                        <FormField control={form.control} name="user_type" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold text-slate-800">I am a...</FormLabel>
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
                    </div>

                    {/* DYNAMIC FIELDS */}
                    <AnimatePresence mode='wait'>
                        {userType === 'school' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="space-y-3 bg-green-50/50 p-4 rounded-xl border border-green-100 overflow-hidden"
                            >
                                <FormField control={form.control} name="school_name" render={({ field }) => (
                                    <FormItem><FormLabel>School Name</FormLabel><FormControl><Input placeholder="e.g. DPS Mathura" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="class_grade" render={({ field }) => (
                                    <FormItem><FormLabel>Class/Grade</FormLabel><FormControl><Input placeholder="e.g. 10th" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </motion.div>
                        )}

                        {(userType === 'undergraduate' || userType === 'graduate') && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="space-y-3 bg-orange-50/50 p-4 rounded-xl border border-orange-100 overflow-hidden"
                            >
                                <FormField control={form.control} name="college_name" render={({ field }) => (
                                    <FormItem><FormLabel>College Name</FormLabel><FormControl><Input placeholder="e.g. IIT Delhi" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormField control={form.control} name="branch" render={({ field }) => (
                                        <FormItem><FormLabel>Branch</FormLabel><FormControl><Input placeholder="e.g. CSE" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="stream" render={({ field }) => (
                                        <FormItem><FormLabel>Stream</FormLabel><FormControl><Input placeholder="e.g. B.Tech" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </motion.div>
                        )}

                        {userType === 'professional' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 overflow-hidden"
                            >
                                <FormField control={form.control} name="job_role" render={({ field }) => (
                                    <FormItem><FormLabel>Job Role</FormLabel><FormControl><Input placeholder="e.g. Unity Developer" className="bg-white" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <Button type="submit" disabled={isSubmitting} className="w-full h-11 mt-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/20">
                        {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Account"}
                    </Button>
                </form>
            </Form>

            <div className="mt-6 text-center pb-4">
                <p className="text-gray-500 text-sm">
                    Already have an account?
                    <button onClick={onLogin} className="text-[#FF6B35] font-bold hover:underline ml-1">Sign in</button>
                </p>
            </div>
        </motion.div>
    );
};