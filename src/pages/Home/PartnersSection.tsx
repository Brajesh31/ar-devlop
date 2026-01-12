import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { HoverLift } from '@/components/ui/MicroInteractions';
import { Handshake } from 'lucide-react';

const partners = [
  { name: 'Snap AR', category: 'Technology' },
  { name: 'Google for Developers', category: 'Technology' },
  { name: 'Ministry of I&B', category: 'Government' },
  { name: 'NSDC', category: 'Government' },
  { name: 'WAVES', category: 'Events' },
  { name: 'IndiaSkills', category: 'Government' },
  { name: 'Skill India', category: 'Government' },
  { name: 'IIT Roorkee', category: 'Academic' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

export const PartnersSection = () => {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container-wide">
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionBadge icon={<Handshake size={14} />}>
              Trusted By
            </SectionBadge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Partners & Collaborators
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          {partners.map((partner) => (
            <motion.div key={partner.name} variants={itemVariants}>
              <HoverLift liftAmount={3}>
                <div className="flex flex-col items-center justify-center p-4 md:p-5 bg-secondary/50 rounded-lg border border-border/50 hover:border-accent/30 transition-colors">
                  <span className="font-medium text-center text-sm md:text-base">{partner.name}</span>
                  <span className="text-xs text-muted-foreground mt-1">{partner.category}</span>
                </div>
              </HoverLift>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
