import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, MapPin, Clock, ArrowRight, Search,
    Ticket, Loader2, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { studentService } from '@/services/api';

// --- TYPES ---
// Must match the columns returned by /student/my_events.php
interface MyEvent {
    event_id: number;
    title: string;
    slug: string;
    start_date: string;
    end_date: string | null;
    banner_image_url: string;
    mode: 'online' | 'offline' | 'hybrid';
    location_city: string;
    event_status: string;
    registered_at: string;
}

// --- ANIMATION VARIANTS ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.98 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    },
    hover: {
        y: -5,
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
        scale: 1.02,
        transition: { duration: 0.3 }
    }
};

const MyEvents = () => {
    const [events, setEvents] = useState<MyEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                // Call the API service which handles the Axios request
                const response = await studentService.getMyEvents();

                // Check for success status and valid data array
                if (response.status === 'success' && Array.isArray(response.data)) {
                    setEvents(response.data);
                }
            } catch (error) {
                console.error("Failed to load events", error);
            } finally {
                // Small delay to prevent flickering on fast loads
                setTimeout(() => setLoading(false), 600);
            }
        };
        fetchMyEvents();
    }, []);

    // Filtering Logic
    const filteredEvents = events.filter(ev => {
        const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase());
        const eventDate = new Date(ev.start_date);
        const now = new Date();

        let matchesFilter = true;
        if (filter === 'upcoming') matchesFilter = eventDate >= now;
        if (filter === 'past') matchesFilter = eventDate < now;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-[#FF6B35]" />
                </motion.div>
                <p className="text-slate-400 font-medium animate-pulse">Loading your schedule...</p>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1600px] mx-auto space-y-8"
        >

            {/* === HEADER SECTION === */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-xs font-bold text-[#FF6B35] mb-3"
                    >
                        <Ticket size={12} />
                        <span>My Schedule</span>
                    </motion.div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        Registered Events
                    </h1>
                    <p className="text-slate-500 mt-2 max-w-lg">
                        Manage your upcoming workshops, hackathons, and webinars.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                    {['all', 'upcoming', 'past'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab as any)}
                            className={`
                px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 capitalize
                ${filter === tab
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* === SEARCH & TOOLS === */}
            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <Input
                    placeholder="Search by event name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 rounded-2xl border-slate-200 bg-white/50 backdrop-blur-sm focus:bg-white transition-all text-base shadow-sm"
                />
            </div>

            {/* === EVENTS GRID === */}
            {filteredEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredEvents.map((event) => (
                            <motion.div
                                key={event.event_id}
                                variants={cardVariants}
                                whileHover="hover"
                                className="group relative bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full"
                            >
                                {/* Image Section */}
                                <div className="relative h-48 w-full overflow-hidden">
                                    <div className="absolute inset-0 bg-slate-200 animate-pulse" />
                                    {event.banner_image_url ? (
                                        <img
                                            src={event.banner_image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                                            <Sparkles className="text-slate-300 w-10 h-10" />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className="absolute top-4 left-4">
                                        <Badge className={`
                      px-3 py-1.5 rounded-lg border-0 backdrop-blur-md shadow-lg
                      ${event.event_status === 'published' ? 'bg-green-500/90 text-white' : 'bg-slate-900/90 text-white'}
                    `}>
                                            {event.event_status === 'published' ? 'Confirmed' : event.event_status}
                                        </Badge>
                                    </div>

                                    {/* Mode Badge */}
                                    <div className="absolute top-4 right-4">
                                        <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-xs font-bold text-slate-900 shadow-lg flex items-center gap-1.5 capitalize">
                                            <MapPin size={12} className="text-[#FF6B35]" />
                                            {event.mode}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 text-[#FF6B35] font-bold text-xs uppercase tracking-wider mb-2">
                                            <Calendar size={12} />
                                            <span>{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-[#FF6B35] transition-colors">
                                            {event.title}
                                        </h3>
                                    </div>

                                    {/* Meta Details */}
                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-center gap-3 text-sm text-slate-500">
                                            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                <Clock size={14} />
                                            </div>
                                            <span>
                        {new Date(event.start_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                                        </div>

                                        {event.location_city && (
                                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                                    <MapPin size={14} />
                                                </div>
                                                <span>{event.location_city}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Area */}
                                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="text-xs font-medium text-slate-400">
                                            Registered on <br/>
                                            <span className="text-slate-600">{new Date(event.registered_at).toLocaleDateString()}</span>
                                        </div>
                                        <Button className="rounded-xl bg-slate-900 hover:bg-[#FF6B35] text-white shadow-lg shadow-slate-200 hover:shadow-orange-200 transition-all duration-300 group/btn">
                                            View Ticket <ArrowRight size={16} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                /* === EMPTY STATE === */
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 border-dashed"
                >
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                        <Ticket className="w-10 h-10 text-[#FF6B35]" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">No events found</h3>
                    <p className="text-slate-500 mt-2 text-center max-w-sm">
                        {searchQuery
                            ? "We couldn't find any events matching your search."
                            : "You haven't registered for any events yet. Start your journey!"}
                    </p>
                    {!searchQuery && (
                        <Button className="mt-6 bg-[#FF6B35] hover:bg-[#e85d2a] text-white rounded-xl shadow-lg shadow-orange-500/20">
                            Browse All Events
                        </Button>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};

export default MyEvents;