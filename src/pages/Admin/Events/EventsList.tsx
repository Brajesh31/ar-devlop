import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus, Search, Calendar, Users, Eye, Edit, Trash2, Loader2, MoreHorizontal, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { adminService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const EventsList = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [events, setEvents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async () => {
        setIsLoading(true);
        try {
            const res = await adminService.events.list();
            if (res.status === 'success' && Array.isArray(res.data)) {
                setEvents(res.data);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error("Load Error:", error);
            toast({ title: "Error", description: "Failed to load events.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event? This will also delete the student registration data for this event.")) return;

        try {
            const res = await adminService.events.delete(id);
            if (res.status === 'success') {
                toast({ title: "Deleted", description: "Event and its data deleted successfully." });
                loadEvents(); // Refresh list
            } else {
                throw new Error(res.message);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete event.", variant: "destructive" });
        }
    };

    const filteredEvents = events.filter(e =>
        e.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Events Management</h1>
                    <p className="text-slate-500">Manage your workshops, hackathons, and meetups.</p>
                </div>
                <Button onClick={() => navigate('/admin/events/create')} className="bg-[#FF6B35] hover:bg-[#E55A2B]">
                    <Plus className="w-4 h-4 mr-2" /> Create Event
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-slate-50 border-slate-200"
                    />
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Event Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Registrations</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                                        <Loader2 className="w-6 h-6 animate-spin text-[#FF6B35]" />
                                        <span>Loading events...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredEvents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                    {searchTerm ? "No matching events found." : "No events created yet."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEvents.map((event) => (
                                <TableRow key={event.event_id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                                                {event.banner_image_url ? (
                                                    <img src={event.banner_image_url} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">IMG</div>
                                                )}
                                            </div>
                                            <span className="truncate max-w-[200px] font-semibold text-slate-700">{event.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(event.start_date).toLocaleDateString()}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize">{event.event_type}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span className="font-medium text-slate-900">{event.registration_count || 0}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={event.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-slate-100 text-slate-700'}>
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">

                                                {/* 1. View Analytics */}
                                                <DropdownMenuItem onClick={() => navigate(`/admin/events/${event.event_id}`)}>
                                                    <Eye className="w-4 h-4 mr-2" /> View Analytics
                                                </DropdownMenuItem>

                                                {/* 2. Edit Event */}
                                                <DropdownMenuItem onClick={() => navigate(`/admin/events/edit/${event.event_id}`)}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit Details
                                                </DropdownMenuItem>

                                                <DropdownMenuSeparator />

                                                {/* 3. Delete Event */}
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleDelete(event.event_id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Event
                                                </DropdownMenuItem>

                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default EventsList;