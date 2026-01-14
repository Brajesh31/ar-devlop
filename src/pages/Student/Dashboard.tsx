import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Calendar, Sparkles, ArrowUpRight, Upload,
    Zap, Activity, Target, ChevronRight, Star, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { studentService, StudentStats, UpcomingActivity } from '@/services/api';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

// --- SKELETON LOADER COMPONENT ---
const DashboardSkeleton = () => (
    <div className="space-y-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-64 rounded-[2.5rem] bg-slate-200/50 w-full" />
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 rounded-[2rem] bg-slate-200/50" />
            ))}
        </div>
        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-96">
            <div className="lg:col-span-2 rounded-[2.5rem] bg-slate-200/50" />
            <div className="rounded-[2.5rem] bg-slate-200/50" />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [upcoming, setUpcoming] = useState<UpcomingActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Add artificial delay to show off the premium skeleton effect
                // await new Promise(resolve => setTimeout(resolve, 1500));
                const [statsData, upcomingData] = await Promise.all([
                    studentService.getStats(),
                    studentService.getUpcoming()
                ]);
                setStats(statsData);
                setUpcoming(upcomingData);
            } catch (error) {
                console.error("Dashboard error", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <DashboardSkeleton />;

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1600px] mx-auto space-y-6"
        >

            {/* === 1. HERO BENTO CARD === */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-900/20 group"
            >
                {/* Dynamic Background Mesh */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B35] rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000 -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-medium text-orange-200"
                        >
                            <Sparkles size={12} className="text-yellow-400" />
                            <span>Premium Student Account</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-yellow-400">Innovate?</span>
                        </h1>
                        <p className="text-lg text-slate-300">
                            Welcome back, <span className="font-semibold text-white">{user?.name}</span>.
                            You have <span className="text-white font-bold underline decoration-[#FF6B35] underline-offset-4">{stats?.eventsRegistered} active missions</span> waiting for you.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-slate-100 hover:scale-105 transition-all shadow-lg shadow-white/10">
                            Explore Hackathons
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 transition-all font-semibold">
                            View Profile
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* === 2. STATS ROW (Glass Cards) === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Events Registered', value: stats?.eventsRegistered || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Hackathons', value: stats?.hackathonsParticipated || 0, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                    { label: 'Lenses Live', value: stats?.lensesSubmitted || 0, icon: Sparkles, color: 'text-[#FF6B35]', bg: 'bg-orange-500/10' },
                    { label: 'Skill Level', value: 'Pro', icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5 }}
                        className="group relative p-6 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-slate-200/40 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={24} />
                            </div>
                        </div>
                        {/* Animated Bottom Line */}
                        <div className="absolute bottom-0 left-6 right-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                transition={{ duration: 1, delay: 0.5 + (idx * 0.1) }}
                                className={`h-full ${stat.color.replace('text-', 'bg-')}`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* === 3. MAIN BENTO GRID === */}
            <div className="grid grid-cols-12 gap-6 h-auto lg:h-[500px]">

                {/* LARGE TILE: Showcase Upload */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-12 lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-orange-50 to-white border border-orange-100 shadow-lg hover:shadow-orange-200/50 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                        <Upload size={200} className="text-[#FF6B35]" />
                    </div>
                    <div className="h-full flex flex-col justify-between p-10 relative z-10">
                        <div className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-[#FF6B35] flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:rotate-12 transition-transform duration-300">
                                <Layers size={28} />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">Submit Project</h3>
                            <p className="text-slate-500 max-w-xs">Ready to show the world? Upload your hackathon demo or capstone project.</p>
                        </div>
                        <div className="flex items-center gap-2 text-[#FF6B35] font-bold group-hover:translate-x-2 transition-transform">
                            <span>Start Upload</span>
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </motion.div>

                {/* MEDIUM TILE: Lens Studio */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-12 md:col-span-6 lg:col-span-3 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-50 to-white border border-green-100 shadow-lg hover:shadow-green-200/50 transition-all duration-500"
                >
                    <div className="h-full flex flex-col justify-between p-8 relative z-10">
                        <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform duration-300">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Lens Studio</h3>
                            <p className="text-sm text-slate-500">Submit your AR filters for verification.</p>
                        </div>
                        <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-green-500" />
                        </div>
                    </div>
                </motion.div>

                {/* LIST TILE: Upcoming Events */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2.5rem] bg-white border border-slate-100 shadow-lg p-8 flex flex-col overflow-hidden"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="text-slate-400" size={20} />
                            Up Next
                        </h3>
                        <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-[#FF6B35]">View All</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
                        {upcoming.length > 0 ? upcoming.map((item, i) => (
                            <div key={item.id} className="flex gap-4 items-center p-3 rounded-2xl hover:bg-slate-50 transition-colors group cursor-pointer">
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-sm font-bold text-slate-900 leading-none">{new Date(item.date).getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 truncate group-hover:text-[#FF6B35] transition-colors">{item.title}</h4>
                                    <p className="text-xs text-slate-500 capitalize">{item.type} • Online</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-transform" />
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-3">
                                    <Calendar size={20} />
                                </div>
                                <p className="text-sm text-slate-400">No upcoming events.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

            </div>

            {/* === 4. XP / GAMIFICATION BAR (Bottom) === */}
            <motion.div
                variants={itemVariants}
                className="relative rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-1"
            >
                <div className="bg-slate-900 rounded-[1.9rem] p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                            <Star fill="currentColor" size={20} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg">Level 5 Scholar</h4>
                            <p className="text-slate-400 text-sm">1,250 XP earned this month</p>
                        </div>
                    </div>
                    <div className="flex-1 w-full max-w-2xl">
                        <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                            <span>Progress to Level 6</span>
                            <span>75%</span>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '75%' }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_0_15px_rgba(255,107,53,0.5)]"
                            />
                        </div>
                    </div>
                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                        View Leaderboard
                    </Button>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default Dashboard;