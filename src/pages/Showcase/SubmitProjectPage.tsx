import React, { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Zap,
    CheckCircle2,
    Loader2,
    Video,
    Layers,
    User,
    Mail,
    School,
    UploadCloud,
    Link as LinkIcon
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
// Updated to match your PHP Backend requirements
const formSchema = z.object({
    full_name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email address"),
    college_name: z.string().min(2, "College name is required"),
    gender: z.string().min(1, "Gender is required"), // ✅ Added for Backend
    project_title: z.string().min(2, "Project title is required"),
    project_description: z.string().optional(),
    lens_link: z.string().url("Valid Lens Link is required"), // ✅ Added for Backend
    tech_stack: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    // Note: File validation happens manually in the handler
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

export const SubmitProjectPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null); // ✅ State for Video File

    const { register, handleSubmit, setValue, trigger, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "AR"
        }
    });

    // Tag Handling
    const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // File Handling
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Basic frontend check (Backend does the strict check)
            if (file.size > 3 * 1024 * 1024) {
                toast({ title: "File too large", description: "Max size is 3MB", variant: "destructive" });
                return;
            }
            setVideoFile(file);
        }
    };

    // API Submission
    const onSubmit = async (values: FormData) => {
        if (!videoFile) {
            toast({ title: "Missing Video", description: "Please upload a project video.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            // ✅ Create FormData for File Upload
            const formData = new FormData();
            formData.append('full_name', values.full_name);
            formData.append('email', values.email);
            formData.append('college_name', values.college_name);
            formData.append('gender', values.gender); // ✅ Backend Req
            formData.append('project_title', values.project_title);
            formData.append('lens_link', values.lens_link); // ✅ Backend Req
            formData.append('video_file', videoFile); // ✅ The File
            formData.append('tech_stack', tags.join(', '));
            formData.append('category', values.category);
            if (values.project_description) {
                formData.append('project_description', values.project_description);
            }

            // Call API with FormData
            const response = await publicService.showcase.submitVideo(formData);

            if (response.status === 'success') {
                setIsSubmitted(true);
            } else {
                throw new Error(response.message || "Submission failed");
            }
        } catch (error: any) {
            toast({
                title: "Transmission Error",
                description: error.message || "Could not submit project.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[32px] p-8 md:p-12 text-center max-w-lg shadow-2xl border border-slate-100"
                >
                    <div className="w-20 h-20 bg-emerald-50 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Project Uploaded</h2>
                    <p className="text-slate-500 mb-8">
                        Your project has been secured in the grid. Our architects will review your submission shortly.
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

    return (
        <div className="min-h-screen bg-slate-50 selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
            <Header />

            <main className="pt-32 pb-20 relative overflow-hidden">

                {/* --- LAYER 0: BACKGROUND PHYSICS --- */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
                    <motion.div
                        animate={{ y: [0, -50, 0], opacity: [0.3, 0.5, 0.3] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#FF6B35]/10 to-transparent rounded-full blur-[100px]"
                    />
                </div>

                <div className="container max-w-4xl relative z-10 px-4">

                    {/* Back Link */}
                    <Link to="/showcase" className="inline-flex items-center gap-2 text-slate-400 hover:text-[#FF6B35] transition-colors mb-8 font-bold text-xs uppercase tracking-widest">
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
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B35] via-[#FBBF24] to-[#3B82F6]" />
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-2">
                                Submit Project
                            </h1>
                            <p className="text-slate-500 font-medium max-w-xl">
                                Upload your MP4 video file and project details to the BharatXR showcase.
                            </p>
                        </div>

                        {/* Input Matrix */}
                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-8">

                            {/* Section 1: Creator Data */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <User size={14} /> Full Name
                                        </Label>
                                        <Input
                                            {...register('full_name')}
                                            placeholder="John Doe"
                                            className="h-14 rounded-xl border-slate-200 focus:border-[#FF6B35] focus:ring-0 text-lg font-bold bg-slate-50/50 transition-all"
                                        />
                                        {errors.full_name && <span className="text-red-500 text-xs">{errors.full_name.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <Mail size={14} /> Email
                                        </Label>
                                        <Input
                                            {...register('email')}
                                            placeholder="john@college.edu"
                                            className="h-14 rounded-xl border-slate-200 focus:border-[#FF6B35] focus:ring-0 text-lg font-medium bg-slate-50/50 transition-all"
                                        />
                                        {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            <School size={14} /> College Name
                                        </Label>
                                        <Input
                                            {...register('college_name')}
                                            placeholder="e.g. IIT Bombay"
                                            className="h-14 rounded-xl border-slate-200 focus:border-[#FF6B35] focus:ring-0 text-lg font-medium bg-slate-50/50 transition-all"
                                        />
                                        {errors.college_name && <span className="text-red-500 text-xs">{errors.college_name.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Gender</Label>
                                        <Select onValueChange={(val) => { setValue('gender', val); trigger('gender'); }}>
                                            <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-slate-50/50 focus:ring-0 focus:border-[#FF6B35] text-lg font-medium">
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

                            {/* Section 2: Project Data */}
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers size={16} className="text-[#FBBF24]" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Technical Manifest</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400">Project Title</Label>
                                        <Input
                                            {...register('project_title')}
                                            placeholder="e.g. Neo-Tokyo VR"
                                            className="h-12 rounded-xl bg-white border-slate-200"
                                        />
                                        {errors.project_title && <span className="text-red-500 text-xs">{errors.project_title.message}</span>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400">Category</Label>
                                        <Select onValueChange={(val) => { setValue('category', val); trigger('category'); }}>
                                            <SelectTrigger className="h-12 rounded-xl bg-white border-slate-200">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="AR">Augmented Reality (AR)</SelectItem>
                                                <SelectItem value="VR">Virtual Reality (VR)</SelectItem>
                                                <SelectItem value="WebXR">WebXR</SelectItem>
                                                <SelectItem value="Game">Game Dev</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400">Description</Label>
                                    <Textarea
                                        {...register('project_description')}
                                        placeholder="Describe your reality..."
                                        className="min-h-[100px] rounded-xl bg-white border-slate-200 resize-none"
                                    />
                                    {errors.project_description && <span className="text-red-500 text-xs">{errors.project_description.message}</span>}
                                </div>

                                {/* Tech Stack */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400">Tech Stack (Type & Enter)</Label>
                                    <div className="flex flex-wrap gap-2 mb-2 min-h-[30px]">
                                        {tags.map(tag => (
                                            <Badge key={tag} onClick={() => removeTag(tag)} className="bg-white text-slate-700 border border-slate-200 px-3 py-1 cursor-pointer hover:bg-red-50 hover:text-red-500 transition-colors">
                                                {tag} ×
                                            </Badge>
                                        ))}
                                    </div>
                                    <Input
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleTagAdd}
                                        placeholder="e.g. Unity, Three.js (Press Enter)"
                                        className="h-12 rounded-xl bg-white border-slate-200"
                                    />
                                </div>

                                {/* Lens Link */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400 flex items-center gap-2">
                                        <LinkIcon size={14} /> Lens / Experience Link (Required)
                                    </Label>
                                    <Input
                                        {...register('lens_link')}
                                        placeholder="https://..."
                                        className="h-12 rounded-xl bg-white border-slate-200"
                                    />
                                    {errors.lens_link && <span className="text-red-500 text-xs">{errors.lens_link.message}</span>}
                                </div>
                            </div>

                            {/* Section 3: Video File Upload (Replaces URL) */}
                            <div className="space-y-4">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                    <Video size={14} /> Project Video File (Max 3MB)
                                </Label>

                                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/5 transition-all">
                                    <input
                                        type="file"
                                        accept="video/mp4,video/x-m4v"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                                        <UploadCloud size={20} className="text-[#FF6B35]" />
                                    </div>
                                    {videoFile ? (
                                        <div className="text-sm font-bold text-emerald-600">
                                            {videoFile.name} ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-sm font-bold text-slate-700">Click or Drag to Upload Video</p>
                                            <p className="text-xs text-slate-400 mt-1">Supported formats: MP4 (Max 3MB)</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-16 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:to-[#3B82F6] text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-500 group"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="animate-spin" /> Uploading...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Zap size={18} className="text-[#FBBF24] group-hover:scale-110 transition-transform" />
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