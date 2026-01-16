import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const HackathonsHeader = () => {
  const { scrollY } = useScroll();

  // High-end physics for smooth "Veteran" feel
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Parallax Logic: Multi-speed layering for Bento-depth
  const yBg = useTransform(smoothY, [0, 500], [0, 150]);
  const yContent = useTransform(smoothY, [0, 500], [0, -40]);
  const opacity = useTransform(smoothY, [0, 300], [1, 0]);

  return (
      <section className="relative pt-32 pb-4 overflow-hidden bg-white">

        {/* --- LAYER 0: Ambient Background (Calm & Balanced) --- */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <motion.div
              style={{ y: yBg, opacity }}
              className="absolute -top-10 -right-10 w-[550px] h-[550px] bg-gradient-to-br from-orange-400/10 to-yellow-300/10 rounded-full blur-[110px]"
          />
          <motion.div
              style={{ y: useTransform(smoothY, [0, 500], [0, 100]), opacity }}
              className="absolute top-10 left-[-120px] w-[450px] h-[450px] bg-gradient-to-tr from-blue-400/10 to-green-300/10 rounded-full blur-[90px]"
          />
        </div>

        <div className="container-wide relative z-10 px-4 md:px-8">
          <motion.div
              style={{ y: yContent }}
              className="flex flex-col max-w-5xl"
          >
            {/* --- LAYER 1: Main Typography (Symmetric & Powerful) --- */}
            {/* pt-32 ensures no collision with the navbar shown in your image */}
            <motion.h1
                initial={{ opacity: 0, x: -40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[48px] sm:text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-orange-500 to-[#10B981]">
              Hackathons
            </span>
            </motion.h1>

            {/* --- LAYER 2: Description (Minimized Spacing) --- */}
            <motion.div
                initial={{ opacity: 0, x: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-base md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-bold tracking-tight">
                Build, compete, and <span className="text-slate-900">showcase your skills</span>. Focus on innovation and real-world impact in <span className="text-blue-500">AR, VR, and MR</span>.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* --- LAYER 3: The "Min" Bottom Spacer --- */}
        {/* Reduced from h-16 to h-6 for minimal padding to the filter matrix */}
        <div className="h-6 md:h-8 w-full" />
      </section>
  );
};