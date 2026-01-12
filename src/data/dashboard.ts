// Mock data for Bharat XR Student Dashboard

import { 
  Student, 
  Initiative, 
  UserInitiative, 
  Event, 
  UserEvent,
  LeaderboardEntry, 
  AmbassadorTask,
  AmbassadorPerk,
  Activity,
  DashboardStats,
  Achievement,
  Certificate,
  Project,
  Education
} from '@/types/dashboard';

export const mockStudent: Student = {
  id: 'user-001',
  name: 'Arjun Sharma',
  email: 'arjun.sharma@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  location: {
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India'
  },
  college: {
    name: 'Indian Institute of Technology Delhi',
    degree: 'B.Tech',
    branch: 'Computer Science',
    year: 3,
    cgpa: 8.7
  },
  bio: 'Passionate AR/VR developer and XR enthusiast. Building immersive experiences that bridge the digital and physical worlds. Currently exploring WebXR and spatial computing.',
  skills: ['Unity', 'ARCore', 'ARKit', 'Spark AR', 'Lens Studio', 'WebXR', 'Three.js', 'Blender', 'C#', 'JavaScript'],
  socialLinks: [
    { platform: 'linkedin', url: 'https://linkedin.com/in/arjunsharma' },
    { platform: 'github', url: 'https://github.com/arjunsharma' },
    { platform: 'twitter', url: 'https://twitter.com/arjunsharma' },
    { platform: 'portfolio', url: 'https://arjunsharma.dev' }
  ],
  level: 7,
  points: 12500,
  globalRank: 127,
  stateRank: 15,
  collegeRank: 3,
  isAmbassador: true,
  ambassadorSince: '2024-06-15',
  referralCode: 'ARJUN2024',
  referralsCount: 23,
  profileVisibility: 'public',
  profileCompletion: 85,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-12-01T14:20:00Z'
};

export const mockEducation: Education[] = [
  {
    id: 'edu-001',
    institution: 'Indian Institute of Technology Delhi',
    degree: 'B.Tech in Computer Science',
    branch: 'Computer Science & Engineering',
    startYear: 2022,
    isCurrentlyStudying: true,
    cgpa: 8.7
  },
  {
    id: 'edu-002',
    institution: 'Delhi Public School, R.K. Puram',
    degree: 'Higher Secondary (XII)',
    startYear: 2020,
    endYear: 2022,
    cgpa: 9.4,
    isCurrentlyStudying: false
  }
];

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'AR Museum Guide',
    description: 'An AR application that provides interactive tours of museums with 3D models and audio narration.',
    technologies: ['Unity', 'ARCore', 'Blender', 'Firebase'],
    link: 'https://armuseumguide.app',
    githubUrl: 'https://github.com/arjun/ar-museum',
    createdAt: '2024-09-15T00:00:00Z'
  },
  {
    id: 'proj-002',
    title: 'VR Meditation Space',
    description: 'A calming VR environment designed for meditation and mindfulness practices.',
    technologies: ['Unity', 'Oculus SDK', 'C#'],
    githubUrl: 'https://github.com/arjun/vr-meditation',
    createdAt: '2024-07-20T00:00:00Z'
  },
  {
    id: 'proj-003',
    title: 'WebXR Product Viewer',
    description: 'A web-based AR viewer for e-commerce products using WebXR.',
    technologies: ['Three.js', 'WebXR', 'React', 'TypeScript'],
    link: 'https://webxr-viewer.demo',
    createdAt: '2024-05-10T00:00:00Z'
  }
];

export const mockCertificates: Certificate[] = [
  {
    id: 'cert-001',
    title: 'AR Development Fundamentals',
    issuer: 'Bharat XR',
    issueDate: '2024-08-15',
    credentialId: 'BXR-AR-2024-001',
    credentialUrl: 'https://bharatxr.co/verify/BXR-AR-2024-001'
  },
  {
    id: 'cert-002',
    title: 'Unity Certified Developer',
    issuer: 'Unity Technologies',
    issueDate: '2024-06-20',
    credentialId: 'UNITY-2024-12345'
  },
  {
    id: 'cert-003',
    title: 'Spark AR Certification',
    issuer: 'Meta',
    issueDate: '2024-04-10',
    credentialId: 'META-SPARK-2024'
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-001',
    title: 'Early Adopter',
    description: 'Joined Bharat XR in the first 1000 members',
    icon: '🚀',
    earnedAt: '2024-01-15',
    category: 'badge'
  },
  {
    id: 'ach-002',
    title: 'Hackathon Champion',
    description: 'Won first place in XR Hackathon 2024',
    icon: '🏆',
    earnedAt: '2024-09-20',
    category: 'award'
  },
  {
    id: 'ach-003',
    title: 'Community Builder',
    description: 'Referred 20+ students to the platform',
    icon: '👥',
    earnedAt: '2024-11-05',
    category: 'milestone'
  },
  {
    id: 'ach-004',
    title: '7-Day Streak',
    description: 'Logged in for 7 consecutive days',
    icon: '🔥',
    earnedAt: '2024-11-28',
    category: 'milestone'
  },
  {
    id: 'ach-005',
    title: 'AR Effect Creator',
    description: 'Published first AR effect',
    icon: '✨',
    earnedAt: '2024-03-10',
    category: 'badge'
  }
];

