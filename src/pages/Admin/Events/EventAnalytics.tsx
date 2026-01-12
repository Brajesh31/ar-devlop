import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Users, Calendar, MapPin, Search, Loader2, Mail, Phone, Building, Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { adminService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const EventAnalytics = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    // --- 1. Load Data ---
    useEffect(() => {
        if (id) loadData();
    }, [id]);

    const loadData = async () => {
        try {
            // Connects to get_details.php
            const res = await adminService.events.getDetails(id!);
            if (res.status === 'success' && res.event) {
                setData(res);
            } else {
                throw new Error(res.message || "Event not found");
            }
        } catch (error: any) {
            console.error("Analytics Error:", error);
            toast({ title: "Error", description: "Failed to load event details.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    // --- 2. Export CSV ---
    const handleExport = () => {
        if (!data?.registrations || data.registrations.length === 0) {
            toast({ title: "No Data", description: "No registrations available to export.", variant: "outline" });
            return;
        }

        // Headers matching the dynamic table structure
        const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Gender", "City", "Organization", "Job Title", "Registered At"];

        const rows = data.registrations.map((r: any) => [
            r.reg_id,
            r.first_name,
            r.last_name,
            r.email,
            r.contact_no,
            r.gender,
            r.city,
            r.organization_name,
            r.job_title,
            new Date(r.registered_at).toLocaleString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(','), ...rows.map((e: any[]) => e.map((i: any) => `"${i || ''}"`).join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `registrations_${data.event.slug || 'event'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return (
        <div className="h-[50vh] flex flex-col items-center justify-center text-slate-500 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6B35]" />
            <p>Loading analytics data...</p>
        </div>
    );

    if (!data) return (
        <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-semibold text-slate-700">Event Not Found</p>
            <p className="text-slate-500">The event you are looking for does not exist or has been deleted.</p>
            <Button onClick={() => navigate('/admin/events')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back to Events
            </Button>
        </div>
    );

    const event = data.event;
    const registrations = data.registrations || [];

    // --- Filter Logic ---
    const filteredStudents = registrations.filter((s: any) =>
        (s.first_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (s.last_name?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (s.email?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (s.organization_name?.toLowerCase() || '').includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">

            {/* --- HEADER --- */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 border-b pb-6">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/events')} className="mt-1">
                    <ArrowLeft className="w-6 h-6 text-slate-500" />
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
                        <Badge variant="outline" className="capitalize">{event.event_type}</Badge>
                        <Badge className={event.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700'}>
                            {event.status}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {event.location_city || 'Online'}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => navigate(`/admin/events/edit/${id}`)} variant="outline">
                        Edit Event
                    </Button>
                    <Button onClick={handleExport} className="gap-2 bg-[#FF6B35] hover:bg-[#E55A2B]">
                        <Download className="w-4 h-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-900 text-white border-slate-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-400">Total Registrations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold flex items-center gap-3">
                            <Users className="w-8 h-8 text-[#FF6B35]" />
                            {registrations.length}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Fee Structure</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-semibold capitalize">
                            {event.fee_type} {event.fee_type === 'paid' && `(₹${event.price})`}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Team Size: {event.team_size}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Database Table</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-sm font-mono bg-slate-100 p-1 rounded px-2 truncate" title={event.registration_table_name}>
                            {event.registration_table_name}
                        </div>
                        <div className="text-xs text-slate-400 mt-2">Auto-generated & Managed</div>
                    </CardContent>
                </Card>
            </div>

            {/* --- STUDENT TABLE --- */}
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b bg-slate-50/50">
                    <div>
                        <CardTitle>Registered Participants</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Real-time data from database</p>
                    </div>
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search students, orgs..."
                            className="pl-8 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 hover:bg-slate-50">
                                <TableHead>Full Name</TableHead>
                                <TableHead>Contact Info</TableHead>
                                <TableHead>Organization/College</TableHead>
                                <TableHead>Designation</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Registered At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-32 text-slate-500">
                                        {registrations.length === 0 ? "No students have registered yet." : "No results found matching your search."}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredStudents.map((student: any) => (
                                    <TableRow key={student.reg_id}>
                                        <TableCell className="font-medium">
                                            <div className="capitalize">{student.first_name} {student.last_name}</div>
                                            <div className="text-xs text-slate-400 capitalize">{student.gender}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1 text-sm">
                                                <span className="flex items-center gap-1.5 text-slate-700"><Mail className="w-3 h-3 text-slate-400" /> {student.email}</span>
                                                <span className="flex items-center gap-1.5 text-slate-500"><Phone className="w-3 h-3 text-slate-400" /> {student.contact_no}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Building className="w-3 h-3 text-slate-400" />
                                                <span className="truncate max-w-[150px]" title={student.organization_name}>{student.organization_name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-3 h-3 text-slate-400" />
                                                {student.job_title}
                                            </div>
                                        </TableCell>
                                        <TableCell>{student.city}</TableCell>
                                        <TableCell className="text-slate-500 text-xs whitespace-nowrap">
                                            {new Date(student.registered_at).toLocaleDateString()} <br/>
                                            {new Date(student.registered_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default EventAnalytics;