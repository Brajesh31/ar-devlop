import { motion } from 'framer-motion';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

export const WhoWeAreSection = () => {
  return (
    <AnimatedSection variant="fadeLeft" className="py-8 md:py-10">
      <div className="container-wide max-w-4xl">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Who We Are
        </motion.h2>
        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Bharat XR is India's largest{' '}
            <span className="text-foreground font-medium">community-driven platform</span>{' '}
            for augmented and virtual reality creators. We believe that immersive technology has the power to transform education, entertainment, and industry — and that this transformation should be led by{' '}
            <span className="text-accent font-medium">Indian talent</span>.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our community-first approach means everything we build starts with our members. From college workshops to national hackathons, we create opportunities for creators at every level to learn, build, and grow together.
          </motion.p>
        </div>
      </div>
    </AnimatedSection>
  );
};
