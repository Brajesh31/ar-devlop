import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Ticket } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Event } from '@/data/events';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EventCardProps {
  event: Event;
}

const statusStyles = {
  live: 'bg-success text-success-foreground',
  upcoming: 'bg-accent text-accent-foreground',
  completed: 'bg-muted text-muted-foreground',
};

const statusLabels = {
  live: 'Live Now',
  upcoming: 'Upcoming',
  completed: 'Completed',
};

export const EventCard = ({ event }: EventCardProps) => {
  const formattedDate = format(new Date(event.date), 'MMM d, yyyy');
  const endDateFormatted = event.endDate 
    ? format(new Date(event.endDate), 'MMM d, yyyy')
    : null;

  return (
    <Link to={`/events/${event.id}`} className="block group">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card border-border">
        {/* Banner */}
        <div className="aspect-[16/9] bg-gradient-to-br from-secondary to-muted relative overflow-hidden">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl opacity-30">
                {event.type === 'hackathon' && '🚀'}
                {event.type === 'workshop' && '🛠️'}
                {event.type === 'challenge' && '🏆'}
                {event.type === 'meetup' && '👥'}
              </span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <Badge className={cn('font-medium', statusStyles[event.status])}>
              {statusLabels[event.status]}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5">
          {/* Meta Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs capitalize">
              {event.type}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {event.mode === 'offline' ? 'In-Person' : event.mode}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {event.fee === 'free' ? 'Free' : `₹${event.feeAmount || 'Paid'}`}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {event.description}
          </p>

          {/* Event Details */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>
                {formattedDate}
                {endDateFormatted && ` - ${endDateFormatted}`}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span>{event.location}</span>
            </div>

            {event.teamSize && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4 flex-shrink-0" />
                <span>{event.teamSize}</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-border">
            <span className="text-sm font-medium text-accent group-hover:underline">
              View Details →
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
