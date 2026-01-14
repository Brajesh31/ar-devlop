import { useEffect, useState } from 'react';
import {
    Trophy, Calendar, Sparkles, ArrowRight, Upload, Clock, Loader2, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { studentService, StudentStats, UpcomingActivity } from '@/services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<StudentStats | null>(null);
    const [upcoming, setUpcoming] = useState<UpcomingActivity[]>([]);
    const [loading, setLoading] = useState(true);

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
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="h-[60vh] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" /></div>;
    }

    // --- WIDGET COMPONENT ---
    const StatCard = ({ icon: Icon, label, value, colorClass, bgClass, trend }: any) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${bgClass} ${colorClass} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                </div>
                {value > 0 && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700 uppercase tracking-wide">Active</span>}
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{value}</h3>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
        </div>
    );

    return (
        <div className="space-y-8 max-w-7xl mx-auto">

            {/* 1. Welcome Header (Orange Gradient Brand) */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF6B35] to-[#FF8F50] p-8 md:p-10 text-white shadow-xl shadow-orange-200">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Hello, {user?.name?.split(' ')[0]}! 👋</h1>
                        <p className="text-orange-50 text-lg max-w-xl">
                            Welcome to your student hub. You have <span className="font-bold text-white">{stats?.eventsRegistered} active events</span> and pending tasks.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button className="bg-white text-orange-600 hover:bg-orange-50 border-0 font-bold shadow-lg">
                            View Calendar
                        </Button>
                    </div>
                </div>
                {/* Decorative Circle */}
                <div className="absolute -right-10 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
            </div>

            {/* 2. Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Calendar}
                    label="Events Registered"
                    value={stats?.eventsRegistered || 0}
                    bgClass="bg-blue-50" colorClass="text-blue-600"
                />
                <StatCard
                    icon={Trophy}
                    label="Hackathons"
                    value={stats?.hackathonsParticipated || 0}
                    bgClass="bg-purple-50" colorClass="text-purple-600"
                />
                <StatCard
                    icon={Sparkles}
                    label="Lenses Submitted"
                    value={stats?.lensesSubmitted || 0}
                    bgClass="bg-orange-50" colorClass="text-[#FF6B35]"
                />
                <StatCard
                    icon={Zap}
                    label="XP Points"
                    value={1250}
                    bgClass="bg-green-50" colorClass="text-green-600"
                />
            </div>

            {/* 3. Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left: Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-bold text-slate-800">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Action 1 (Showcase) */}
                        <div className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-full bg-orange-50 text-[#FF6B35] group-hover:scale-110 transition-transform"><Upload className="w-6 h-6" /></div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Submit Project</h4>
                            <p className="text-sm text-slate-500 mt-2">Upload your hackathon submission or project demo.</p>
                        </div>

                        {/* Action 2 (Lens) */}
                        <div className="group cursor-pointer bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300">
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-3 rounded-full bg-green-50 text-green-600 group-hover:scale-110 transition-transform"><Sparkles className="w-6 h-6" /></div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h4 className="text-lg font-bold text-slate-800">Submit AR Lens</h4>
                            <p className="text-sm text-slate-500 mt-2">Submit your Snap AR Lens for verification.</p>
                        </div>
                    </div>
                </div>

                {/* Right: Upcoming List */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col h-full">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#FF6B35]" /> Up Next
                    </h3>

                    <div className="space-y-3 flex-1">
                        {upcoming.length > 0 ? upcoming.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">IMG</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm line-clamp-1 group-hover:text-[#FF6B35] transition-colors">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-0.5">{new Date(item.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10">
                                <p className="text-slate-400 text-sm">No upcoming events.</p>
                                <Button variant="link" className="text-[#FF6B35]">Browse Events</Button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;