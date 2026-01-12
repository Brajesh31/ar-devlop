import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Target, Rocket, Lightbulb, Users } from 'lucide-react';
import { useRef } from 'react';

const Card3D = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set((mouseX / width) - 0.5);
    y.set((mouseY / height) - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const MissionVisionSection = () => {
  const cards = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To democratize XR education across India by providing accessible resources, hands-on workshops, and opportunities for students to learn and create with immersive technologies.',
      gradient: 'from-accent/10 to-accent/5',
      iconBg: 'from-accent to-accent/70',
      stats: [
        { value: '90K+', label: 'Students Reached' },
        { value: '500+', label: 'Colleges' },
      ],
    },
    {
      icon: Rocket,
      title: 'Our Vision',
      description: 'To establish India as a global leader in XR innovation by nurturing a thriving ecosystem of creators, developers, and entrepreneurs who will shape the future of immersive technology.',
      gradient: 'from-success/10 to-success/5',
      iconBg: 'from-success to-success/70',
      stats: [
        { value: '2030', label: 'Target Year' },
        { value: '1M+', label: 'Goal Members' },
      ],
    },
  ];

  const values = [
    { icon: Lightbulb, label: 'Innovation', description: 'Pushing boundaries' },
    { icon: Users, label: 'Community', description: 'Growing together' },
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Background decoration with accent/success colors */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-success/5 rounded-full blur-3xl" />
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
            Our Purpose
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Driving XR Innovation in India
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're on a mission to make extended reality accessible to every Indian student
          </p>
        </motion.div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <Card3D className="h-full">
                <div className={`h-full p-8 rounded-3xl bg-gradient-to-br ${card.gradient} border border-border bg-card relative overflow-hidden group`}>
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-accent/10 via-transparent to-success/10" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <card.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold mb-4">{card.title}</h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8">
                      {card.stats.map((stat) => (
                        <div key={stat.label}>
                          <div className="text-2xl font-bold text-accent">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Core Values Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {values.map((value, index) => (
            <motion.div
              key={value.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-3 px-6 py-3 rounded-full bg-card border border-border"
            >
              <value.icon className="w-5 h-5 text-accent" />
              <div>
                <span className="font-medium">{value.label}</span>
                <span className="text-muted-foreground text-sm ml-2">{value.description}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