export const mockInitiatives: Initiative[] = [
  {
    id: 'init-001',
    name: 'XR Innovation Challenge 2024',
    logo: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=100&h=100&fit=crop',
    description: 'Build innovative XR solutions for real-world problems',
    type: 'hackathon',
    format: 'free',
    mode: 'hybrid',
    status: 'ongoing',
    currentRound: 'Round 2: Prototype',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    tags: ['AR', 'VR', 'Innovation'],
    participantsCount: 5000
  },
  {
    id: 'init-002',
    name: 'AR Bootcamp - Beginner',
    logo: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=100&h=100&fit=crop',
    description: 'Learn AR development from scratch',
    type: 'bootcamp',
    format: 'free',
    mode: 'virtual',
    status: 'ongoing',
    startDate: '2024-11-15',
    endDate: '2025-01-15',
    tags: ['AR', 'Beginner', 'Unity'],
    participantsCount: 2500
  },
  {
    id: 'init-003',
    name: 'Lens Studio Workshop',
    logo: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=100&h=100&fit=crop',
    description: 'Master Snapchat Lens Studio',
    type: 'workshop',
    format: 'free',
    mode: 'virtual',
    status: 'completed',
    startDate: '2024-10-01',
    endDate: '2024-10-15',
    tags: ['Lens Studio', 'Snapchat', 'AR Filters'],
    participantsCount: 1200
  },
  {
    id: 'init-004',
    name: 'WebXR Development Sprint',
    logo: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop',
    description: 'Build web-based XR experiences',
    type: 'challenge',
    format: 'free',
    mode: 'virtual',
    status: 'upcoming',
    startDate: '2025-01-10',
    endDate: '2025-01-25',
    registrationDeadline: '2025-01-05',
    tags: ['WebXR', 'Three.js', 'A-Frame'],
    participantsCount: 0
  }
];

export const mockUserInitiatives: UserInitiative[] = [
  {
    id: 'ui-001',
    initiative: mockInitiatives[0],
    registeredAt: '2024-11-02T10:00:00Z',
    status: 'in-progress',
    teamName: 'XR Pioneers',
    teamSize: 4
  },
  {
    id: 'ui-002',
    initiative: mockInitiatives[1],
    registeredAt: '2024-11-16T09:30:00Z',
    status: 'in-progress'
  },
  {
    id: 'ui-003',
    initiative: mockInitiatives[2],
    registeredAt: '2024-10-01T08:00:00Z',
    status: 'completed',
    score: 92
  }
];

export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    title: 'XR Meetup Delhi',
    description: 'Monthly meetup for XR enthusiasts in Delhi NCR',
    type: 'meetup',
    mode: 'offline',
    date: '2025-01-15',
    time: '6:00 PM',
    venue: 'IIT Delhi, New Delhi',
    city: 'New Delhi',
    status: 'upcoming',
    registeredCount: 150
  },
  {
    id: 'evt-002',
    title: 'Introduction to Spatial Computing',
    description: 'Learn the fundamentals of spatial computing and Apple Vision Pro development',
    type: 'webinar',
    mode: 'online',
    date: '2025-01-10',
    time: '4:00 PM',
    status: 'upcoming',
    registeredCount: 500
  },
  {
    id: 'evt-003',
    title: 'AR Workshop at IIT Roorkee',
    description: 'Hands-on AR development workshop',
    type: 'workshop',
    mode: 'offline',
    date: '2024-11-20',
    time: '10:00 AM',
    venue: 'IIT Roorkee Campus',
    city: 'Roorkee',
    status: 'past',
    registeredCount: 200
  }
];

