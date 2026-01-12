import { AnimatedSection, AnimatedContainer, AnimatedItem } from '@/components/ui/AnimatedSection';
import { values } from '@/data/team';

export const ValuesSection = () => {
  return (
    <AnimatedSection className="py-16">
      <div className="container-wide">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">What We Believe</h2>
        <AnimatedContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => (
            <AnimatedItem key={value.title}>
              <div className="p-6 bg-card border border-border rounded-xl h-full">
                <span className="text-3xl mb-4 block">{value.icon}</span>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            </AnimatedItem>
          ))}
        </AnimatedContainer>
      </div>
    </AnimatedSection>
  );
};
