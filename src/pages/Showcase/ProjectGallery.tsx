// FIX: Imported 'Variants'
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShowcaseProject } from '@/data/showcase';
import { ProjectCard } from './ProjectCard';
import { SearchX, Layers } from 'lucide-react';

interface ProjectGalleryProps {
  projects: ShowcaseProject[];
  onViewDetails?: (project: ShowcaseProject) => void;
}

// --- MASTER "BUTTER-SMOOTH" VARIANTS ---
// FIX: Explicitly typed as 'Variants'
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// FIX: Explicitly typed as 'Variants'
const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    filter: 'blur(5px)'
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      // FIX: Added 'as const' to satisfy the Bezier Tuple requirement
      ease: [0.16, 1, 0.3, 1] as const
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: 'blur(10px)',
    transition: { duration: 0.3 }
  }
};

export const ProjectGallery = ({ projects, onViewDetails }: ProjectGalleryProps) => {
  // --- EMPTY STATE: SYSTEM NULL ---
  if (projects.length === 0) {
    return (
        <motion.section
            className="py-12 bg-transparent min-h-[40vh] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
          <div className="container-wide">
            <div className="flex flex-col items-center justify-center text-center">

              {/* Holographic Icon Container */}
              <div className="relative w-24 h-24 mb-6 group">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-100 rounded-[24px] rotate-6 group-hover:rotate-12 transition-transform duration-500" />
                <div className="absolute inset-0 bg-white rounded-[24px] border border-slate-100 shadow-xl flex items-center justify-center">
                  <SearchX size={40} className="text-slate-300" />
                </div>
                {/* Floating Orbit */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-4 border border-dashed border-slate-200 rounded-full pointer-events-none"
                />
              </div>

              <motion.h3
                  className="text-2xl font-black text-slate-900 tracking-tight mb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
              >
                Data Not Found
              </motion.h3>

              <motion.p
                  className="text-slate-500 font-medium max-w-xs mx-auto"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
              >
                The requested parameters returned zero results. Adjust your filters to re-calibrate.
              </motion.p>

            </div>
          </div>
        </motion.section>
    );
  }

  // --- MAIN GRID: DATA MATRIX ---
  return (
      <section className="py-4 bg-transparent min-h-[50vh]">
        <div className="container-wide px-4 md:px-8">

          {/* Total Count Indicator */}
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-6"
          >
            <div className="p-1.5 rounded-md bg-slate-100 text-slate-500">
              <Layers size={14} />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {projects.length} {projects.length === 1 ? 'Entry' : 'Entries'} Loaded
          </span>
          </motion.div>

          <motion.div
              layout // Enables automatic layout animations when items change
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 perspective-1000"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {projects.map((project) => (
                  <motion.div
                      layout // Smooth position shuffling
                      key={project.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full"
                  >
                    <ProjectCard
                        project={project}
                        onViewDetails={onViewDetails}
                    />
                  </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
  );
};