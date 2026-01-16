import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowUpRight, Trophy, Zap, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Hackathon } from '@/data/hackathons';

interface HackathonCardProps {
  hackathon: Hackathon;
}

export const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const startDateFormatted = format(new Date(hackathon.startDate), 'MMM d, yyyy');
  const registrationDeadline = format(new Date(hackathon.registrationDeadline), 'MMM d, yyyy');

  // --- DESIGNER PHYSICS: 3D PERSPECTIVE & LIGHT ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [20, -20]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-[580px] w-full group cursor-pointer perspective-1000"
      >
        {/* 1. THE CHROMATIC AURA LAYER (Blue -> Green -> Yellow -> Orange) */}
        <motion.div
            style={{ x: shadowX }}
            className="absolute -inset-6 bg-gradient-to-tr from-blue-500/10 via-emerald-400/10 via-yellow-300/5 to-orange-500/10 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />

        <Link to={`/hackathons/${hackathon.id}`} className="block h-full relative z-10">
          <div className={cn(
              "h-full w-full rounded-[48px] p-[1.5px] transition-all duration-700 overflow-hidden",
              "bg-white/40 backdrop-blur-[100px] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]",
              "group-hover:shadow-[0_60px_100px_-20px_rgba(0,0,0,0.12)]"
          )}>

            {/* 2. THE REFRACTIVE PRISM BORDER */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-emerald-400 via-yellow-400 to-orange-500 opacity-20 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="relative h-full w-full rounded-[46px] bg-white/70 overflow-hidden flex flex-col p-4">

              {/* 3. IMAGE PORTAL (Layered Z-30) */}
              <div className="relative h-[42%] w-full overflow-hidden rounded-[38px] shadow-2xl translate-z-30">
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {hackathon.image ? (
                    <motion.img
                        src={hackathon.image}
                        alt={hackathon.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.12 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <Zap className="w-12 h-12 text-blue-200 animate-pulse" />
                    </div>
                )}

                {/* Status Badge (Refractive Glass) */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", hackathon.status === 'live' ? "bg-emerald-400 animate-pulse" : "bg-blue-400")} />
                    {hackathon.status}
                  </div>
                </div>
              </div>

              {/* 4. THE INFORMATION MATRIX (Layered Z-100) */}
              <div className="flex-1 px-4 py-8 flex flex-col justify-between translate-z-50">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-blue-50 text-[9px] font-black text-blue-600 uppercase flex items-center gap-1.5 tracking-wider">
                    <MapPin size={10} /> {hackathon.mode}
                  </span>
                    <span className="px-3 py-1.5 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase flex items-center gap-1.5 tracking-wider">
                    <Users size={10} /> {hackathon.teamSizeRange || 'Team'}
                  </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 leading-[1.1] group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                    {hackathon.title}
                  </h3>

                  {/* BENTO LOGISTICS GRID */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Date Range</span>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="text-xs font-black text-slate-800">{startDateFormatted}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Entry Fee</span>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-orange-500" />
                        <span className="text-xs font-black text-slate-800">{hackathon.fee === 'free' ? 'FREE' : `₹${hackathon.feeAmount}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. MASTER PRIZE FOOTER (Layered Z-150) */}
                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] via-[#FBBF24] to-[#10B981] p-[2px] shadow-lg">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <Trophy size={20} className="text-orange-500" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Prize Pool</p>
                      <p className="text-xl font-black bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                        {hackathon.prizePool || 'TBD'}
                      </p>
                    </div>
                  </div>

                  <div className="relative h-12 w-12 rounded-full bg-slate-900 flex items-center justify-center text-white overflow-hidden transition-all duration-500 group-hover:w-32 group-hover:bg-blue-600 shadow-xl">
                    <ArrowUpRight className="absolute left-3.5 group-hover:translate-x-24 transition-transform duration-500" size={20} />
                    <span className="font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4 tracking-tighter">VIEW DETAILS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
  );
};