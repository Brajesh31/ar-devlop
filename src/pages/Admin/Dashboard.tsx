import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Trophy,
    Calendar,
    TrendingUp,
    ArrowUpRight,
    MoreHorizontal,
    Clock,
    UserPlus,
    ShieldAlert,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/api';

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        students: 0,
        events: 0,
        hackathons: 0,
        growth: 0
    });
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getStats();
                if (response.status === 'success' && response.data) {
                    setStats(response.data.counts);
                    setActivities(response.data.activity);
                }
            } catch (error) {
                console.error("Failed to load dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: "Total Students", value: stats.students.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
        { title: "Active Events", value: stats.events, icon: Calendar, color: "text-[#FF6B35]", bg: "bg-orange-50" },
        { title: "Hackathons", value: stats.hackathons, icon: Trophy, color: "text-purple-500", bg: "bg-purple-50" },
        { title: "Monthly Growth", value: `+${stats.growth}%`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto">

            {/* Welcome Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                    <p className="text-slate-500">Welcome back, here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Download Report</Button>
                    <Button className="bg-[#FF6B35] hover:bg-[#E55A2B] text-white">Create New Event</Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-default">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                        <h3 className="text-2xl font-bold text-slate-800 mt-2">{stat.value}</h3>
                                    </div>
                                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-4 text-xs text-green-600 font-medium">
                                    <ArrowUpRight className="w-3 h-3" />
                                    <span>Growth Rate: {stats.growth}%</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Realtime Graph Placeholder */}
                <Card className="lg:col-span-2 border-none shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-slate-800">Realtime Traffic</CardTitle>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="text-center">
                                <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                <p className="text-slate-400 font-medium">Live Analytics Graph</p>
                                <p className="text-xs text-slate-300">(Integration Pending)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Right: Recent Activity */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {activities.length > 0 ? activities.map((activity, idx) => (
                                <div key={idx} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer">
                                    <div className="mt-1">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                            {activity.type === 'user' ? (
                                                <UserPlus className="w-4 h-4 text-slate-500" />
                                            ) : (
                                                <ShieldAlert className="w-4 h-4 text-slate-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800">
                                            {activity.user} <span className="text-slate-500 font-normal">{activity.action}</span>
                                        </p>
                                        <p className="text-sm text-[#FF6B35] font-medium truncate">{activity.target}</p>
                                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                            <Clock className="w-3 h-3" />
                                            {activity.time}
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-8 text-center text-slate-400 text-sm">No recent activity</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;