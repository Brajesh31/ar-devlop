import { motion } from 'framer-motion';
import { getFeaturedProjects, ShowcaseProject } from '@/data/showcase';
import { ProjectCard } from './ProjectCard';
import { SectionBadge } from '@/components/ui/SectionBadge';

interface FeaturedProjectsProps {
  onViewDetails?: (project: ShowcaseProject) => void;
}

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const FeaturedProjects = ({ onViewDetails }: FeaturedProjectsProps) => {
  const featured = getFeaturedProjects();

  if (featured.length === 0) return null;

  return (
    <section className="py-8 md:py-10 bg-secondary/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionBadge>Featured Projects</SectionBadge>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-3 mb-6">
            Standout Work from Our Community
          </h2>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {featured.slice(0, 3).map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
            >
              <ProjectCard 
                project={project} 
                featured 
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
