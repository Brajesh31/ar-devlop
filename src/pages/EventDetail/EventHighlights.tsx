import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@/data/events';

interface EventHighlightsProps {
  event: Event;
}

export const EventHighlights = ({ event }: EventHighlightsProps) => {
  if (!event.highlights) return null;

  const highlights = [
    { icon: Calendar, label: 'Date', value: event.highlights.date },
    { icon: MapPin, label: 'Location', value: event.highlights.location },
    { icon: Users, label: 'Format', value: event.highlights.format },
  ];

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container-wide">
        <h2 className="text-xl font-bold text-foreground mb-6 text-center">
          Where Builders Come Together
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {highlights.map((item, index) => (
            <div key={index} className="text-center p-6">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
