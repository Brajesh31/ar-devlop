import { motion } from 'framer-motion';
import { Event } from '@/data/events';
import { EventCard } from './EventCard';

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
  // Create a copy and sort by date DESCENDING (Furthest date first)
  // Example: Nov 2025 (First) -> Feb 2025 (Second)
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
                <EventCard event={event} />
              </motion.div>
          ))}
        </motion.div>
      </div>
  );
};