import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/components/ui/AnimatedSection';
import { team } from '@/data/team';

export const TeamSection = () => {
  // Skip founder (first item) as they're in Leadership section
  const teamMembers = team.slice(1);

  return (
    <AnimatedSection className="py-12 bg-secondary/30">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">Our Team</h2>
        <AnimatedContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <AnimatedItem key={member.id}>
              <div className="p-6 bg-background border border-border rounded-xl text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent">{member.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-accent mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedContainer>
      </div>
    </AnimatedSection>
  );
};
