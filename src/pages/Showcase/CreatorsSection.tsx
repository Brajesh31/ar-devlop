import { motion } from 'framer-motion';
import { showcaseCreators } from '@/data/showcase';
import { Card, CardContent } from '@/components/ui/card';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { User } from 'lucide-react';

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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const CreatorsSection = () => {
  return (
    <section className="py-8 md:py-10 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>Creators & Teams</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-6">
            The People Behind the Projects
          </h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {showcaseCreators.map((creator, index) => (
            <motion.div
              key={creator.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="h-full bg-card border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-md">
                <CardContent className="p-4">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <User className="w-5 h-5 text-accent" />
                  </motion.div>
                  
                  <h3 className="font-semibold text-foreground text-base mb-0.5 group-hover:text-accent transition-colors">
                    {creator.name}
                  </h3>
                  
                  <p className="text-accent text-xs font-medium mb-2">
                    {creator.role}
                  </p>
                  
                  <p className="text-muted-foreground text-xs mb-2 line-clamp-2">
                    {creator.bio}
                  </p>
                  
                  {creator.associatedProgram && (
                    <p className="text-xs text-muted-foreground">
                      <span className="text-foreground font-medium">{creator.projectCount}</span> projects • {creator.associatedProgram}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
