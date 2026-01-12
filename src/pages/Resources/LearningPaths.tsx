import { motion } from 'framer-motion';
import { learningPaths } from '@/data/resources';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionBadge } from '@/components/ui/SectionBadge';

const effortLabels: Record<string, { label: string; color: string }> = {
  beginner: { label: 'Beginner', color: 'bg-success/10 text-success' },
  intermediate: { label: 'Intermediate', color: 'bg-accent/10 text-accent' },
  advanced: { label: 'Advanced', color: 'bg-purple-500/10 text-purple-600' },
};

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
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const LearningPaths = () => {
  return (
    <section className="py-8 md:py-10 bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>Learning Paths</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-3">
            Structured Journeys for Every Level
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-6">
            Choose a path that matches your background and goals. Each path provides 
            a clear learning progression without overwhelming you.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="h-full bg-card border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <motion.span 
                      className="text-3xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {path.icon}
                    </motion.span>
                    <Badge className={`${effortLabels[path.effortLevel].color} border-0 text-xs`}>
                      {effortLabels[path.effortLevel].label}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {path.description}
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-xs font-medium text-foreground mb-1">Who it's for:</p>
                    <p className="text-xs text-muted-foreground">{path.whoFor}</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-foreground mb-2">What you'll learn:</p>
                    <ul className="space-y-1">
                      {path.whatYouLearn.map((item, itemIndex) => (
                        <motion.li 
                          key={itemIndex}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + itemIndex * 0.05 }}
                        >
                          <span className="text-accent mt-0.5">•</span>
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
