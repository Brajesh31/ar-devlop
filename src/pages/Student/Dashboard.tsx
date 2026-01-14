import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Trophy, Calendar, Sparkles, ArrowRight, Upload, Clock, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { studentService, StudentStats, UpcomingActivity } from '@/services/api'; // ✅ Corrected import path

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
                console.error("Dashboard data fetch failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">

            {/* 1. Welcome Section with Gradient Mesh */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-pink-600 p-8 text-white shadow-xl shadow-orange-200">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sparkles className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 🚀</h1>
                    <p className="text-orange-100 text-lg max-w-2xl">
                        You have {stats?.eventsRegistered || 0} active registrations and {stats?.hackathonsParticipated || 0} hackathons pending. Ready to learn something new today?
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Button className="bg-white text-orange-600 hover:bg-orange-50 border-0 font-semibold">
                            Explore Events
                        </Button>
                        <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:text-white">
                            View Profile
                        </Button>
                    </div>
                </div>
            </div>

            {/* 2. The Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Stats & Actions */}
                <div className="md:col-span-2 space-y-6">

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-green-50/50">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                                <div className="p-3 bg-green-100 text-green-600 rounded-full"><Calendar className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-bold text-slate-800">{stats?.eventsRegistered || 0}</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Events</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-purple-50/50">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                                <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Trophy className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-bold text-slate-800">{stats?.hackathonsParticipated || 0}</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Hackathons</p>
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-sm hover:shadow-md transition-shadow bg-blue-50/50 col-span-2 md:col-span-1">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-2">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Sparkles className="w-6 h-6" /></div>
                                <h3 className="text-2xl font-bold text-slate-800">{stats?.lensesSubmitted || 0}</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Lenses</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions (Large Cards) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="group cursor-pointer rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-orange-50 text-[#FF6B35] group-hover:scale-110 transition-transform"><Upload className="w-6 h-6" /></div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#FF6B35] group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Submit Showcase</h3>
                            <p className="text-sm text-slate-500 mt-1">Upload your project video/demo for review.</p>
                        </div>

                        <div className="group cursor-pointer rounded-2xl bg-white border border-slate-100 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform"><Sparkles className="w-6 h-6" /></div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg">Lens Studio</h3>
                            <p className="text-sm text-slate-500 mt-1">Submit your Snap AR Lens for approval.</p>
                        </div>
                    </div>

                </div>

                {/* Right Column: Up Next */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col h-full">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#FF6B35]" /> Up Next
                    </h3>

                    <div className="space-y-4 flex-1">
                        {upcoming.length > 0 ? upcoming.map((item) => (
                            <div key={item.id} className="flex gap-4 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-xs">IMG</div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-tight group-hover:text-[#FF6B35] transition-colors">{item.title}</h4>
                                    <p className="text-xs text-slate-500 mt-1">{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}</p>
                                    <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 uppercase tracking-wide">{item.type}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-slate-400 text-sm">No upcoming events.</div>
                        )}
                    </div>

                    <Button variant="ghost" className="w-full mt-4 text-[#FF6B35] hover:text-orange-700 hover:bg-orange-50">View Calendar</Button>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;