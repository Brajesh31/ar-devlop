import { FileText } from 'lucide-react';
import { Event } from '@/data/events';

interface TermsSectionProps {
  event: Event;
}

export const TermsSection = ({ event }: TermsSectionProps) => {
  if (!event.terms) return null;

  return (
    <section className="py-8">
      <div className="container-wide">
        <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg max-w-3xl">
          <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-foreground mb-1">Terms & Conditions</h3>
            <p className="text-sm text-muted-foreground">{event.terms}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
