import { Event } from '@/data/events';

interface AboutEventProps {
  event: Event;
}

export const AboutEvent = ({ event }: AboutEventProps) => {
  if (!event.longDescription) return null;

  return (
    <section className="py-12">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-6">About the Event</h2>
        <div className="prose prose-gray max-w-none">
          <p className="text-muted-foreground leading-relaxed text-lg">
            {event.longDescription}
          </p>
        </div>
      </div>
    </section>
  );
};
