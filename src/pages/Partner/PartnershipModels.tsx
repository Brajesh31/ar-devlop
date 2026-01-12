import { motion } from 'framer-motion';
import { Building2, GraduationCap, Briefcase, Landmark, Check } from 'lucide-react';
import { useState } from 'react';

const partnershipModels = [
  {
    id: 'brand',
    icon: Building2,
    title: 'Brand Partnerships',
    description: 'Collaborate on campaigns, product adoption, and XR showcases that reach our engaged community.',
    outcomes: [
      'Brand visibility across events',
      'Product integration in hackathons',
      'Co-branded XR experiences',
      'Access to XR talent pool',
    ],
  },
  {
    id: 'college',
    icon: GraduationCap,
    title: 'College & University',
    description: 'Bring XR education to your campus through workshops, curriculum support, and student programs.',
    outcomes: [
      'On-campus XR workshops',
      'Faculty training programs',
      'Student hackathon participation',
      'Curriculum consultation',
    ],
  },
  {
    id: 'industry',
    icon: Briefcase,
    title: 'Industry Collaborations',
    description: 'Partner on hackathons, hiring initiatives, and innovation challenges that solve real problems.',
    outcomes: [
      'Custom hackathon challenges',
      'Access to vetted XR developers',
      'Innovation lab partnerships',
      'R&D collaborations',
    ],
  },
  {
    id: 'government',
    icon: Landmark,
    title: 'Government & Institutions',
    description: 'Work together on national programs, skilling initiatives, and public technology adoption.',
    outcomes: [
      'Large-scale skilling programs',
      'Policy consultation',
      'Public awareness campaigns',
      'Digital India initiatives',
    ],
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

export const PartnershipModels = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <section className="py-12 md:py-16 bg-background relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Decorative orbs */}
      <motion.div
        className="absolute top-20 left-[5%] w-48 h-48 rounded-full bg-accent/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-[10%] w-40 h-40 rounded-full bg-success/10 blur-[80px]"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 6, repeat: Infinity }}
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
              Partnership Models
            </span>
          </motion.div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
            How We Can Work Together
          </h2>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          {partnershipModels.map((model) => (
            <motion.div
              key={model.id}
              variants={itemVariants}
              onMouseEnter={() => setHoveredCard(model.id)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ 
                y: -5, 
                boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
              }}
              className="group relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-5 md:p-6 transition-all duration-300 hover:border-accent/40"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/5 to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Header */}
              <div className="flex items-start gap-4 mb-4 relative z-10">
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 group-hover:bg-accent transition-colors duration-300"
                  whileHover={{ rotate: 10, scale: 1.05 }}
                >
                  <model.icon className="w-6 h-6 text-accent group-hover:text-accent-foreground transition-colors duration-300" strokeWidth={1.5} />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-foreground text-lg md:text-xl">
                    {model.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                    {model.description}
                  </p>
                </div>
              </div>
              
              {/* Outcomes with staggered reveal on hover */}
              <div className="space-y-2 pl-16 relative z-10">
                {model.outcomes.map((outcome, idx) => (
                  <motion.div 
                    key={outcome} 
                    className="flex items-start gap-2"
                    initial={{ opacity: 0.7, x: 0 }}
                    animate={{ 
                      opacity: hoveredCard === model.id ? 1 : 0.7,
                      x: hoveredCard === model.id ? 5 : 0,
                    }}
                    transition={{ delay: idx * 0.05, duration: 0.2 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: hoveredCard === model.id ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                    </motion.div>
                    <span className="text-sm text-foreground/80">{outcome}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
