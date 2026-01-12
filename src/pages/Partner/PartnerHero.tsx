import { Header } from '@/components/layout/Header';
import { motion } from 'framer-motion';
import { ArrowRight, Users, MapPin, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const heroStats = [
  { icon: Users, value: '50K+', label: 'Students Reached' },
  { icon: MapPin, value: '25+', label: 'Cities Covered' },
  { icon: Calendar, value: '100+', label: 'Programs Delivered' },
  { icon: Trophy, value: '10K+', label: 'Creators Trained' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
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

export const PartnerHero = () => {
  const scrollToForm = () => {
    document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header />
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-accent/5 via-background to-success/5">
        {/* Animated Gradient Orbs */}
        <motion.div
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-accent/15 blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-success/10 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-[150px]"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Floating Dots Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating Decorative Elements */}
        <motion.div
          className="absolute top-32 right-[20%] w-3 h-3 rounded-full bg-accent/50"
          animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-48 left-[15%] w-2 h-2 rounded-full bg-success/60"
          animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 left-[25%] w-4 h-4 rounded-full bg-accent/30"
          animate={{ y: [0, 15, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-60 right-[30%] w-2 h-2 rotate-45 bg-success/40"
          animate={{ rotate: [45, 90, 45], scale: [1, 1.2, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Content */}
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-16 relative z-10 py-16 md:py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-6">
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="w-2 h-2 rounded-full bg-accent"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-sm font-medium text-accent tracking-wide">
                  Strategic Partnerships
                </span>
              </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]"
            >
              Let's Shape the Future of{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/70">
                XR
              </span>{' '}
              —{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-success/70">
                Together
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            >
              Partner with India's largest XR community to unlock new opportunities, 
              reach passionate creators, and drive real impact through immersive technology.
            </motion.p>

            {/* CTA Button */}
            <motion.div variants={itemVariants}>
              <Button
                size="lg"
                onClick={scrollToForm}
                className="group bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg rounded-full shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300"
              >
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center"
                >
                  Start a Partnership
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </motion.span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 md:mt-16"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {heroStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -5, scale: 1.02, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}
                  className="group relative bg-card/80 backdrop-blur-md border border-border rounded-2xl p-4 md:p-5 hover:border-accent/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.div 
                      className="p-2 rounded-xl bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                    </motion.div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                  
                  {/* Subtle gradient border on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-success/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Curve Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0 80L60 73.3C120 66.7 240 53.3 360 46.7C480 40 600 40 720 43.3C840 46.7 960 53.3 1080 56.7C1200 60 1320 60 1380 60L1440 60V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z"
              fill="hsl(var(--secondary))"
              fillOpacity="0.3"
            />
          </svg>
        </div>
      </section>
    </>
  );
};
