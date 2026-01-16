import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export const EventsHeader = () => {
  const { scrollY } = useScroll();

  // High-end physics for smooth "Veteran" layering
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Parallax Logic: Multi-speed layering for Bento-depth
  const yBg = useTransform(smoothY, [0, 500], [0, 150]);
  const yContent = useTransform(smoothY, [0, 500], [0, -50]);
  const opacity = useTransform(smoothY, [0, 300], [1, 0]);

  return (
      <section className="relative pt-32 pb-0 overflow-hidden bg-white">

        {/* --- LAYER 0: Original Calm Background (Multi-Layered) --- */}
        <div className="absolute inset-0 pointer-events-none select-none">
          {/* Original Orange/Yellow Spot */}
          <motion.div
              style={{ y: yBg, opacity }}
              className="absolute -top-10 -right-10 w-[550px] h-[550px] bg-gradient-to-br from-orange-400/10 to-yellow-300/10 rounded-full blur-[110px]"
          />
          {/* Original Blue/Green Spot (The Professional Touch) */}
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
            {/* Increased bottom margin to separate from description */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[48px] sm:text-7xl md:text-9xl font-black text-slate-900 tracking-tighter leading-[0.85] mb-8"
            >
              Explore <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-orange-500 to-[#10B981]">
                Future Realities
              </span>
            </motion.h1>

            {/* --- LAYER 2: Description (Tightened vertical spacing) --- */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="text-base md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-bold tracking-tight"
            >
              Join <span className="text-slate-900">India's largest XR community</span>. Discover hackathons and meetups designed to level up your skills in <span className="text-blue-500">AR, VR, and MR</span>.
            </motion.p>
          </motion.div>
        </div>

        {/* --- LAYER 3: Bento Spacing Rail (Ensures clean connection to filters) --- */}
        <div className="h-10 md:h-16 w-full" />
      </section>
  );
};