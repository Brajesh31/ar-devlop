import { useState, useEffect } from 'react'; // Added hooks
import { motion } from 'framer-motion';
import { Event } from '@/data/events';
import { EventCard } from './EventCard';
import { useAuth } from '@/hooks/useAuth'; // Import Auth hook
import { studentService } from '@/services/api'; // Import API service

interface EventsGridProps {
  events: Event[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const EventsGrid = ({ events }: EventsGridProps) => {
  const { user } = useAuth();
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());

  // 1. Fetch Registered Events IDs
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) return;
      try {
        const res = await studentService.getMyEvents();
        if (res && Array.isArray(res.data)) { // Check if data exists
          // Create a Set of event IDs for O(1) lookup
          const ids = new Set(res.data.map((e: any) => String(e.event_id)));
          setRegisteredIds(ids);
        }
      } catch (error) {
        console.error("Failed to fetch registrations", error);
      }
    };

    fetchRegistrations();
  }, [user]);

  // Create a copy and sort by date DESCENDING
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
      <div className="container-wide py-6 md:py-8">
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          {sortedEvents.map((event) => (
              <motion.div
                  key={event.id}
                  variants={itemVariants}
              >
                <EventCard
                    event={event}
                    isRegistered={registeredIds.has(String(event.id))} // Pass prop
                />
              </motion.div>
          ))}
        </motion.div>
      </div>
  );
};