/**
 * Events Data Types & Helpers
 * Logic for sorting and filtering events.
 */

export type EventType = 'workshop' | 'challenge' | 'meetup';
export type EventMode = 'online' | 'offline' | 'hybrid';
export type EventStatus = 'upcoming' | 'live' | 'completed';
export type EventFee = 'free' | 'paid';

// ... (Keep all your existing Interfaces: EventTimeline, EventReward, EventFAQ, EventEligibility) ...

export interface Event {
  rewards: any;
  timeline: any;
  faqs: any;
  eligibility: any;
  id: string;
  slug?: string; // Added based on your previous request
  title: string;
  description: string;
  longDescription?: string;
  date: string;
  endDate?: string;
  location: string;
  venue?: string;
  mode: EventMode;
  status: EventStatus;
  type: EventType;
  fee: EventFee;
  feeAmount?: number;
  teamSize?: string;
  registrationDeadline?: string;
  image?: string;
  registrationUrl?: string;
  tags?: string[];

  // Detail page fields

  steps?: string[];
  terms?: string;
  highlights?: {
    date: string;
    location: string;
    format: string;
  };
  participantTypes?: {
    title: string;
    description: string;
  }[];
}

// === 1. REMOVE FAKE DATA ===
export const events: Event[] = []; // Empty array, or you can delete this line entirely if you update all references.

// === 2. UPDATE HELPERS TO ACCEPT DATA ===

/**
 * Get events sorted by date (newest first)
 * @param eventList - The list of events (from API)
 */
export const getSortedEvents = (eventList: Event[]): Event[] => {
  return [...eventList].sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Get upcoming events (sorted by date, soonest first)
 * @param eventList - The list of events (from API)
 */
export const getUpcomingEvents = (eventList: Event[]): Event[] => {
  return eventList
      .filter(event => event.status === 'upcoming' || event.status === 'live')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Get past events (sorted by date, newest first)
 * @param eventList - The list of events (from API)
 */
export const getPastEvents = (eventList: Event[]): Event[] => {
  return eventList
      .filter(event => event.status === 'completed')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Get event by ID or Slug
 * @param id - The ID or Slug to find
 * @param eventList - The list of events (from API)
 */
export const getEventById = (id: string, eventList: Event[]): Event | undefined => {
  return eventList.find(event => event.id === id || event.slug === id);
};

/**
 * Filter events by criteria
 * @param filters - Filter options
 * @param eventList - The list of events (from API)
 */
export const filterEvents = (
    filters: {
      type?: EventType;
      mode?: EventMode;
      status?: EventStatus;
      fee?: EventFee;
    },
    eventList: Event[]
): Event[] => {
  return eventList.filter(event => {
    if (filters.type && event.type !== filters.type) return false;
    if (filters.mode && event.mode !== filters.mode) return false;
    if (filters.status && event.status !== filters.status) return false;
    if (filters.fee && event.fee !== filters.fee) return false;
    return true;
  });
};