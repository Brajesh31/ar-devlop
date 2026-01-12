import { motion } from 'framer-motion';
import { Heart, Lightbulb, Users, Rocket, Shield, Globe } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Everything we build starts with our members. Their growth is our success.',
    color: 'accent',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We push boundaries and explore new frontiers in immersive technology.',
    color: 'success',
  },
  {
    icon: Users,
    title: 'Inclusivity',
    description: 'XR education should be accessible to every student, regardless of background.',
    color: 'accent',
  },
  {
    icon: Rocket,
    title: 'Excellence',
    description: 'We strive for the highest quality in workshops, content, and experiences.',
    color: 'success',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Transparency and honesty guide all our partnerships and interactions.',
    color: 'accent',
  },
  {
    icon: Globe,
    title: 'Impact',
    description: 'Creating lasting change in India\'s technology landscape and beyond.',
    color: 'success',
  },
];

export const ValuesGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
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
            Our Values
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            What Drives Us Forward
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The principles that guide every decision we make
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group"
            >
              <div className="h-full p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 shadow-sm">
                {/* Icon */}
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                    value.color === 'accent' 
                      ? 'bg-accent/10 text-accent' 
                      : 'bg-success/10 text-success'
                  }`}
                >
                  <value.icon className="w-7 h-7" />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
