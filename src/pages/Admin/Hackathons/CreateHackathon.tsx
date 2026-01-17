import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save,
    ArrowLeft,
    Upload,
    Calendar,
    Users,
    Trophy,
    Clock,
    MapPin,
    Layers,
    Plus,
    Trash2,
    Image as ImageIcon,
    Sparkles,
    Link as LinkIcon
} from 'lucide-react';
import { adminService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// --- PHYSICS ENGINE ---
const PHYSICS = {
    ease: [0.16, 1, 0.3, 1],
    spring: { type: "spring", stiffness: 90, damping: 40, mass: 1.2 }
};

const TABS = [
    { id: 'basics', label: 'Basics & Logistics', icon: Layers },
    { id: 'timeline', label: 'Timeline & Phases', icon: Clock },
    { id: 'people', label: 'Mentors & Jury', icon: Users },
    { id: 'prizes', label: 'Prizes & Tracks', icon: Trophy },
];

const CreateHackathon = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('basics');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        longDescription: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        status: 'upcoming',
        mode: 'hybrid',
        location: '',
        image: '',

        // Logistics
        prizePool: '',
        fee: 'free',
        feeAmount: 0,
        teamSize: 'teams', // 'solo' | 'teams'
        minTeamSize: 2,
        maxTeamSize: 4,

        // External
        registrationUrl: '',
        resultsUrl: '',

        // Dynamic Arrays
        timeline: [] as any[],
        mentors: [] as any[],
        jury: [] as any[],
        prizes: [] as any[],
        tracks: [] as any[]
    });

    // --- HANDLERS ---
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        try {
            const response = await adminService.uploadImage(e.target.files[0], 'hackathon');
            if (response.status === 'success') {
                setFormData(prev => ({ ...prev, image: response.url }));
                toast.success("Banner uploaded successfully");
            } else {
                toast.error("Upload failed");
            }
        } catch (err) {
            toast.error("Network error during upload");
        } finally {
            setUploading(false);
        }
    };

    // Generic Array Handlers (Add/Remove items)
    const addItem = (field: 'timeline' | 'mentors' | 'jury' | 'prizes' | 'tracks', item: any) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], item] }));
    };

    const removeItem = (field: string, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.title || !formData.startDate) {
            toast.error("Title and Start Date are required");
            return;
        }

        setLoading(true);
        try {
            const response = await adminService.hackathons.create(formData);
            if (response.status === 'success') {
                toast.success("Hackathon initialized successfully");
                navigate('/admin/hackathons');
            } else {
                toast.error(response.message || "Creation failed");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 font-sans text-slate-900 selection:bg-orange-200 selection:text-orange-900">

            {/* 1. HOLOGRAPHIC ENVIRONMENT */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-400/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-400/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-6 lg:p-12 space-y-8">

                {/* HEADER & ACTIONS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: PHYSICS.ease }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/hackathons')}
                            className="pl-0 hover:bg-transparent hover:text-orange-600 text-slate-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                            INITIALIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">EVENT</span>
                        </h1>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        disabled={loading}
                        className="group relative px-8 py-4 bg-slate-900 text-white font-bold tracking-wide uppercase text-sm rounded-xl overflow-hidden shadow-xl shadow-orange-500/20 disabled:opacity-50"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
              {loading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {loading ? 'Deploying...' : 'Launch Hackathon'}
            </span>
                    </motion.button>
                </motion.div>

                {/* 2. TAB NAVIGATION (PRISM STYLE) */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-white/50 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm sticky top-6 z-50">
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-bold tracking-wide uppercase transition-all duration-300 ${
                                    isActive ? 'text-white shadow-lg shadow-orange-500/20' : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-slate-900 rounded-xl"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : ''}`} />
                                    {tab.label}
                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 3. DYNAMIC CONTENT AREA */}
                <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 md:p-12 border border-white shadow-xl shadow-slate-200/50 relative overflow-hidden min-h-[600px]">
                    {/* Refractive Border Overlay */}
                    <div className="absolute inset-0 rounded-[32px] border border-white/50 pointer-events-none" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.4, ease: PHYSICS.ease }}
                        >
                            {/* --- TAB 1: BASICS --- */}
                            {activeTab === 'basics' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Core Info */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Event Title</Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="e.g. Waves XR Hackathon 2025"
                                                className="h-14 text-xl font-bold bg-white/50 border-slate-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Slug (URL)</Label>
                                            <Input
                                                value={formData.slug}
                                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                                placeholder="waves-xr-2025"
                                                className="bg-white/50 border-slate-200"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Short Description</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="A quick summary for the card view..."
                                                className="bg-white/50 border-slate-200 rounded-xl resize-none h-32"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Start Date</Label>
                                                <Input type="datetime-local" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className="bg-white/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">End Date</Label>
                                                <Input type="datetime-local" value={formData.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} className="bg-white/50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Image & Logistics */}
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Banner Image</Label>
                                            <div className="group relative w-full aspect-video rounded-2xl bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200 hover:border-orange-400 transition-colors cursor-pointer">
                                                <input
                                                    type="file"
                                                    onChange={handleImageUpload}
                                                    className="absolute inset-0 opacity-0 z-10 cursor-pointer"
                                                    accept="image/*"
                                                />
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Banner" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-orange-500 transition-colors">
                                                        {uploading ? <Sparkles className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8 mb-2" />}
                                                        <span className="text-xs font-bold uppercase tracking-wide">
                                  {uploading ? 'Uploading...' : 'Click to Upload Banner'}
                                </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Mode</Label>
                                                <select
                                                    className="w-full h-10 rounded-md border border-slate-200 bg-white/50 px-3 py-2 text-sm focus:border-orange-400 outline-none"
                                                    value={formData.mode}
                                                    onChange={(e) => handleInputChange('mode', e.target.value)}
                                                >
                                                    <option value="online">Online</option>
                                                    <option value="offline">Offline</option>
                                                    <option value="hybrid">Hybrid</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Location</Label>
                                                <Input value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="e.g. New Delhi" className="bg-white/50" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Min Team</Label>
                                                <Input type="number" value={formData.minTeamSize} onChange={(e) => handleInputChange('minTeamSize', e.target.value)} className="bg-white/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Max Team</Label>
                                                <Input type="number" value={formData.maxTeamSize} onChange={(e) => handleInputChange('maxTeamSize', e.target.value)} className="bg-white/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Prize Pool</Label>
                                                <Input value={formData.prizePool} onChange={(e) => handleInputChange('prizePool', e.target.value)} placeholder="₹50k" className="bg-white/50" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB 2: TIMELINE --- */}
                            {activeTab === 'timeline' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Event Phases</h3>
                                        <Button onClick={() => addItem('timeline', { title: '', date: '', description: '' })} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" /> Add Phase
                                        </Button>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.timeline.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex gap-4 items-start p-4 bg-white/40 border border-slate-100 rounded-xl"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Input
                                                        placeholder="Phase Title (e.g. Registration Ends)"
                                                        value={item.title}
                                                        onChange={(e) => {
                                                            const newTimeline = [...formData.timeline];
                                                            newTimeline[index].title = e.target.value;
                                                            handleInputChange('timeline', newTimeline);
                                                        }}
                                                    />
                                                    <Input
                                                        type="datetime-local"
                                                        value={item.date}
                                                        onChange={(e) => {
                                                            const newTimeline = [...formData.timeline];
                                                            newTimeline[index].date = e.target.value;
                                                            handleInputChange('timeline', newTimeline);
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="Description (Optional)"
                                                        value={item.description}
                                                        onChange={(e) => {
                                                            const newTimeline = [...formData.timeline];
                                                            newTimeline[index].description = e.target.value;
                                                            handleInputChange('timeline', newTimeline);
                                                        }}
                                                    />
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeItem('timeline', index)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        ))}
                                        {formData.timeline.length === 0 && (
                                            <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                                                No timeline events added yet.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB 3: PEOPLE (MENTORS & JURY) --- */}
                            {activeTab === 'people' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Mentors */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                            <h3 className="font-bold flex items-center gap-2"><Users className="w-4 h-4 text-orange-500"/> Mentors</h3>
                                            <Button size="sm" variant="ghost" onClick={() => addItem('mentors', { name: '', role: '', image: '', linkedin: '' })}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {formData.mentors.map((item, index) => (
                                            <div key={index} className="p-3 bg-white border border-slate-100 rounded-lg space-y-2 shadow-sm">
                                                <div className="flex gap-2">
                                                    <Input placeholder="Name" value={item.name} onChange={(e) => {
                                                        const list = [...formData.mentors]; list[index].name = e.target.value; handleInputChange('mentors', list);
                                                    }} />
                                                    <Input placeholder="Role/Company" value={item.role} onChange={(e) => {
                                                        const list = [...formData.mentors]; list[index].role = e.target.value; handleInputChange('mentors', list);
                                                    }} />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <LinkIcon className="w-4 h-4 text-slate-300" />
                                                    <Input placeholder="LinkedIn URL" value={item.linkedin} onChange={(e) => {
                                                        const list = [...formData.mentors]; list[index].linkedin = e.target.value; handleInputChange('mentors', list);
                                                    }} className="h-8 text-xs" />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => removeItem('mentors', index)}><Trash2 className="w-3 h-3"/></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Jury */}
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                            <h3 className="font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-blue-500"/> Jury</h3>
                                            <Button size="sm" variant="ghost" onClick={() => addItem('jury', { name: '', role: '', image: '', linkedin: '' })}>
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        {formData.jury.map((item, index) => (
                                            <div key={index} className="p-3 bg-white border border-slate-100 rounded-lg space-y-2 shadow-sm">
                                                <div className="flex gap-2">
                                                    <Input placeholder="Name" value={item.name} onChange={(e) => {
                                                        const list = [...formData.jury]; list[index].name = e.target.value; handleInputChange('jury', list);
                                                    }} />
                                                    <Input placeholder="Role/Company" value={item.role} onChange={(e) => {
                                                        const list = [...formData.jury]; list[index].role = e.target.value; handleInputChange('jury', list);
                                                    }} />
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <LinkIcon className="w-4 h-4 text-slate-300" />
                                                    <Input placeholder="LinkedIn URL" value={item.linkedin} onChange={(e) => {
                                                        const list = [...formData.jury]; list[index].linkedin = e.target.value; handleInputChange('jury', list);
                                                    }} className="h-8 text-xs" />
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400" onClick={() => removeItem('jury', index)}><Trash2 className="w-3 h-3"/></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB 4: PRIZES --- */}
                            {activeTab === 'prizes' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-bold">Prize Categories</h3>
                                        <Button onClick={() => addItem('prizes', { position: '', reward: '', icon: '' })} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" /> Add Prize
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {formData.prizes.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ scale: 0.9 }}
                                                animate={{ scale: 1 }}
                                                className="p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl relative group"
                                            >
                                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button size="icon" variant="ghost" className="h-6 w-6 text-red-400" onClick={() => removeItem('prizes', index)}><Trash2 className="w-3 h-3"/></Button>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                                        <Trophy className="w-5 h-5" />
                                                    </div>
                                                    <Input
                                                        placeholder="Title (e.g. 1st Place)"
                                                        className="font-bold border-none bg-transparent px-0 focus-visible:ring-0"
                                                        value={item.position}
                                                        onChange={(e) => {
                                                            const list = [...formData.prizes]; list[index].position = e.target.value; handleInputChange('prizes', list);
                                                        }}
                                                    />
                                                    <Input
                                                        placeholder="Reward (e.g. ₹20,000 + Swag)"
                                                        className="text-sm text-slate-500 border-none bg-transparent px-0 h-auto focus-visible:ring-0"
                                                        value={item.reward}
                                                        onChange={(e) => {
                                                            const list = [...formData.prizes]; list[index].reward = e.target.value; handleInputChange('prizes', list);
                                                        }}
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default CreateHackathon;