import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Zap,
    CheckCircle2,
    Loader2,
    User,
    Mail,
    School,
    Link as LinkIcon,
    Smartphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { publicService } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// --- VALIDATION SCHEMA ---
const formSchema = z.object({
    full_name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    college_name: z.string().min(2, "College name is required"),
    gender: z.string().min(1, "Gender is required"),
    lens_link: z.string().url("Please enter a valid URL (https://...)"),
});

type FormData = z.infer<typeof formSchema>;

// --- FRAMER VARIANTS ---
const formReveal: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1] as const
        }
    }
};

export const SubmitLensPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema)
    });

    // API Submission
    const onSubmit = async (values: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await publicService.showcase.submitLens(values);

            if (response.status === 'success') {
                setIsSubmitted(true);
            } else {
                throw new Error(response.message || "Submission failed");
            }
        } catch (error: any) {
            toast({
                title: "Transmission Error",
                description: error.message || "Could not submit lens.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- SUCCESS VIEW ---
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[32px] p-8 md:p-12 text-center max-w-lg shadow-2xl border border-slate-100"
                >
                    <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Lens Deployed</h2>
                    <p className="text-slate-500 mb-8">
                        Your augmented reality lens link has been captured. It is now queued for verification.
                    </p>
                    <Link to="/showcase">
                        <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-widest hover:bg-slate-800">
                            Return to Matrix
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    // --- FORM VIEW ---
    return (
        <div className="min-h-screen bg-slate-50 selection:bg-purple-500/20 selection:text-purple-600">
            <Header />

            <main className="pt-32 pb-20 relative overflow-hidden">

                {/* --- BACKGROUND PHYSICS --- */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
                    <motion.div
                        animate={{ x: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 15, repeat: Infinity }}
                        className="absolute top-20 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-[100px]"
                    />
                </div>

                <div className="container max-w-4xl relative z-10 px-4">

                    {/* Back Link */}
                    <Link to="/showcase" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
                        <ArrowLeft size={14} /> Back to Gallery
                    </Link>

                    {/* Form Container */}
                    <motion.div
                        variants={formReveal}
                        initial="hidden"
                        animate="visible"
                        className="bg-white rounded-[40px] shadow-xl border border-slate-100 overflow-hidden"
                    >
                        {/* Header Plate */}
                        <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50 relative">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" />
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                                Submit Lens
                            </h1>
                            <p className="text-slate-500 font-medium max-w-xl">
                                Deploy your Snap Lenses, Instagram Filters, or WebXR links directly to the grid.
                            </p>
                        </div>

                        {/* Input Matrix */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">

                            {/* Section 1: Identity */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <User size={14} /> Creator Name
                                        </Label>
                                        <Input
                                            {...register('full_name')}
                                            placeholder="Enter your full name"
                                            className="h-14 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-0 text-lg font-bold bg-slate-50/50 transition-all"
                                        />
                                        {errors.full_name && <span className="text-red-500 text-xs">{errors.full_name.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Mail size={14} /> Email Address
                                        </Label>
                                        <Input
                                            {...register('email')}
                                            placeholder="john@college.edu"
                                            className="h-14 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-0 text-lg font-medium bg-slate-50/50 transition-all"
                                        />
                                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <School size={14} /> College / Institution
                                        </Label>
                                        <Input
                                            {...register('college_name')}
                                            placeholder="e.g. IIT Bombay"
                                            className="h-14 rounded-xl border-slate-200 focus:border-purple-500 focus:ring-0 text-lg font-medium bg-slate-50/50 transition-all"
                                        />
                                        {errors.college_name && <span className="text-red-500 text-xs">{errors.college_name.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</Label>
                                        <Select onValueChange={(val) => { setValue('gender', val); trigger('gender'); }}>
                                            <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-0 focus:border-purple-500 text-lg font-medium">
                                                <SelectValue placeholder="Select Gender" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Male">Male</SelectItem>
                                                <SelectItem value="Female">Female</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <span className="text-red-500 text-xs">{errors.gender.message}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Payload */}
                            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                        <LinkIcon size={14} /> Lens / Effect Link
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            {...register('lens_link')}
                                            placeholder="https://www.snapchat.com/unlock/?type=SNAPCODE..."
                                            className="h-14 pl-12 rounded-xl bg-white border-purple-200 focus:border-purple-500 focus:ring-0 text-lg font-medium shadow-sm"
                                        />
                                        <div className="absolute left-4 top-4 text-purple-300">
                                            <Smartphone size={24} />
                                        </div>
                                    </div>
                                    {errors.lens_link && <span className="text-red-500 text-xs">{errors.lens_link.message}</span>}
                                    <p className="text-xs text-purple-400/80 pl-1">
                                        *Supports Snap Lenses, Instagram Filters, and 8th Wall Links.
                                    </p>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-slate-900 to-purple-900 hover:to-purple-700 text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-500 group"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" /> Uploading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Zap size={18} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                                            Initialize Launch
                                        </span>
                                    )}
                                </Button>
                            </div>

                        </form>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
};