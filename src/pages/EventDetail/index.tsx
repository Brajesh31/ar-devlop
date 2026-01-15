import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { publicService, studentService } from '@/services/api'; // Added studentService
import { Event } from '@/data/events';
import { useAuth } from '@/hooks/useAuth'; // Added useAuth

import { EventHero } from './EventHero';
import { QuickInfoRow } from './QuickInfoRow';
import { AboutEvent } from './AboutEvent';
import { EventHighlights } from './EventHighlights';
import { EligibilitySection } from './EligibilitySection';
import { ParticipantTypes } from './ParticipantTypes';
import { StepsToParticipate } from './StepsToParticipate';
import { RewardsSection } from './RewardsSection';
import { EventTimeline } from './EventTimeline';
import { EventFAQs } from './EventFAQs';
import { TermsSection } from './TermsSection';
import { RegistrationCard } from './RegistrationCard';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get current user

  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false); // Track registration status

  // 1. Fetch Event Data & Registration Status
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        // Parallel Fetch: Event Details & User Registrations (if logged in)
        const [eventRes, myEventsRes] = await Promise.all([
          publicService.events.getById(id),
          user ? studentService.getMyEvents() : Promise.resolve({ data: [] })
        ]);

        if (eventRes.status === 'success' && eventRes.data) {
          const dbEvent = eventRes.data;

          // ... (keep existing mapping logic unchanged) ...
          const parse = (jsonStr: unknown) => {
            if (typeof jsonStr !== 'string') return jsonStr || [];
            try { return JSON.parse(jsonStr); } catch { return []; }
          };

          const mappedEvent = {
            id: dbEvent.event_id,
            title: dbEvent.title,
            description: dbEvent.description || "",
            longDescription: dbEvent.long_description || "",
            date: dbEvent.start_date,
            endDate: dbEvent.end_date,
            registrationDeadline: dbEvent.registration_deadline,
            mode: (dbEvent.mode || 'online').toLowerCase(),
            location: dbEvent.mode === 'online' ? 'Online' : (dbEvent.location_city || 'TBA'),
            venue: dbEvent.venue_name,
            type: (dbEvent.event_type || 'workshop').toLowerCase(),
            fee: (dbEvent.fee_type || 'free').toLowerCase(),
            feeAmount: dbEvent.price,
            teamSize: dbEvent.team_size,
            image: dbEvent.banner_image_url,
            status: 'upcoming',
            tags: parse(dbEvent.tags),
            eligibility: parse(dbEvent.eligibility),
            rewards: parse(dbEvent.rewards),
            timeline: parse(dbEvent.timeline),
            faqs: parse(dbEvent.faqs),
            terms: dbEvent.terms_conditions,
          };

          setEvent(mappedEvent as unknown as Event);

          // CHECK REGISTRATION STATUS
          if (myEventsRes && Array.isArray(myEventsRes.data)) {
            const isReg = myEventsRes.data.some((e: any) => String(e.event_id) === String(dbEvent.event_id));
            setIsRegistered(isReg);
          }

        } else {
          navigate('/events');
        }
      } catch (error) {
        console.error("Failed to load event details", error);
        navigate('/events');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, navigate, user]);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!event) return null;

  const now = new Date();
  const deadline = event.registrationDeadline
      ? new Date(event.registrationDeadline)
      : new Date(event.date);

  const isRegistrationClosed = now > deadline;

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Pass isRegistered to Hero */}
          <EventHero
              event={event}
              isClosed={isRegistrationClosed}
              isRegistered={isRegistered}
          />
          <QuickInfoRow event={event} />

          <div className="container-wide py-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <AboutEvent event={event} />
                <EventHighlights event={event} />
                <EligibilitySection event={event} />
                <ParticipantTypes event={event} />
                <StepsToParticipate event={event} />
                <RewardsSection event={event} />
                <EventTimeline event={event} />
                <EventFAQs event={event} />
                <TermsSection event={event} />
              </div>

              <div className="lg:col-span-1 mt-8 lg:mt-0">
                <div className="lg:sticky lg:top-28">
                  {/* Pass isRegistered to RegistrationCard */}
                  <RegistrationCard
                      event={event}
                      isClosed={isRegistrationClosed}
                      isRegistered={isRegistered} // <--- Pass the prop here
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:hidden container-wide pb-8">
            <RegistrationCard
                event={event}
                isClosed={isRegistrationClosed}
                isRegistered={isRegistered} // <--- And here
            />
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default EventDetailPage;