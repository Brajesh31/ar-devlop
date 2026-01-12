import { cn } from '@/lib/utils';
import { EventType, EventMode, EventStatus, EventFee } from '@/data/events';

interface FilterOption<T> {
  value: T | null;
  label: string;
}

interface EventFilterBarProps {
  selectedType: EventType | null;
  selectedMode: EventMode | null;
  selectedStatus: EventStatus | null;
  selectedFee: EventFee | null;
  onTypeChange: (type: EventType | null) => void;
  onModeChange: (mode: EventMode | null) => void;
  onStatusChange: (status: EventStatus | null) => void;
  onFeeChange: (fee: EventFee | null) => void;
  onReset: () => void;
}

const typeOptions: FilterOption<EventType>[] = [
  { value: null, label: 'All Types' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'meetup', label: 'Meetup' },
];

const modeOptions: FilterOption<EventMode>[] = [
  { value: null, label: 'All Modes' },
  { value: 'online', label: 'Online' },
  { value: 'offline', label: 'In-Person' },
  { value: 'hybrid', label: 'Hybrid' },
];

const statusOptions: FilterOption<EventStatus>[] = [
  { value: null, label: 'All Status' },
  { value: 'live', label: 'Live' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'completed', label: 'Completed' },
];

const feeOptions: FilterOption<EventFee>[] = [
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

export const EventFilterBar = ({
  selectedType,
  selectedMode,
  selectedStatus,
  selectedFee,
  onTypeChange,
  onModeChange,
  onStatusChange,
  onFeeChange,
  onReset,
}: EventFilterBarProps) => {
  const hasFilters = selectedType || selectedMode || selectedStatus || selectedFee;

  return (
    <div className="container-wide py-6 space-y-4">
      <div className="flex flex-wrap gap-4 items-start">
        <FilterGroup
          options={typeOptions}
          selected={selectedType}
          onChange={onTypeChange}
          label="Type"
        />
      </div>
      
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
