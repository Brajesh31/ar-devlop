import { motion } from 'framer-motion';

const partners = [
  { name: 'Snap Inc.', logo: 'SNAP' },
  { name: 'Meta', logo: 'META' },
  { name: 'Google', logo: 'GOOGLE' },
  { name: 'Unity', logo: 'UNITY' },
  { name: 'AICTE', logo: 'AICTE' },
  { name: 'NASSCOM', logo: 'NASSCOM' },
  { name: 'Startup India', logo: 'STARTUP' },
  { name: 'Microsoft', logo: 'MSFT' },
  { name: 'Adobe', logo: 'ADOBE' },
  { name: 'Qualcomm', logo: 'QCOM' },
  { name: 'NVIDIA', logo: 'NVIDIA' },
  { name: 'AWS', logo: 'AWS' },
];

const MarqueeRow = ({ direction = 'left', speed = 30 }: { direction?: 'left' | 'right'; speed?: number }) => {
  const duplicatedPartners = [...partners, ...partners];
  
  return (
    <div className="flex overflow-hidden">
      <motion.div
        animate={{
          x: direction === 'left' ? [0, -50 * partners.length + '%'] : [-50 * partners.length + '%', 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        className="flex gap-8 py-4"
      >
        {duplicatedPartners.map((partner, index) => (
          <motion.div
            key={`${partner.name}-${index}`}
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 group"
          >
            <div className="px-8 py-6 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300 min-w-[150px] flex items-center justify-center">
              <span className="text-xl font-bold text-muted-foreground group-hover:text-accent transition-colors">
                {partner.logo}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export const PartnersMarquee = () => {
  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent" />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 container-narrow"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Our Partners
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Collaborating with top organizations to advance XR education in India
          </p>
        </motion.div>

        {/* Marquee rows */}
        <div className="space-y-4">
          <MarqueeRow direction="left" speed={40} />
          <MarqueeRow direction="right" speed={35} />
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container-narrow mt-12"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { value: '200+', label: 'Industry Partners' },
              { value: '50+', label: 'Academic Institutions' },
              { value: '10+', label: 'Government Bodies' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-accent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
