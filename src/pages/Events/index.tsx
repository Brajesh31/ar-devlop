import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SEOHead } from '@/components/seo/SEOHead';
import { seoConfig } from '@/config/seo';
import { EventsHeader } from './EventsHeader';
import { EventFilterBar } from './EventFilterBar';
import { EventsGrid } from './EventsGrid';
import { NoEventsState } from './NoEventsState';
import { EventType, EventMode, EventStatus, EventFee } from '@/data/events';
import { publicService } from '@/services/api';
import { Loader2 } from 'lucide-react';

const EventsPage = () => {
  const [apiEvents, setApiEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [selectedMode, setSelectedMode] = useState<EventMode | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | null>(null);
  const [selectedFee, setSelectedFee] = useState<EventFee | null>(null);

  // 1. Fetch Events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await publicService.events.list();
        if (res.status === 'success') {
          // console.log("Fetched Events:", res.data); // Debugging Log
          setApiEvents(res.data);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 2. Map Database Fields to UI Format & Calculate Status
  const mappedEvents = useMemo(() => {
    const now = new Date();

    return apiEvents.map(e => {
      // FIX: Ensure safe date parsing for Safari/Firefox
      const safeStartDate = e.start_date ? e.start_date.replace(" ", "T") : "";
      const safeEndDate = e.end_date ? e.end_date.replace(" ", "T") : "";

      const startDate = new Date(safeStartDate);
      // Default end time to 2 hours after start if not provided
      const endDate = safeEndDate ? new Date(safeEndDate) : new Date(startDate.getTime() + (2 * 60 * 60 * 1000));

      // --- STATUS LOGIC (Matching 'EventStatus' type) ---
      let calculatedStatus: EventStatus = 'upcoming'; // Default

      if (now > endDate) {
        calculatedStatus = 'completed'; // Matches 'EventStatus' type
      } else if (now >= startDate && now <= endDate) {
        calculatedStatus = 'live';      // Matches 'EventStatus' type
      } else if (now < startDate) {
        calculatedStatus = 'upcoming';  // Matches 'EventStatus' type
      }

      return {
        id: e.event_id,
        slug: e.slug, // <--- ADDED SLUG HERE
        title: e.title,
        description: e.description,
        type: (e.event_type || 'workshop').toLowerCase() as EventType,
        date: safeStartDate,
        startDateObj: startDate, // For sorting
        mode: (e.mode || 'online').toLowerCase() as EventMode,
        location: e.mode === 'online' ? 'Online' : e.location_city,
        image: e.banner_image_url,
        fee: (e.fee_type || 'free').toLowerCase() as EventFee,
        price: e.price,
        status: calculatedStatus,
        registration_deadline: e.registration_deadline
      };
    });
  }, [apiEvents]);

  // 3. Filter & Sort Logic
  const filteredEvents = useMemo(() => {
    let filtered = [...mappedEvents];

    // Apply Filters
    if (selectedType) {
      filtered = filtered.filter(e => e.type === selectedType);
    }
    if (selectedMode) {
      filtered = filtered.filter(e => e.mode === selectedMode);
    }
    if (selectedStatus) {
      filtered = filtered.filter(e => e.status === selectedStatus);
    }
    if (selectedFee) {
      filtered = filtered.filter(e => e.fee === selectedFee);
    }

    // Apply Sorting: Live -> Upcoming (Nearest) -> Completed (Most Recent)
    return filtered.sort((a, b) => {
      // 1. Prioritize Status Groups
      const statusOrder = { 'live': 0, 'upcoming': 1, 'completed': 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];
      if (statusDiff !== 0) return statusDiff;

      // 2. Sort within groups
      if (a.status === 'completed') {
        // Completed events: Show most recent first (Descending)
        return b.startDateObj.getTime() - a.startDateObj.getTime();
      } else {
        // Upcoming/Live: Show nearest start date first (Ascending)
        return a.startDateObj.getTime() - b.startDateObj.getTime();
      }
    });
  }, [mappedEvents, selectedType, selectedMode, selectedStatus, selectedFee]);

  const handleReset = () => {
    setSelectedType(null);
    setSelectedMode(null);
    setSelectedStatus(null);
    setSelectedFee(null);
  };

  return (
      <div className="min-h-screen bg-background">
        <SEOHead {...seoConfig.events} />
        <Header />
        <main>
          <EventsHeader />

          <EventFilterBar
              selectedType={selectedType}
              selectedMode={selectedMode}
              selectedStatus={selectedStatus}
              selectedFee={selectedFee}
              onTypeChange={setSelectedType}
              onModeChange={setSelectedMode}
              onStatusChange={setSelectedStatus}
              onFeeChange={setSelectedFee}
              onReset={handleReset}
          />

          {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF6B35]" />
              </div>
          ) : filteredEvents.length > 0 ? (
              <EventsGrid events={filteredEvents} />
          ) : (
              <NoEventsState onReset={handleReset} />
          )}
        </main>
        <Footer />
      </div>
  );
};

export default EventsPage;