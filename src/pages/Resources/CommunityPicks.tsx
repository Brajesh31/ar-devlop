import { motion } from 'framer-motion';
import { communityPicks } from '@/data/resources';
import { Card, CardContent } from '@/components/ui/card';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { ArrowRight, User } from 'lucide-react';

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

export const CommunityPicks = () => {
  return (
    <section className="py-8 md:py-10 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>Community Picks</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-6">
            Shared by the Community
          </h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {communityPicks.map((pick) => (
            <motion.div
              key={pick.id}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <Card className="h-full bg-card border border-border transition-all duration-300 hover:border-accent/50 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <motion.div 
                      className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <User className="w-4 h-4 text-accent" />
                    </motion.div>
                    <span className="text-sm font-medium text-foreground">{pick.author}</span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground text-base mb-2 group-hover:text-accent transition-colors">
                    {pick.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {pick.description}
                  </p>
                  
                  <motion.a 
                    href={pick.url}
                    className="inline-flex items-center text-accent text-sm font-medium group/link"
                    whileHover={{ x: 4 }}
                  >
                    Read more
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                  </motion.a>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
