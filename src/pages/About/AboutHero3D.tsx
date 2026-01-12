import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, Suspense, lazy } from 'react';
import { ChevronDown } from 'lucide-react';

const FloatingShapes3D = lazy(() => import('@/components/3d/FloatingShapes3D').then(m => ({ default: m.FloatingShapes3D })));

export const AboutHero3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const words = "Building India's XR Future Together".split(' ');

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
    >
      {/* Animated gradient mesh background - using accent/success colors */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-accent/15 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-success/15 via-transparent to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* 3D Floating shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <Suspense fallback={<div className="w-full h-full" />}>
          <FloatingShapes3D className="w-full h-full opacity-60" />
        </Suspense>
      </div>

      {/* Parallax layers */}
      <motion.div 
        style={{ y, opacity, scale }}
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
      >
        {/* Badge - using accent color */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-sm font-medium text-accent">90,000+ XR Enthusiasts</span>
        </motion.div>

        {/* Main heading with word-by-word animation */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.4 + index * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="inline-block mr-4"
            >
              {word === "XR" ? (
                <span className="bg-gradient-to-r from-accent via-success to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                  {word}
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          India's largest community empowering students, creators, and innovators 
          with Augmented Reality, Virtual Reality, and Mixed Reality technologies.
        </motion.p>

        {/* Stats row - using accent color */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { value: '90,000+', label: 'Community Members' },
            { value: '500+', label: 'Partner Colleges' },
            { value: '100+', label: 'Events Organized' },
            { value: '50+', label: 'Hackathons' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-accent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-sm">Scroll to explore</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};