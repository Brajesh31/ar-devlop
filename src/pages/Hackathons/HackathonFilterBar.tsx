import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, RefreshCw, SlidersHorizontal,
  Globe, Activity, Users, CircleDollarSign, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { HackathonMode, HackathonStatus, HackathonTeamSize, HackathonFee } from '@/data/hackathons';

interface HackathonFilterBarProps {
  selectedMode: HackathonMode | null;
  selectedStatus: HackathonStatus | null;
  selectedTeamSize: HackathonTeamSize | null;
  selectedFee: HackathonFee | null;
  onModeChange: (mode: HackathonMode | null) => void;
  onStatusChange: (status: HackathonStatus | null) => void;
  onTeamSizeChange: (teamSize: HackathonTeamSize | null) => void;
  onFeeChange: (fee: HackathonFee | null) => void;
  onReset: () => void;
}

const PrismDropdown = <T extends string>({
                                           label,
                                           value,
                                           options,
                                           onChange,
                                           icon: Icon,
                                           accentClass,
                                         }: {
  label: string;
  value: T | null;
  options: { value: T | null; label: string }[];
  onChange: (val: T | null) => void;
  icon: any;
  accentClass: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
      <DropdownMenu onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <motion.button
              whileTap={{ scale: 0.96 }}
              className={cn(
                  "flex items-center gap-3 px-4 py-3 md:px-6 md:py-4 rounded-[26px] transition-all duration-500",
                  "bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm outline-none",
                  "basis-[47%] sm:basis-0 flex-grow",
                  "hover:bg-white/90 hover:shadow-md hover:-translate-y-0.5",
                  value && cn("ring-1 ring-inset bg-white/100 shadow-md", accentClass)
              )}
          >
            <div className={cn(
                "p-2 rounded-xl transition-colors shrink-0",
                value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"
            )}>
              <Icon size={14} className="md:w-4 md:h-4" />
            </div>

            <div className="text-left overflow-hidden">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                {label}
              </p>
              <p className="text-[12px] md:text-[15px] font-black text-slate-900 leading-none truncate">
                {selectedOption?.label || `All`}
              </p>
            </div>

            <ChevronDown size={14} className={cn("text-slate-300 transition-transform ml-auto", isOpen && "rotate-180")} />
          </motion.button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
            align="start"
            sideOffset={12}
            className="w-[92vw] sm:w-64 p-2 rounded-[28px] bg-white/95 backdrop-blur-3xl border-white/40 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300 z-[110]"
        >
          <div className="px-4 py-2 mb-1 border-b border-slate-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hackathon {label}</p>
          </div>
          {options.map((opt) => (
              <DropdownMenuItem
                  key={opt.label}
                  onClick={() => onChange(opt.value)}
                  className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl font-bold text-[14px] cursor-pointer transition-all mb-1 last:mb-0",
                      value === opt.value ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                  )}
              >
                {opt.label}
                {value === opt.value && <Check size={16} />}
              </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export const HackathonFilterBar = ({
                                     selectedMode,
                                     selectedStatus,
                                     selectedTeamSize,
                                     selectedFee,
                                     onModeChange,
                                     onStatusChange,
                                     onTeamSizeChange,
                                     onFeeChange,
                                     onReset,
                                   }: HackathonFilterBarProps) => {
  const hasFilters = selectedMode || selectedStatus || selectedTeamSize || selectedFee;

  return (
      <div className="w-full pt-2 pb-10 relative z-[90]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col gap-6">

          {/* Matrix Header */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.25em]">Hack Matrix</h2>
            </div>

            <AnimatePresence>
              {hasFilters && (
                  <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={onReset}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-500"
                  >
                    <RefreshCw size={12} />
                    <span className="text-[10px] uppercase tracking-widest font-black">Reset</span>
                  </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Dynamic Bento Row (Responsive Grid) */}
          <div className="flex flex-wrap md:flex-nowrap items-stretch gap-4 md:gap-6">
            <PrismDropdown
                label="Location"
                value={selectedMode}
                options={[
                  { value: null, label: 'All Modes' },
                  { value: 'online', label: 'Online' },
                  { value: 'offline', label: 'In-Person' },
                  { value: 'hybrid', label: 'Hybrid' },
                ]}
                onChange={onModeChange}
                icon={Globe}
                accentClass="ring-orange-500/20 border-orange-200"
            />

            <PrismDropdown
                label="Timeline"
                value={selectedStatus}
                options={[
                  { value: null, label: 'Any Status' },
                  { value: 'live', label: 'Live' },
                  { value: 'upcoming', label: 'Upcoming' },
                  { value: 'completed', label: 'Closed' },
                ]}
                onChange={onStatusChange}
                icon={Activity}
                accentClass="ring-emerald-500/20 border-emerald-200"
            />

            <PrismDropdown
                label="Squad"
                value={selectedTeamSize}
                options={[
                  { value: null, label: 'All Sizes' },
                  { value: 'solo', label: 'Solo' },
                  { value: 'team', label: 'Team' },
                ]}
                onChange={onTeamSizeChange}
                icon={Users}
                accentClass="ring-blue-500/20 border-blue-200"
            />

            <PrismDropdown
                label="Access"
                value={selectedFee}
                options={[
                  { value: null, label: 'Any Entry' },
                  { value: 'free', label: 'Free' },
                  { value: 'paid', label: 'Paid' },
                ]}
                onChange={onFeeChange}
                icon={CircleDollarSign}
                accentClass="ring-yellow-500/20 border-yellow-200"
            />
          </div>
        </div>
      </div>
  );
};