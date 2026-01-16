import { Link } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle2, ArrowUpRight, Globe, Layers, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Event } from '@/data/events';

interface EventCardProps {
  event: Event;
  isRegistered?: boolean;
}

export const EventCard = ({ event, isRegistered }: EventCardProps) => {
  const formattedDate = format(new Date(event.date), 'MMM d, yyyy');

  // --- DESIGNER PHYSICS: 3D PERSPECTIVE ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
      <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative h-[620px] w-full group cursor-pointer"
      >
        {/* 1. DYNAMIC CHROMATIC AURA (Blue/Green/Yellow/Orange) */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-blue-500/20 via-emerald-400/20 via-yellow-300/10 to-orange-500/20 rounded-[60px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <Link to={`/events/${event.slug || event.id}`} className="block h-full relative z-10">
          <div className={cn(
              "h-full w-full rounded-[48px] p-[1.5px] transition-all duration-700",
              "bg-white/40 backdrop-blur-[120px] overflow-hidden",
              "border border-white/80 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)]",
              "group-hover:shadow-[0_80px_160px_-20px_rgba(0,0,0,0.15)]"
          )}>

            {/* 2. THE REFRACTIVE PRISM BORDER */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-emerald-400 via-yellow-400 to-orange-500 opacity-20 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative h-full w-full rounded-[46px] bg-white/70 overflow-hidden flex flex-col p-4">

              {/* 3. IMAGE PORTAL (Top Layer) */}
              <div className="relative h-[45%] w-full overflow-hidden rounded-[38px] shadow-2xl translate-z-30">
                {/* Hover Shine Effect */}
                <div className="absolute inset-0 z-10 bg-gradient-to-tr from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {event.image ? (
                    <motion.img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                      <Zap className="w-12 h-12 text-blue-300 animate-pulse" />
                    </div>
                )}

                {/* Status Ribbon */}
                <div className="absolute top-6 left-6 z-20">
                  <div className="px-4 py-2 rounded-2xl bg-black/80 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", event.status === 'live' ? "bg-red-500 animate-ping" : "bg-blue-400")} />
                    {event.status}
                  </div>
                </div>
              </div>

              {/* 4. THE INFORMATION MATRIX (Middle Layer) */}
              <div className="flex-1 px-4 py-6 flex flex-col justify-between translate-z-50">
                <div className="space-y-4">
                  {/* Information Tags */}
                  <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-[9px] font-black text-blue-600 uppercase flex items-center gap-1">
                    <Globe size={10} /> {event.mode}
                  </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-[9px] font-black text-emerald-600 uppercase flex items-center gap-1">
                    <Layers size={10} /> {event.type}
                  </span>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase",
                        event.fee === 'free' ? "bg-orange-50 text-orange-600" : "bg-slate-100 text-slate-600"
                    )}>
                    {event.fee === 'free' ? 'FREE ACCESS' : 'PREMIUM'}
                  </span>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {event.title}
                  </h3>

                  <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  {/* Logistics Grid */}
                  <div className="grid grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Schedule</p>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-500" />
                        <span className="text-xs font-black text-slate-800">{formattedDate}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-orange-500" />
                        <span className="text-xs font-black text-slate-800 truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. MASTER ACTION FOOTER (Base Layer) */}
                <div className="pt-6 flex items-center justify-between">
                  {isRegistered ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 via-emerald-400 to-orange-400 p-[1.5px]">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <CheckCircle2 size={18} className="text-emerald-500" />
                          </div>
                        </div>
                        <span className="text-sm font-black bg-gradient-to-r from-blue-600 via-emerald-600 via-yellow-500 to-orange-600 bg-clip-text text-transparent uppercase tracking-tight">
                      Ready to Lead
                    </span>
                      </div>
                  ) : (
                      <div className="relative h-14 w-14 rounded-full bg-slate-900 flex items-center justify-center text-white overflow-hidden transition-all duration-500 group-hover:w-44 group-hover:bg-blue-600 shadow-xl group-hover:shadow-blue-500/40">
                        <ArrowUpRight className="absolute left-4 group-hover:translate-x-32 transition-transform duration-500" size={24} />
                        <span className="font-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ml-4">EXPLORE EVENT</span>
                      </div>
                  )}

                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-300 uppercase leading-none">Investment</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">
                      {event.fee === 'free' ? 'FREE' : `₹${event.feeAmount}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
  );
};