import { motion } from 'framer-motion';
import { FloatingShapes, DotPattern, GradientOrb } from '@/components/ui/DecorativeElements';
import { contactIntentCards } from '@/data/contact';
import { Headphones, Users, Handshake, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ElementType> = {
  specialist: Headphones,
  campus: Users,
  partnership: Handshake,
  enterprise: Building2
};

const ContactHero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, delay: 0.3 + i * 0.1 }
    })
  };

  return (
    <section className="relative pt-20 pb-6 bg-gradient-to-b from-muted/50 via-background to-background overflow-hidden">
      {/* Background decorative elements */}
      <DotPattern />
      <FloatingShapes />
      <GradientOrb className="-top-20 -right-20 opacity-10" size={400} colors={['accent', 'success']} />
      <GradientOrb className="top-1/2 -left-32 opacity-10" size={300} colors={['success', 'accent']} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Text */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
              We're here to help
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight"
          >
            Get in{' '}
            <span className="relative inline-block">
              <span className="text-accent">Touch</span>
              <motion.span 
                className="absolute -bottom-1 left-0 h-1 bg-accent/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
            </span>
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            Whether you're curious about our initiatives, want to explore partnerships, 
            or need guidance on XR programs—we're ready to help.
          </motion.p>
        </motion.div>

        {/* Intent Cards - Integrated */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl shadow-accent/5 p-6 md:p-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {contactIntentCards.map((card, index) => {
                const Icon = iconMap[card.id] || Headphones;
                const isLink = card.action === 'link' && card.href;

                const cardContent = (
                  <motion.div 
                    className="group relative p-5 rounded-xl bg-gradient-to-br from-muted/50 to-transparent border border-transparent hover:border-accent/20 hover:from-accent/5 hover:to-transparent transition-all duration-300"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  >
                    {/* Icon with glow effect */}
                    <div className="relative mb-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div className="absolute inset-0 w-10 h-10 rounded-lg bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                      {card.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {card.description}
                    </p>
                    
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      {card.cta.replace(' →', '')}
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.div>
                );

                if (isLink) {
                  return (
                    <Link key={card.id} to={card.href!} className="block">
                      {cardContent}
                    </Link>
                  );
                }

                return (
                  <button
                    key={card.id}
                    onClick={scrollToForm}
                    className="block text-left w-full"
                  >
                    {cardContent}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
