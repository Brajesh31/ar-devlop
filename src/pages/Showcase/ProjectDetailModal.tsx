import { ShowcaseProject } from '@/data/showcase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, X } from 'lucide-react';

interface ProjectDetailModalProps {
  project: ShowcaseProject | null;
  open: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  ar: 'AR',
  vr: 'VR',
  webar: 'WebAR',
  snapar: 'SnapAR',
  hackathon: 'Hackathon',
  workshop: 'Workshop',
};

export const ProjectDetailModal = ({ project, open, onClose }: ProjectDetailModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {project.title}
          </DialogTitle>
        </DialogHeader>

        {/* Thumbnail placeholder */}
        <div className="bg-muted aspect-video rounded-lg flex items-center justify-center mb-4">
          <div className="text-6xl opacity-50">
            {project.categories.includes('vr') ? '🥽' : project.categories.includes('snapar') ? '📱' : '🔮'}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories.map((cat) => (
            <Badge key={cat} variant="secondary">
              {categoryLabels[cat]}
            </Badge>
          ))}
        </div>

        {/* Meta info */}
        {project.builtDuring && (
          <p className="text-sm text-muted-foreground mb-2">
            <span className="font-medium text-foreground">Built during:</span> {project.builtDuring}
          </p>
        )}

        {/* Tech stack */}
        <div className="mb-4">
          <p className="text-sm font-medium text-foreground mb-1">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {project.techUsed.map((tech) => (
              <Badge key={tech} variant="outline" className="text-accent border-accent/30">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4">
          {project.description}
        </p>

        {/* Creator */}
        <div className="border-t border-border pt-4">
          <p className="text-sm text-foreground">
            <span className="font-medium">Created by:</span> {project.creatorName}
          </p>
          {project.creatorTeam && (
            <p className="text-sm text-muted-foreground mt-1">
              Team: {project.creatorTeam}
            </p>
          )}
        </div>

        {/* External link if available */}
        {project.projectUrl && (
          <div className="mt-4">
            <Button 
              onClick={() => window.open(project.projectUrl, '_blank')}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              View Project
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