export const mockUserEvents: UserEvent[] = [
  {
    id: 'ue-001',
    event: mockEvents[0],
    registeredAt: '2024-12-01T10:00:00Z',
    attended: false
  },
  {
    id: 'ue-002',
    event: mockEvents[1],
    registeredAt: '2024-12-05T14:30:00Z',
    attended: false
  },
  {
    id: 'ue-003',
    event: mockEvents[2],
    registeredAt: '2024-11-15T09:00:00Z',
    attended: true,
    certificateUrl: 'https://bharatxr.co/certificates/evt-003-user-001'
  }
];

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'u-001', name: 'Priya Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50', college: 'IIT Bombay', state: 'Maharashtra', points: 28500, badges: 15, isAmbassador: true, profileVisibility: 'public' },
  { rank: 2, userId: 'u-002', name: 'Rahul Kumar', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50', college: 'IIT Madras', state: 'Tamil Nadu', points: 25000, badges: 12, isAmbassador: true, profileVisibility: 'public' },
  { rank: 3, userId: 'u-003', name: 'Sneha Reddy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50', college: 'IIIT Hyderabad', state: 'Telangana', points: 23000, badges: 11, isAmbassador: true, profileVisibility: 'public' },
  { rank: 4, userId: 'u-004', name: 'Amit Singh', college: 'NIT Trichy', state: 'Tamil Nadu', points: 21500, badges: 10, isAmbassador: false, profileVisibility: 'public' },
  { rank: 5, userId: 'u-005', name: 'Kavya Nair', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50', college: 'BITS Pilani', state: 'Rajasthan', points: 20000, badges: 9, isAmbassador: true, profileVisibility: 'ambassadors' },
  { rank: 127, userId: 'user-001', name: 'Arjun Sharma', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50', college: 'IIT Delhi', state: 'Delhi', points: 12500, badges: 5, isAmbassador: true, profileVisibility: 'public' },
];

export const mockAmbassadorTasks: AmbassadorTask[] = [
  {
    id: 'task-001',
    title: 'Refer 5 Students',
    description: 'Invite 5 students to join Bharat XR using your referral code',
    points: 500,
    type: 'referral',
    status: 'in-progress',
    progress: 3,
    maxProgress: 5
  },
  {
    id: 'task-002',
    title: 'Host a Campus Workshop',
    description: 'Organize and conduct an AR/VR workshop at your college',
    points: 1000,
    type: 'event',
    status: 'available'
  },
  {
    id: 'task-003',
    title: 'Share on LinkedIn',
    description: 'Post about your Bharat XR journey on LinkedIn',
    points: 100,
    type: 'social',
    status: 'completed',
    completedAt: '2024-11-25T10:00:00Z'
  },
  {
    id: 'task-004',
    title: 'Create Tutorial Content',
    description: 'Create and publish an AR/VR tutorial on YouTube',
    points: 750,
    type: 'content',
    status: 'available'
  },
  {
    id: 'task-005',
    title: 'Mentor 3 Beginners',
    description: 'Help 3 new members complete their first project',
    points: 300,
    type: 'community',
    status: 'in-progress',
    progress: 1,
    maxProgress: 3
  }
];

export const mockAmbassadorPerks: AmbassadorPerk[] = [
  {
    id: 'perk-001',
    title: 'Ambassador Badge',
    description: 'Exclusive badge on your profile',
    icon: '🏅',
    unlockLevel: 1,
    isUnlocked: true
  },
  {
    id: 'perk-002',
    title: 'Early Event Access',
    description: 'Get early access to all Bharat XR events',
    icon: '🎟️',
    unlockLevel: 3,
    isUnlocked: true
  },
  {
    id: 'perk-003',
    title: 'Merchandise Kit',
    description: 'Exclusive Bharat XR merchandise',
    icon: '👕',
    unlockLevel: 5,
    isUnlocked: true
  },
  {
    id: 'perk-004',
    title: 'LinkedIn Recommendation',
    description: 'Get a recommendation from Bharat XR team',
    icon: '💼',
    unlockLevel: 7,
    isUnlocked: true
  },
  {
    id: 'perk-005',
    title: 'Industry Mentorship',
    description: '1-on-1 mentorship with industry experts',
    icon: '🎯',
    unlockLevel: 10,
    isUnlocked: false
  }
];

export const mockActivities: Activity[] = [
  {
    id: 'act-001',
    type: 'achievement',
    title: 'Earned "7-Day Streak" Badge',
    description: 'You logged in for 7 consecutive days',
    timestamp: '2024-11-28T10:00:00Z'
  },
  {
    id: 'act-002',
    type: 'submission',
    title: 'Submitted Round 2 Prototype',
    description: 'XR Innovation Challenge 2024',
    timestamp: '2024-11-25T16:30:00Z'
  },
  {
    id: 'act-003',
    type: 'referral',
    title: 'New Referral Joined',
    description: 'Vikram Mehta joined using your code',
    timestamp: '2024-11-22T09:15:00Z'
  },
  {
    id: 'act-004',
    type: 'event_attended',
    title: 'Attended AR Workshop',
    description: 'AR Workshop at IIT Roorkee',
    timestamp: '2024-11-20T14:00:00Z'
  },
  {
    id: 'act-005',
    type: 'level_up',
    title: 'Reached Level 7',
    description: 'You earned 2000 points and leveled up!',
    timestamp: '2024-11-18T11:45:00Z'
  }
];

export const mockDashboardStats: DashboardStats = {
  activeInitiatives: 2,
  submittedProjects: 5,
  completedEvents: 12,
  totalPoints: 12500,
  globalRank: 127,
  badges: 5,
  referrals: 23,
  streakDays: 7
};

// Activity heatmap data (GitHub-style)
export const mockActivityHeatmap: { date: string; count: number }[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  return {
    date: date.toISOString().split('T')[0],
    count: Math.floor(Math.random() * 5)
  };
});
