import { AnimatedSection } from '@/components/ui/AnimatedSection';
import { Users, Wrench, Award, Building } from 'lucide-react';

const differentiators = [
  { icon: Users, text: 'Community-first approach to everything we build' },
  { icon: Wrench, text: 'Hands-on learning through real projects' },
  { icon: Award, text: 'Real outcomes — jobs, projects, recognition' },
  { icon: Building, text: 'Trust from industry leaders and government' },
];

export const DifferentiatorSection = () => {
  return (
    <AnimatedSection className="py-12 bg-secondary/30">
      <div className="container-wide max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">What Makes Us Different</h2>
        <ul className="space-y-4">
          {differentiators.map((item, index) => (
            <li key={index} className="flex items-start gap-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-foreground pt-2">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </AnimatedSection>
  );
};
