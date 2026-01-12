import { motion } from 'framer-motion';
import { Hackathon } from '@/data/hackathons';
import { HackathonCard } from './HackathonCard';

interface HackathonsGridProps {
  hackathons: Hackathon[];
}

export const HackathonsGrid = ({ hackathons }: HackathonsGridProps) => {
  return (
    <div className="container-wide py-8">
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {hackathons.map((hackathon) => (
          <motion.div
            key={hackathon.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
          >
            <HackathonCard hackathon={hackathon} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
