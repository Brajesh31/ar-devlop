import { useState, useMemo, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
// FIX: Import 'Variants' for strict typing
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { HackathonsHeader } from './HackathonsHeader';
import { HackathonFilterBar } from './HackathonFilterBar';
import { HackathonsGrid } from './HackathonsGrid';
import { NoHackathonsState } from './NoHackathonsState';
import {
  hackathons,
  getSortedHackathons,
  filterHackathons,
  HackathonMode,
  HackathonStatus,
  HackathonTeamSize,
  HackathonFee,
} from '@/data/hackathons';

// --- VETERAN DESIGNER MOTION VARIANTS ---
// FIX: Explicitly typed as 'Variants' to fix TS errors
const sectionRevealFromLeft: Variants = {
  hidden: { opacity: 0, x: -100, filter: 'blur(15px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      // FIX: Added 'as const' to satisfy Bezier Tuple requirement
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

// FIX: Explicitly typed as 'Variants'
const sectionRevealFromRight: Variants = {
  hidden: { opacity: 0, x: 100, filter: 'blur(15px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      // FIX: Added 'as const'
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const HackathonsPage = () => {
  const [selectedMode, setSelectedMode] = useState<HackathonMode | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<HackathonStatus | null>(null);
  const [selectedTeamSize, setSelectedTeamSize] = useState<HackathonTeamSize | null>(null);
  const [selectedFee, setSelectedFee] = useState<HackathonFee | null>(null);

  // --- 1. BUTTER-SMOOTH LENIS ENGINE ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const filteredHackathons = useMemo(() => {
    const filtered = filterHackathons(hackathons, {
      mode: selectedMode,
      status: selectedStatus,
      teamSize: selectedTeamSize,
      fee: selectedFee,
    });
    return getSortedHackathons(filtered);
  }, [selectedMode, selectedStatus, selectedTeamSize, selectedFee]);

  const handleReset = () => {
    setSelectedMode(null);
    setSelectedStatus(null);
    setSelectedTeamSize(null);
    setSelectedFee(null);
  };

  return (
      <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-600">
        {/* Guarding SEOHead in case config is undefined */}
        {seoConfig?.hackathons && <SEOHead {...seoConfig.hackathons} />}

        {/* --- LAYER 0: DEEP PARALLAX ORBS --- */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-orange-400/5 to-yellow-300/10 rounded-full blur-[120px]"
          />
          <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -40, 0],
                y: [0, -60, 0]
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-tr from-blue-400/5 to-emerald-300/10 rounded-full blur-[100px]"
          />
        </div>

        <Header />

        <main className="relative z-10">

          {/* --- SECTION 1: HEADER --- */}
          <HackathonsHeader />

          {/* --- SECTION 2: FILTER MATRIX --- */}
          <motion.section
              variants={sectionRevealFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="sticky top-[70px] z-[40] bg-white/60 backdrop-blur-2xl border-b border-slate-50"
          >
            <HackathonFilterBar
                selectedMode={selectedMode}
                selectedStatus={selectedStatus}
                selectedTeamSize={selectedTeamSize}
                selectedFee={selectedFee}
                onModeChange={setSelectedMode}
                onStatusChange={setSelectedStatus}
                onTeamSizeChange={setSelectedTeamSize}
                onFeeChange={setSelectedFee}
                onReset={handleReset}
            />
          </motion.section>

          {/* --- SECTION 3: CONTENT GRID --- */}
          <div className="relative min-h-[60vh]">
            <AnimatePresence mode="wait">
              {filteredHackathons.length > 0 ? (
                  <motion.div
                      key="grid"
                      variants={sectionRevealFromRight}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                  >
                    <HackathonsGrid hackathons={filteredHackathons} />
                  </motion.div>
              ) : (
                  <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      transition={{ duration: 0.8 }}
                  >
                    <NoHackathonsState onReset={handleReset} />
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default HackathonsPage;