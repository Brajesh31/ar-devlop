import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { Sparkles } from 'lucide-react';
import { Reveal, TextReveal } from '@/components/ui/MicroInteractions';

export const WhoWeAreSection = () => {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <SectionBadge icon={<Sparkles size={14} />}>
              Who We Are
            </SectionBadge>
          </Reveal>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
          >
            🚀 We're Not Just a{' '}
            <span className="text-accent">Community</span>.
            <br />
            We're a <span className="text-success">Movement</span>.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            At Bharat XR, we believe immersive technology should be accessible to everyone — 
            from tier-2 colleges to global stages. We're not just building a network; 
            we're empowering the next generation of XR creators with tools, mentorship, 
            and opportunities. Our community-first approach puts creators at the center, 
            providing not just exposure, but real skills and real impact.
          </motion.p>
        </div>
      </div>
    </section>
  );
};
