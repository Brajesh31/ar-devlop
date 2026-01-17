import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    MoreVertical,
    Calendar,
    Users,
    Trophy,
    ExternalLink,
    Loader2,
    MapPin,
    Sparkles
} from 'lucide-react';
import { adminService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// --- PHYSICS CONSTANTS ---
const PHYSICS = {
    ease: [0.16, 1, 0.3, 1], // The "Butter Smooth" curve
    spring: { type: "spring", stiffness: 90, damping: 40, mass: 1.2 }
};

const STAGGER = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const ITEM_ANIMATION = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, ease: PHYSICS.ease }
    }
};

interface Hackathon {
    id: string;
    slug: string;
    title: string;
    startDate: string;
    endDate: string;
    status: 'upcoming' | 'live' | 'ended';
    mode: string;
    location: string;
    image: string;
    participants_count: number;
}

const HackathonsList = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [hackathons, setHackathons] = useState<Hackathon[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHackathons();
    }, []);

    const fetchHackathons = async () => {
        try {
            setLoading(true);
            const response = await adminService.hackathons.list();
            if (response.status === 'success' && response.data) {
                setHackathons(response.data);
            } else {
                toast.error('Failed to load hackathons');
            }
        } catch (error) {
            toast.error('Network error fetching hackathons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This will delete all teams and participants associated with this hackathon.')) return;
        try {
            const response = await adminService.hackathons.delete(id);
            if (response.status === 'success') {
                toast.success('Hackathon deleted successfully');
                fetchHackathons();
            } else {
                toast.error(response.message || 'Delete failed');
            }
        } catch (error) {
            toast.error('Error deleting hackathon');
        }
    };

    const filteredHackathons = hackathons.filter(h =>
        h.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 font-sans selection:bg-orange-200 selection:text-orange-900">

            {/* 1. HOLOGRAPHIC PAPER ENVIRONMENT */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Grain Texture */}
                <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

                {/* Solar Caustics */}
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-orange-400/20 rounded-full blur-[120px] animate-pulse delay-75" />
                <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-400/10 rounded-full blur-[150px]" />
                <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-yellow-400/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 space-y-12">

                {/* 2. MONUMENTAL TYPOGRAPHY & ACTION BAR */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: PHYSICS.ease }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold tracking-widest uppercase border border-orange-200/50">
                Admin Console
              </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                            HACK<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">ATHONS</span>
                        </h1>
                        <p className="mt-4 text-lg text-slate-500 font-medium max-w-lg leading-relaxed">
                            Manage your high-performance event infrastructure. Track live participants, teams, and deployment status.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/admin/hackathons/create')}
                        className="group relative px-8 py-4 bg-slate-900 text-white font-bold tracking-wide uppercase text-sm rounded-xl overflow-hidden shadow-xl shadow-orange-500/10"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Initialize Event
            </span>
                    </motion.button>
                </motion.div>

                {/* 3. SEARCH (REFRACTIVE PRISM BORDER) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6, ease: PHYSICS.ease }}
                    className="relative group"
                >
                    {/* The Prism Gradient Layer */}
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-400 via-yellow-400 to-blue-400 rounded-2xl opacity-20 group-hover:opacity-100 blur-sm group-hover:blur-[2px] transition-all duration-500" />

                    <div className="relative bg-white rounded-2xl shadow-lg shadow-orange-500/5 flex items-center px-6 py-4 border border-slate-100">
                        <Search className="w-5 h-5 text-slate-400 mr-4" />
                        <input
                            type="text"
                            placeholder="Search by event name..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder:text-slate-300 font-medium"
                        />
                        <div className="hidden sm:flex gap-2">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-400 text-xs font-bold border border-slate-200">CMD+K</span>
                        </div>
                    </div>
                </motion.div>

                {/* 4. BENTO GRID DATA RAILS */}
                <motion.div
                    variants={STAGGER}
                    initial="hidden"
                    animate="visible"
                    className="space-y-4"
                >
                    {loading ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 gap-3">
                            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                            <span className="font-medium tracking-wide">SYNCING DATABASE...</span>
                        </div>
                    ) : filteredHackathons.length === 0 ? (
                        <div className="h-64 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <Trophy className="w-12 h-12 mb-4 text-slate-300" />
                            <p className="font-medium">No active events found.</p>
                        </div>
                    ) : (
                        filteredHackathons.map((h) => (
                            <HackathonRail key={h.id} data={h} onDelete={handleDelete} navigate={navigate} />
                        ))
                    )}
                </motion.div>

            </div>
        </div>
    );
};

