import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Event } from '@/data/events';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface EventHeroProps {
  event: Event;
  isClosed: boolean; // <--- Added Prop to fix TS Error
}

const statusStyles = {
  live: 'bg-green-100 text-green-700 border-green-200',
  upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const EventHero = ({ event, isClosed }: EventHeroProps) => {

  // Scroll to registration card handler
  const handleRegisterClick = () => {
    if (isClosed) return;
    const element = document.getElementById('register-card');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
      <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-24 pb-8 md:pt-28 md:pb-12"
      >
        <div className="container-wide">
          {/* Back Link */}
          <Link
              to="/events"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Events</span>
          </Link>

          {/* Hero Banner */}
          <div className="aspect-[21/9] md:aspect-[3/1] bg-slate-100 rounded-xl overflow-hidden mb-8 border border-slate-200 relative">
            {event.image ? (
                <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-6xl md:text-8xl opacity-20 grayscale">
                {event.type === 'hackathon' && '🚀'}
                {event.type === 'workshop' && '🛠️'}
                {event.type === 'challenge' && '🏆'}
                {event.type === 'meetup' && '👥'}
              </span>
                </div>
            )}

            {/* Mobile Overlay Badge */}
            <div className="absolute top-4 right-4 md:hidden">
              <Badge className={cn('font-medium shadow-sm', statusStyles[event.status])}>
                {event.status === 'live' ? 'Live Now' : event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
              </Badge>
            </div>
          </div>

          {/* Title and Meta */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start justify-between gap-4"
              >
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
                    {event.title}
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>

              {/* Meta Pills & Actions */}
              <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
              >
                <div className="flex flex-wrap gap-2">
                  <Badge className={cn('font-medium hidden md:inline-flex', statusStyles[event.status])}>
                    {event.status === 'live' ? 'Live Now' : event.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </Badge>
                  <Badge variant="outline" className="capitalize px-3 py-1 text-sm">
                    {event.mode === 'offline' ? 'In-Person' : event.mode}
                  </Badge>
                  {event.teamSize && (
                      <Badge variant="outline" className="px-3 py-1 text-sm">{event.teamSize}</Badge>
                  )}
                  <Badge variant="outline" className="px-3 py-1 text-sm bg-slate-50">
                    {event.fee === 'free' ? 'Free Entry' : `₹${event.feeAmount}`}
                  </Badge>
                </div>

                {/* Primary CTA for Mobile/Tablet (Desktop uses Sidebar) */}
                <Button
                    onClick={handleRegisterClick}
                    disabled={isClosed}
                    className={`lg:hidden w-full sm:w-auto h-11 text-base font-medium shadow-md ${
                        isClosed
                            ? "bg-slate-300 text-slate-500 hover:bg-slate-300 cursor-not-allowed"
                            : "bg-[#FF6B35] hover:bg-[#E55A2B] text-white"
                    }`}
                >
                  {isClosed ? "Registration Closed" : "Register Now"}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>
  );
};