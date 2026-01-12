import { Code, Palette } from 'lucide-react';
import { Event } from '@/data/events';

interface ParticipantTypesProps {
  event: Event;
}

const icons: Record<string, React.ElementType> = {
  Developer: Code,
  'Designer / Creative': Palette,
};

export const ParticipantTypes = ({ event }: ParticipantTypesProps) => {
  if (!event.participantTypes || event.participantTypes.length === 0) return null;

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-6">Who Is This For</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {event.participantTypes.map((type, index) => {
            const Icon = icons[type.title] || Code;
            return (
              <div 
                key={index} 
                className="p-6 bg-background rounded-xl border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{type.title}</h3>
                </div>
                <p className="text-muted-foreground">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
