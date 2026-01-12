/**
 * Events Data
 * Events are automatically sorted by date (newest first)
 */

export type EventType = 'workshop' | 'hackathon' | 'challenge' | 'meetup';
export type EventMode = 'online' | 'offline' | 'hybrid';
export type EventStatus = 'upcoming' | 'live' | 'completed';
export type EventFee = 'free' | 'paid';

export interface EventTimeline {
  title: string;
  dateRange: string;
  description: string;
}

export interface EventReward {
  position: string;
  prize: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventEligibility {
  age?: string;
  region?: string;
  openFor?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  date: string; // ISO date string
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
  eligibility?: EventEligibility;
  rewards?: EventReward[];
  timeline?: EventTimeline[];
  faqs?: EventFAQ[];
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

export const events: Event[] = [
  {
    id: 'waves-2025',
    title: 'XR Creator Hackathon @ WAVES 2025',
    description: 'National flagship XR hackathon in partnership with WAVES Summit. Create immersive experiences and compete for ₹5 Lakh in prizes.',
    longDescription: 'Join India\'s most prestigious XR hackathon at WAVES 2025! This is your opportunity to showcase your AR/VR development skills, collaborate with fellow creators, and compete for exciting prizes. Whether you\'re building immersive experiences, interactive installations, or innovative XR applications, this hackathon welcomes all skill levels.',
    date: '2025-02-15',
    endDate: '2025-02-17',
    location: 'New Delhi',
    venue: 'Bharat Mandapam, New Delhi',
    mode: 'offline',
    status: 'upcoming',
    type: 'hackathon',
    fee: 'free',
    teamSize: '2-4 members',
    registrationDeadline: '2025-02-10',
    tags: ['Hackathon', 'AR/VR', 'National'],
    eligibility: {
      age: '18+',
      region: 'Pan-India',
      openFor: ['Students', 'Developers', 'Designers', 'XR Enthusiasts'],
    },
    rewards: [
      { position: 'Winner', prize: '₹2,00,000 + Mentorship' },
      { position: 'First Runner-up', prize: '₹1,50,000 + XR Devices' },
      { position: 'Second Runner-up', prize: '₹1,00,000 + Goodies' },
      { position: 'All Participants', prize: 'Certificates + Swag Kit' },
    ],
    timeline: [
      { title: 'Registration Opens', dateRange: 'Jan 15 - Feb 10, 2025', description: 'Register your team online' },
      { title: 'Idea Submission', dateRange: 'Feb 10 - Feb 13, 2025', description: 'Submit your project idea' },
      { title: 'Hackathon Days', dateRange: 'Feb 15 - Feb 17, 2025', description: 'Build and present your project' },
      { title: 'Results & Awards', dateRange: 'Feb 17, 2025', description: 'Winners announced at closing ceremony' },
    ],
    faqs: [
      { question: 'Who can participate?', answer: 'Anyone 18+ from India with interest in XR development can participate.' },
      { question: 'Is there any registration fee?', answer: 'No, participation is completely free.' },
      { question: 'What should I bring?', answer: 'Bring your laptop, any XR devices you have, and your creative spirit!' },
      { question: 'Will accommodation be provided?', answer: 'Yes, accommodation will be arranged for outstation participants.' },
      { question: 'Do I need prior XR experience?', answer: 'Basic familiarity with XR tools is recommended but not mandatory.' },
    ],
    steps: [
      'Register your team online',
      'Submit your project idea',
      'Receive confirmation and event details',
      'Attend the hackathon and build!',
    ],
    terms: 'By registering, you agree to Bharat XR\'s terms of participation and code of conduct.',
    highlights: {
      date: 'Feb 15-17, 2025',
      location: 'Bharat Mandapam, Delhi',
      format: '48-hour Hackathon',
    },
    participantTypes: [
      { title: 'Developer', description: 'Build AR/VR experiences using Unity, Unreal, WebXR, or any XR framework.' },
      { title: 'Designer / Creative', description: 'Focus on UX, 3D modeling, visual design, or storytelling in XR.' },
    ],
  },
  {
    id: 'snapar-workshop-feb',
    title: 'SnapAR Lens Studio Workshop',
    description: 'Hands-on workshop on creating AR effects using Snap Lens Studio. Perfect for beginners and intermediate creators.',
    longDescription: 'Learn to create stunning AR filters and lenses using Snap\'s powerful Lens Studio. This workshop covers everything from basic face filters to advanced world effects, guided by certified SnapAR creators.',
    date: '2025-02-01',
    location: 'Online',
    venue: 'Zoom + Discord',
    mode: 'online',
    status: 'upcoming',
    type: 'workshop',
    fee: 'free',
    teamSize: 'Individual',
    registrationDeadline: '2025-01-30',
    tags: ['Workshop', 'SnapAR', 'Beginner-Friendly'],
    eligibility: {
      age: '16+',
      region: 'Global',
      openFor: ['Students', 'Creators', 'Beginners'],
    },
    rewards: [
      { position: 'All Participants', prize: 'Certificate + Lens Studio Assets' },
      { position: 'Best Lens', prize: 'Featured on Bharat XR Social' },
    ],
    timeline: [
      { title: 'Registration', dateRange: 'Jan 20 - Jan 30, 2025', description: 'Sign up for the workshop' },
      { title: 'Workshop Day', dateRange: 'Feb 1, 2025', description: '3-hour live session' },
      { title: 'Submission Deadline', dateRange: 'Feb 7, 2025', description: 'Submit your lens for review' },
    ],
    faqs: [
      { question: 'Do I need any prior experience?', answer: 'No! This workshop is beginner-friendly.' },
      { question: 'What software do I need?', answer: 'Download Lens Studio (free) before the workshop.' },
      { question: 'Will the session be recorded?', answer: 'Yes, registered participants will receive the recording.' },
    ],
    steps: [
      'Register with your email',
      'Download Lens Studio',
      'Join the live session',
      'Build and submit your lens',
    ],
    terms: 'By participating, you agree to our community guidelines.',
    highlights: {
      date: 'Feb 1, 2025',
      location: 'Online (Zoom)',
      format: '3-hour Workshop',
    },
  },
  {
    id: 'xr-meetup-delhi',
    title: 'XR Community Meetup Delhi',
    description: 'Monthly community meetup for XR enthusiasts in Delhi NCR. Networking, demos, and lightning talks.',
    longDescription: 'Connect with fellow XR enthusiasts, see live demos, and share your work at our monthly Delhi meetup. Whether you\'re a beginner or an expert, this is the perfect place to network and learn.',
    date: '2025-01-25',
    location: 'T-Hub, Delhi',
    venue: 'T-Hub Coworking Space, Connaught Place',
    mode: 'offline',
    status: 'upcoming',
    type: 'meetup',
    fee: 'free',
    teamSize: 'Individual',
    registrationDeadline: '2025-01-24',
    tags: ['Meetup', 'Networking'],
    eligibility: {
      region: 'Delhi NCR',
      openFor: ['Everyone'],
    },
    rewards: [
      { position: 'All Attendees', prize: 'Networking + Snacks' },
    ],
    timeline: [
      { title: 'Registration', dateRange: 'Jan 15 - Jan 24, 2025', description: 'RSVP for the meetup' },
      { title: 'Meetup Day', dateRange: 'Jan 25, 2025 (4-7 PM)', description: 'Join us at T-Hub' },
    ],
    faqs: [
      { question: 'Is this free?', answer: 'Yes, completely free to attend!' },
      { question: 'Can I present my work?', answer: 'Yes! Reach out to us for a lightning talk slot.' },
    ],
    steps: [
      'RSVP online',
      'Receive venue details',
      'Show up and connect!',
    ],
    terms: 'Please be respectful to all attendees.',
    highlights: {
      date: 'Jan 25, 2025',
      location: 'T-Hub, Delhi',
      format: 'Evening Meetup',
    },
  },
  {
    id: 'india-skills-2024',
    title: 'India Skills 2024 - AR/VR Nationals',
    description: 'Official jury and mentorship for India\'s largest skill competition in AR/VR category.',
    longDescription: 'Bharat XR served as official jury and mentors for the AR/VR category at India Skills 2024 Nationals, supporting the next generation of skilled XR professionals.',
    date: '2024-12-10',
    endDate: '2024-12-12',
    location: 'Yashobhoomi, Delhi',
    venue: 'Yashobhoomi Convention Centre, Dwarka',
    mode: 'offline',
    status: 'completed',
    type: 'challenge',
    fee: 'free',
    tags: ['Competition', 'National', 'Judging'],
    eligibility: {
      region: 'Pan-India',
      openFor: ['ITI Students', 'Polytechnic Students'],
    },
    timeline: [
      { title: 'Competition Days', dateRange: 'Dec 10-12, 2024', description: 'National finals at Yashobhoomi' },
    ],
    highlights: {
      date: 'Dec 10-12, 2024',
      location: 'Yashobhoomi, Delhi',
      format: 'National Competition',
    },
  },
  {
    id: 'webar-bootcamp',
    title: 'WebAR Development Bootcamp',
    description: '3-day intensive bootcamp on building WebAR experiences using 8thWall and A-Frame.',
    longDescription: 'An intensive 3-day bootcamp covering WebAR development from basics to deployment. Learn to build AR experiences that work directly in the browser without any app downloads.',
    date: '2024-11-20',
    endDate: '2024-11-22',
    location: 'Online',
    venue: 'Zoom + Discord Community',
    mode: 'online',
    status: 'completed',
    type: 'workshop',
    fee: 'paid',
    feeAmount: 999,
    tags: ['Bootcamp', 'WebAR', 'Development'],
    eligibility: {
      age: '18+',
      openFor: ['Developers', 'Students'],
    },
    timeline: [
      { title: 'Day 1', dateRange: 'Nov 20, 2024', description: 'WebAR fundamentals & A-Frame basics' },
      { title: 'Day 2', dateRange: 'Nov 21, 2024', description: '8thWall integration & marker tracking' },
      { title: 'Day 3', dateRange: 'Nov 22, 2024', description: 'Project building & deployment' },
    ],
    highlights: {
      date: 'Nov 20-22, 2024',
      location: 'Online',
      format: '3-Day Bootcamp',
    },
  },
  {
    id: 'snapar-campus-tour',
    title: 'SnapAR Campus Tour - IIT Roorkee',
    description: 'Campus workshop introducing students to AR development with Snap Lens Studio.',
    longDescription: 'A hands-on campus workshop at IIT Roorkee, introducing students to the world of AR development using Snap Lens Studio. Part of our national campus tour initiative.',
    date: '2024-11-05',
    location: 'IIT Roorkee',
    venue: 'Lecture Hall Complex, IIT Roorkee',
    mode: 'offline',
    status: 'completed',
    type: 'workshop',
    fee: 'free',
    tags: ['Workshop', 'Campus', 'SnapAR'],
    eligibility: {
      openFor: ['IIT Roorkee Students'],
    },
    timeline: [
      { title: 'Workshop Day', dateRange: 'Nov 5, 2024', description: '4-hour workshop with live demos' },
    ],
    highlights: {
      date: 'Nov 5, 2024',
      location: 'IIT Roorkee',
      format: 'Campus Workshop',
    },
  },
];

/**
 * Get events sorted by date (newest first)
 */
export const getSortedEvents = (eventList: Event[] = events): Event[] => {
  return [...eventList].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Get upcoming events (sorted by date, soonest first)
 */
export const getUpcomingEvents = (): Event[] => {
  return events
    .filter(event => event.status === 'upcoming' || event.status === 'live')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Get past events (sorted by date, newest first)
 */
export const getPastEvents = (): Event[] => {
  return events
    .filter(event => event.status === 'completed')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

/**
 * Get event by ID
 */
export const getEventById = (id: string): Event | undefined => {
  return events.find(event => event.id === id);
};

/**
 * Filter events by criteria
 */
export const filterEvents = (filters: {
  type?: EventType;
  mode?: EventMode;
  status?: EventStatus;
  fee?: EventFee;
}): Event[] => {
  return events.filter(event => {
    if (filters.type && event.type !== filters.type) return false;
    if (filters.mode && event.mode !== filters.mode) return false;
    if (filters.status && event.status !== filters.status) return false;
    if (filters.fee && event.fee !== filters.fee) return false;
    return true;
  });
};
