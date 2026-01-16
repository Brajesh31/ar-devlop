import { motion } from 'framer-motion';
import { Rocket, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NoHackathonsStateProps {
  onReset: () => void;
}

export const NoHackathonsState = ({ onReset }: NoHackathonsStateProps) => {
  return (
      <motion.div
          className="container-wide py-16 md:py-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center max-w-xl mx-auto flex flex-col items-center">

          {/* --- LAYER 1: MULTI-LAYERED BENTO ICON --- */}
          <motion.div
              className="relative w-24 h-24 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Glass Layer 1: The Blue Touch shadow */}
            <div className="absolute inset-0 bg-blue-400/10 blur-2xl rounded-full" />

            {/* Glass Layer 2: Chromatic Border (Primary Palette) */}
            <div className="absolute inset-0 p-[1.5px] rounded-[30px] bg-gradient-to-tr from-[#3B82F6] via-[#10B981] via-[#FBBF24] to-[#FF6B35]">
              {/* Glass Layer 3: The Main Refractive Plate */}
              <div className="w-full h-full bg-white/60 backdrop-blur-xl rounded-[29px] flex items-center justify-center shadow-xl">
                <motion.div
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 8, -8, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Rocket className="w-10 h-10 text-slate-800" />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* --- LAYER 2: TYPOGRAPHY (Calm & Powerful) --- */}
          <motion.h3
              className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
          >
            Zero Hacks Found
          </motion.h3>

          <motion.p
              className="text-lg text-slate-500 font-bold max-w-sm leading-snug tracking-tight mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
          >
            Adjust your <span className="text-blue-500">Hack Matrix</span> to find new challenges in the XR ecosystem.
          </motion.p>

          {/* --- LAYER 3: INTERACTIVE RESET BUTTON --- */}
          <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
          >
            <Button
                onClick={onReset}
                className="h-14 px-10 rounded-full bg-slate-900 text-white border-none hover:bg-blue-600 transition-all duration-500 group shadow-lg"
            >
              <RotateCcw className="mr-2 w-4 h-4 group-hover:rotate-[-180deg] transition-transform duration-700" />
              <span className="text-xs font-black uppercase tracking-widest">Re-Initialize Matrix</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
  );
};