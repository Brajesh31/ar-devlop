import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageCircle, Users, Globe, Zap, TrendingUp } from 'lucide-react';

const platforms = [
  { name: 'Discord', members: '25,000+', icon: MessageCircle, color: 'accent', activity: 85 },
  { name: 'LinkedIn', members: '30,000+', icon: Users, color: 'success', activity: 92 },
  { name: 'Instagram', members: '20,000+', icon: Globe, color: 'accent', activity: 78 },
  { name: 'WhatsApp', members: '15,000+', icon: Zap, color: 'success', activity: 95 },
];

const regions = [
  { name: 'North India', percentage: 35 },
  { name: 'South India', percentage: 28 },
  { name: 'West India', percentage: 22 },
  { name: 'East India', percentage: 15 },
];

export const CommunityStats = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Community Pulse
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            A Thriving <span className="text-accent">Ecosystem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time engagement across our community platforms
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold mb-6">Platform Presence</h3>
            
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-accent/30 transition-all duration-300">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    platform.color === 'accent' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-success/10 text-success'
                  }`}>
                    <platform.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-sm text-muted-foreground">{platform.members}</span>
                    </div>
                    
                    {/* Activity bar */}
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${platform.activity}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          platform.color === 'accent' ? 'bg-accent' : 'bg-success'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Activity indicator */}
                  <div className="flex items-center gap-1 text-success">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-xs font-medium">{platform.activity}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Regional Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold mb-6">Geographic Reach</h3>

            {/* India Map Placeholder */}
            <div className="relative aspect-square max-w-sm mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/10 via-success/5 to-accent/10 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-accent/5 to-success/5 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent">
                    28
                  </div>
                  <div className="text-sm text-muted-foreground">States Covered</div>
                </div>
              </div>
              
              {/* Animated dots around the circle */}
              {regions.map((region, index) => {
                const angle = (index * 90 - 45) * (Math.PI / 180);
                const radius = 45;
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);
                
                return (
                  <motion.div
                    key={region.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="absolute"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                  >
                    <div className="px-3 py-1.5 rounded-full bg-card border border-border shadow-lg text-xs font-medium whitespace-nowrap">
                      {region.name}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Region breakdown */}
            <div className="grid grid-cols-2 gap-4">
              {regions.map((region, index) => (
                <motion.div
                  key={region.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-xl bg-card border border-border"
                >
                  <div className={`text-2xl font-bold ${index % 2 === 0 ? 'text-accent' : 'text-success'}`}>
                    {region.percentage}%
                  </div>
                  <div className="text-sm text-muted-foreground">{region.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-success/5 to-accent/10 border border-border"
        >
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
            {[
              { value: '1M+', label: 'Content Views Monthly' },
              { value: '50K+', label: 'Event Registrations' },
              { value: '10K+', label: 'Projects Submitted' },
              { value: '99%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div key={stat.label}>
                <div className={`text-2xl md:text-3xl font-bold ${index % 2 === 0 ? 'text-accent' : 'text-success'}`}>{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};