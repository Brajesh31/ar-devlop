import { motion } from 'framer-motion';
import { contactFAQs } from '@/data/contact';
import { HelpCircle, MessageCircle } from 'lucide-react';

const ContactFAQs = () => {
  // Split FAQs - first one is featured
  const featuredFaq = contactFAQs[0];
  const regularFaqs = contactFAQs.slice(1);

  return (
    <section id="faq" className="relative py-10 bg-background overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating question marks - very subtle */}
        <motion.div
          className="absolute top-20 left-[15%] text-6xl text-muted-foreground/[0.03] font-bold"
          animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          ?
        </motion.div>
        <motion.div
          className="absolute bottom-20 right-[10%] text-8xl text-muted-foreground/[0.02] font-bold"
          animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          ?
        </motion.div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Quick Answers
              </h2>
              <p className="text-sm text-muted-foreground">
                Common questions about Bharat XR
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Featured FAQ - Takes 2 columns */}
          <motion.div
            className="md:col-span-2 md:row-span-2"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="h-full bg-gradient-to-br from-accent/10 via-accent/5 to-transparent border border-accent/20 rounded-xl p-6 md:p-8 relative overflow-hidden group"
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <HelpCircle className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 leading-snug">
                  {featuredFaq.question}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {featuredFaq.answer}
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Regular FAQs */}
          {regularFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (index + 1) * 0.05 }}
            >
              <motion.div 
                className="h-full bg-card border border-border/50 rounded-xl p-5 group hover:border-accent/30 hover:shadow-md hover:shadow-accent/5 transition-all duration-300 relative overflow-hidden"
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <motion.div 
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors"
                      whileHover={{ rotate: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HelpCircle className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-snug group-hover:text-accent transition-colors">
                        {faq.question}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactFAQs;
