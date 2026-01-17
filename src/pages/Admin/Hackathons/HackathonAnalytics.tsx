import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart2,
    Users,
    Trophy,
    Zap,
    TrendingUp,
    Activity,
    Calendar,
    Loader2
} from 'lucide-react';
import { adminService } from '@/services/api'; // Ensure you add the analytics endpoint to api.ts if missing, or use direct axios for now
import { apiClient } from '@/services/api'; // Direct access if needed
import { toast } from 'sonner';

// --- PHYSICS ENGINE ---
const PHYSICS = {
    ease: [0.16, 1, 0.3, 1],
    spring: { type: "spring", stiffness: 90, damping: 40, mass: 1.2 }
};

const STAGGER = {
    visible: { transition: { staggerChildren: 0.1 } }
};

const ITEM = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: PHYSICS.ease } }
};

const HackathonAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await apiClient.get('/admin/hackathons/analytics.php');
            if (response.data.status === 'success') {
                setData(response.data);
            }
        } catch (error) {
            toast.error("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    const stats = data?.data || {};

    return (
        <div className="min-h-screen relative overflow-hidden bg-slate-50 p-6 lg:p-12 space-y-12 font-sans selection:bg-orange-200">

            {/* BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                <div className="absolute top-[-20%] left-[10%] w-[50vw] h-[50vw] bg-purple-400/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] bg-orange-400/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-8">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: PHYSICS.ease }}
                >
                    <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold tracking-widest uppercase border border-blue-100">
              Live Telemetry
            </span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-slate-900">
                        SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ANALYTICS</span>
                    </h1>
                </motion.div>

                {/* STATS GRID */}
                <motion.div
                    variants={STAGGER}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <StatCard
                        label="Total Participants"
                        value={stats.total_participants}
                        icon={Users}
                        color="text-orange-500"
                        bg="bg-orange-50"
                    />
                    <StatCard
                        label="Teams Formed"
                        value={stats.total_teams}
                        icon={Trophy}
                        color="text-purple-500"
                        bg="bg-purple-50"
                    />
                    <StatCard
                        label="Live Events"
                        value={stats.live_events}
                        icon={Zap}
                        color="text-green-500"
                        bg="bg-green-50"
                    />
                    <StatCard
                        label="Avg. Team Size"
                        value="3.2"
                        icon={Activity}
                        color="text-blue-500"
                        bg="bg-blue-50"
                    />
                </motion.div>

                {/* GRAPH SECTION (Simplified Visual) */}
                <motion.div
                    variants={ITEM}
                    initial="hidden"
                    animate="visible"
                    className="p-8 bg-white/60 backdrop-blur-xl rounded-[32px] border border-white shadow-xl shadow-slate-200/50"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-slate-400" />
                            Registration Velocity
                        </h3>
                        <select className="bg-white/50 border border-slate-200 rounded-lg text-sm px-3 py-1 font-medium text-slate-600 outline-none">
                            <option>Last 7 Days</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-4">
                        {data?.graph?.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full bg-blue-100 rounded-t-xl overflow-hidden group-hover:bg-blue-200 transition-colors" style={{ height: `${Math.max(10, d.count * 10)}%`, maxHeight: '100%' }}>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: '100%' }}
                                        transition={{ duration: 1, delay: i * 0.1, ease: PHYSICS.ease }}
                                        className="w-full bg-gradient-to-t from-blue-500 to-purple-500 absolute bottom-0"
                                    />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })}</span>
                            </div>
                        ))}
                        {(!data?.graph || data.graph.length === 0) && (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                No recent activity data available.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
    <motion.div variants={ITEM} className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group">
        <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500`}>
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="text-4xl font-black tracking-tighter text-slate-900 mb-1">{value}</div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</div>
    </motion.div>
);

export default HackathonAnalytics;