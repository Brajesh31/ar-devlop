import { motion } from 'framer-motion';
import { Globe, Users, Shield, Rocket } from 'lucide-react';

const reasons = [
  {
    icon: Globe,
    title: 'Nationwide Reach',
    description: 'Access a pan-India network of XR enthusiasts, developers, and institutions across 25+ cities.',
    stats: { cities: '25+', reach: '50K+', events: '100+' },
  },
  {
    icon: Users,
    title: 'Hands-on Expertise',
    description: 'Work with a team that has delivered 100+ workshops, hackathons, and training programs.',
  },
  {
    icon: Shield,
    title: 'Institutional Trust',
    description: 'Leverage our established relationships with colleges, brands, and government bodies.',
  },
  {
    icon: Rocket,
    title: 'Proven Execution',
    description: 'Track record of successful events, measurable outcomes, and impactful collaborations.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
  },
};

export const WhyPartner = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/30 via-background to-background relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        className="absolute top-10 right-[10%] w-32 h-32 rounded-full bg-accent/10 blur-[80px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-[5%] w-40 h-40 rounded-full bg-success/10 blur-[100px]"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* Floating dots */}
      <motion.div
        className="absolute top-20 left-[20%] w-2 h-2 rounded-full bg-accent/40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 right-[25%] w-3 h-3 rounded-full bg-success/30"
        animate={{ y: [0, 15, 0], x: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Why Partner With Us
            </span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            Build With India's XR Community
          </h2>
        </motion.div>
        
        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                borderColor: 'hsl(var(--accent) / 0.3)'
              }}
              className={`group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 md:p-6 transition-all duration-300 ${
                index === 0 ? 'lg:row-span-2' : ''
              }`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/10 to-success/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
              
              {/* Icon */}
              <motion.div 
                className={`w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300 ${
                  index === 0 ? 'w-14 h-14' : ''
                }`}
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <reason.icon className={`text-accent group-hover:text-accent-foreground ${index === 0 ? 'w-7 h-7' : 'w-6 h-6'}`} strokeWidth={1.5} />
              </motion.div>
              
              {/* Content */}
              <h3 className={`font-semibold text-foreground mb-2 ${
                index === 0 ? 'text-xl md:text-2xl' : 'text-lg'
              }`}>
                {reason.title}
              </h3>
              <p className={`text-muted-foreground leading-relaxed ${
                index === 0 ? 'text-base' : 'text-sm'
              }`}>
                {reason.description}
              </p>
              
              {/* Featured card extra content */}
              {index === 0 && reason.stats && (
                <motion.div 
                  className="mt-6 pt-4 border-t border-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-4 text-sm">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <div className="text-xl font-bold text-accent">{reason.stats.cities}</div>
                      <div className="text-muted-foreground">Cities</div>
                    </motion.div>
                    <div className="w-px h-10 bg-border" />
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <div className="text-xl font-bold text-success">{reason.stats.reach}</div>
                      <div className="text-muted-foreground">Reach</div>
                    </motion.div>
                    <div className="w-px h-10 bg-border" />
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <div className="text-xl font-bold text-accent">{reason.stats.events}</div>
                      <div className="text-muted-foreground">Events</div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
