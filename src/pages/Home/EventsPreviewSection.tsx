import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { Button } from '@/components/ui/button';
import { HoverLift, HoverScale } from '@/components/ui/MicroInteractions';
import { Calendar, MapPin, ArrowRight, Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import { getUpcomingEvents, Event } from '@/data/events';
import { publicService } from '@/services/api';
import { format } from 'date-fns';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export const EventsPreviewSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Data from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await publicService.events.list();
        if (res.status === 'success') {
          // Map the raw DB data to your Event interface
          const mappedData: Event[] = res.data.map((e: any) => ({
            id: e.event_id,
            slug: e.slug,
            title: e.title,
            description: e.description,
            type: (e.event_type || 'workshop').toLowerCase(),
            date: e.start_date,
            mode: (e.mode || 'online').toLowerCase(),
            location: e.mode === 'online' ? 'Online' : e.location_city,
            image: e.banner_image_url, // <--- ADDED THIS LINE
            status: 'upcoming',
            tags: e.tags
          }));
          setEvents(mappedData);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // 2. Use your Helper Function with the Real Data
  const upcomingEvents = getUpcomingEvents(events).slice(0, 3);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
      <section className="py-8 md:py-12 bg-background">
        <div className="container-wide">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
            <div>
              <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
              >
                <SectionBadge icon={<Calendar size={14} />}>
                  Events
                </SectionBadge>
              </motion.div>

              <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold"
              >
                What's Happening Next
              </motion.h2>
            </div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/events">
                <HoverScale scale={1.03}>
                  <Button variant="outline" className="rounded-full gap-2">
                    View All Events
                    <ArrowRight size={16} />
                  </Button>
                </HoverScale>
              </Link>
            </motion.div>
          </div>

          {/* Events Grid */}
          {upcomingEvents.length > 0 ? (
              <motion.div
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
              >
                {upcomingEvents.map((event) => (
                    <motion.div key={event.id} variants={itemVariants}>
                      <Link to={`/events/${event.slug || event.id}`}>
                        <HoverLift liftAmount={4}>
                          {/* CARD CONTAINER: Removed padding, added overflow-hidden */}
                          <div className="h-full bg-card rounded-xl border border-border shadow-sm group overflow-hidden flex flex-col">

                            {/* 1. IMAGE SECTION (New) */}
                            <div className="aspect-video w-full bg-muted relative overflow-hidden">
                              {event.image ? (
                                  <img
                                      src={event.image}
                                      alt={event.title}
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                    <ImageIcon size={40} />
                                  </div>
                              )}

                              {/* Overlay Gradient (Optional, makes text pop if you overlay it, but here it adds depth) */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* 2. CONTENT SECTION (Wrapped in padding) */}
                            <div className="p-4 md:p-5 flex flex-col flex-grow">
                              <div className="flex items-center justify-between mb-3">
                                <motion.span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        event.status === 'live'
                                            ? 'bg-success/10 text-success'
                                            : 'bg-accent/10 text-accent'
                                    }`}
                                    animate={event.status === 'live' ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                  {event.status === 'live' ? '🔴 Live' : 'Upcoming'}
                                </motion.span>
                                <span className={`px-2 py-0.5 rounded text-xs ${
                                    event.mode === 'online'
                                        ? 'bg-secondary text-muted-foreground'
                                        : 'bg-primary/5 text-primary'
                                }`}>
                                {event.mode.charAt(0).toUpperCase() + event.mode.slice(1)}
                              </span>
                              </div>

                              <h3 className="text-base font-semibold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                {event.title}
                              </h3>

                              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                {event.description}
                              </p>

                              <div className="mt-auto space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Clock size={12} />
                                  <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin size={12} />
                                  <span className="truncate">{event.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </HoverLift>
                      </Link>
                    </motion.div>
                ))}
              </motion.div>
          ) : (
              <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="text-center py-10 bg-secondary/30 rounded-xl"
              >
                <p className="text-muted-foreground">
                  No upcoming events at the moment. Check back soon!
                </p>
              </motion.div>
          )}
        </div>
      </section>
  );
};