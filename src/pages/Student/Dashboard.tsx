import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Calendar, Sparkles, ArrowUpRight, Upload,
    Zap, Activity, ChevronRight, Star, Hexagon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { studentService, StudentStats, UpcomingActivity } from '@/services/api';

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    }
};

const hoverScaleVariants = {
    hover: { scale: 1.02, transition: { duration: 0.3 } }
};

// --- SKELETON LOADER (Matches Bento Layout) ---
const DashboardSkeleton = () => (
    <div className="max-w-[1600px] mx-auto space-y-6 p-1 animate-pulse">
        {/* Hero Skeleton */}
        <div className="h-[280px] rounded-[2.5rem] bg-slate-200/50 w-full" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-40 rounded-[2rem] bg-slate-200/50" />
            ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-12 gap-6 h-[500px]">
            <div className="col-span-12 lg:col-span-5 rounded-[2.5rem] bg-slate-200/50" />
            <div className="col-span-12 md:col-span-6 lg:col-span-3 rounded-[2.5rem] bg-slate-200/50" />
            <div className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2.5rem] bg-slate-200/50" />
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
                // Parallel data fetching for speed
                const [statsData, upcomingData] = await Promise.all([
                    studentService.getStats(),
                    studentService.getUpcoming()
                ]);
                setStats(statsData);
                setUpcoming(upcomingData);
            } catch (error) {
                console.error("Dashboard error", error);
            } finally {
                // Minimal delay to prevent flicker if API is too fast
                setTimeout(() => setLoading(false), 500);
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

            {/* === 1. HERO CARD (Dark Glass Aesthetic) === */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.5rem] bg-[#0F172A] text-white shadow-2xl shadow-slate-900/10 group min-h-[280px]"
            >
                {/* Animated Background Mesh */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF6B35] rounded-full blur-[120px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 translate-x-1/3 -translate-y-1/3 animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-1000 -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 p-10 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 h-full">
                    <div className="space-y-6 max-w-2xl">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-medium text-orange-200"
                        >
                            <Sparkles size={12} className="text-yellow-400 fill-yellow-400" />
                            <span>Premium Member</span>
                        </motion.div>

                        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-yellow-400">Innovate?</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-light">
                            Welcome back, <span className="font-semibold text-white">{user?.name}</span>.
                            You have <span className="text-white font-bold decoration-[#FF6B35] underline underline-offset-4 decoration-2">{stats?.eventsRegistered || 0} active events</span> on your roadmap.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <Button className="h-14 px-8 rounded-2xl bg-white text-slate-900 font-bold text-base hover:bg-slate-100 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Explore Hackathons
                        </Button>
                        <Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-all font-semibold">
                            View Profile
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* === 2. STATS ROW (Floating Glass Cards) === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Registered Events', value: stats?.eventsRegistered || 0, icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10', gradient: 'from-blue-500' },
                    { label: 'Hackathons', value: stats?.hackathonsParticipated || 0, icon: Trophy, color: 'text-purple-500', bg: 'bg-purple-500/10', gradient: 'from-purple-500' },
                    { label: 'Lenses Live', value: stats?.lensesSubmitted || 0, icon: Hexagon, color: 'text-[#FF6B35]', bg: 'bg-orange-500/10', gradient: 'from-[#FF6B35]' },
                    { label: 'XP Points', value: '1,250', icon: Zap, color: 'text-green-500', bg: 'bg-green-500/10', gradient: 'from-green-500' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -5, shadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}
                        className="group relative p-6 rounded-[2rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden"
                    >
                        {/* Hover Gradient Effect */}
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-full`} />

                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-bold text-slate-800 tracking-tight">{stat.value}</h3>
                            </div>
                            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform duration-300`}>
                                <stat.icon size={24} strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Progress Line Animation */}
                        <div className="mt-6 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '60%' }}
                                transition={{ duration: 1.5, delay: 0.5 + (idx * 0.1), ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${stat.gradient} to-white`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* === 3. BENTO GRID (The Core Interface) === */}
            <div className="grid grid-cols-12 gap-6 h-auto lg:h-[500px]">

                {/* TILE 1: PROJECT UPLOAD (Large) */}
                <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    className="col-span-12 lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-lg hover:shadow-orange-500/10 transition-all duration-500"
                >
                    {/* Subtle Orange Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-700">
                        <Upload size={240} />
                    </div>

                    <div className="h-full flex flex-col justify-between p-10 relative z-10">
                        <div className="space-y-6">
                            <motion.div
                                variants={hoverScaleVariants}
                                className="w-16 h-16 rounded-3xl bg-[#FF6B35] flex items-center justify-center text-white shadow-lg shadow-orange-500/30"
                            >
                                <Upload size={32} />
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold text-slate-900 mb-2">Submit Project</h3>
                                <p className="text-slate-500 leading-relaxed max-w-sm">
                                    Completed a hackathon or built a cool AR lens? Upload your demo here to get verified.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-[#FF6B35] font-bold mt-8 group-hover:translate-x-2 transition-transform">
                            <span>Start Submission</span>
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </motion.div>

                {/* TILE 2: LENS STUDIO (Medium) */}
                <motion.div
                    variants={itemVariants}
                    whileHover="hover"
                    className="col-span-12 md:col-span-6 lg:col-span-3 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-lg hover:shadow-green-500/10 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="h-full flex flex-col justify-between p-8 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/30 group-hover:rotate-12 transition-transform duration-300">
                            <Sparkles size={28} />
                        </div>
                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Lens Studio</h3>
                            <p className="text-sm text-slate-500">Fast-track your AR filters.</p>
                        </div>

                        {/* Mini Progress Indicator */}
                        <div className="mt-auto pt-6">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                                <span>Verification</span>
                                <span>80%</span>
                            </div>
                            <div className="w-full h-1.5 bg-green-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '80%' }}
                                    className="h-full bg-green-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* TILE 3: UPCOMING LIST (Scrollable) */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2.5rem] bg-white border border-slate-100 shadow-lg p-8 flex flex-col overflow-hidden relative"
                >
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Activity className="text-[#FF6B35]" size={20} />
                            Up Next
                        </h3>
                        <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 hover:text-[#FF6B35]">View Calendar</Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 relative z-10 custom-scrollbar">
                        {upcoming.length > 0 ? upcoming.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ x: 4, backgroundColor: "rgba(248, 250, 252, 1)" }}
                                className="flex gap-4 items-center p-3 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100"
                            >
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group-hover:border-orange-200 transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-orange-400">{new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                                    <span className="text-lg font-bold text-slate-900 leading-none">{new Date(item.date).getDate()}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-[#FF6B35] transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                                        <p className="text-xs text-slate-500 capitalize">{item.type}</p>
                                    </div>
                                </div>
                                <ChevronRight size={16} className="text-slate-300 group-hover:text-[#FF6B35] opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </motion.div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                                <Calendar size={32} className="text-slate-300 mb-2" />
                                <p className="text-sm text-slate-400">No upcoming events</p>
                            </div>
                        )}
                    </div>

                    {/* Bottom Fade for Scroll */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
                </motion.div>

            </div>

            {/* === 4. GAMIFICATION BAR (Sticky Visual) === */}
            <motion.div
                variants={itemVariants}
                className="relative p-[2px] rounded-[2rem] bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl"
            >
                <div className="bg-[#0F172A] rounded-[1.9rem] p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
                    {/* Shine Effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-shimmer" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500 p-[2px] shadow-[0_0_20px_rgba(250,204,21,0.4)]">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                                <Star fill="#FACC15" className="text-yellow-400" size={20} />
                            </div>
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-lg tracking-tight">Level 5 Scholar</h4>
                            <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Top 5% of Students</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-2xl relative z-10">
                        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                            <span>Next Reward: Pro Badge</span>
                            <span>1,250 / 2,000 XP</span>
                        </div>
                        <div className="h-4 bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/50 backdrop-blur-sm">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '62%' }}
                                transition={{ duration: 2, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-[#FF6B35] relative"
                            >
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />
                            </motion.div>
                        </div>
                    </div>

                    <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white border border-white/10 rounded-xl relative z-10">
                        View Leaderboard
                    </Button>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default Dashboard;