import { motion } from 'framer-motion';
import { ShowcaseProject } from '@/data/showcase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Eye, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: ShowcaseProject;
  featured?: boolean;
  onViewDetails?: (project: ShowcaseProject) => void;
}

const categoryLabels: Record<string, string> = {
  ar: 'AR',
  vr: 'VR',
  webar: 'WebAR',
  snapar: 'SnapAR',
  hackathon: 'Hackathon',
  workshop: 'Workshop',
};

export const ProjectCard = ({ project, featured = false, onViewDetails }: ProjectCardProps) => {
  const handleClick = () => {
    if (project.projectUrl) {
      window.open(project.projectUrl, '_blank');
    } else if (onViewDetails) {
      onViewDetails(project);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`h-full bg-card border border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:border-accent/30 group ${featured ? 'md:col-span-2' : ''}`}>
        {/* Thumbnail placeholder */}
        <div className={`bg-gradient-to-br from-accent/10 via-secondary to-primary/10 ${featured ? 'aspect-video' : 'aspect-[4/3]'} flex items-center justify-center relative overflow-hidden`}>
          <motion.div 
            className="text-5xl opacity-50"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {project.categories.includes('vr') ? '🥽' : project.categories.includes('snapar') ? '📱' : '🔮'}
          </motion.div>
          
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        <CardContent className="p-4">
          {/* Categories */}
          <motion.div 
            className="flex flex-wrap gap-1.5 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {project.categories.slice(0, 3).map((cat, index) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {categoryLabels[cat]}
              </Badge>
            ))}
          </motion.div>

          {/* Title */}
          <h3 className={`font-semibold text-foreground mb-2 group-hover:text-accent transition-colors ${featured ? 'text-xl' : 'text-lg'}`}>
            {project.title}
          </h3>

          {/* Meta */}
          {project.builtDuring && (
            <p className="text-xs text-muted-foreground mb-2">
              Built during {project.builtDuring}
            </p>
          )}

          {/* Tech used */}
          <div className="flex flex-wrap gap-1 mb-2">
            {project.techUsed.map((tech, index) => (
              <span key={tech} className="text-xs text-accent font-medium">
                {tech}
                {index < project.techUsed.length - 1 && ' • '}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className={`text-muted-foreground mb-3 ${featured ? 'text-sm' : 'text-xs line-clamp-2'}`}>
            {project.description}
          </p>

          {/* Creator */}
          <p className="text-xs text-foreground mb-3">
            By <span className="font-medium text-accent">{project.creatorName}</span>
          </p>

          {/* Action */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleClick}
              variant="outline" 
              size="sm" 
              className="w-full group/btn hover:border-accent/50"
            >
              {project.projectUrl ? (
                <>
                  View Project
                  <ExternalLink className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </>
              ) : (
                <>
                  View Details
                  <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
