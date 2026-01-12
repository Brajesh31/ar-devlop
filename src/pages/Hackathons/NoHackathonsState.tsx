import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoHackathonsStateProps {
  onReset: () => void;
}

export const NoHackathonsState = ({ onReset }: NoHackathonsStateProps) => {
  return (
    <motion.div 
      className="container-wide py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center max-w-md mx-auto">
        <motion.div 
          className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
        >
          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 1, delay: 0.3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Rocket className="w-8 h-8 text-muted-foreground" />
          </motion.div>
        </motion.div>
        
        <motion.h3 
          className="text-xl font-semibold text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          No hackathons found
        </motion.h3>
        
        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Try adjusting your filters to find more hackathons.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button 
            onClick={onReset} 
            variant="outline"
            className="hover:border-accent/50"
          >
            Reset Filters
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
