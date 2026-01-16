import { useState, useMemo, useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { motion, AnimatePresence, Variants } from 'framer-motion';
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
import { Zap } from 'lucide-react';

// --- INTERFACES ---

// 1. Raw API Response Shape
interface RawEvent {
  event_id: string | number;
  slug: string;
  title: string;
  description: string;
  event_type?: string;
  start_date?: string;
  end_date?: string;
  mode?: string;
  location_city?: string;
  banner_image_url?: string;
  fee_type?: string;
  price?: string | number;
}

// --- FRAMER MOTION VARIANTS ---
const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 60, filter: 'blur(10px)' },
  visible: {
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const
    }
  }
};

const EventsPage = () => {
  const [apiEvents, setApiEvents] = useState<RawEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [selectedType, setSelectedType] = useState<EventType | null>(null);
  const [selectedMode, setSelectedMode] = useState<EventMode | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | null>(null);
  const [selectedFee, setSelectedFee] = useState<EventFee | null>(null);

  // --- BUTTER-SMOOTH LENIS SCROLL ENGINE ---
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    let isMounted = true;

    const fetchEvents = async () => {
      try {
        const res = await publicService.events.list();
        if (isMounted && res.status === 'success') {
          setApiEvents(res.data);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        if (isMounted) {
          setTimeout(() => setIsLoading(false), 800);
        }
      }
    };

    fetchEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- DATA MAPPING & SORTING ---
  const mappedEvents = useMemo(() => {
    const now = new Date();

    return apiEvents.map((e) => {
      const safeStartDate = e.start_date?.replace(" ", "T") || "";
      const safeEndDate = e.end_date?.replace(" ", "T") || "";
      const startDate = new Date(safeStartDate);

      // Fallback: If no end date, assume 2 hours duration
      const endDate = safeEndDate ? new Date(safeEndDate) : new Date(startDate.getTime() + 7200000);

      let calculatedStatus: EventStatus = 'upcoming';
      if (now > endDate) calculatedStatus = 'completed';
      else if (now >= startDate && now <= endDate) calculatedStatus = 'live';

      return {
        id: e.event_id,
        slug: e.slug,
        title: e.title,
        description: e.description || "",
        type: (e.event_type || 'workshop').toLowerCase() as EventType,
        date: safeStartDate,
        startDateObj: startDate,
        mode: (e.mode || 'online').toLowerCase() as EventMode,
        location: e.mode === 'online' ? 'Online' : e.location_city || 'TBD',
        image: e.banner_image_url || "",
        fee: (e.fee_type || 'free').toLowerCase() as EventFee,
        price: e.price || 0,
        status: calculatedStatus,

        // --- SAFE DEFAULTS FOR MISSING FIELDS ---
        // These fields are required by the 'Event' interface but might not be in the list API
        rewards: [],
        timeline: [],
        faqs: [],
        eligibility: ""
      };
    });
  }, [apiEvents]);

  // --- FILTERING LOGIC ---
  const filteredEvents = useMemo(() => {
    let filtered = [...mappedEvents];

    if (selectedType) filtered = filtered.filter(e => e.type === selectedType);
    if (selectedMode) filtered = filtered.filter(e => e.mode === selectedMode);
    if (selectedStatus) filtered = filtered.filter(e => e.status === selectedStatus);
    if (selectedFee) filtered = filtered.filter(e => e.fee === selectedFee);

    return filtered.sort((a, b) => {
      const statusOrder = { 'live': 0, 'upcoming': 1, 'completed': 2 };
      const statusDiff = statusOrder[a.status] - statusOrder[b.status];

      if (statusDiff !== 0) return statusDiff;

      return a.status === 'completed'
          ? b.startDateObj.getTime() - a.startDateObj.getTime() // Most recent completed first
          : a.startDateObj.getTime() - b.startDateObj.getTime(); // Sooner upcoming first
    });
  }, [mappedEvents, selectedType, selectedMode, selectedStatus, selectedFee]);

  const handleReset = () => {
    setSelectedType(null);
    setSelectedMode(null);
    setSelectedStatus(null);
    setSelectedFee(null);
  };

  return (
      <div className="min-h-screen bg-white selection:bg-orange-100 selection:text-orange-600">
        {seoConfig?.events && <SEOHead {...seoConfig.events} />}
        <Header />

        <main className="relative overflow-hidden">
          {/* --- SECTION 1: HEADER --- */}
          <EventsHeader />

          {/* --- SECTION 2: FILTERS --- */}
          <motion.section
              variants={slideFromLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="sticky top-[70px] z-[40] bg-white/60 backdrop-blur-2xl border-b border-slate-50"
          >
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
          </motion.section>

          {/* --- SECTION 3: CONTENT GRID --- */}
          <div className="relative z-10 min-h-[60vh] py-10">
            <AnimatePresence mode="wait">
              {isLoading ? (
                  <motion.div
                      key="loader"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="flex flex-col justify-center items-center h-[50vh] gap-6"
                  >
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                          className="absolute inset-0 border-t-2 border-b-2 border-blue-500 rounded-full"
                      />
                      <Zap className="w-8 h-8 text-[#FF6B35] animate-pulse" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Syncing Matrix</p>
                  </motion.div>
              ) : filteredEvents.length > 0 ? (
                  <motion.div
                      key="grid"
                      variants={slideFromRight}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                  >
                    <EventsGrid events={filteredEvents} />
                  </motion.div>
              ) : (
                  <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                  >
                    <NoEventsState onReset={handleReset} />
                  </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <Footer />
      </div>
  );
};

export default EventsPage;