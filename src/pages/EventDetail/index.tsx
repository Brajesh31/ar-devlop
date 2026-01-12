import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { publicService } from '@/services/api';
import { Event } from '@/data/events';

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
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Event Data
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return;

      try {
        const res = await publicService.events.getById(id);
        if (res.status === 'success' && res.data) {
          const dbEvent = res.data;

          // FIX 1: Replaced 'any' with 'unknown' for type safety (ESLint fix)
          // Also handles cases where input might be null or undefined
          const parse = (jsonStr: unknown) => {
            if (typeof jsonStr !== 'string') return jsonStr || [];
            try {
              return JSON.parse(jsonStr);
            } catch {
              return [];
            }
          };

          // FIX 2: Removed explicit ': Event' type annotation here.
          // This prevents TS2353 (Excess Property Check) if 'rewards' is missing
          // from your imported Event interface.
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

            // Complex JSON Fields
            eligibility: parse(dbEvent.eligibility),
            rewards: parse(dbEvent.rewards), // This property was causing TS2353
            timeline: parse(dbEvent.timeline),
            faqs: parse(dbEvent.faqs),
            terms: dbEvent.terms_conditions,

            // Optional fields
            highlights: undefined,
            participantTypes: undefined,
            steps: undefined
          };

          // Cast to Event to satisfy the state setter
          setEvent(mappedEvent as unknown as Event);
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

    loadEvent();
  }, [id, navigate]);

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
    );
  }

  if (!event) return null;

  // 2. Logic: Check if Registration is Closed
  const now = new Date();
  const deadline = event.registrationDeadline
      ? new Date(event.registrationDeadline)
      : new Date(event.date); // Fallback to start date

  const isRegistrationClosed = now > deadline;

  return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          {/* Pass isClosed to Hero for the main CTA */}
          <EventHero event={event} isClosed={isRegistrationClosed} />
          <QuickInfoRow event={event} />

          <div className="container-wide py-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <AboutEvent event={event} />
                <EventHighlights event={event} />
                <EligibilitySection event={event} />
                <ParticipantTypes event={event} />
                <StepsToParticipate event={event} />

                {/* Ensure RewardsSection can handle the data structure */}
                <RewardsSection event={event} />

                <EventTimeline event={event} />
                <EventFAQs event={event} />
                <TermsSection event={event} />
              </div>

              {/* Sidebar - Registration Card */}
              <div className="lg:col-span-1 mt-8 lg:mt-0">
                <div className="lg:sticky lg:top-28">
                  <RegistrationCard event={event} isClosed={isRegistrationClosed} />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Registration Card */}
          <div className="lg:hidden container-wide pb-8">
            <RegistrationCard event={event} isClosed={isRegistrationClosed} />
          </div>
        </main>
        <Footer />
      </div>
  );
};

export default EventDetailPage;