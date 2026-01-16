import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, Variants } from 'framer-motion';
import { getFeaturedProjects, ShowcaseProject } from '@/data/showcase';
import { ProjectCard } from './ProjectCard';

interface FeaturedProjectsProps {
  onViewDetails?: (project: ShowcaseProject) => void;
}

// --- MASTER "BUTTER-SMOOTH" VARIANTS ---
// FIX 1: Explicitly type 'Variants' to prevent index signature errors
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const card3DVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: 'blur(8px)',
    rotateX: 3
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    rotateX: 0,
    transition: {
      duration: 0.8,
      // FIX 2: Use 'as const' to tell TS this is a Bezier tuple, not a generic number[]
      ease: [0.16, 1, 0.3, 1] as const
    },
  },
};

export const FeaturedProjects = ({ onViewDetails }: FeaturedProjectsProps) => {
  // --- 1. HOOKS FIRST (Always execute hooks before returns) ---
  const containerRef = useRef<HTMLDivElement>(null);

  // High-Performance Scroll Physics
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // "Shock Absorber" Physics
  const smoothY = useSpring(scrollYProgress, {
    damping: 20,
    stiffness: 100,
    mass: 0.5,
    restDelta: 0.001
  });

  // Optimized Transforms
  const yBg = useTransform(smoothY, [0, 1], [0, -80]);
  // Note: 'rotateMesh' was unused in your JSX, so I removed it to prevent lint warnings.
  const ySecondary = useTransform(smoothY, [0, 1], [0, 60]);

  // --- 2. DATA FETCHING ---
  const featured = getFeaturedProjects();

  // --- 3. CONDITIONAL RENDER (Only SAFE after hooks) ---
  if (featured.length === 0) return null;

  return (
      <section ref={containerRef} className="relative py-8 md:py-12 overflow-hidden bg-slate-50 perspective-2000 transform-gpu">

        {/* --- LAYER 0: OPTIMIZED HOLOGRAPHIC MESH --- */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          {/* Static Noise */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

          {/* Ambient Solar Flares - GPU Accelerated */}
          <motion.div
              style={{ y: yBg }}
              className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[#FF6B35]/10 via-[#FBBF24]/10 to-transparent rounded-full blur-[80px] will-change-transform"
          />
          <motion.div
              style={{ y: ySecondary }}
              className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#FBBF24]/15 via-[#FF6B35]/5 to-transparent rounded-full blur-[70px] will-change-transform"
          />
        </div>

        <div className="container-wide relative z-10 px-4 md:px-8">

          {/* --- LAYER 1: HEADER --- */}
          <motion.div
              initial={{ opacity: 0, x: -40, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: "-50px" }}
              // FIX 3: Added 'as const' here too for safety
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
              className="mb-8 max-w-4xl"
          >
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.85]">
              Hall of <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] via-[#FF6B35] to-[#FBBF24] bg-[length:200%_auto] animate-gradient-x">
              Fame
            </span>
            </h2>
          </motion.div>

          {/* --- LAYER 2: 3D PRISM GRID --- */}
          <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 perspective-1000"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
          >
            {featured.slice(0, 3).map((project, index) => (
                <motion.div
                    key={project.id}
                    variants={card3DVariants}
                    whileHover={{
                      y: -10,
                      rotateX: 2,
                      rotateY: 2,
                      transition: { type: "spring", stiffness: 150, damping: 15 }
                    }}
                    className="relative group h-full preserve-3d will-change-transform"
                >
                  {/* Floating Rank Badge */}
                  <div className="absolute -top-4 -right-4 z-30 transform-gpu group-hover:translate-y-[-5px] transition-transform duration-500">
                    <div className="w-12 h-12 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center shadow-xl group-hover:shadow-[#FBBF24]/30 transition-shadow">
                      <span className="text-base font-black text-slate-900 italic">#{index + 1}</span>
                    </div>
                  </div>

                  {/* Refractive Colored Shadow */}
                  <div className="absolute inset-4 bg-gradient-to-br from-[#FBBF24] to-[#FF6B35] blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 transform translate-y-2 will-change-transform" />

                  {/* Card Container */}
                  <div className="relative h-full rounded-[30px] overflow-hidden bg-white border border-slate-200 group-hover:border-transparent transition-colors duration-500 shadow-lg group-hover:shadow-xl">

                    {/* Internal Prism Border */}
                    <div className="absolute inset-0 p-[2px] rounded-[30px] bg-gradient-to-br from-[#FBBF24] via-[#FF6B35] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="w-full h-full bg-white rounded-[28px]" />
                    </div>

                    {/* Holographic Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none z-20" />

                    <div className="relative z-10 h-full">
                      <ProjectCard
                          project={project}
                          featured
                          onViewDetails={onViewDetails}
                      />
                    </div>
                  </div>
                </motion.div>
            ))}
          </motion.div>

          {/* --- LAYER 3: DIVIDER LINE --- */}
          <div className="flex justify-center mt-12">
            <motion.div
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: "100%", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
                className="h-[1px] max-w-2xl bg-gradient-to-r from-transparent via-slate-200 to-transparent"
            />
          </div>
        </div>
      </section>
  );
};