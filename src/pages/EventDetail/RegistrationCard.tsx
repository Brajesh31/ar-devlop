import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { Event } from '@/data/events';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RegistrationCardProps {
  event: Event;
  isClosed: boolean; // <--- Added to handle logic from parent
  className?: string;
}

export const RegistrationCard = ({ event, isClosed, className }: RegistrationCardProps) => {
  const [countdown, setCountdown] = useState<string>('');

  // Use explicit registration deadline if available, otherwise start date
  const deadline = event.registrationDeadline
      ? new Date(event.registrationDeadline)
      : new Date(event.date);

  // --- Countdown Logic ---
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('Registration closed');
        return;
      }

      const days = differenceInDays(deadline, now);
      const hours = differenceInHours(deadline, now) % 24;
      const minutes = differenceInMinutes(deadline, now) % 60;

      if (days > 0) {
        setCountdown(`${days}d ${hours}h left`);
      } else if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m left`);
      } else {
        setCountdown(`${minutes}m left`);
      }
    };

    updateCountdown();
    // Only run interval if not closed
    if (!isClosed) {
      const interval = setInterval(updateCountdown, 60000);
      return () => clearInterval(interval);
    } else {
      setCountdown('Registration closed');
    }
  }, [deadline, isClosed]);

  return (
      <Card
          id="register-card" // <--- Important for Scroll-to-view
          className={cn('bg-card border-border shadow-md', className)}
      >
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">{event.title}</h3>

          {/* Registration Deadline Info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Calendar className="w-4 h-4" />
            <span>
            Deadline: {format(deadline, 'MMM d, yyyy, h:mm a')}
          </span>
          </div>

          {/* Countdown Timer (Only if open) */}
          {!isClosed && (
              <div className="flex items-center gap-2 text-sm mb-6 bg-blue-50 text-blue-700 p-2 rounded px-3 w-fit">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{countdown}</span>
              </div>
          )}

          {/* Fee Display */}
          <div className="p-4 bg-secondary/50 rounded-lg mb-6 border border-border/50">
            <p className="text-sm text-muted-foreground mb-1">Registration Fee</p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-foreground">
                {event.fee === 'free' ? 'Free' : `₹${event.feeAmount}`}
              </p>
              {event.fee !== 'free' && <span className="text-sm text-muted-foreground">/ person</span>}
            </div>
          </div>

          {/* Call to Action */}
          {!isClosed ? (
              <Link to={`/events/${event.id}/register`} className="block">
                <Button className="w-full h-12 text-lg font-semibold bg-[#FF6B35] hover:bg-[#E55A2B] text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                  Register Now
                </Button>
              </Link>
          ) : (
              <div className="space-y-3">
                <Button disabled className="w-full h-12 text-lg bg-slate-200 text-slate-500 border-slate-300">
                  Registration Closed
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  The deadline for this event has passed.
                </p>
              </div>
          )}
        </CardContent>
      </Card>
  );
};