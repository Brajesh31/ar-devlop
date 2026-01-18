import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // 1. Import useParams
import { motion, AnimatePresence } from 'framer-motion';
import {
    Save, ArrowLeft, Upload, Clock, Users, Trophy, Layers,
    Plus, Trash2, Loader2
} from 'lucide-react';
import { adminService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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
    const { id } = useParams(); // 2. Detect ID from URL
    const isEditMode = !!id;    // 3. Boolean flag for Edit Mode

    const [activeTab, setActiveTab] = useState('basics');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 4. Initial State matches your DB structure
    const [formData, setFormData] = useState({
        id: '', // Crucial for Update API
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
        prizePool: '',
        fee: 'free',
        feeAmount: 0,
        teamSize: 'teams',
        minTeamSize: 2,
        maxTeamSize: 4,
        registrationUrl: '',
        resultsUrl: '',
        timeline: [] as any[],
        mentors: [] as any[],
        jury: [] as any[],
        prizes: [] as any[],
        tracks: [] as any[]
    });

    // 5. FETCH DATA IF EDITING
    useEffect(() => {
        if (isEditMode) {
            loadHackathonData();
        }
    }, [id]);

    const loadHackathonData = async () => {
        setFetching(true);
        try {
            const response = await adminService.hackathons.getDetails(id!);
            if (response.status === 'success') {
                // Merge fetched data into form
                setFormData(prev => ({ ...prev, ...response.data }));
            } else {
                toast.error("Failed to load event data");
                navigate('/admin/hackathons');
            }
        } catch (error) {
            toast.error("Network error fetching data");
        } finally {
            setFetching(false);
        }
    };

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

    const addItem = (field: 'timeline' | 'mentors' | 'jury' | 'prizes' | 'tracks', item: any) => {
        setFormData(prev => ({ ...prev, [field]: [...prev[field], item] }));
    };

    const removeItem = (field: string, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev as any)[field].filter((_: any, i: number) => i !== index)
        }));
    };

    // 6. SMART SUBMIT HANDLER
    const handleSubmit = async () => {
        if (!formData.title || !formData.startDate) {
            toast.error("Title and Start Date are required");
            return;
        }

        setLoading(true);
        try {
            let response;
            if (isEditMode) {
                // UPDATE Existing
                response = await adminService.hackathons.update(formData);
            } else {
                // CREATE New
                response = await adminService.hackathons.create(formData);
            }

            if (response.status === 'success') {
                toast.success(isEditMode ? "Hackathon Updated" : "Hackathon Created");
                navigate('/admin/hackathons');
            } else {
                toast.error(response.message || "Operation failed");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 font-sans text-slate-900 selection:bg-orange-200 selection:text-orange-900">

            {/* BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-orange-400/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto p-6 lg:p-12 space-y-8">

                {/* HEADER: Dynamic Title */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/hackathons')}
                            className="pl-0 hover:bg-transparent hover:text-orange-600 text-slate-400 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                            {isEditMode ? 'UPDATE' : 'INITIALIZE'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">EVENT</span>
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
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isEditMode ? 'Save Changes' : 'Launch Hackathon'}
            </span>
                    </motion.button>
                </div>

                {/* TABS */}
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

                {/* CONTENT FORM */}
                <div className="bg-white/60 backdrop-blur-md rounded-[32px] p-8 md:p-12 border border-white shadow-xl shadow-slate-200/50 relative overflow-hidden min-h-[600px]">
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
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Event Title</Label>
                                            <Input
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                placeholder="e.g. Waves XR Hackathon"
                                                className="h-14 text-xl font-bold bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Slug (URL)</Label>
                                            <Input
                                                value={formData.slug}
                                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                                className="bg-white/50"
                                                disabled={isEditMode} // Slug cannot be changed once created
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                className="bg-white/50 resize-none h-32"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Start Date</Label>
                                                <Input type="datetime-local" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className="bg-white/50" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>End Date</Label>
                                                <Input type="datetime-local" value={formData.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} className="bg-white/50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <Label>Banner Image</Label>
                                            <div className="group relative w-full aspect-video rounded-2xl bg-slate-100 overflow-hidden border-2 border-dashed border-slate-200 hover:border-orange-400 transition-colors cursor-pointer">
                                                <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 z-10 cursor-pointer" accept="image/*" />
                                                {formData.image ? (
                                                    <img src={formData.image} alt="Banner" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                        {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8 mb-2" />}
                                                        <span className="text-xs font-bold uppercase">{uploading ? 'Uploading...' : 'Upload Banner'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Location</Label>
                                            <Input value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} className="bg-white/50" placeholder="e.g. Online / New Delhi" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- TAB 2: TIMELINE --- */}
                            {activeTab === 'timeline' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">Event Phases</h3>
                                        <Button onClick={() => addItem('timeline', { title: '', date: '', description: '' })} variant="outline">
                                            <Plus className="w-4 h-4 mr-2" /> Add Phase
                                        </Button>
                                    </div>
                                    <div className="space-y-4">
                                        {formData.timeline.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-start p-4 bg-white/40 border border-slate-100 rounded-xl">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 shrink-0">{index + 1}</div>
                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <Input placeholder="Title" value={item.title} onChange={(e) => {
                                                        const newTimeline = [...formData.timeline];
                                                        newTimeline[index].title = e.target.value;
                                                        handleInputChange('timeline', newTimeline);
                                                    }} />
                                                    <Input type="datetime-local" value={item.date} onChange={(e) => {
                                                        const newTimeline = [...formData.timeline];
                                                        newTimeline[index].date = e.target.value;
                                                        handleInputChange('timeline', newTimeline);
                                                    }} />
                                                    <Input placeholder="Desc" value={item.description} onChange={(e) => {
                                                        const newTimeline = [...formData.timeline];
                                                        newTimeline[index].description = e.target.value;
                                                        handleInputChange('timeline', newTimeline);
                                                    }} />
                                                </div>
                                                <Button size="icon" variant="ghost" onClick={() => removeItem('timeline', index)} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- TAB 3: PEOPLE --- */}
                            {activeTab === 'people' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                        <h3 className="font-bold">Mentors</h3>
                                        <Button size="sm" variant="ghost" onClick={() => addItem('mentors', { name: '', role: '', linkedin: '' })}><Plus className="w-4 h-4" /></Button>
                                    </div>
                                    {formData.mentors.map((item, index) => (
                                        <div key={index} className="p-3 bg-white border border-slate-100 rounded-lg flex gap-2">
                                            <Input placeholder="Name" value={item.name} onChange={(e) => { const l = [...formData.mentors]; l[index].name = e.target.value; handleInputChange('mentors', l); }} />
                                            <Input placeholder="Role" value={item.role} onChange={(e) => { const l = [...formData.mentors]; l[index].role = e.target.value; handleInputChange('mentors', l); }} />
                                            <Button size="icon" variant="ghost" onClick={() => removeItem('mentors', index)} className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* --- TAB 4: PRIZES --- */}
                            {activeTab === 'prizes' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold">Prizes</h3>
                                        <Button onClick={() => addItem('prizes', { position: '', reward: '' })} variant="outline"><Plus className="w-4 h-4 mr-2" /> Add Prize</Button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {formData.prizes.map((item, index) => (
                                            <div key={index} className="p-4 bg-white border border-slate-200 rounded-xl relative">
                                                <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-red-400" onClick={() => removeItem('prizes', index)}><Trash2 className="w-3 h-3"/></Button>
                                                <div className="space-y-3">
                                                    <Input placeholder="Position (e.g. 1st)" className="font-bold border-none px-0" value={item.position} onChange={(e) => { const l = [...formData.prizes]; l[index].position = e.target.value; handleInputChange('prizes', l); }} />
                                                    <Input placeholder="Reward" className="text-sm border-none px-0" value={item.reward} onChange={(e) => { const l = [...formData.prizes]; l[index].reward = e.target.value; handleInputChange('prizes', l); }} />
                                                </div>
                                            </div>
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