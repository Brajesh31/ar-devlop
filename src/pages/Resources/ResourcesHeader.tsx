import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const ResourcesHeader = () => {
  return (
    <>
      <Header />
      <motion.section 
        className="pt-20 pb-6 md:pt-24 md:pb-8 bg-background"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container-wide">
          <motion.h1 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            <span className="text-accent">Resources</span>
          </motion.h1>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-muted-foreground max-w-2xl"
          >
            Curated learning paths, tools, and references to help you explore, build, and grow in XR.
          </motion.p>
        </div>
      </motion.section>
    </>
  );
};
