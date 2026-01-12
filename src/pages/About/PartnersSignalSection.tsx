import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const partners = ['SnapAR', 'Google for Developers', 'NSDC', 'AICTE', 'Meta Spark'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const PartnersSignalSection = () => {
  return (
    <AnimatedSection className="py-8 md:py-10 bg-secondary/30">
      <div className="container-wide">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Community & Partners
        </motion.h2>
        <motion.p 
          className="text-muted-foreground mb-6 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Trusted by leading technology companies, educational institutions, and government bodies across India.
        </motion.p>
        
        <motion.div 
          className="flex flex-wrap gap-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {partners.map((partner, index) => (
            <motion.span 
              key={partner}
              variants={itemVariants}
              className="px-4 py-2 bg-background border border-border rounded-full text-sm text-muted-foreground transition-all duration-300 hover:border-accent/50 hover:text-foreground hover:shadow-sm cursor-default"
              whileHover={{ y: -2, scale: 1.02 }}
            >
              {partner}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
