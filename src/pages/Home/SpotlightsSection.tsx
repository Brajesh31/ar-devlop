import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { HoverLift, CountUp } from '@/components/ui/MicroInteractions';
import { Star, Users, Trophy, Award } from 'lucide-react';

const spotlights = [
  {
    title: 'XR Creator Hackathon with WAVES 2025',
    description: 'National flagship initiative in partnership with Wavelabs and XDG. A 9-month journey culminating at WAVES Summit 2025.',
    metrics: [
      { value: 2200, suffix: '+', label: 'Registrations' },
      { value: 5, suffix: '', label: 'Themed Winners' },
      { value: 5, prefix: '₹', suffix: 'L', label: 'Cash Prize' },
    ],
    icon: Trophy,
    gradient: 'from-accent/10 to-success/10',
  },
  {
    title: 'India Skills 2024 Nationals (AR/VR Judging)',
    description: 'Official jury role at India\'s largest skill competition. Evaluated state and national rounds for innovation.',
    metrics: [
      { value: 500, suffix: '+', label: 'Students Judged' },
      { value: 10, suffix: '', label: 'Top Finalists' },
      { value: 3, suffix: '', label: 'Winners' },
    ],
    icon: Award,
    gradient: 'from-success/10 to-accent/10',
  },
  {
    title: 'SnapAR x Bharat XR',
    description: 'Long-term nationwide partnership with Snap. Conducting workshops, GenAI demonstrations, and curated hackathons.',
    metrics: [
      { value: 50, suffix: '+', label: 'Events' },
      { value: 3500, suffix: '+', label: 'Creators Trained' },
      { value: 15, suffix: '+', label: 'Cities Reached' },
    ],
    icon: Users,
    gradient: 'from-accent/10 to-success/10',
  },
];

export const SpotlightsSection = () => {
  return (
    <section className="py-8 md:py-12 bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionBadge icon={<Star size={14} />}>
              Featured Initiatives
            </SectionBadge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            ✨ Featured Spotlights
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
          >
            National-level hackathons, industry collaborations, and long-term ecosystem impact.
          </motion.p>
        </div>

        <div className="space-y-4">
          {spotlights.map((spotlight, index) => (
            <motion.div
              key={spotlight.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <HoverLift liftAmount={4}>
                <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
                  <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Placeholder */}
                    <div className={`h-40 md:h-auto bg-gradient-to-br ${spotlight.gradient} flex items-center justify-center ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                      <motion.div 
                        className="text-center p-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <spotlight.icon className="mx-auto h-12 w-12 md:h-16 md:w-16 text-accent mb-2" />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className={`p-4 md:p-6 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                      <h3 className="text-lg md:text-xl font-bold mb-2">
                        {spotlight.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {spotlight.description}
                      </p>

                      {/* Metrics */}
                      <div className="flex flex-wrap gap-4 pt-3 border-t border-border">
                        {spotlight.metrics.map((metric) => (
                          <div key={metric.label}>
                            <div className="text-lg md:text-xl font-bold text-accent">
                              <CountUp 
                                end={metric.value} 
                                prefix={metric.prefix || ''} 
                                suffix={metric.suffix} 
                                duration={2} 
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </HoverLift>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
