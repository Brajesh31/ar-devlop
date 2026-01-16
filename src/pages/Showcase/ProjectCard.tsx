import { motion } from 'framer-motion';
import { ShowcaseProject } from '@/data/showcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowRight, Layers, User, Zap } from 'lucide-react';

interface ProjectCardProps {
  project: ShowcaseProject;
  featured?: boolean;
  onViewDetails?: (project: ShowcaseProject) => void;
}

const categoryLabels: Record<string, string> = {
  ar: 'AR',
  vr: 'VR',
  webar: 'WebAR',
  snapar: 'SnapAR',
  hackathon: 'Hackathon',
  workshop: 'Workshop',
};

export const ProjectCard = ({ project, featured = false, onViewDetails }: ProjectCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click
    if (project.projectUrl) {
      window.open(project.projectUrl, '_blank');
    } else if (onViewDetails) {
      onViewDetails(project);
    }
  };

  return (
      <div className="h-full group relative perspective-1000">

        {/* --- LAYER 0: REFRACTIVE SHADOW (Backdrop) --- */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-orange-500/5 to-emerald-500/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-4" />

        {/* --- LAYER 1: GLASS PLATE STRUCTURE --- */}
        <div className="relative h-full bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500">

          {/* Internal Prism Gradient Border (Hover Reveal) */}
          <div className="absolute inset-0 p-[1.5px] rounded-[32px] bg-gradient-to-br from-[#FF6B35] via-[#FBBF24] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="w-full h-full bg-white rounded-[30px]" />
          </div>

          <div className="relative z-10 flex flex-col h-full bg-slate-50/30 rounded-[30px]">

            {/* --- TOP: HOLOGRAPHIC THUMBNAIL --- */}
            <div className={`relative overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-[4/3]'} rounded-t-[30px]`}>
              {/* Base Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />

              {/* Animated Mesh Gradient (Hologram Effect) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/10 via-[#FF6B35]/10 to-[#10B981]/10 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

              {/* Central Icon / Visual */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="text-6xl filter drop-shadow-xl select-none"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                  {project.categories.includes('vr') ? '🥽' : project.categories.includes('snapar') ? '📱' : '🔮'}
                </motion.div>
              </div>

              {/* Glass Overlay with Noise */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

              {/* Category Badges (Floating) */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                {project.categories.slice(0, 2).map((cat) => (
                    <Badge key={cat} className="bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      {categoryLabels[cat]}
                    </Badge>
                ))}
              </div>
            </div>

            {/* --- BOTTOM: BENTO CONTENT MATRIX --- */}
            {/* Reduced padding from p-6 to px-6 pt-5 pb-4 */}
            <div className="px-6 pt-5 pb-4 flex flex-col flex-grow">

              {/* Title & Metadata */}
              <div className="mb-3">
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF6B35] group-hover:to-[#FBBF24] transition-all duration-300">
                  {project.title}
                </h3>

                {project.builtDuring && (
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Layers size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                    {project.builtDuring}
                  </span>
                    </div>
                )}
              </div>

              {/* Description (Clamped) */}
              {/* Reduced mb-6 to mb-4 */}
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack (Mini Pills) */}
              {/* Reduced mb-6 to mb-4 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techUsed.slice(0, 3).map((tech) => (
                    <div key={tech} className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide">
                      <Zap size={10} className="text-[#FBBF24]" />
                      {tech}
                    </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-slate-200/60 flex items-center justify-between">

                {/* Creator ID */}
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <User size={12} className="text-slate-400" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">
                  {project.creatorName}
                </span>
                </div>

                {/* Action Button (Icon Only on Mobile, Text on Desktop) */}
                <Button
                    onClick={handleClick}
                    size="sm"
                    className="h-8 px-4 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#3B82F6] transition-colors shadow-lg"
                >
                  {project.projectUrl ? (
                      <span className="flex items-center gap-1.5">
                    View <ExternalLink size={10} />
                  </span>
                  ) : (
                      <span className="flex items-center gap-1.5">
                    Details <ArrowRight size={10} />
                  </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};