import { motion } from 'framer-motion';
import { Building2, GraduationCap, Landmark } from 'lucide-react';

const audiences = [
  {
    icon: Building2,
    title: 'Brands & Startups',
    description: 'Reach tech-savvy audiences, run XR campaigns, or build talent pipelines.',
  },
  {
    icon: GraduationCap,
    title: 'Colleges & Universities',
    description: 'Bring XR education to campus, train faculty, or engage students in hackathons.',
  },
  {
    icon: Landmark,
    title: 'Institutions & Policy',
    description: 'Large-scale skilling programs, research collaborations, or public awareness.',
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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring' as const, stiffness: 100, damping: 15 },
  },
};

export const WhoShouldReach = () => {
  return (
    <section className="py-10 md:py-12 bg-background relative overflow-hidden">
      {/* Subtle decorative elements */}
      <motion.div
        className="absolute top-10 right-[20%] w-2 h-2 rounded-full bg-accent/30"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 left-[15%] w-3 h-3 rounded-full bg-success/20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              Is This Right for You?
            </span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Partnerships We're Looking For
          </h2>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {audiences.map((audience) => (
            <motion.div
              key={audience.title}
              variants={itemVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 15px 30px rgba(0,0,0,0.06)',
                borderColor: 'hsl(var(--accent) / 0.3)'
              }}
              className="group flex items-start gap-4 p-5 bg-card/80 backdrop-blur-sm border border-border rounded-2xl transition-all duration-300"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              
              <motion.div 
                className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors duration-300"
                whileHover={{ rotate: 10, scale: 1.05 }}
              >
                <audience.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors duration-300" strokeWidth={1.5} />
              </motion.div>
              <div>
                <h3 className="font-semibold text-foreground mb-1 text-lg">
                  {audience.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {audience.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
