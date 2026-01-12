import { motion } from 'framer-motion';
import { partnerLogos } from '@/data/partners';
import { Handshake } from 'lucide-react';

export const PartnersLogos = () => {
  // Double the logos for seamless infinite scroll
  const logosRow1 = [...partnerLogos.slice(0, 6), ...partnerLogos.slice(0, 6)];
  const logosRow2 = [...partnerLogos.slice(6), ...partnerLogos.slice(6)];

  return (
    <section className="py-10 md:py-12 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <motion.div
        className="absolute top-8 left-1/4 w-3 h-3 rounded-full bg-accent/30"
        animate={{ y: [0, -12, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-8 right-1/3 w-2 h-2 rounded-full bg-success/30"
        animate={{ y: [0, 8, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 lg:px-12 xl:px-16 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-5"
          >
            <Handshake className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Trusted by the Best</span>
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-2">
            Our{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-success">
              Partners
            </span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Join {partnerLogos.length}+ leading organizations shaping the future of XR in India
          </p>
        </motion.div>
      </div>
      
      {/* Marquee container */}
      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
        
        {/* Row 1 - scrolling left */}
        <div className="flex mb-3 overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 25,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {logosRow1.map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex-shrink-0 bg-card border border-border rounded-xl px-5 py-3 flex items-center justify-center min-w-[140px] hover:border-accent/40 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer"
              >
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Row 2 - scrolling right */}
        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: ['-50%', '0%'] }}
            transition={{
              duration: 30,
              ease: 'linear',
              repeat: Infinity,
            }}
          >
            {logosRow2.map((partner, index) => (
              <motion.div
                key={`${partner.id}-${index}`}
                whileHover={{ scale: 1.05, y: -3 }}
                className="flex-shrink-0 bg-card border border-border rounded-xl px-5 py-3 flex items-center justify-center min-w-[140px] hover:border-success/40 hover:shadow-lg hover:shadow-success/10 transition-all duration-300 cursor-pointer"
              >
                <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
