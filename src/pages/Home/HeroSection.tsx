import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';

// --- Local Safety Components ---

const SimpleCountUp = ({ end, suffix = '', label }: { end: number, suffix: string, label: string }) => {
  const [count, setCount] = useState(0);

  // FIX 1: Explicitly typed the ref for TypeScript to avoid "never" type errors
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let animationFrameId: number;
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);

        setCount(Math.floor(easeOut * end));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      // FIX 2: Cleanup function prevents memory leaks/errors if user leaves page during animation
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isInView, end]);

  return (
      <div ref={ref} className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-center items-center text-center">
        <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-accent mb-2">
          {count.toLocaleString()}{suffix}
        </div>
        <div className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium">
          {label}
        </div>
      </div>
  );
};

// --- Main Hero Section ---

const stats = [
  { value: 90, suffix: 'K+', label: 'Students Taught' },
  { value: 500, suffix: '+', label: 'Campus Impacted' },
  { value: 50, suffix: '+', label: 'AR/VR Events Hosted' },
  { value: 400, suffix: '+', label: 'Workshops Delivered' },
];

const partners = [
  'Snap AR',
  'Ministry of I&B',
  'Google for Developers',
  'NSDC',
  'WAVES',
  'IndiaSkills',
  'Skill India',
];

// ANIMATIONS
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      // FIX 3: Added 'as const' here.
      // This solves "Type number[] is not assignable to type Easing"
      ease: [0.22, 1, 0.36, 1] as const
    },
  },
};

export const HeroSection = () => {
  return (
      <section className="flex flex-col">

        {/* --- TOP SECTION: Image + Main Content --- */}
        <div className="relative w-full h-full min-h-[85vh] flex flex-col justify-start overflow-hidden pb-24 pt-24 md:pt-32">

          {/* 1. Background Image */}
          <div className="absolute inset-0 z-0">
            <img
                src="/herohome/hero.jpg"
                alt="Bharat XR Community"
                className="w-full h-full object-cover"
                loading="eager"
                // FIX 4: React types workaround for fetchPriority
                fetchPriority="high"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-background/80" />
          </div>

          {/* Decorative Elements */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.5 }}
                className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-accent/10 blur-3xl opacity-50"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full bg-success/10 blur-3xl opacity-50"
            />
          </div>

          {/* Hero Content Wrapper */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center px-4 sm:px-6">
            <motion.div variants={itemVariants} className="mb-6">
            <span className="px-4 py-2 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm md:text-base font-semibold tracking-wide uppercase">
              Pioneering Extended Reality in India
            </span>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto"
            >
              <motion.h1
                  variants={itemVariants}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight mb-8 md:mb-10 text-foreground drop-shadow-sm"
              >
                India's Leading
                <br />
                <span className="text-accent relative inline-block">
                AR/VR
              </span> Community &
                <br />
                Innovation Partner
              </motion.h1>

              <motion.p
                  variants={itemVariants}
                  className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto font-medium leading-relaxed"
              >
                Build, Learn & Grow with XR — From Hands-on Workshops to National Hackathons.
                Join the revolution shaping the future of spatial computing.
              </motion.p>

              <motion.div variants={itemVariants} className="flex justify-center">
                {/* WHATSAPP LINK + GREEN HOVER BUTTON */}
                <a
                    href="https://chat.whatsapp.com/KHK6hBPxfITDAKn00cRJT5"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                  <div className="group relative rounded-full overflow-hidden shadow-lg shadow-accent/25 bg-accent">

                    {/* The Green Fill Layer (Swipes from left) */}
                    <div className="absolute inset-0 bg-green-600 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />

                    <Button
                        size="lg"
                        className="relative z-10 bg-transparent hover:bg-transparent text-accent-foreground gap-2 text-base px-8 py-6 h-auto font-bold transition-colors duration-300 group-hover:text-white border-0"
                    >
                    <span className="relative z-10 flex items-center gap-2">
                      Join Bharat XR
                      <ArrowRight size={20} />
                    </span>
                    </Button>
                  </div>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Stats & Partners --- */}
        <div className="w-full bg-background relative z-10">

          {/* Stats Grid */}
          <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="w-full max-w-7xl px-4 mx-auto -mt-12 mb-4 relative z-20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                  <SimpleCountUp
                      key={stat.label}
                      end={stat.value}
                      suffix={stat.suffix}
                      label={stat.label}
                  />
              ))}
            </div>
          </motion.div>

          {/* Trust Section */}
          <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="py-4 px-0 border-t border-transparent"
          >
            <div className="w-full">
              <p className="text-center text-lg md:text-xl font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                Trusted by the Best
              </p>

              {/* Marquee */}
              <div className="relative flex overflow-hidden w-full group">
                <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

                <motion.div
                    className="flex gap-8 md:gap-12 min-w-full"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                      duration: 30,
                      ease: "linear",
                      repeat: Infinity
                    }}
                >
                  {[...partners, ...partners, ...partners].map((partner, index) => (
                      <div
                          key={`${partner}-${index}`}
                          className="relative flex items-center justify-center h-24 w-40 md:h-28 md:w-52 px-2 shrink-0 rounded-xl overflow-hidden bg-transparent border border-transparent group/logo"
                      >
                        <motion.img
                            // FIX 5: Safer file path generation for spaces in names
                            src={`/trust/${encodeURIComponent(partner)}.png`}
                            alt={partner}
                            className="h-16 md:h-20 w-auto object-contain opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform group-hover/logo:scale-110"
                        />
                      </div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
  );
};