import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, MapPin, Calendar, Award, Sparkles } from 'lucide-react';

const partnerImpactMetrics = [
  { icon: Users, label: 'Students Reached', value: 50000, suffix: '+', color: 'accent' },
  { icon: MapPin, label: 'Cities Covered', value: 25, suffix: '+', color: 'success' },
  { icon: Calendar, label: 'Programs Delivered', value: 100, suffix: '+', color: 'accent' },
  { icon: Award, label: 'Creators Trained', value: 10000, suffix: '+', color: 'success' },
];

const CountUp = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;
    
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    const tick = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / (duration * 1000));
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      
      if (now < endTime) {
        requestAnimationFrame(tick);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
    }
    return num.toString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

export const PartnerImpact = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-accent/5 via-background to-success/5 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px]"
        animate={{ 
          scale: [1, 1.2, 1], 
          x: [0, 40, 0],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-success/10 blur-[100px]"
        animate={{ 
          scale: [1.2, 1, 1.2], 
          x: [0, -20, 0],
          opacity: [0.15, 0.3, 0.15] 
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* Floating Particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-accent/40' : 'bg-success/40'}`}
          style={{
            top: `${20 + i * 20}%`,
            left: `${15 + i * 18}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}
      
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-5"
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-success" />
            </motion.div>
            <span className="text-sm font-medium text-success">Partnership Impact</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 tracking-tight">
            What We've{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-accent">
              Achieved Together
            </span>
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto">
            Numbers that reflect our collective impact on India's XR ecosystem.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {partnerImpactMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 100,
              }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 md:p-6 text-center hover:border-accent/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Gradient Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl ${
                metric.color === 'accent' ? 'from-accent/20 to-transparent' : 'from-success/20 to-transparent'
              }`} />

              {/* Icon */}
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                  metric.color === 'accent' 
                    ? 'bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground' 
                    : 'bg-success/10 text-success group-hover:bg-success group-hover:text-success-foreground'
                } transition-colors duration-300`}
              >
                <metric.icon className="w-6 h-6" />
              </motion.div>

              {/* Number */}
              <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-1 ${
                metric.color === 'accent' ? 'text-accent' : 'text-success'
              }`}>
                <CountUp 
                  end={metric.value} 
                  suffix={metric.suffix}
                  duration={2.5}
                />
              </div>
              
              {/* Label */}
              <div className="text-xs md:text-sm text-muted-foreground font-medium">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
