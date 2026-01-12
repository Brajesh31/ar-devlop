import { User, Globe, Users } from 'lucide-react';
import { Event } from '@/data/events';
import { Card, CardContent } from '@/components/ui/card';

interface EligibilitySectionProps {
  event: Event;
}

export const EligibilitySection = ({ event }: EligibilitySectionProps) => {
  if (!event.eligibility) return null;

  const { age, region, openFor } = event.eligibility;

  const eligibilityItems = [
    { icon: User, label: 'Age Requirement', value: age || 'All ages welcome' },
    { icon: Globe, label: 'Region', value: region || 'Open to all' },
    { icon: Users, label: 'Open For', value: openFor?.join(', ') || 'Everyone' },
  ].filter(item => item.value);

  return (
    <section className="py-12">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-6">Who Can Participate</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eligibilityItems.map((item, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                    <p className="font-medium text-foreground">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