// --- SUB-COMPONENT: HACKATHON RAIL (The "Card") ---
const HackathonRail = ({ data, onDelete, navigate }: { data: Hackathon, onDelete: (id: string) => void, navigate: any }) => {
    const isLive = data.status === 'live';
    const isEnded = data.status === 'ended';

    return (
        <motion.div
            variants={ITEM_ANIMATION}
            className="group relative"
        >
            {/* Prism Hover Effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-orange-500 via-yellow-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-40 blur-md transition-all duration-500" />

            <div className="relative bg-white rounded-[22px] p-2 pr-6 flex items-center gap-6 shadow-sm shadow-slate-200 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 border border-slate-100">

                {/* Image Block */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-100 relative shrink-0">
                    {data.image ? (
                        <img src={data.image} alt={data.title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Trophy className="w-8 h-8" />
                        </div>
                    )}
                    {/* Status Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3 sm:hidden">
            <span className={`text-[10px] font-bold uppercase tracking-wider text-white ${isLive ? 'text-green-400' : 'text-slate-300'}`}>
              {data.status}
            </span>
                    </div>
                </div>

                {/* Content Rail */}
                <div className="flex-1 py-2 min-w-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                    {/* Title Section (Cols 5) */}
                    <div className="lg:col-span-5 space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-bold text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                                {data.title}
                            </h3>
                            {isLive && (
                                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                {data.location}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(data.startDate).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    {/* Stats Rail (Cols 4) */}
                    <div className="hidden lg:flex lg:col-span-4 gap-8">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Participants</span>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-slate-800" />
                                <span className="text-2xl font-black text-slate-900">{data.participants_count}</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Status</span>
                            <Badge
                                variant="secondary"
                                className={`
                  uppercase tracking-widest font-bold px-3 py-1 rounded-lg border
                  ${isLive ? 'bg-green-50 text-green-700 border-green-200' : ''}
                  ${data.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  ${isEnded ? 'bg-slate-50 text-slate-500 border-slate-200' : ''}
                `}
                            >
                                {data.status}
                            </Badge>
                        </div>
                    </div>

                    {/* Actions Rail (Cols 3) */}
                    <div className="lg:col-span-3 flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => navigate(`/admin/hackathons/manage/${data.id}`)}
                            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 font-semibold tracking-wide hover:border-orange-200 hover:text-orange-600 transition-all"
                        >
                            Manage
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-800 hover:bg-slate-100">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl border border-slate-100 shadow-xl bg-white/95 backdrop-blur-xl">
                                <DropdownMenuLabel className="text-xs uppercase tracking-widest text-slate-400 pl-2">Event Controls</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-slate-100 my-2" />
                                <DropdownMenuItem onClick={() => navigate(`/admin/hackathons/manage/${data.id}`)} className="rounded-lg cursor-pointer focus:bg-slate-50 p-2">
                                    <Sparkles className="w-4 h-4 mr-2 text-orange-500" /> Manage Dashboard
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(`/hackathons/${data.slug}`, '_blank')} className="rounded-lg cursor-pointer focus:bg-slate-50 p-2">
                                    <ExternalLink className="w-4 h-4 mr-2 text-blue-500" /> View Live Page
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-100 my-2" />
                                <DropdownMenuItem onClick={() => onDelete(data.id)} className="rounded-lg cursor-pointer focus:bg-red-50 text-red-600 p-2 font-medium">
                                    Delete Event
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};

export default HackathonsList;