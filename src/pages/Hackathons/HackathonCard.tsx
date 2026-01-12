import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, ArrowRight, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Hackathon } from '@/data/hackathons';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface HackathonCardProps {
  hackathon: Hackathon;
}

const statusStyles = {
  live: 'bg-success text-success-foreground animate-pulse',
  upcoming: 'bg-accent text-accent-foreground',
  completed: 'bg-muted text-muted-foreground',
};

const statusLabels = {
  live: 'Live',
  upcoming: 'Upcoming',
  completed: 'Closed',
};

export const HackathonCard = ({ hackathon }: HackathonCardProps) => {
  const startDateFormatted = format(new Date(hackathon.startDate), 'MMM d, yyyy');
  const endDateFormatted = format(new Date(hackathon.endDate), 'MMM d, yyyy');
  const registrationDeadline = format(new Date(hackathon.registrationDeadline), 'MMM d, yyyy');

  return (
    <Link to={`/hackathons/${hackathon.id}`} className="block group">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-xl group-hover:shadow-accent/5 group-hover:border-accent/30 bg-card border-border">
          {/* Banner */}
          <div className="aspect-[16/9] bg-gradient-to-br from-accent/20 via-secondary to-success/20 relative overflow-hidden">
            {hackathon.image ? (
              <motion.img
                src={hackathon.image}
                alt={hackathon.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <motion.span 
                  className="text-5xl opacity-40"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  🚀
                </motion.span>
              </div>
            )}
            
            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge className={cn('font-medium text-xs', statusStyles[hackathon.status])}>
                {statusLabels[hackathon.status]}
              </Badge>
            </div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <CardContent className="p-4">
            {/* Meta Tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge variant="outline" className="text-xs capitalize">
                {hackathon.mode === 'offline' ? 'In-Person' : hackathon.mode}
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                {hackathon.teamSize === 'team' ? hackathon.teamSizeRange || 'Team' : 'Solo'}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {hackathon.fee === 'free' ? 'Free' : `₹${hackathon.feeAmount || 'Paid'}`}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
              {hackathon.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {hackathon.description}
            </p>

            {/* Hackathon Details */}
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{startDateFormatted} - {endDateFormatted}</span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="line-clamp-1">{hackathon.location}</span>
              </div>

              {hackathon.participants && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hackathon.participants.toLocaleString()}+ participants</span>
                </div>
              )}
            </div>

            {/* Important Dates */}
            {hackathon.status !== 'completed' && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-0.5">Registration closes</p>
                <p className="text-sm font-medium text-foreground">{registrationDeadline}</p>
              </div>
            )}

            {/* Prize Pool */}
            {hackathon.prizePool && (
              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                    <p className="text-base font-bold text-accent">{hackathon.prizePool}</p>
                  </div>
                </div>
                <motion.span 
                  className="text-sm font-medium text-accent flex items-center"
                  whileHover={{ x: 4 }}
                >
                  View Details
                  <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};
