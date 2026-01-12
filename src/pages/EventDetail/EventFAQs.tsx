import { Event } from '@/data/events';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface EventFAQsProps {
  event: Event;
}

export const EventFAQs = ({ event }: EventFAQsProps) => {
  if (!event.faqs || event.faqs.length === 0) return null;

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {event.faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`}
                className="bg-background border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <span className="font-medium text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
