import { Trophy, Medal, Award, Gift } from 'lucide-react';
import { Event } from '@/data/events';
import { Card, CardContent } from '@/components/ui/card';

interface RewardsSectionProps {
  event: Event;
}

const rewardIcons: Record<string, React.ElementType> = {
  Winner: Trophy,
  'First Runner-up': Medal,
  'Second Runner-up': Award,
  'All Participants': Gift,
  'All Attendees': Gift,
  'Best Lens': Trophy,
};

export const RewardsSection = ({ event }: RewardsSectionProps) => {
  if (!event.rewards || event.rewards.length === 0) return null;

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container-wide">
        <h2 className="text-2xl font-bold text-foreground mb-8">Rewards & Recognition</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {event.rewards.map((reward, index) => {
            const Icon = rewardIcons[reward.position] || Gift;
            return (
              <Card key={index} className="bg-background border-border text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{reward.position}</h3>
                  <p className="text-sm text-muted-foreground">{reward.prize}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
