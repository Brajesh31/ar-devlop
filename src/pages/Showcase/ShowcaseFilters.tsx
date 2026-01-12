import { motion } from 'framer-motion';
import { type ProjectCategory } from '@/data/showcase';
import { cn } from '@/lib/utils';

interface ShowcaseFiltersProps {
  activeFilters: ProjectCategory[];
  onFilterToggle: (filter: ProjectCategory) => void;
}

const filterOptions: { label: string; value: ProjectCategory }[] = [
  { label: 'AR', value: 'ar' },
  { label: 'VR', value: 'vr' },
  { label: 'WebAR', value: 'webar' },
  { label: 'SnapAR', value: 'snapar' },
  { label: 'Hackathon Projects', value: 'hackathon' },
  { label: 'Workshop Outputs', value: 'workshop' },
];

export const ShowcaseFilters = ({ activeFilters, onFilterToggle }: ShowcaseFiltersProps) => {
  return (
    <motion.section 
      className="py-4 bg-background/80 backdrop-blur-sm sticky top-16 z-30 border-b border-border/50"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="container-wide">
        <motion.div 
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filterOptions.map((filter, index) => (
            <motion.button
              key={filter.value}
              onClick={() => onFilterToggle(filter.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden',
                activeFilters.includes(filter.value)
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {filter.label}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};
