import { Calendar, MapPin, Users, Lock, Unlock } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/data/events';

interface QuickInfoRowProps {
  event: Event;
}

export const QuickInfoRow = ({ event }: QuickInfoRowProps) => {
  const formattedDate = format(new Date(event.date), 'MMM d, yyyy');
  const endDateFormatted = event.endDate 
    ? format(new Date(event.endDate), 'MMM d, yyyy')
    : null;

  const infoItems = [
    {
      icon: Calendar,
      label: 'Date',
      value: endDateFormatted ? `${formattedDate} - ${endDateFormatted}` : formattedDate,
    },
    {
      icon: MapPin,
      label: 'Venue',
      value: event.venue || event.location,
    },
    {
      icon: event.eligibility?.openFor?.length ? Unlock : Lock,
      label: 'Entry',
      value: event.eligibility?.openFor?.length ? 'Open for All' : 'Invite Only',
    },
  ];

  return (
    <section className="py-6 border-y border-border">
      <div className="container-wide">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {infoItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-4 bg-secondary/50 rounded-lg">
              <div className="w-10 h-10 bg-background rounded-full flex items-center justify-center">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
