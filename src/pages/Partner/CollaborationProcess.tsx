import { motion } from 'framer-motion';
import { Target, Palette, Rocket, BarChart3 } from 'lucide-react';

const steps = [
  {
    icon: Target,
    step: '01',
    title: 'Identify Goals',
    description: 'We understand your objectives, target audience, and desired outcomes.',
  },
  {
    icon: Palette,
    step: '02',
    title: 'Design Program',
    description: 'Together, we craft a tailored program that aligns with your goals.',
  },
  {
    icon: Rocket,
    step: '03',
    title: 'Execute Together',
    description: 'Our team handles end-to-end execution with regular updates.',
  },
  {
    icon: BarChart3,
    step: '04',
    title: 'Measure Impact',
    description: 'We provide detailed reports on outcomes and engagement.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
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

export const CollaborationProcess = () => {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-secondary/30 to-background relative overflow-hidden">
      {/* Subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 right-[15%] w-3 h-3 rounded-full bg-accent/40"
        animate={{ y: [0, -15, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 left-[10%] w-2 h-2 rounded-full bg-success/50"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
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
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border mb-4"
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
              How It Works
            </span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            A Simple, Transparent Process
          </h2>
        </motion.div>
        
        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="relative"
        >
          {/* Animated connecting line - desktop */}
          <motion.div 
            className="hidden lg:block absolute top-[60px] left-[80px] right-[80px] h-0.5 bg-gradient-to-r from-accent/20 via-accent/40 to-success/20"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ transformOrigin: 'left' }}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="relative"
              >
                {/* Step card */}
                <motion.div 
                  className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 h-full transition-all duration-300 hover:border-accent/40 hover:shadow-lg"
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                >
                  {/* Icon with step number */}
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center relative"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <step.icon className="w-5 h-5 text-accent" strokeWidth={1.5} />
                      
                      {/* Pulse animation */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-accent/30"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                      
                      {/* Connector dot on desktop */}
                      <div className="hidden lg:block absolute -bottom-[26px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-accent border-2 border-background" />
                    </motion.div>
                    <span className="text-2xl font-bold text-muted-foreground/20">
                      {step.step}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
                
                {/* Mobile connector line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-accent/30 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
