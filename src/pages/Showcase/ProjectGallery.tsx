import { motion } from 'framer-motion';
import { ShowcaseProject } from '@/data/showcase';
import { ProjectCard } from './ProjectCard';

interface ProjectGalleryProps {
  projects: ShowcaseProject[];
  onViewDetails?: (project: ShowcaseProject) => void;
}

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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export const ProjectGallery = ({ projects, onViewDetails }: ProjectGalleryProps) => {
  if (projects.length === 0) {
    return (
      <motion.section 
        className="py-8 bg-background"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container-wide">
          <div className="text-center py-12">
            <motion.p 
              className="text-muted-foreground text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              No projects match your filters.
            </motion.p>
            <motion.p 
              className="text-sm text-muted-foreground mt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Try removing some filters to see more projects.
            </motion.p>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <section className="py-6 md:py-8 bg-background">
      <div className="container-wide">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
            >
              <ProjectCard 
                project={project} 
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
