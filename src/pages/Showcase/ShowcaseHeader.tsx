import { motion, Variants } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Layers, Sparkles } from 'lucide-react';

// --- MASTER FRAMER VARIANTS ---
// FIX: Explicitly typed as 'Variants' to fix TS2322
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// FIX: Explicitly typed as 'Variants'
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -10,
    filter: 'blur(10px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      // FIX: Added 'as const' to satisfy Bezier Tuple requirement
      ease: [0.16, 1, 0.3, 1] as const
    },
  },
};

export const ShowcaseHeader = () => {
  return (
      <>
        <Header />

        {/* Light Mode: Transparent BG to let Global Texture show through */}
        <motion.section
            className="pt-32 pb-12 md:pt-40 md:pb-16 bg-transparent relative overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <div className="container-wide px-4 md:px-8 relative z-10">

            {/* --- TOP RAIL: SYSTEM BADGES --- */}
            <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 backdrop-blur-sm border border-slate-200">
                <Layers size={14} className="text-slate-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                 Global Repository
               </span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50/80 backdrop-blur-sm border border-orange-100">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B35] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6B35]"></span>
                </div>
                <span className="text-[10px] font-black text-[#FF6B35] uppercase tracking-widest">
                 Live Submissions
               </span>
              </div>
            </motion.div>

            {/* --- MAIN TYPOGRAPHY --- */}
            <div className="relative">
              <motion.h1
                  variants={itemVariants}
                  className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-6"
              >
                The Innovation <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FBBF24] to-[#FF6B35] animate-gradient-x">
                Showcase
              </span>
              </motion.h1>

              {/* Decorative Sparkle (Absolute Positioned) */}
              <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -top-8 right-0 md:right-[20%] text-[#FBBF24] opacity-50 hidden md:block"
              >
                <Sparkles size={64} strokeWidth={1} />
              </motion.div>
            </div>

            {/* --- SUBTEXT & STATS --- */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-8 border-l-2 border-slate-200 pl-6 md:pl-8">
              <motion.p
                  variants={itemVariants}
                  className="text-lg md:text-xl text-slate-500 font-medium max-w-xl leading-relaxed"
              >
                Explore a curated gallery of <span className="text-slate-900 font-bold">Real XR projects</span>, prototypes, and immersive experiences architected by the Bharat XR community.
              </motion.p>

              {/* Stats Rail */}
              <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-8"
              >
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">900+</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projects</span>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 tracking-tighter">600+</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Builders</span>
                </div>
              </motion.div>
            </div>

          </div>
        </motion.section>
      </>
  );
};