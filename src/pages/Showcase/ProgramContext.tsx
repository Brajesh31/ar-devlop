import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { ArrowRight, Calendar, Code, GraduationCap } from 'lucide-react';

const programs = [
  {
    title: 'Events',
    description: 'Conferences, meetups, and community gatherings that spark collaboration.',
    icon: Calendar,
    link: '/events',
  },
  {
    title: 'Hackathons',
    description: 'Build real projects under time pressure with mentorship and resources.',
    icon: Code,
    link: '/hackathons',
  },
  {
    title: 'Workshops',
    description: 'Hands-on learning sessions to master XR tools and techniques.',
    icon: GraduationCap,
    link: '/events',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const ProgramContext = () => {
  return (
    <section className="py-8 md:py-10 bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>Built Through Bharat XR Programs</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-3">
            Where These Projects Come From
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Every project in our showcase was built through a Bharat XR program. 
            Join one and start building your own XR portfolio.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <Link 
                to={program.link}
                className="group block bg-card border border-border rounded-xl p-5 transition-all duration-300 hover:border-accent/50 hover:shadow-md h-full"
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <program.icon className="w-8 h-8 text-accent mb-3" />
                </motion.div>
                <h3 className="font-semibold text-foreground text-base mb-2 group-hover:text-accent transition-colors">
                  {program.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {program.description}
                </p>
                <span className="inline-flex items-center text-accent text-sm font-medium">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
