import { motion } from 'framer-motion';
import { resourceCategories } from '@/data/resources';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const LearningCategories = () => {
  return (
    <section className="py-8 md:py-10 bg-background">
      <div className="container-wide">
        <motion.h2 
          className="text-2xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Explore by Category
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {resourceCategories.map((category, index) => (
            <motion.div
              key={category.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="h-full bg-card border border-border cursor-pointer transition-all duration-300 hover:border-accent/50 hover:shadow-md">
                <CardContent className="p-5">
                  <motion.div 
                    className="text-3xl mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {category.icon}
                  </motion.div>
                  <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center text-accent text-sm font-medium">
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
