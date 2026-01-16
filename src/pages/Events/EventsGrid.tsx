import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Event } from '@/data/events';
import { EventCard } from './EventCard';
import { useAuth } from '@/hooks/useAuth';
import { studentService } from '@/services/api';


interface EventsGridProps {
  events: Event[];
}

// FIX: Define the expected shape of the API response item
interface EventRegistration {
  event_id: string | number;
  [key: string]: unknown; // Allow other properties without losing safety on event_id
}

// MASTER ANIMATION PHYSICS
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 25
    },
  },
};

export const EventsGrid = ({ events }: EventsGridProps) => {
  const { user } = useAuth();
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [setLoading] = useState(true);

  // 1. FETCH REGISTRATIONS WITH REFINEMENT
  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await studentService.getMyEvents();

        // FIX: Removed 'any' by typing the map callback
        if (res && Array.isArray(res.data)) {
          const ids = new Set(
              res.data.map((e: EventRegistration) => String(e.event_id))
          );
          setRegisteredIds(ids);
        }
      } catch (error) {
        console.error("Failed to fetch registrations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [user]);

  // SORTING LOGIC: DATE DESCENDING
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
      <div className="w-full py-8 md:py-16 relative perspective-2000">
        {/* AMBIENT BACKGROUND LAYER */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

        <div className="container-wide px-4 md:px-8">
          <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 xl:gap-12"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {sortedEvents.map((event) => (
                  <motion.div
                      key={event.id}
                      variants={itemVariants}
                      layout // Smooth grid transitions
                      className="h-full"
                  >
                    <EventCard
                        event={event}
                        isRegistered={registeredIds.has(String(event.id))}
                    />
                  </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* EMPTY STATE ARCHITECTURE */}
          {sortedEvents.length === 0 && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100 rounded-[48px] bg-white/40 backdrop-blur-sm"
              >
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">No Events Found</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2">Adjust your matrix filters</p>
              </motion.div>
          )}
        </div>
      </div>
  );
};