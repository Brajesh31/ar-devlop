import { motion } from 'framer-motion';
import { resourcesFAQs } from '@/data/resources';
import { SectionBadge } from '@/components/ui/SectionBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const ResourcesFAQ = () => {
  return (
    <section className="py-8 md:py-10 bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <SectionBadge>FAQ</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-6">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="space-y-2">
            {resourcesFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <AccordionItem 
                  value={faq.id}
                  className="bg-card border border-border rounded-lg px-5 data-[state=open]:shadow-sm data-[state=open]:border-accent/30 transition-all duration-300"
                >
                  <AccordionTrigger className="text-foreground font-medium hover:text-accent hover:no-underline text-left text-sm">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};
