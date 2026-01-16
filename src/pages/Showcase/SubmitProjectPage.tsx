// src/pages/showcase/SubmitProjectPage.tsx
import React, { useState } from 'react';
// FIX: Imported 'Variants' for strict typing
import { motion, Variants } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- FRAMER VARIANTS ---
// FIX: Explicitly typed as 'Variants' to fix TS errors
const formReveal: Variants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: {
            duration: 0.8,
            // FIX: Added 'as const' to satisfy Bezier Tuple requirement
            ease: [0.16, 1, 0.3, 1] as const
        }
    }
};

export const SubmitProjectPage = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [tags, setTags] = useState<string[]>([]);
    const [currentTag, setCurrentTag] = useState("");

    // FIX: Added specific HTMLInputElement type
    const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            setTags([...tags, currentTag.trim()]);
            setCurrentTag("");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        // Note: In a real app, ensure this is cleaned up if the component unmounts
        setTimeout(() => setIsSubmitted(true), 1500);
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
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Transmission Received</h2>
                    <p className="text-slate-500 mb-8">
                        Your project has been uploaded to the grid. Our architects will review your submission shortly.
                    </p>
                    <Link to="/showcase">
                        <Button className="w-full h-12 rounded-xl bg-slate-900 text-white font-bold uppercase tracking-widest">
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
                                Fill out the manifest below to deploy your AR/VR project to the BharatXR showcase.
                            </p>
                        </div>

                        {/* Input Matrix */}
                        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">

                            {/* Section 1: Core Data */}
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Project Title</Label>
                                        <Input placeholder="e.g. Neo-Tokyo VR" className="h-14 rounded-xl border-slate-200 focus:border-[#FF6B35] focus:ring-0 text-lg font-bold bg-slate-50/50 transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Project URL</Label>
                                        <Input placeholder="https://" className="h-14 rounded-xl border-slate-200 focus:border-[#FF6B35] focus:ring-0 text-lg font-medium bg-slate-50/50 transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</Label>
                                    <Textarea placeholder="Describe your reality..." className="min-h-[120px] rounded-xl border-slate-200 focus:border-[#FF6B35] focus:ring-0 text-base font-medium bg-slate-50/50 transition-all resize-none p-4" />
                                </div>
                            </div>

                            {/* Section 2: Tech Specs */}
                            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-6">
                                <div className="flex items-center gap-2 mb-2">
                                    <Layers size={16} className="text-[#FBBF24]" />
                                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Technical Manifest</span>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-400">Tech Stack (Press Enter to add)</Label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {tags.map(tag => (
                                            <Badge key={tag} className="bg-white text-slate-700 border border-slate-200 px-3 py-1">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <Input
                                        value={currentTag}
                                        onChange={(e) => setCurrentTag(e.target.value)}
                                        onKeyDown={handleTagAdd}
                                        placeholder="e.g. Unity, Three.js, Lens Studio"
                                        className="h-12 rounded-xl bg-white border-slate-200"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400">Category</Label>
                                        <select className="w-full h-12 rounded-xl border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 outline-none focus:border-[#FF6B35]">
                                            <option>Augmented Reality (AR)</option>
                                            <option>Virtual Reality (VR)</option>
                                            <option>WebXR</option>
                                            <option>Snap Lens</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-400">Creator ID / Team Name</Label>
                                        <Input placeholder="Who built this?" className="h-12 rounded-xl bg-white border-slate-200" />
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Visuals */}
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Thumbnail Upload</Label>
                                <div className="border-2 border-dashed border-slate-200 rounded-2xl h-32 flex flex-col items-center justify-center text-slate-400 hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 transition-all cursor-pointer group">
                                    <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-xs font-bold uppercase tracking-wide">Drop Holo-Data Here</span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="pt-4">
                                <Button type="submit" className="w-full h-16 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 hover:to-[#3B82F6] text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl transition-all duration-500 group">
                    <span className="flex items-center gap-2">
                       <Zap size={18} className="text-[#FBBF24] group-hover:scale-110 transition-transform" />
                       Initialize Launch
                    </span>
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