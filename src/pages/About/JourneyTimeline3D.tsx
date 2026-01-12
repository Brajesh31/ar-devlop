import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Rocket, Users, Award, Globe, Zap, Target } from 'lucide-react';

const milestones = [
  {
    year: '2019',
    title: 'The Beginning',
    description: 'Started as a small community of XR enthusiasts in Delhi',
    icon: Rocket,
    color: 'accent',
  },
  {
    year: '2020',
    title: 'First Workshop',
    description: 'Conducted our first AR workshop reaching 100+ students',
    icon: Users,
    color: 'success',
  },
  {
    year: '2021',
    title: 'National Expansion',
    description: 'Expanded to 50+ colleges across 10 states',
    icon: Globe,
    color: 'accent',
  },
  {
    year: '2022',
    title: 'Forbes Recognition',
    description: 'Founder recognized in Forbes 30 Under 30 Asia',
    icon: Award,
    color: 'success',
  },
  {
    year: '2023',
    title: '50K+ Community',
    description: 'Crossed 50,000 active community members',
    icon: Zap,
    color: 'accent',
  },
  {
    year: '2024',
    title: 'India\'s Largest',
    description: 'Became India\'s largest XR community with 90K+ members',
    icon: Target,
    color: 'success',
  },
];

export const JourneyTimeline3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-72 h-72 bg-success/5 rounded-full blur-3xl" />
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
            Our Journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            From Idea to Impact
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The story of how we're building India's XR future, one milestone at a time
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-border hidden md:block">
            <motion.div
              style={{ height: lineHeight }}
              className="w-full bg-gradient-to-b from-accent via-success to-accent"
            />
          </div>

          {/* Milestones */}
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="p-6 rounded-2xl bg-card border border-border shadow-sm inline-block"
                  >
                    <span className={`text-sm font-medium ${milestone.color === 'accent' ? 'text-accent' : 'text-success'}`}>
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold mt-1 mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm">{milestone.description}</p>
                  </motion.div>
                </div>

                {/* Icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-full flex items-center justify-center z-10 shadow-lg ${
                    milestone.color === 'accent' 
                      ? 'bg-gradient-to-br from-accent to-accent/70' 
                      : 'bg-gradient-to-br from-success to-success/70'
                  }`}
                >
                  <milestone.icon className="w-6 h-6 text-white" />
                </motion.div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
