import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const AboutCTASection = () => {
  return (
    <AnimatedSection className="py-10 md:py-12">
      <div className="container-wide text-center relative">
        {/* Decorative elements */}
        <motion.div 
          className="absolute -top-10 left-1/4 w-20 h-20 bg-accent/5 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-10 right-1/4 w-24 h-24 bg-primary/5 rounded-full blur-2xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
        
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-foreground mb-4 relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Join the Movement
        </motion.h2>
        
        <motion.p 
          className="text-muted-foreground mb-8 max-w-lg mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Be part of India's growing XR creator community. Learn, build, and grow with us.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/signup">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full px-8 group"
              >
                Get Started
                <motion.span
                  className="ml-2 inline-flex"
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
