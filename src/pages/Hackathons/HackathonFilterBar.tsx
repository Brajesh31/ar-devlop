import { cn } from '@/lib/utils';
import { HackathonMode, HackathonStatus, HackathonTeamSize, HackathonFee } from '@/data/hackathons';

interface FilterOption<T> {
  value: T | null;
  label: string;
}

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

const modeOptions: FilterOption<HackathonMode>[] = [
  { value: null, label: 'All Modes' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid' },
];

const statusOptions: FilterOption<HackathonStatus>[] = [
  { value: null, label: 'All Status' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Closed' },
];

const teamSizeOptions: FilterOption<HackathonTeamSize>[] = [
  { value: null, label: 'All Teams' },
  { value: 'solo', label: 'Solo' },
  { value: 'team', label: 'Team' },
];

const feeOptions: FilterOption<HackathonFee>[] = [
  { value: null, label: 'All' },
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
];

const FilterGroup = <T extends string>({
  options,
  selected,
  onChange,
  label,
}: {
  options: FilterOption<T>[];
  selected: T | null;
  onChange: (value: T | null) => void;
  label: string;
}) => (
  <div className="flex flex-wrap gap-2">
    <span className="text-sm text-muted-foreground self-center mr-1 hidden sm:inline">{label}:</span>
    {options.map((option) => (
      <button
        key={option.label}
        onClick={() => onChange(option.value)}
        className={cn(
          'px-3 py-1.5 text-sm font-medium rounded-full transition-all',
          selected === option.value
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        {option.label}
      </button>
    ))}
  </div>
);

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
    <div className="container-wide py-6 space-y-4">
      <div className="flex flex-wrap gap-4 items-start">
        <FilterGroup
          options={modeOptions}
          selected={selectedMode}
          onChange={onModeChange}
          label="Mode"
        />
      </div>
      
      <div className="flex flex-wrap gap-4 items-start">
        <FilterGroup
          options={statusOptions}
          selected={selectedStatus}
          onChange={onStatusChange}
          label="Status"
        />
      </div>
      
      <div className="flex flex-wrap gap-4 items-start">
        <FilterGroup
          options={teamSizeOptions}
          selected={selectedTeamSize}
          onChange={onTeamSizeChange}
          label="Team Size"
        />
      </div>
      
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <FilterGroup
          options={feeOptions}
          selected={selectedFee}
          onChange={onFeeChange}
          label="Fee"
        />
        
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-sm text-accent hover:text-accent/80 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
