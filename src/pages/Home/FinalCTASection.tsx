import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const FinalCTASection = () => {
  return (
    <section className="py-10 md:py-14 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent/20 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.1, 0.05],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-success/20 blur-3xl"
        />
      </div>

      <div className="container-wide relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            Ready to Build the Future?
          </h2>
          <p className="text-base md:text-lg text-primary-foreground/70 mb-6">
            Join Bharat's fastest-growing XR community. Learn, create, and grow with 90,000+ creators.
          </p>
          <Link to="/contact">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block relative"
            >
              {/* Pulse Ring */}
              <motion.span
                className="absolute inset-0 rounded-full bg-accent/30"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <Button 
                size="lg" 
                className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2 text-base px-6 md:px-8 relative"
              >
                Join Bharat XR
                <ArrowRight size={18} />
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
