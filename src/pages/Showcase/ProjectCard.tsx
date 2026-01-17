import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShowcaseProject } from '@/data/showcase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowRight, Layers, User, Zap, Play } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.projectUrl) {
      window.open(project.projectUrl, '_blank');
    } else if (onViewDetails) {
      onViewDetails(project);
    }
  };

  // Hover Logic for Desktop (Instant Play)
  const handleMouseEnter = () => {
    if (videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Prevent error if user interacts quickly or browser blocks unmuted
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Optional: videoRef.current.currentTime = 0; // Reset on leave?
    }
  };

  return (
      <div
          className="h-full group relative perspective-1000"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
      >

        {/* --- LAYER 0: REFRACTIVE SHADOW (Backdrop) --- */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-orange-500/5 to-emerald-500/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-4" />

        {/* --- LAYER 1: GLASS PLATE STRUCTURE --- */}
        <div className="relative h-full bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500">

          {/* Internal Prism Gradient Border (Hover Reveal) */}
          <div className="absolute inset-0 p-[1.5px] rounded-[32px] bg-gradient-to-br from-[#FF6B35] via-[#FBBF24] to-[#3B82F6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20">
            <div className="w-full h-full bg-transparent rounded-[30px]" />
          </div>

          <div className="relative z-10 flex flex-col h-full bg-slate-50/30 rounded-[30px]">

            {/* --- TOP: MEDIA THUMBNAIL (Video / Hologram) --- */}
            <div className={`relative overflow-hidden ${featured ? 'aspect-[2/1]' : 'aspect-[4/3]'} rounded-t-[30px] bg-slate-900`}>

              {project.videoUrl ? (
                  /* --- VIDEO PLAYER --- */
                  <div className="absolute inset-0 w-full h-full">
                    <video
                        ref={videoRef}
                        src={project.videoUrl}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                        muted
                        loop
                        playsInline
                        preload="metadata" // Load metadata fast for poster/size
                        // poster={project.thumbnail} // Use thumbnail while loading
                    />

                    {/* Video Overlay Gradient (Fade out on hover) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent group-hover:opacity-0 transition-opacity duration-300" />

                    {/* Play Icon Hint (Hidden when playing) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Play size={20} className="text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>
              ) : (
                  /* --- FALLBACK: HOLOGRAPHIC ANIMATION --- */
                  <>
                    {/* Base Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200" />

                    {/* Animated Mesh */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/10 via-[#FF6B35]/10 to-[#10B981]/10 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

                    {/* Central Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                          className="text-6xl filter drop-shadow-xl select-none"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                      >
                        {project.categories.includes('vr') ? '🥽' : project.categories.includes('snapar') ? '📱' : '🔮'}
                      </motion.div>
                    </div>
                  </>
              )}

              {/* Glass Overlay with Noise (Texture) */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

              {/* Category Badges (Floating) */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
                {project.categories.slice(0, 2).map((cat) => (
                    <Badge key={cat} className="bg-white/90 backdrop-blur-md text-slate-900 border-none shadow-sm px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                      {categoryLabels[cat]}
                    </Badge>
                ))}
              </div>
            </div>

            {/* --- BOTTOM: BENTO CONTENT MATRIX --- */}
            <div className="px-6 pt-5 pb-4 flex flex-col flex-grow bg-white">

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

              {/* Description */}
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4 line-clamp-2">
                {project.description}
              </p>

              {/* Tech Stack */}
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

                {/* Action Button */}
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