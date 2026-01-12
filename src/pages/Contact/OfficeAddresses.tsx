import { motion } from 'framer-motion';
import { officeAddresses } from '@/data/contact';
import CitySkyline from '@/components/ui/CitySkyline';
import { MapPin } from 'lucide-react';
import { DecorativeLine } from '@/components/ui/DecorativeElements';

const cityToSkyline: Record<string, 'delhi' | 'bengaluru' | 'mumbai'> = {
  'Delhi NCR': 'delhi',
  'Bengaluru': 'bengaluru',
  'Mumbai': 'mumbai'
};

const OfficeAddresses = () => {
  return (
    <section className="relative py-10 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute w-full h-full opacity-[0.015]" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
          <path
            d="M100,200 Q200,100 300,200 T500,200 T700,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8,8"
            className="text-foreground"
          />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-success" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                Our Presence
              </h2>
              <p className="text-sm text-muted-foreground">
                Operational across India
              </p>
            </div>
          </div>
          <DecorativeLine className="flex-1 hidden md:block" />
        </motion.div>

        {/* Office Cards - Horizontal scroll on mobile */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-5">
          {officeAddresses.map((office, index) => (
            <motion.div
              key={office.city}
              className="flex-1 min-w-0"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <motion.div 
                className="group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden h-full"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative p-5">
                  {/* Pin indicator */}
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-0.5">
                    {office.city}
                  </h3>
                  <p className="text-xs font-medium text-success mb-2">
                    {office.country}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {office.address}
                  </p>
                </div>
                
                {/* Animated Skyline */}
                <motion.div 
                  className="px-3 pb-1 relative overflow-hidden"
                  initial={{ opacity: 0.4 }}
                  whileHover={{ opacity: 0.7 }}
                  transition={{ duration: 0.3 }}
                >
                  <CitySkyline 
                    city={cityToSkyline[office.city] || 'delhi'} 
                    className="opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                  />
                </motion.div>
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-success/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Connecting dots between cities */}
        <div className="hidden md:flex justify-center items-center mt-6 gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-success/40" />
            <div className="w-16 h-px bg-gradient-to-r from-success/40 to-success/20" />
            <div className="w-2 h-2 rounded-full bg-success/30" />
            <div className="w-16 h-px bg-gradient-to-r from-success/20 to-success/40" />
            <div className="w-2 h-2 rounded-full bg-success/40" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfficeAddresses;
