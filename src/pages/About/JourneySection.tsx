import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { journey } from '@/data/team';

export const JourneySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-secondary/30">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12 text-center">
          Our Journey
        </h2>

        {/* Desktop: Parallax Layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Fixed visual area */}
          <div className="sticky top-32">
            <motion.div 
              className="aspect-square bg-gradient-to-br from-accent/20 to-success/20 rounded-2xl flex items-center justify-center"
              style={{ scale: useTransform(scrollYProgress, [0, 0.5], [0.9, 1]) }}
            >
              <div className="text-center p-8">
                <motion.span 
                  className="text-7xl font-bold gradient-text"
                  style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [0.5, 1]) }}
                >
                  2021–2025
                </motion.span>
                <p className="text-muted-foreground mt-4">Building India's XR Future</p>
              </div>
            </motion.div>
          </div>

          {/* Right: Scrolling milestones */}
          <div className="space-y-16">
            {journey.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative pl-8 border-l-2 border-accent/30"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 bg-accent rounded-full" />
                <span className="text-accent font-bold text-lg">{milestone.year}</span>
                <h3 className="text-xl font-semibold text-foreground mt-2 mb-2">{milestone.title}</h3>
                <p className="text-muted-foreground">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Stacked Layout */}
        <div className="md:hidden space-y-8">
          {journey.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 bg-background rounded-xl border border-border"
            >
              <span className="text-accent font-bold">{milestone.year}</span>
              <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">{milestone.title}</h3>
              <p className="text-muted-foreground text-sm">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
