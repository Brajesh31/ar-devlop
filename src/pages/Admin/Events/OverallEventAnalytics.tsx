import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BarChart2, Users, Calendar, TrendingUp, Loader2, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { adminService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const OverallEventAnalytics = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await adminService.getStats();
            if (res.status === 'success') {
                setStats(res.data?.counts);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load overall analytics", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-[#FF6B35]" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/events')}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Overall Event Analytics</h1>
                    <p className="text-slate-500">Aggregate performance across all events.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Events</CardTitle></CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <span className="text-2xl font-bold">{stats?.events || 0}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle></CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">{stats?.students || 0}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Hackathons</CardTitle></CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-purple-500" />
                        <span className="text-2xl font-bold">{stats?.hackathons || 0}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Growth Rate</CardTitle></CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-orange-500" />
                        <span className="text-2xl font-bold">+{stats?.growth || 0}%</span>
                    </CardContent>
                </Card>
            </div>

            {/* Placeholder for future graphs */}
            <Card className="h-64 flex items-center justify-center border-dashed bg-slate-50/50">
                <div className="text-center">
                    <BarChart2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">Detailed Engagement Charts Coming Soon</p>
                </div>
            </Card>
        </div>
    );
};

export default OverallEventAnalytics;