import { motion } from 'framer-motion';

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

export const AboutHero = () => {
  const titleWords = ['About', 'Bharat', 'XR'];

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="pt-20 pb-8 md:pt-24 md:pb-10 relative"
    >
      <div className="container-wide">
        <motion.h1 
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 flex flex-wrap gap-x-3"
        >
          {titleWords.map((word, index) => (
            <motion.span
              key={index}
              variants={itemVariants}
              className={word === 'XR' ? 'text-accent' : ''}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl"
        >
          More than a community — a{' '}
          <motion.span 
            className="text-foreground font-medium relative inline-block"
            whileHover={{ scale: 1.02 }}
          >
            movement
            <motion.span 
              className="absolute bottom-0 left-0 w-full h-0.5 bg-accent origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            />
          </motion.span>{' '}
          empowering India's next generation of XR creators.
        </motion.p>
      </div>
    </motion.section>
  );
};
