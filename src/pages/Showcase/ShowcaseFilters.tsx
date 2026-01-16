import { motion } from 'framer-motion';
import { type ProjectCategory } from '@/data/showcase';
import { cn } from '@/lib/utils';
import {
  Box,
  Glasses,
  Globe,
  Smartphone,
  Code2,
  Wrench,
  Filter,
  X
} from 'lucide-react';

interface ShowcaseFiltersProps {
  activeFilters: ProjectCategory[];
  onFilterToggle: (filter: ProjectCategory) => void;
}

const filterOptions: { label: string; value: ProjectCategory; icon: React.ElementType }[] = [
  { label: 'AR Experience', value: 'ar', icon: Box },
  { label: 'VR Worlds', value: 'vr', icon: Glasses },
  { label: 'WebXR', value: 'webar', icon: Globe },
  { label: 'Snap Lens', value: 'snapar', icon: Smartphone },
  { label: 'Hackathon', value: 'hackathon', icon: Code2 },
  { label: 'Workshop', value: 'workshop', icon: Wrench },
];

export const ShowcaseFilters = ({ activeFilters, onFilterToggle }: ShowcaseFiltersProps) => {
  return (
      // GLASS DOCK: Sticky positioning with blur
      <motion.section
          className="sticky top-16 md:top-20 z-40 py-3 bg-white/70 backdrop-blur-xl border-y border-white/40 shadow-sm supports-[backdrop-filter]:bg-white/60"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container-wide px-4 md:px-8">
          <div className="flex items-center gap-4">

            {/* Label Icon (Hidden on small mobile) */}
            <div className="hidden md:flex items-center gap-2 text-slate-400 border-r border-slate-200 pr-4 mr-2">
              <Filter size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Filter Matrix</span>
            </div>

            {/* Scrollable Filter List */}
            <div className="flex-1 overflow-x-auto no-scrollbar mask-linear-fade">
              <motion.div
                  className="flex items-center gap-2 md:gap-3 pb-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
              >
                {filterOptions.map((filter, index) => {
                  const isActive = activeFilters.includes(filter.value);
                  const Icon = filter.icon;

                  return (
                      <motion.button
                          key={filter.value}
                          onClick={() => onFilterToggle(filter.value)}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={cn(
                              'relative px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-300 flex items-center gap-2 shrink-0 border group',
                              isActive
                                  ? 'border-transparent text-white shadow-lg shadow-orange-500/20'
                                  : 'bg-white/50 border-slate-200 text-slate-500 hover:border-[#FF6B35]/50 hover:bg-white'
                          )}
                      >
                        {/* Active Gradient Background */}
                        {isActive && (
                            <motion.div
                                layoutId={`active-bg-${filter.value}`}
                                className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] to-[#FBBF24] rounded-xl -z-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}

                        <Icon size={14} className={cn(
                            "transition-colors",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-[#FF6B35]"
                        )} />

                        <span>{filter.label}</span>

                        {/* Active Dot Indicator */}
                        {isActive && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-1.5 h-1.5 rounded-full bg-white ml-1"
                            />
                        )}
                      </motion.button>
                  );
                })}

                {/* Clear Filters Button (Only shows when filters are active) */}
                {activeFilters.length > 0 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => activeFilters.forEach(f => onFilterToggle(f))} // Naive clear for now, ideally parent handles clear
                        className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1 ml-2 border border-transparent hover:border-red-100"
                    >
                      <X size={12} />
                      Clear
                    </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
  );
};