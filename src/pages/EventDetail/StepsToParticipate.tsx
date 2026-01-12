import { Check } from 'lucide-react';
import { Event } from '@/data/events';

interface StepsToParticipateProps {
  event: Event;
}

export const StepsToParticipate = ({ event }: StepsToParticipateProps) => {
  if (!event.steps || event.steps.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-8">Steps to Participate</h2>
        
        <div className="max-w-2xl">
          <div className="space-y-0">
            {event.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                {/* Step number and line */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                    {index + 1}
                  </div>
                  {index < event.steps!.length - 1 && (
                    <div className="w-0.5 h-12 bg-border" />
                  )}
                </div>
                
                {/* Step content */}
                <div className="pb-8">
                  <p className="text-lg font-medium text-foreground pt-2">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
