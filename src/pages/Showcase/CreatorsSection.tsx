import { motion, Variants } from 'framer-motion';
// Assuming this path exists. If not, replace with a local mock interface/data.
import { showcaseCreators } from '@/data/showcase';
import { User, Sparkles, Zap } from 'lucide-react';

// --- TYPE DEFINITIONS ---
// Defined to prevent "implicitly has 'any' type" errors
interface Creator {
  id: string | number;
  name: string;
  role: string;
  bio: string;
  associatedProgram?: string; // marked optional based on usage
  projectCount?: number;
}

// --- MASTER FRAMER VARIANTS ---
// FIX: Explicitly typed as 'Variants' to fix the "incompatible index signature" error
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

// FIX: Explicitly typed as 'Variants' to fix the 'AnimationGeneratorType' error
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9,
    filter: 'blur(12px)',
    rotateX: 10
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      type: "spring", // Now correctly recognized as a literal
      stiffness: 100,
      damping: 20,
      mass: 1.2
    },
  },
};

export const CreatorsSection = () => {
  return (
      <section className="relative py-12 md:py-16 overflow-hidden bg-white">

        {/* --- LAYER 0: UNIFIED AMBIENT DEPTH --- */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <motion.div
              // OPTIMIZATION: 'will-change-transform' promotes this to a GPU layer
              // preventing main-thread layout thrashing during infinite animation.
              className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#FF6B35]/5 to-[#FBBF24]/10 rounded-full blur-[120px] will-change-transform"
              animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
              className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#3B82F6]/5 to-[#10B981]/10 rounded-full blur-[100px] will-change-transform"
              animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <div className="container-wide relative z-10 px-4 md:px-8">

          {/* --- LAYER 1: HEADER --- */}
          <motion.div
              initial={{ opacity: 0, x: -60, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-12 max-w-4xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-[2px] bg-gradient-to-r from-blue-500 to-transparent" />
              <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.3em]">
              System Architects
            </span>
            </div>

            <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
              The Minds <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FBBF24] to-[#10B981]">
              Behind Reality
            </span>
            </h2>
          </motion.div>

          {/* --- LAYER 2: BENTO PRISM GRID --- */}
          <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
          >
            {/* Cast showcaseCreators to Creator[] if needed, or assume data file is typed */}
            {(showcaseCreators as Creator[]).map((creator, i) => (
                <motion.div
                    key={creator.id}
                    variants={cardVariants}
                    whileHover={{ y: -16, scale: 1.02 }}
                    className="group relative h-full perspective-1000"
                >
                  {/* Refractive Prism Shadow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/20 via-[#FF6B35]/20 to-[#10B981]/20 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 will-change-transform" />

                  {/* Glass Plate Structure */}
                  <div className="relative h-full bg-white rounded-[40px] border border-slate-100 p-1.5 overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12)] transition-all duration-500">

                    {/* Internal Prism Border */}
                    <div className="absolute inset-0 rounded-[38px] border-2 border-transparent group-hover:border-blue-100/50 transition-colors duration-500" />

                    <div className="relative p-6 flex flex-col h-full bg-slate-50/30 rounded-[34px]">

                      {/* --- TOP RAIL: Tech Badge --- */}
                      <div className="flex justify-between items-start mb-6">
                        <div className="relative w-20 h-20">
                          <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                              className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#FF6B35] via-[#FBBF24] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 will-change-transform"
                          />
                          <div className="absolute inset-0.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <User className="w-8 h-8 text-slate-300 group-hover:text-[#FF6B35] transition-colors duration-300" />
                          </div>
                        </div>

                        <div className="px-3 py-1.5 rounded-full bg-white border border-slate-100 shadow-sm">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                        DEV_0{i + 1}
                      </span>
                        </div>
                      </div>

                      {/* --- MIDDLE RAIL: Identity --- */}
                      <div className="flex-grow space-y-2">
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-[#10B981] transition-all duration-300">
                          {creator.name}
                        </h3>

                        <div className="flex items-center gap-2">
                          <Zap size={12} className="text-[#FBBF24]" />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {creator.role}
                          </p>
                        </div>

                        <p className="text-sm text-slate-500 font-bold leading-relaxed pt-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          {creator.bio}
                        </p>
                      </div>

                      {/* --- BOTTOM RAIL: Stats & Status --- */}
                      {creator.associatedProgram && (
                          <div className="mt-6 pt-4 border-t border-slate-200/50 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 group/stat">
                              <Sparkles size={12} className="text-slate-300 group-hover/stat:text-[#FBBF24] transition-colors" />
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover/stat:text-slate-700 transition-colors">
                          {creator.projectCount} Builds
                        </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">
                          Active
                        </span>
                            </div>
                          </div>
                      )}

                      {/* Holographic Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </div>
                  </div>
                </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  );
};