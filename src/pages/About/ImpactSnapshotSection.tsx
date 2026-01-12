import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { AnimatedSection } from '@/components/ui/AnimatedSection';

const metrics = [
  { value: 90000, label: 'Students Trained', suffix: '+' },
  { value: 500, label: 'College Partners', suffix: '+' },
  { value: 50, label: 'Events Conducted', suffix: '+' },
];

const CountUp = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const startTime = Date.now();
    const endValue = target;

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * endValue);
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      }
    };

    requestAnimationFrame(updateCount);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const ImpactSnapshotSection = () => {
  return (
    <AnimatedSection className="py-8 md:py-10">
      <div className="container-wide">
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-foreground mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Our Impact
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
          {metrics.map((metric, index) => (
            <motion.div 
              key={index}
              className="text-center p-5 bg-card border border-border rounded-xl group hover:border-accent/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <motion.p 
                className="text-3xl md:text-4xl font-bold text-accent mb-2"
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
              >
                <CountUp target={metric.value} suffix={metric.suffix} />
              </motion.p>
              <p className="text-muted-foreground text-sm">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};
