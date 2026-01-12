import { motion } from 'framer-motion';
import { ArrowRight, Rocket, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const AboutCTA3D = () => {
  const ctaCards = [
    {
      icon: Users,
      title: 'Join Community',
      description: 'Connect with 90,000+ XR enthusiasts',
      link: '/contact',
      color: 'from-accent to-accent/70',
    },
    {
      icon: Calendar,
      title: 'Attend Events',
      description: 'Workshops, hackathons & meetups',
      link: '/events',
      color: 'from-success to-success/70',
    },
    {
      icon: Rocket,
      title: 'Partner With Us',
      description: 'Collaborate for XR innovation',
      link: '/partner',
      color: 'from-accent to-success',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-success/5" />
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--accent) / 0.15) 0%, transparent 50%)`,
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="container-narrow relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
          >
            Ready to Shape India's{' '}
            <span className="bg-gradient-to-r from-accent via-success to-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              XR Future
            </span>
            ?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            Whether you're a student, creator, or organization, there's a place for you 
            in India's largest XR community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground group">
              <Link to="/events">
                Explore Events
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {ctaCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={card.link}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 h-full shadow-sm"
                >
                  {/* Icon */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <card.icon className="w-7 h-7 text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {card.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-accent font-medium text-sm">
                    Learn more
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Contact info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 text-muted-foreground"
        >
          <p>
            Have questions? Reach out to{' '}
            <a href="mailto:chhavi@bharatxr.co" className="text-accent hover:underline">
              chhavi@bharatxr.co
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};
