import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageTransition } from '@/components/layout/PageTransition';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { faqCategories } from '@/data/legal';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FAQsPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        <SEOHead {...seoConfig.faqs} />
        <Header />
        <main className="py-10 md:py-12">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <motion.div 
                className="mb-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Frequently Asked Questions
                </h1>
                <p className="text-muted-foreground text-sm">
                  Find answers to common questions about Bharat XR, our events, and how to get involved.
                </p>
              </motion.div>

              <div className="space-y-8">
                {faqCategories.map((category, categoryIndex) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 }}
                  >
                    <h2 className="text-lg font-semibold text-foreground mb-3">{category.title}</h2>
                    <Accordion type="single" collapsible className="w-full space-y-2">
                      {category.questions.map((faq, faqIndex) => (
                        <motion.div
                          key={`${category.id}-${faqIndex}`}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: categoryIndex * 0.1 + faqIndex * 0.05 }}
                        >
                          <AccordionItem 
                            value={`${category.id}-${faqIndex}`}
                            className="bg-card border border-border rounded-lg px-4 data-[state=open]:border-accent/30 data-[state=open]:shadow-sm transition-all duration-300"
                          >
                            <AccordionTrigger className="text-left text-foreground hover:text-accent text-sm py-3">
                              {faq.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-sm pb-3">
                              {faq.a}
                            </AccordionContent>
                          </AccordionItem>
                        </motion.div>
                      ))}
                    </Accordion>
                  </motion.div>
                ))}
              </div>

              <motion.div 
                className="mt-10 p-5 bg-secondary/50 rounded-xl text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-base font-semibold text-foreground mb-2">
                  Still have questions?
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to="/help" 
                    className="inline-flex items-center justify-center px-5 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium hover:bg-accent/90 transition-colors group"
                  >
                    Contact Support
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FAQsPage;
