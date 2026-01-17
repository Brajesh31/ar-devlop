import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Users,
    Trophy,
    Calendar,
    MapPin,
    Edit3,
    ExternalLink,
    Download,
    Search,
    MoreHorizontal,
    Shield,
    Clock,
    Zap,
    Loader2
} from 'lucide-react';
import { adminService } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- PHYSICS ENGINE ---
const PHYSICS = {
    ease: [0.16, 1, 0.3, 1],
    spring: { type: "spring", stiffness: 90, damping: 40, mass: 1.2 }
};

const STAGGER = {
    visible: { transition: { staggerChildren: 0.05 } }
};

const ITEM_ANIM = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: PHYSICS.ease } }
};

interface HackathonDetail {
    id: string;
    slug: string;
    title: string;
    status: string;
    startDate: string;
    location: string;
    mode: string;
    image: string;
    participants_count?: number;
}

interface Participant {
    registration_id: string;
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'leader' | 'member' | 'solo';
    team_name?: string;
    team_code?: string;
    registration_status: string;
    registered_at: string;
}

const HackathonManager = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'teams'>('overview');
    const [loading, setLoading] = useState(true);
    const [hackathon, setHackathon] = useState<HackathonDetail | null>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [search, setSearch] = useState('');

    // 1. Fetch Data
    useEffect(() => {
        if (!id) return;
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            // Parallel Fetch: Details + Participants
            const [detailsRes, partsRes] = await Promise.all([
                adminService.hackathons.getDetails(id!),
                adminService.hackathons.getParticipants(id!)
            ]);

            if (detailsRes.status === 'success') setHackathon(detailsRes.data);
            if (partsRes.status === 'success') setParticipants(partsRes.data || []);

        } catch (error) {
            toast.error("Failed to sync event data");
        } finally {
            setLoading(false);
        }
    };

    // 2. Filter Logic
    const filteredParticipants = participants.filter(p =>
        p.first_name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase()) ||
        p.team_name?.toLowerCase().includes(search.toLowerCase())
    );

    const stats = {
        total: participants.length,
        teams: new Set(participants.filter(p => p.team_code).map(p => p.team_code)).size,
        solo: participants.filter(p => p.role === 'solo').length,
        today: participants.filter(p => {
            const date = new Date(p.registered_at);
            const today = new Date();
            return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
        }).length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (!hackathon) return <div>Event not found</div>;

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 font-sans text-slate-900 selection:bg-orange-200 selection:text-orange-900">

            {/* 1. HOLOGRAPHIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-20%] left-[20%] w-[60vw] h-[60vw] bg-blue-400/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-orange-400/10 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto p-6 lg:p-12 space-y-8">

                {/* 2. HEADER: COMMAND CENTER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: PHYSICS.ease }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6"
                >
                    <div className="space-y-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/admin/hackathons')}
                            className="pl-0 hover:bg-transparent hover:text-orange-600 text-slate-400 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Fleet
                        </Button>

                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="bg-white/50 backdrop-blur border-slate-200 text-slate-500 uppercase tracking-widest text-[10px] py-1 px-2">
                                    {hackathon.mode} Event
                                </Badge>
                                <Badge variant="secondary" className={`uppercase tracking-widest text-[10px] py-1 px-2 ${
                                    hackathon.status === 'live' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {hackathon.status}
                                </Badge>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-slate-900 leading-none">
                                {hackathon.title}
                            </h1>
                        </div>

                        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                    {new Date(hackathon.startDate).toLocaleDateString()}
                </span>
                            <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                                {hackathon.location}
                </span>
                        </div>
                    </div>

                    {/* Action Array */}
                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="outline"
                            onClick={() => window.open(`/hackathons/${hackathon.slug}`, '_blank')}
                            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                        >
                            <ExternalLink className="w-4 h-4 mr-2" /> Live Page
                        </Button>
                        <Button
                            variant="outline"
                            className="bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                        >
                            <Download className="w-4 h-4 mr-2" /> Export CSV
                        </Button>
                        <Button
                            onClick={() => navigate(`/admin/hackathons/edit/${hackathon.id}`)} // Route we will create later if needed
                            className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-orange-500/10"
                        >
                            <Edit3 className="w-4 h-4 mr-2" /> Edit Details
                        </Button>
                    </div>
                </motion.div>

                {/* 3. BENTO GRID: LIVE TELEMETRY */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.6, ease: PHYSICS.ease }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <StatCard label="Total Registrations" value={stats.total} icon={Users} color="text-slate-900" bg="bg-white" />
                    <StatCard label="Teams Formed" value={stats.teams} icon={Trophy} color="text-orange-600" bg="bg-orange-50/50" />
                    <StatCard label="Solo Hackers" value={stats.solo} icon={Zap} color="text-blue-600" bg="bg-blue-50/50" />
                    <StatCard label="Joined Today" value={stats.today} icon={Clock} color="text-green-600" bg="bg-green-50/50" />
                </motion.div>

                {/* 4. MAIN INTERFACE (TABS) */}
                <div className="space-y-6">
                    {/* Tab Switcher */}
                    <div className="flex gap-1 p-1 bg-slate-200/50 rounded-xl w-fit">
                        {['overview', 'participants', 'teams'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
                                    activeTab === tab
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        {activeTab === 'participants' && (
                            <motion.div
                                key="participants"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="space-y-4"
                            >
                                {/* Search Bar */}
                                <div className="relative max-w-md">
                                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <Input
                                        placeholder="Search by name, email, or team..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 bg-white border-slate-200 focus:border-orange-400 focus:ring-orange-400/20 rounded-xl h-12"
                                    />
                                </div>

                                {/* Physics Table */}
                                <div className="bg-white/60 backdrop-blur-xl rounded-[24px] border border-white shadow-xl shadow-slate-200/50 overflow-hidden">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                        <tr className="border-b border-slate-200/60 bg-slate-50/50">
                                            <th className="p-4 pl-6 text-xs font-bold uppercase tracking-widest text-slate-400">User</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-400">Role</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-400">Team</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="p-4 pr-6 text-right text-xs font-bold uppercase tracking-widest text-slate-400">Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                        {filteredParticipants.length === 0 ? (
                                            <tr><td colSpan={5} className="p-12 text-center text-slate-400">No participants found.</td></tr>
                                        ) : (
                                            filteredParticipants.map((p) => (
                                                <tr key={p.registration_id} className="group hover:bg-white transition-colors">
                                                    <td className="p-4 pl-6">
                                                        <div className="font-bold text-slate-900">{p.first_name} {p.last_name}</div>
                                                        <div className="text-xs text-slate-500">{p.email}</div>
                                                    </td>
                                                    <td className="p-4">
                                                        <Badge variant="secondary" className={`
                                        uppercase tracking-widest font-bold text-[10px]
                                        ${p.role === 'leader' ? 'bg-orange-100 text-orange-700' : ''}
                                        ${p.role === 'member' ? 'bg-blue-100 text-blue-700' : ''}
                                        ${p.role === 'solo' ? 'bg-slate-100 text-slate-600' : ''}
                                     `}>
                                                            {p.role}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-4">
                                                        {p.team_name ? (
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-slate-700">{p.team_name}</span>
                                                                <span className="text-[10px] font-mono text-slate-400">CODE: {p.team_code}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 text-sm">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                                            <span className="text-sm font-medium text-slate-600 capitalize">{p.registration_status}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 pr-6 text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                                                                <DropdownMenuItem className="text-red-600">Remove User</DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400"
                            >
                                <Trophy className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-bold text-slate-500">Overview Panel</h3>
                                <p>More detailed analytics and charts will appear here.</p>
                            </motion.div>
                        )}
                        {activeTab === 'teams' && (
                            <motion.div
                                key="teams"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400"
                            >
                                <Users className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                                <h3 className="text-lg font-bold text-slate-500">Teams Panel</h3>
                                <p>Team management interface coming soon.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

// --- SUB-COMPONENT: STAT CARD ---
const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
    <div className={`p-6 rounded-2xl border border-white shadow-lg shadow-slate-200/50 ${bg} flex flex-col items-start gap-4 hover:scale-[1.02] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
        <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <div className="text-3xl font-black tracking-tighter text-slate-900">{value}</div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</div>
        </div>
    </div>
);

export default HackathonManager;