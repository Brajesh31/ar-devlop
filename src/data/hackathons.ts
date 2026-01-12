/**
 * Hackathons Data
 * Extended with mentors, jury, themes, timeline, prizes, FAQs, partners
 */

export type HackathonMode = 'online' | 'offline' | 'hybrid';
export type HackathonStatus = 'upcoming' | 'live' | 'completed';
export type HackathonTeamSize = 'solo' | 'team';
export type HackathonFee = 'free' | 'paid';

export interface HackathonMentor {
  id: string;
  name: string;
  role: string;
  organization: string;
  photo?: string;
}

export interface HackathonJury {
  id: string;
  name: string;
  role: string;
  organization: string;
  photo?: string;
}

export interface HackathonTheme {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface HackathonTimelineItem {
  id: string;
  date: string;
  title: string;
  description: string;
}

export interface HackathonPrize {
  id: string;
  position: string;
  amount: string;
  description: string;
}

export interface HackathonFAQ {
  id: string;
  question: string;
  answer: string;
}

export interface HackathonPartner {
  id: string;
  name: string;
  logo?: string;
  type: 'title' | 'powered' | 'community' | 'media';
}

export interface Hackathon {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  status: HackathonStatus;
  prizePool?: string;
  participants?: number;
  location: string;
  mode: HackathonMode;
  teamSize: HackathonTeamSize;
  teamSizeRange?: string;
  fee: HackathonFee;
  feeAmount?: number;
  image?: string;
  registrationUrl?: string;
  resultsUrl?: string;
  tracks?: string[];
  mentors: HackathonMentor[];
  jury: HackathonJury[];
  themes: HackathonTheme[];
  timeline: HackathonTimelineItem[];
  prizes: HackathonPrize[];
  faqs: HackathonFAQ[];
  partners: HackathonPartner[];
}

export const hackathons: Hackathon[] = [
  {
    id: 'waves-xr-2025',
    title: 'XR Creator Hackathon with WAVES 2025',
    description: 'National flagship initiative in partnership with Wavelabs and XDG. A 9-month journey culminating at WAVES Summit 2025.',
    longDescription: `The XR Creator Hackathon with WAVES 2025 is a national flagship initiative designed to discover, nurture, and showcase the next generation of XR creators across India.

This 9-month journey brings together aspiring developers, designers, and storytellers to build innovative XR experiences that address real-world challenges. From ideation to prototyping to final showcase at Bharat Mandapam, participants will receive mentorship from industry leaders.

What you'll build:
- Immersive AR/VR experiences
- WebXR applications
- Mixed reality prototypes
- XR-powered social impact solutions

The hackathon is open to students, professionals, and creative technologists who want to push the boundaries of immersive technology in India.`,
    startDate: '2024-06-01',
    endDate: '2025-02-17',
    registrationDeadline: '2024-07-15',
    status: 'live',
    prizePool: '₹5,00,000',
    participants: 2200,
    location: 'Pan-India + Bharat Mandapam, New Delhi',
    mode: 'hybrid',
    teamSize: 'team',
    teamSizeRange: '2-5 members',
    fee: 'free',
    tracks: ['Gaming', 'Education', 'Healthcare', 'Tourism', 'Social Impact'],
    mentors: [
      { id: 'm1', name: 'Priya Sharma', role: 'XR Lead', organization: 'Google India', photo: '' },
      { id: 'm2', name: 'Arjun Mehta', role: 'AR Director', organization: 'Snap Inc.', photo: '' },
      { id: 'm3', name: 'Kavita Reddy', role: 'VR Architect', organization: 'Meta', photo: '' },
      { id: 'm4', name: 'Rahul Gupta', role: 'Creative Technologist', organization: 'Unity', photo: '' },
    ],
    jury: [
      { id: 'j1', name: 'Dr. Ananya Singh', role: 'Professor of HCI', organization: 'IIT Delhi', photo: '' },
      { id: 'j2', name: 'Vikram Patel', role: 'CEO', organization: 'XR Ventures', photo: '' },
      { id: 'j3', name: 'Neha Kapoor', role: 'Innovation Head', organization: 'NASSCOM', photo: '' },
    ],
    themes: [
      { id: 't1', title: 'Immersive Education', description: 'Create XR experiences that transform how we learn and teach', icon: '📚' },
      { id: 't2', title: 'Cultural Heritage', description: 'Preserve and showcase Indian heritage through immersive technology', icon: '🏛️' },
      { id: 't3', title: 'Healthcare Innovation', description: 'Build XR solutions for therapy, training, and patient care', icon: '🏥' },
      { id: 't4', title: 'Smart Tourism', description: 'Enhance travel experiences with AR guides and VR previews', icon: '✈️' },
      { id: 't5', title: 'Gaming & Entertainment', description: 'Push boundaries of interactive entertainment', icon: '🎮' },
    ],
    timeline: [
      { id: 'tl1', date: '2024-06-01', title: 'Registration Opens', description: 'Applications open for all participants across India' },
      { id: 'tl2', date: '2024-07-15', title: 'Registration Closes', description: 'Last date to submit your application' },
      { id: 'tl3', date: '2024-08-01', title: 'Team Formation', description: 'Find teammates and finalize your squad' },
      { id: 'tl4', date: '2024-09-01', title: 'Ideation Phase', description: 'Submit your concept and project proposal' },
      { id: 'tl5', date: '2024-10-15', title: 'Mentorship Begins', description: 'Weekly sessions with industry mentors' },
      { id: 'tl6', date: '2024-12-01', title: 'Prototype Submission', description: 'Submit your working prototype' },
      { id: 'tl7', date: '2025-01-15', title: 'Finals Announcement', description: 'Top 20 teams announced for grand finale' },
      { id: 'tl8', date: '2025-02-17', title: 'Grand Finale at WAVES', description: 'Demo Day at Bharat Mandapam, New Delhi' },
    ],
    prizes: [
      { id: 'p1', position: 'Winner', amount: '₹2,00,000', description: 'Cash prize + Incubation support + Featured showcase' },
      { id: 'p2', position: '1st Runner-up', amount: '₹1,00,000', description: 'Cash prize + Mentorship program access' },
      { id: 'p3', position: '2nd Runner-up', amount: '₹50,000', description: 'Cash prize + Hardware credits' },
      { id: 'p4', position: 'Best Student Team', amount: '₹25,000', description: 'Special recognition for college teams' },
      { id: 'p5', position: 'Best Social Impact', amount: '₹25,000', description: 'For projects addressing social challenges' },
    ],
    faqs: [
      { id: 'f1', question: 'Who can participate in this hackathon?', answer: 'The hackathon is open to all Indian citizens above 18 years of age. Students, professionals, and hobbyists are all welcome to participate.' },
      { id: 'f2', question: 'Do I need prior XR experience?', answer: 'No prior XR experience is required. We have tracks and mentorship for beginners as well as advanced creators.' },
      { id: 'f3', question: 'Can I participate solo?', answer: 'Teams of 2-5 members are required. If you\'re looking for teammates, you can use our team formation platform.' },
      { id: 'f4', question: 'What tools can we use?', answer: 'You can use any XR development platform including Unity, Unreal, SnapAR, WebXR, or any other framework of your choice.' },
      { id: 'f5', question: 'Is there a registration fee?', answer: 'No, participation is completely free. Selected finalists will also receive travel grants for the finale.' },
      { id: 'f6', question: 'Will there be mentorship support?', answer: 'Yes, weekly mentorship sessions with industry experts will be provided throughout the hackathon.' },
    ],
    partners: [
      { id: 'pt1', name: 'WAVES', type: 'title' },
      { id: 'pt2', name: 'XDG India', type: 'powered' },
      { id: 'pt3', name: 'Snap Inc.', type: 'powered' },
      { id: 'pt4', name: 'Unity Technologies', type: 'community' },
      { id: 'pt5', name: 'Meta', type: 'community' },
    ],
  },
  {
    id: 'moodhack-2024',
    title: 'MoodHack 2024',
    description: 'Create AR experiences that capture and express emotions. Focus on mental health and emotional wellness through immersive tech.',
    longDescription: `MoodHack 2024 is a unique hackathon focused on the intersection of emotional wellness and augmented reality technology.

Participants will create AR experiences that help users understand, express, and manage their emotions. From mood-tracking lenses to therapeutic AR environments, this hackathon challenges creators to build technology that nurtures mental health.

The hackathon is particularly suited for creators interested in:
- Expressive technology and digital art
- Mental health applications
- Therapeutic gaming and interactive experiences
- Social emotional learning tools`,
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    registrationDeadline: '2024-09-25',
    status: 'completed',
    prizePool: '₹1,00,000',
    participants: 850,
    location: 'Online',
    mode: 'online',
    teamSize: 'team',
    teamSizeRange: '1-3 members',
    fee: 'free',
    tracks: ['Wellness', 'Expression', 'Therapy'],
    mentors: [
      { id: 'm1', name: 'Dr. Meera Iyer', role: 'Clinical Psychologist', organization: 'NIMHANS', photo: '' },
      { id: 'm2', name: 'Rohan Desai', role: 'AR Artist', organization: 'Independent', photo: '' },
    ],
    jury: [
      { id: 'j1', name: 'Sanjay Nair', role: 'Mental Health Advocate', organization: 'Mind Matters', photo: '' },
      { id: 'j2', name: 'Tanya Malhotra', role: 'Creative Director', organization: 'SnapAR', photo: '' },
    ],
    themes: [
      { id: 't1', title: 'Mood Expression', description: 'AR filters and experiences that help express emotions', icon: '🎭' },
      { id: 't2', title: 'Therapeutic Spaces', description: 'Calming and healing AR environments', icon: '🧘' },
      { id: 't3', title: 'Social Connection', description: 'AR experiences that foster emotional connection', icon: '💬' },
    ],
    timeline: [
      { id: 'tl1', date: '2024-10-01', title: 'Hackathon Begins', description: 'Kickoff and theme reveal' },
      { id: 'tl2', date: '2024-10-15', title: 'Mid-point Check-in', description: 'Progress review and mentor feedback' },
      { id: 'tl3', date: '2024-10-28', title: 'Submission Deadline', description: 'Final project submission' },
      { id: 'tl4', date: '2024-10-31', title: 'Winners Announced', description: 'Results and showcase' },
    ],
    prizes: [
      { id: 'p1', position: 'Winner', amount: '₹50,000', description: 'Cash prize + Featured on Bharat XR showcase' },
      { id: 'p2', position: '1st Runner-up', amount: '₹30,000', description: 'Cash prize + Mentorship session' },
      { id: 'p3', position: '2nd Runner-up', amount: '₹20,000', description: 'Cash prize' },
    ],
    faqs: [
      { id: 'f1', question: 'What platforms are supported?', answer: 'We recommend SnapAR/Lens Studio, but any AR development platform is acceptable.' },
      { id: 'f2', question: 'Is this suitable for beginners?', answer: 'Yes! We have resources and mentor support for those new to AR development.' },
    ],
    partners: [
      { id: 'pt1', name: 'SnapAR', type: 'title' },
      { id: 'pt2', name: 'Mental Health Foundation', type: 'community' },
    ],
  },
  {
    id: 'novhack-2024',
    title: 'NovHack 2024',
    description: 'November hackathon focused on festive AR experiences. Create effects for Diwali, holidays, and celebrations.',
    longDescription: `NovHack 2024 is a festive-themed AR hackathon celebrating the spirit of Diwali and the holiday season.

Create AR experiences that capture the joy, color, and cultural richness of Indian festivals. From virtual diyas to AR rangoli creators, participants will build experiences that bring celebrations to life in augmented reality.

Perfect for creators who want to:
- Celebrate cultural heritage through technology
- Create shareable festive content
- Explore AR face filters and world effects
- Build community-focused experiences`,
    startDate: '2024-11-01',
    endDate: '2024-11-15',
    registrationDeadline: '2024-10-28',
    status: 'completed',
    prizePool: '₹75,000',
    participants: 620,
    location: 'Online',
    mode: 'online',
    teamSize: 'solo',
    fee: 'free',
    tracks: ['Festivals', 'Celebrations', 'Cultural'],
    mentors: [
      { id: 'm1', name: 'Ankit Jain', role: 'Lens Creator', organization: 'Snap Stars', photo: '' },
    ],
    jury: [
      { id: 'j1', name: 'Prachi Sharma', role: 'Community Lead', organization: 'Bharat XR', photo: '' },
    ],
    themes: [
      { id: 't1', title: 'Diwali Magic', description: 'AR experiences celebrating the festival of lights', icon: '🪔' },
      { id: 't2', title: 'Family Celebrations', description: 'AR that brings families together', icon: '👨‍👩‍👧‍👦' },
      { id: 't3', title: 'Cultural Art', description: 'Digital rangoli, mehndi, and traditional art in AR', icon: '🎨' },
    ],
    timeline: [
      { id: 'tl1', date: '2024-11-01', title: 'Hackathon Begins', description: 'Start building your festive AR experience' },
      { id: 'tl2', date: '2024-11-12', title: 'Submission Deadline', description: 'Final submissions due' },
      { id: 'tl3', date: '2024-11-15', title: 'Results', description: 'Winners announced during Diwali week' },
    ],
    prizes: [
      { id: 'p1', position: 'Winner', amount: '₹35,000', description: 'Cash prize + Featured spotlight' },
      { id: 'p2', position: '1st Runner-up', amount: '₹25,000', description: 'Cash prize' },
      { id: 'p3', position: '2nd Runner-up', amount: '₹15,000', description: 'Cash prize' },
    ],
    faqs: [
      { id: 'f1', question: 'Can I participate solo?', answer: 'Yes! This hackathon is designed for individual creators.' },
      { id: 'f2', question: 'What should I build?', answer: 'Create AR lenses, filters, or experiences that celebrate festivals and cultural traditions.' },
    ],
    partners: [
      { id: 'pt1', name: 'SnapAR', type: 'title' },
    ],
  },
  {
    id: 'campus-xr-challenge',
    title: 'Campus XR Challenge 2024',
    description: 'Inter-college XR development competition. Teams from 50+ colleges competed to build innovative AR/VR solutions.',
    longDescription: `The Campus XR Challenge 2024 was a nationwide inter-college competition designed to introduce students to the world of extended reality development.

Over 1500 students from 50+ colleges across India participated in this hybrid hackathon, building innovative XR solutions for campus life, education, and beyond.

The challenge provided:
- Hands-on workshops on XR development
- Campus ambassador program
- Industry mentorship
- Networking with fellow student creators

This hackathon was specifically designed for college students looking to start their journey in XR development.`,
    startDate: '2024-08-15',
    endDate: '2024-09-30',
    registrationDeadline: '2024-08-10',
    status: 'completed',
    prizePool: '₹2,00,000',
    participants: 1500,
    location: 'Multiple Campuses',
    mode: 'hybrid',
    teamSize: 'team',
    teamSizeRange: '3-4 members',
    fee: 'free',
    tracks: ['Education', 'Campus Life', 'Innovation'],
    mentors: [
      { id: 'm1', name: 'Shreya Bansal', role: 'Student Programs Lead', organization: 'Google', photo: '' },
      { id: 'm2', name: 'Amit Kumar', role: 'XR Developer', organization: 'Infosys', photo: '' },
    ],
    jury: [
      { id: 'j1', name: 'Prof. Rajesh Sharma', role: 'Dean of Engineering', organization: 'IIIT Hyderabad', photo: '' },
      { id: 'j2', name: 'Divya Menon', role: 'Startup Founder', organization: 'EduXR', photo: '' },
    ],
    themes: [
      { id: 't1', title: 'Virtual Campus', description: 'Create VR/AR campus tours and experiences', icon: '🏫' },
      { id: 't2', title: 'Lab Simulations', description: 'Build immersive lab and practical experiences', icon: '🔬' },
      { id: 't3', title: 'Student Life', description: 'AR/VR for events, clubs, and campus activities', icon: '🎓' },
    ],
    timeline: [
      { id: 'tl1', date: '2024-08-15', title: 'Launch Event', description: 'Kickoff across 50+ campuses' },
      { id: 'tl2', date: '2024-08-25', title: 'Workshop Phase', description: 'XR development bootcamps at partner colleges' },
      { id: 'tl3', date: '2024-09-15', title: 'Campus Finals', description: 'Regional winners selected' },
      { id: 'tl4', date: '2024-09-30', title: 'National Finale', description: 'Top teams compete virtually' },
    ],
    prizes: [
      { id: 'p1', position: 'Winner', amount: '₹1,00,000', description: 'Cash prize + Internship opportunities' },
      { id: 'p2', position: '1st Runner-up', amount: '₹50,000', description: 'Cash prize + Course subscriptions' },
      { id: 'p3', position: '2nd Runner-up', amount: '₹25,000', description: 'Cash prize + Swag kit' },
      { id: 'p4', position: 'Best All-Women Team', amount: '₹25,000', description: 'Special category award' },
    ],
    faqs: [
      { id: 'f1', question: 'Is this only for engineering students?', answer: 'No, students from any discipline can participate as long as they are enrolled in a recognized college.' },
      { id: 'f2', question: 'Do we need to travel?', answer: 'Campus rounds are at your college. National finale is virtual, but winners may be invited to a physical event.' },
    ],
    partners: [
      { id: 'pt1', name: 'Google for Developers', type: 'title' },
      { id: 'pt2', name: 'NSDC', type: 'powered' },
    ],
  },
];

/**
 * Get hackathons sorted by date (newest first)
 */
export const getSortedHackathons = (hackathonList: Hackathon[] = hackathons): Hackathon[] => {
  return [...hackathonList].sort((a, b) => 
    new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
};

/**
 * Get hackathon by ID
 */
export const getHackathonById = (id: string): Hackathon | undefined => {
  return hackathons.find(h => h.id === id);
};

/**
 * Get live hackathons
 */
export const getLiveHackathons = (): Hackathon[] => {
  return hackathons.filter(h => h.status === 'live');
};

/**
 * Get upcoming hackathons
 */
export const getUpcomingHackathons = (): Hackathon[] => {
  return hackathons
    .filter(h => h.status === 'upcoming')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
};

/**
 * Get past hackathons
 */
export const getPastHackathons = (): Hackathon[] => {
  return hackathons
    .filter(h => h.status === 'completed')
    .sort((a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime());
};

/**
 * Filter hackathons by criteria
 */
export const filterHackathons = (
  hackathonList: Hackathon[],
  filters: {
    mode?: HackathonMode | null;
    status?: HackathonStatus | null;
    teamSize?: HackathonTeamSize | null;
    fee?: HackathonFee | null;
  }
): Hackathon[] => {
  return hackathonList.filter(h => {
    if (filters.mode && h.mode !== filters.mode) return false;
    if (filters.status && h.status !== filters.status) return false;
    if (filters.teamSize && h.teamSize !== filters.teamSize) return false;
    if (filters.fee && h.fee !== filters.fee) return false;
    return true;
  });
};
