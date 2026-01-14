import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Trophy, Calendar, Sparkles, ArrowUpRight, Upload,
    Zap, Activity, ChevronRight, Star, Layers, Command, BellRing
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { studentService, StudentStats, UpcomingActivity } from '@/services/api';

// --- PHYSICS ANIMATIONS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0, filter: 'blur(4px)' },
    visible: {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        transition: { type: "spring", stiffness: 120, damping: 20 }
    }
};

// --- MOUSE TILT EFFECT HOOK ---
const useTilt = () => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 150, damping: 20 });

    function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return { rotateX, rotateY, handleMouseMove, handleMouseLeave };
};

// --- SKELETON LOADER (Light Theme) ---
const DashboardSkeleton = () => (
    <div className="max-w-[1600px] mx-auto space-y-8 p-2">
        <div className="h-[300px] rounded-[2.5rem] bg-white shadow-sm border border-slate-100 w-full animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-44 rounded-[2rem] bg-white shadow-sm border border-slate-100 animate-pulse" />
            ))}
        </div>
        <div className="grid grid-cols-12 gap-6 h-[500px]">
            <div className="col-span-12 lg:col-span-8 rounded-[2.5rem] bg-white shadow-sm border border-slate-100 animate-pulse" />
            <div className="col-span-12 lg:col-span-4 rounded-[2.5rem] bg-white shadow-sm border border-slate-100 animate-pulse" />
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [upcoming, setUpcoming] = useState<UpcomingActivity[]>([]);
    const [loading, setLoading] = useState(true);

    // Tilt Hook for Hero
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = useTilt();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsData, upcomingData] = await Promise.all([
                    studentService.getStats(),
                    studentService.getUpcoming()
                ]);
                setStats(statsData);
                setUpcoming(upcomingData);
            } catch (error) {
                console.error("Dashboard error", error);
            } finally {
                setTimeout(() => setLoading(false), 600);
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
            className="max-w-[1600px] mx-auto space-y-8"
        >

            {/* === 1. HERO SECTION (Light & Clean) === */}
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] min-h-[320px] group"
            >
                {/* Soft Aurora Background (Light Mode) */}
                <div className="absolute inset-0 opacity-40 pointer-events-none">
                    <div className="absolute -top-[50%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-orange-100/80 via-yellow-100/50 to-transparent rounded-full blur-[100px] animate-pulse-slow" />
                    <div className="absolute -bottom-[50%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-green-100/80 via-emerald-50/50 to-transparent rounded-full blur-[100px] animate-pulse-slow delay-1000" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 p-10 md:p-14 flex flex-col justify-between h-full transform translate-z-10">
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 tracking-wide uppercase shadow-sm"
                        >
                            <Sparkles size={12} className="text-[#FF6B35]" />
                            <span>Student Dashboard v2.0</span>
                        </motion.div>

                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight text-slate-900">
                                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-orange-500">{user?.name}</span>
                            </h1>
                            <p className="mt-4 text-lg text-slate-500 font-medium max-w-xl">
                                You have <span className="text-slate-900 font-bold">{stats?.eventsRegistered || 0} active events</span> and <span className="text-slate-900 font-bold">{stats?.hackathonsParticipated || 0} hackathons</span> scheduled for this week.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <Button
                            onClick={() => navigate('/student/hackathons')}
                            className="h-12 px-8 rounded-xl bg-[#FF6B35] hover:bg-[#e85d2a] text-white font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-105 transition-all duration-300"
                        >
                            Explore Hackathons <ArrowUpRight size={18} className="ml-2" />
                        </Button>
                        <Button
                            onClick={() => navigate('/student/events')}
                            variant="outline"
                            className="h-12 px-8 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold bg-white/50 backdrop-blur-sm"
                        >
                            My Calendar
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* === 2. STATS CARDS (Floating & Clean) === */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    {
                        label: 'Total Events',
                        value: stats?.eventsRegistered || 0,
                        icon: Calendar,
                        color: 'text-blue-600',
                        bg: 'bg-blue-50',
                        border: 'hover:border-blue-200'
                    },
                    {
                        label: 'Hackathons',
                        value: stats?.hackathonsParticipated || 0,
                        icon: Trophy,
                        color: 'text-purple-600',
                        bg: 'bg-purple-50',
                        border: 'hover:border-purple-200'
                    },
                    {
                        label: 'Projects',
                        value: stats?.projectsShowcased || 0,
                        icon: Layers,
                        color: 'text-[#FF6B35]',
                        bg: 'bg-orange-50',
                        border: 'hover:border-orange-200'
                    },
                    {
                        label: 'XP Points',
                        value: '1,250',
                        icon: Zap,
                        color: 'text-green-600',
                        bg: 'bg-green-50',
                        border: 'hover:border-green-200'
                    },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={itemVariants}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className={`
              relative p-6 rounded-[2rem] bg-white border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] 
              transition-all duration-300 cursor-default group ${stat.border}
            `}
                    >
                        <div className="flex justify-between items-start">
                            <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={22} strokeWidth={2.5} />
                            </div>
                            <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg">
                                <Activity size={12} className="text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-500">+12%</span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-4xl font-bold text-slate-900 tracking-tight">{stat.value}</h3>
                            <p className="text-sm font-medium text-slate-400 mt-1">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* === 3. BENTO GRID (White, Shadowed, Detailed) === */}
            <div className="grid grid-cols-12 gap-6 h-auto lg:h-[500px]">

                {/* LARGE TILE: UPLOAD */}
                <motion.div
                    variants={itemVariants}
                    onClick={() => navigate('/student/showcase')}
                    className="col-span-12 lg:col-span-5 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="h-full flex flex-col justify-between p-10 relative z-10">
                        <div className="flex items-start justify-between">
                            <div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#FF6B35] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Upload size={28} />
                            </div>
                            <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center bg-white text-slate-300 group-hover:text-[#FF6B35] group-hover:border-orange-200 transition-colors">
                                <ArrowUpRight size={20} />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-3xl font-bold text-slate-900">Submit Project</h3>
                            <p className="text-slate-500 leading-relaxed max-w-sm font-medium">
                                Built something amazing? Upload your hackathon demo or project for verification.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* MEDIUM TILE: LENS */}
                <motion.div
                    variants={itemVariants}
                    onClick={() => navigate('/student/lens')}
                    className="col-span-12 md:col-span-6 lg:col-span-3 relative group cursor-pointer overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-lg hover:shadow-xl hover:shadow-green-500/10 transition-all duration-500"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 transition-transform group-hover:scale-150" />

                    <div className="h-full flex flex-col justify-between p-8 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-300">
                            <Sparkles size={24} />
                        </div>

                        <div className="mt-4">
                            <h3 className="text-2xl font-bold text-slate-900">Lens Studio</h3>
                            <p className="text-sm font-medium text-slate-500 mt-1">Verify AR filters.</p>
                        </div>

                        <div className="mt-auto pt-6">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2">
                                <span>Completed</span>
                                <span className="text-green-600">3/5</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '60%' }}
                                    className="h-full bg-green-500 rounded-full"
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* LIST TILE: UPCOMING */}
                <motion.div
                    variants={itemVariants}
                    className="col-span-12 md:col-span-6 lg:col-span-4 rounded-[2.5rem] bg-white border border-slate-100 shadow-lg p-8 flex flex-col overflow-hidden relative"
                >
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="text-xl font-bold text-slate-900">Up Next</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/student/events')}
                            className="h-8 text-xs font-bold text-slate-400 hover:text-[#FF6B35] hover:bg-orange-50"
                        >
                            View All
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-2 relative z-10 custom-scrollbar">
                        {upcoming.length > 0 ? upcoming.map((item) => (
                            <motion.div
                                key={item.id}
                                onClick={() => navigate(`/student/events`)} // Navigates to event list
                                whileHover={{ x: 4, backgroundColor: "rgba(248, 250, 252, 1)" }}
                                className="flex gap-4 items-center p-3 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100"
                            >
                                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center group-hover:bg-white group-hover:shadow-sm transition-all">
                  <span className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-[#FF6B35]">
                    {new Date(item.date).toLocaleDateString('en-US', { month: 'short' })}
                  </span>
                                    <span className="text-lg font-bold text-slate-900 leading-none">
                    {new Date(item.date).getDate()}
                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-slate-800 text-sm truncate group-hover:text-[#FF6B35] transition-colors">{item.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`inline-block w-1.5 h-1.5 rounded-full ${item.type === 'hackathon' ? 'bg-purple-500' : 'bg-green-500'}`} />
                                        <p className="text-xs font-medium text-slate-500 capitalize">{item.type}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                                <Calendar size={32} className="text-slate-300 mb-2" />
                                <p className="text-sm font-medium text-slate-400">No upcoming events</p>
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-20" />
                </motion.div>

            </div>

            {/* === 4. GAMIFICATION BANNER (Bottom) === */}
            <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-1 shadow-xl"
            >
                <div className="bg-white rounded-[1.8rem] p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden border border-slate-100">

                    <div className="flex items-center gap-5 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-yellow-50 text-yellow-500 border border-yellow-100 flex items-center justify-center shadow-inner">
                            <Star fill="currentColor" size={24} />
                        </div>
                        <div>
                            <h4 className="text-slate-900 font-bold text-xl tracking-tight">Level 5 Scholar</h4>
                            <p className="text-slate-500 text-sm font-medium">Top 5% of Students</p>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-3xl relative z-10 px-4">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                            <span>Progress to Pro</span>
                            <span className="text-[#FF6B35]">1,250 / 2,000 XP</span>
                        </div>
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '62%' }}
                                transition={{ duration: 2, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-yellow-400 to-[#FF6B35] relative"
                            >
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            </motion.div>
                        </div>
                    </div>

                    <Button variant="ghost" className="text-slate-600 hover:text-[#FF6B35] hover:bg-orange-50 rounded-xl relative z-10 font-bold">
                        Leaderboard
                    </Button>
                </div>
            </motion.div>

        </motion.div>
    );
};

export default Dashboard;