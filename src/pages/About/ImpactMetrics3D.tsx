import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, GraduationCap, Calendar, Trophy, MapPin, Briefcase } from 'lucide-react';

interface CountUpProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

const CountUp = ({ end, duration = 2, suffix = '', prefix = '' }: CountUpProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  );
};

const metrics = [
  {
    icon: Users,
    value: 90000,
    suffix: '+',
    label: 'Community Members',
    description: 'XR enthusiasts across India',
    color: 'accent',
  },
  {
    icon: GraduationCap,
    value: 500,
    suffix: '+',
    label: 'Partner Colleges',
    description: 'Educational institutions',
    color: 'success',
  },
  {
    icon: Calendar,
    value: 100,
    suffix: '+',
    label: 'Events Organized',
    description: 'Workshops & meetups',
    color: 'accent',
  },
  {
    icon: Trophy,
    value: 50,
    suffix: '+',
    label: 'Hackathons',
    description: 'Innovation challenges',
    color: 'success',
  },
  {
    icon: MapPin,
    value: 28,
    suffix: '',
    label: 'States Covered',
    description: 'Pan-India presence',
    color: 'accent',
  },
  {
    icon: Briefcase,
    value: 200,
    suffix: '+',
    label: 'Industry Partners',
    description: 'Corporate collaborations',
    color: 'success',
  },
];

export const ImpactMetrics3D = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container-narrow relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Numbers That <span className="text-accent">Inspire</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The measurable impact we've created in India's XR ecosystem
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group"
            >
              <div className="relative p-6 md:p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 text-center overflow-hidden shadow-sm">
                {/* Background glow */}
                <div className={`absolute inset-0 ${metric.color === 'accent' ? 'bg-accent/5' : 'bg-success/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                    metric.color === 'accent' 
                      ? 'bg-gradient-to-br from-accent to-accent/70' 
                      : 'bg-gradient-to-br from-success to-success/70'
                  }`}
                >
                  <metric.icon className="w-7 h-7 text-white" />
                </motion.div>

                {/* Count */}
                <div className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-2 ${
                  metric.color === 'accent' ? 'text-accent' : 'text-success'
                }`}>
                  <CountUp end={metric.value} suffix={metric.suffix} />
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold mb-1">{metric.label}</h3>
                <p className="text-sm text-muted-foreground">{metric.description}</p>

                {/* Corner decoration */}
                <div className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity ${
                  metric.color === 'accent' ? 'bg-accent' : 'bg-success'
                }`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-muted-foreground">
            Join India's fastest-growing XR community and be part of the revolution
          </p>
        </motion.div>
      </div>
    </section>
  );
};