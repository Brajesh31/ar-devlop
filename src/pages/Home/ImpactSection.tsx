import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { AnimatedContainer, AnimatedItem } from '@/components/ui/AnimatedSection';
import { HoverLift, CountUp } from '@/components/ui/MicroInteractions';
import { BarChart3, Users, Sparkles, MapPin, Building2 } from 'lucide-react';

const impactCards = [
  {
    icon: Building2,
    title: 'Partners',
    subtitle: 'SnapAR, Google, IIT Roorkee, Ministry of Information & Broadcasting',
    description: 'Strong industry backing, academic partnerships, government collaboration, and grassroots reach across India.',
    isWide: true,
  },
  {
    icon: Users,
    value: 90000,
    label: 'Students Trained',
    description: 'Through workshops, bootcamps, challenges, and hands-on XR learning experiences.',
  },
  {
    icon: Sparkles,
    value: 4000,
    label: 'AR Effects Published',
    description: 'From viral AR effects to branded campaigns with real-world impact.',
  },
  {
    icon: BarChart3,
    value: 50,
    label: 'AR/VR Events Hosted',
    description: 'On-ground workshops, hackathons, and knowledge-sharing sessions.',
  },
  {
    icon: MapPin,
    value: 500,
    label: 'Colleges Reached',
    description: 'Nationwide reach from tier-1 to tier-2 colleges across India.',
  },
];

export const ImpactSection = () => {
  return (
    <section className="py-8 md:py-12 bg-secondary/30">
      <div className="container-wide">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionBadge icon={<BarChart3 size={14} />}>
              Impact & Numbers
            </SectionBadge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            Real Work. Real Numbers.
          </motion.h2>
        </div>

        <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {impactCards.map((card, index) => (
            <AnimatedItem
              key={card.label || card.title}
              className={card.isWide ? 'md:col-span-2 lg:col-span-4' : ''}
              direction={index % 2 === 0 ? 'left' : 'right'}
            >
              <HoverLift liftAmount={4}>
                <div className="h-full bg-card rounded-xl p-4 md:p-6 border border-border shadow-sm">
                  <div className="flex items-start gap-3">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className="p-2.5 rounded-lg bg-primary text-primary-foreground flex-shrink-0"
                    >
                      <card.icon size={18} />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      {card.value ? (
                        <>
                          <div className="text-2xl md:text-3xl font-bold text-accent mb-0.5">
                            <CountUp end={card.value} suffix="+" duration={2} />
                          </div>
                          <div className="text-sm md:text-base font-semibold mb-1">{card.label}</div>
                        </>
                      ) : (
                        <>
                          <div className="text-sm md:text-base font-semibold mb-0.5">{card.title}</div>
                          <div className="text-xs text-accent mb-1 line-clamp-2">{card.subtitle}</div>
                        </>
                      )}
                      <p className="text-muted-foreground text-xs md:text-sm leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </div>
              </HoverLift>
            </AnimatedItem>
          ))}
        </AnimatedContainer>
      </div>
    </section>
  );
};
