import { ShowcaseProject } from '@/data/showcase';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, X, Zap, User, Calendar, Sparkles, Hash } from 'lucide-react';
// FIX: Imported 'Variants' for strict typing
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProjectDetailModalProps {
  project: ShowcaseProject | null;
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  ar: 'AR',
  vr: 'VR',
  webar: 'WebAR',
  snapar: 'SnapAR',
  hackathon: 'Hackathon',
  workshop: 'Workshop',
};

// --- FRAMER VARIANTS ---
// FIX: Explicitly typed as 'Variants' to fix TS2322 error
const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 30 }
  },
  exit: { opacity: 0, scale: 0.95, y: 20 }
};

const contentStagger: Variants = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } }
};

const itemSlide: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const ProjectDetailModal = ({ project, open, onClose }: ProjectDetailModalProps) => {
  // Guard clause
  if (!project) return null;

  return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden bg-transparent border-none shadow-none sm:rounded-[32px]">

          <AnimatePresence mode="wait">
            {open && (
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
                >
                  {/* --- LAYER 0: REFRACTIVE BORDER GLOW --- */}
                  <div className="absolute inset-0 p-[1px] rounded-[32px] bg-gradient-to-br from-[#FF6B35]/30 via-[#FBBF24]/30 to-[#3B82F6]/30 pointer-events-none">
                    <div className="w-full h-full bg-white rounded-[31px]" />
                  </div>

                  {/* --- CLOSE BUTTON --- */}
                  <button
                      onClick={onClose}
                      className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-[#FF6B35] hover:bg-white border border-slate-200 transition-all duration-300 shadow-sm hover:rotate-90"
                  >
                    <X size={20} />
                  </button>

                  <div className="relative z-10 flex flex-col max-h-[90vh]">

                    {/* --- HEADER: HOLOGRAPHIC HERO --- */}
                    <div className="relative h-64 md:h-80 overflow-hidden shrink-0">
                      {/* Background Mesh */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/10 via-[#FF6B35]/10 to-[#10B981]/10 opacity-60 animate-pulse" />

                      {/* Scanning Line Effect */}
                      <motion.div
                          animate={{ top: ['0%', '100%', '0%'] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B35]/50 to-transparent blur-sm"
                      />

                      {/* Icon Visual */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                            className="text-9xl filter drop-shadow-2xl select-none"
                        >
                          {project.categories.includes('vr') ? '🥽' : project.categories.includes('snapar') ? '📱' : '🔮'}
                        </motion.div>
                      </div>

                      {/* Glass Texture */}
                      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                      {/* Floating ID Badge */}
                      <div className="absolute bottom-6 left-6 flex gap-2">
                        <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-none px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                          PROJECT_ID_0{Math.floor(Math.random() * 99)}
                        </Badge>
                      </div>
                    </div>

                    {/* --- BODY: BENTO CONTENT --- */}
                    <ScrollArea className="flex-grow">
                      <motion.div
                          variants={contentStagger}
                          initial="hidden"
                          animate="visible"
                          className="p-6 md:p-8 space-y-8"
                      >

                        {/* 1. Title & Meta Block */}
                        <motion.div variants={itemSlide}>
                          <div className="flex flex-wrap items-center gap-3 mb-4">
                            {project.categories.map((cat) => (
                                <div key={cat} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                  <Hash size={10} className="text-[#FF6B35]" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest">{categoryLabels[cat]}</span>
                                </div>
                            ))}
                          </div>

                          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
                            {project.title}
                          </h2>

                          {project.builtDuring && (
                              <div className="flex items-center gap-2 text-slate-500 font-medium">
                                <Calendar size={14} className="text-[#FBBF24]" />
                                <span className="text-xs uppercase tracking-wide">Deployed during <span className="text-slate-900 font-bold">{project.builtDuring}</span></span>
                              </div>
                          )}
                        </motion.div>

                        {/* 2. Description Block */}
                        <motion.div variants={itemSlide} className="relative pl-6 border-l-2 border-slate-200">
                          <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            {project.description}
                          </p>
                        </motion.div>

                        {/* 3. Tech Stack Bento */}
                        <motion.div variants={itemSlide}>
                          <div className="flex items-center gap-2 mb-4">
                            <Zap size={16} className="text-[#FBBF24]" />
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Technology Stack</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.techUsed.map((tech) => (
                                <div key={tech} className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm text-sm font-bold text-slate-700 hover:border-[#FF6B35]/30 hover:shadow-md transition-all duration-300 cursor-default">
                                  {tech}
                                </div>
                            ))}
                          </div>
                        </motion.div>

                        {/* 4. Creator Plate */}
                        <motion.div variants={itemSlide} className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm">
                              <User size={20} />
                            </div>
                            <div>
                              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Architect</span>
                              <span className="block text-lg font-black text-slate-900">{project.creatorName}</span>
                              {project.creatorTeam && (
                                  <span className="text-xs text-slate-500 font-medium">Team: {project.creatorTeam}</span>
                              )}
                            </div>
                          </div>
                          <div className="hidden sm:block">
                            <Sparkles size={24} className="text-[#FF6B35]/20" />
                          </div>
                        </motion.div>

                      </motion.div>
                    </ScrollArea>

                    {/* --- FOOTER: ACTION BAR --- */}
                    <div className="p-6 md:p-8 pt-4 bg-white border-t border-slate-100 shrink-0">
                      <Button
                          onClick={() => project.projectUrl && window.open(project.projectUrl, '_blank')}
                          disabled={!project.projectUrl}
                          className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-[#3B82F6] text-white text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 group"
                      >
                     <span className="flex items-center gap-3">
                       {project.projectUrl ? 'Launch Project System' : 'System Access Restricted'}
                       {project.projectUrl && <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />}
                     </span>
                      </Button>
                    </div>

                  </div>
                </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
  );
};