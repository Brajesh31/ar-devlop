import { Event } from '@/data/events';

interface EventTimelineProps {
  event: Event;
}

export const EventTimeline = ({ event }: EventTimelineProps) => {
  if (!event.timeline || event.timeline.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-8">Timeline</h2>
        
        <div className="max-w-2xl">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            
            {event.timeline.map((item, index) => (
              <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
                {/* Dot */}
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center z-10 flex-shrink-0">
                  <div className="w-3 h-3 bg-accent-foreground rounded-full" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-accent font-medium mb-2">{item.dateRange}</p>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
