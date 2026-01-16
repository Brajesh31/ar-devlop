// FIX: Imported 'Variants' for strict typing
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Hackathon } from '@/data/hackathons';
import { HackathonCard } from './HackathonCard';

interface HackathonsGridProps {
    hackathons: Hackathon[];
}

// --- MASTER FRAMER VARIANTS ---
// FIX: Explicitly typed as 'Variants' to fix TS errors regarding transition types
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

// FIX: Explicitly typed as 'Variants'
const itemVariants: Variants = {
    hidden: {
        opacity: 0,
        x: 60,
        scale: 0.9,
        filter: 'blur(12px)',
        rotateY: 15
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        rotateY: 0,
        transition: {
            type: "spring", // Correctly typed as a Spring transition
            stiffness: 260,
            damping: 28
        }
    },
};

export const HackathonsGrid = ({ hackathons }: HackathonsGridProps) => {
    return (
        <div className="w-full py-12 md:py-20 relative perspective-2000">
            {/* DEEP LAYER: Ambient Prism Mesh */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />

            <div className="container-wide px-4 md:px-8">
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <AnimatePresence mode="popLayout">
                        {hackathons.map((hackathon) => (
                            <motion.div
                                key={hackathon.id}
                                variants={itemVariants}
                                layout // Professional bento-reordering physics
                                className="h-full transform-gpu"
                            >
                                <HackathonCard hackathon={hackathon} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* EMPTY STATE ARCHITECTURE */}
                {hackathons.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-40 rounded-[56px] bg-white/40 backdrop-blur-3xl border-2 border-dashed border-slate-100"
                    >
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 shadow-inner">
                            <span className="text-3xl grayscale opacity-30">🚀</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Zero Hacks Found</h3>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Adjust your Matrix Filters</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};