// src/pages/showcase/ShowcaseCTA.tsx
import { Link } from 'react-router-dom';
// FIX: Import 'Variants' for strict typing
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {  Rocket, Calendar, Zap, Sparkles, PlusCircle } from 'lucide-react';

// --- MASTER FRAMER VARIANTS ---
// FIX: Explicitly typed as 'Variants'
const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      // FIX: Added 'as const' to satisfy Bezier Tuple requirement
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

// FIX: Explicitly typed as 'Variants' to allow string literals for easing
const floatingVariant: Variants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const ShowcaseCTA = () => {
  return (
      // LIGHT MODE CONTEXT: Transparent bg to let page texture show through
      <section className="relative py-12 bg-transparent">
        <div className="container-wide px-4 md:px-8">

          <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="relative rounded-[40px] overflow-hidden isolate shadow-2xl shadow-orange-500/5"
          >
            {/* --- LAYER 0: SOLAR GLASS BACKGROUND (Light Mode) --- */}
            <div className="absolute inset-0 bg-white">
              {/* Base Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-blue-50 opacity-80" />

              {/* Animated Solar Mesh */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0%_0%,#FF6B35_0%,transparent_50%)]" />
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_100%_100%,#FBBF24_0%,transparent_50%)]" />

              {/* Refractive Noise */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />
            </div>

            {/* --- LAYER 1: PRISM BORDER --- */}
            <div className="absolute inset-0 p-[1px] rounded-[40px] bg-gradient-to-br from-orange-200 via-transparent to-blue-200 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/50 to-transparent opacity-50 blur-sm" />
            </div>

            {/* --- LAYER 2: CONTENT MATRIX --- */}
            <div className="relative z-10 px-6 py-16 md:py-20 flex flex-col items-center text-center">

              {/* Floating Solar Icon */}
              <motion.div
                  variants={floatingVariant}
                  animate="animate"
                  className="mb-8 relative"
              >
                {/* Icon Glow */}
                <div className="absolute inset-0 bg-[#FBBF24] blur-xl opacity-20" />
                <div className="relative w-20 h-20 bg-white border border-orange-100 rounded-3xl flex items-center justify-center text-[#FF6B35] shadow-[0_10px_40px_-10px_rgba(255,107,53,0.2)]">
                  <Zap size={40} fill="currentColor" />
                </div>
              </motion.div>

              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6">
                Ready to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] via-[#FBBF24] to-[#FF6B35] animate-gradient-x">
                Build Reality?
              </span>
              </h2>

              <p className="text-lg md:text-xl text-slate-500 font-medium max-w-xl mb-10 leading-relaxed">
                Join the ecosystem. Participate in hackathons, attend events, or <span className="text-slate-900 font-bold">submit your own lens</span> to the Prime Selection.
              </p>

              {/* Action Matrix (3 Buttons) */}
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center max-w-3xl mx-auto">

                {/* 1. Launch Button (Primary) */}
                <Link to="/hackathons" className="flex-1">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-[#3B82F6] text-white text-sm font-black uppercase tracking-widest shadow-xl transition-all duration-300 group">
                      <Rocket className="w-4 h-4 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      Join Hackathon
                    </Button>
                  </motion.div>
                </Link>

                {/* 2. Submit Project (Featured Action) */}
                <Link to="/submit-project" className="flex-1">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FBBF24] hover:shadow-[0_0_30px_-5px_#FBBF24] text-white text-sm font-black uppercase tracking-widest border-none shadow-lg transition-all duration-300 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                      <span className="relative flex items-center justify-center">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Submit Lens
                    </span>
                    </Button>
                  </motion.div>
                </Link>

                {/* 3. Events (Secondary) */}
                <Link to="/events" className="flex-1">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="outline" className="w-full h-14 rounded-2xl border-slate-200 bg-white text-slate-600 hover:text-[#FF6B35] hover:border-orange-200 text-sm font-black uppercase tracking-widest transition-all duration-300 group">
                      <Calendar className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                      Events
                    </Button>
                  </motion.div>
                </Link>
              </div>

              {/* Micro-Interaction Footer */}
              <div className="mt-8 flex items-center gap-2 opacity-60">
                <Sparkles size={12} className="text-[#FF6B35]" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                 Submissions Reviewed in 24h
               </span>
                <Sparkles size={12} className="text-[#FF6B35]" />
              </div>

            </div>
          </motion.div>
        </div>
      </section>
  );
};