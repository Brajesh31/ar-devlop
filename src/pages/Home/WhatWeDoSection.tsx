import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { Button } from '@/components/ui/button';
import { HoverLift, HoverScale } from '@/components/ui/MicroInteractions';
import { Brain, ArrowRight, Check, Zap, Users, Building, Trophy } from 'lucide-react';

const collaborationPoints = [
  'Custom Workshops',
  'Hackathon Support',
  'Co-Branded Events',
  'Brand Partnerships',
];

const activities = [
  {
    icon: Zap,
    title: 'Workshops & Training',
    description: 'Hands-on learning with SnapAR, WebAR, Unity, and real-time XR projects.',
  },
  {
    icon: Trophy,
    title: 'Hackathons & Challenges',
    description: 'Short-format competitions with mentorship and industry evaluation.',
  },
  {
    icon: Users,
    title: 'Community Events',
    description: 'Meetups and speaker sessions in partnership with Google and Snap.',
  },
  {
    icon: Building,
    title: 'Brand & Campus Partnerships',
    description: 'Curated XR programs for universities and organizations.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export const WhatWeDoSection = () => {
  return (
    <section className="py-8 md:py-12 bg-background">
      <div className="container-wide">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <SectionBadge icon={<Brain size={14} />}>
              What We Do
            </SectionBadge>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-2xl sm:text-3xl md:text-4xl font-bold"
          >
            🧠 Learn, Build, Grow — with{' '}
            <span className="text-accent">X</span>
            <span className="text-success">R</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-3 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto"
          >
            Bharat XR builds, not just talks. We deliver hands-on, high-impact experiences 
            for students, developers, brands, and institutions.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-4 md:gap-6">
          {/* Collaboration Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <HoverLift liftAmount={4}>
              <div className="h-full bg-card rounded-xl p-5 md:p-6 border border-border shadow-sm">
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-bold mb-1">
                    ✨ Have an idea or initiative?
                  </h3>
                  <p className="text-base font-semibold text-accent mb-4">
                    Let's collaborate!
                  </p>

                  <ul className="space-y-2 mb-6 flex-1">
                    {collaborationPoints.map((point, index) => (
                      <motion.li 
                        key={point} 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <div className="p-1 rounded-full bg-success/10">
                          <Check size={12} className="text-success" />
                        </div>
                        <span className="text-sm font-medium">{point}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Link to="/contact">
                    <HoverScale scale={1.02}>
                      <Button className="w-full rounded-full bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
                        Contact Us
                        <ArrowRight size={16} />
                      </Button>
                    </HoverScale>
                  </Link>
                </div>
              </div>
            </HoverLift>
          </motion.div>

          {/* Activities Grid */}
          <motion.div 
            className="lg:col-span-3 grid sm:grid-cols-2 gap-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.title}
                variants={itemVariants}
              >
                <HoverLift liftAmount={3}>
                  <div className="h-full bg-secondary/50 rounded-lg p-4 border border-border/50">
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="p-2 rounded-lg bg-primary inline-block text-primary-foreground mb-2"
                    >
                      <activity.icon size={16} />
                    </motion.div>
                    <h4 className="font-semibold mb-1 text-sm">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </HoverLift>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
