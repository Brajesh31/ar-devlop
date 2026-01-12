import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { Button } from '@/components/ui/button';
import { HoverLift, HoverScale } from '@/components/ui/MicroInteractions';
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react';
import { getUpcomingEvents } from '@/data/events';
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
  const upcomingEvents = getUpcomingEvents().slice(0, 3);

  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container-wide">
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
                <HoverLift liftAmount={4}>
                  <div className="h-full bg-card rounded-xl p-4 md:p-5 border border-border shadow-sm group">
                    {/* Status Badge */}
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

                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock size={12} />
                        <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={12} />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    {event.tags && (
                      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                        {event.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-secondary rounded text-xs text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </HoverLift>
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
