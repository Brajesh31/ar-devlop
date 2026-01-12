import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { founder } from '@/data/team';
import { Linkedin, Twitter } from 'lucide-react';

export const LeadershipSection = () => {
  return (
    <AnimatedSection className="py-16">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Leadership</h2>
        <div className="max-w-2xl">
          <div className="flex flex-col md:flex-row gap-6 p-6 bg-card border border-border rounded-xl">
            <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-success/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl font-bold text-accent">CG</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{founder.name}</h3>
              <p className="text-accent font-medium mb-3">{founder.role}</p>
              <p className="text-muted-foreground text-sm mb-4">{founder.bio}</p>
              <div className="flex gap-2">
                {founder.linkedin && (
                  <a href={founder.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                    <Linkedin className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
                {founder.twitter && (
                  <a href={founder.twitter} target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors">
                    <Twitter className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
