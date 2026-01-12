// Dashboard Type Definitions for Bharat XR Student Dashboard

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  college?: {
    name: string;
    degree: string;
    branch?: string;
    year: number;
    cgpa?: number;
  };
  bio?: string;
  skills: string[];
  socialLinks: SocialLink[];
  level: number;
  points: number;
  globalRank: number;
  stateRank?: number;
  collegeRank?: number;
  isAmbassador: boolean;
  ambassadorSince?: string;
  referralCode?: string;
  referralsCount: number;
  profileVisibility: 'public' | 'ambassadors' | 'private';
  profileCompletion: number;
  createdAt: string;
  updatedAt: string;
}

export interface SocialLink {
  platform: 'linkedin' | 'github' | 'twitter' | 'instagram' | 'portfolio' | 'behance' | 'dribbble';
  url: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  branch?: string;
  startYear: number;
  endYear?: number;
  cgpa?: number;
  isCurrentlyStudying: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  technologies: string[];
  link?: string;
  githubUrl?: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issuerLogo?: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'badge' | 'award' | 'milestone';
}

export interface Initiative {
  id: string;
  name: string;
  logo: string;
  description?: string;
  type: 'hackathon' | 'workshop' | 'bootcamp' | 'challenge' | 'competition';
  format: 'free' | 'paid';
  mode: 'virtual' | 'in-person' | 'hybrid';
  status: 'ongoing' | 'upcoming' | 'completed';
  currentRound?: string;
  startDate: string;
  endDate: string;
  registrationDeadline?: string;
  tags: string[];
  participantsCount?: number;
}

export interface UserInitiative {
  id: string;
  initiative: Initiative;
  registeredAt: string;
  status: 'registered' | 'in-progress' | 'submitted' | 'completed' | 'withdrawn';
  teamName?: string;
  teamSize?: number;
  submissionUrl?: string;
  rank?: number;
  score?: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  type: 'workshop' | 'webinar' | 'meetup' | 'conference' | 'hackathon';
  mode: 'online' | 'offline' | 'hybrid';
  date: string;
  time: string;
  venue?: string;
  city?: string;
  status: 'upcoming' | 'live' | 'past';
  registeredCount?: number;
}

export interface UserEvent {
  id: string;
  event: Event;
  registeredAt: string;
  attended: boolean;
  certificateUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  college: string;
  state: string;
  points: number;
  badges: number;
  isAmbassador: boolean;
  profileVisibility: 'public' | 'ambassadors' | 'private';
}

export interface AmbassadorTask {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'referral' | 'event' | 'social' | 'content' | 'community';
  status: 'available' | 'in-progress' | 'completed' | 'expired';
  deadline?: string;
  completedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface AmbassadorPerk {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockLevel: number;
  isUnlocked: boolean;
}

export interface Activity {
  id: string;
  type: 'registration' | 'submission' | 'achievement' | 'level_up' | 'referral' | 'event_attended';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface DashboardStats {
  activeInitiatives: number;
  submittedProjects: number;
  completedEvents: number;
  totalPoints: number;
  globalRank: number;
  badges: number;
  referrals: number;
  streakDays: number;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  eventReminders: boolean;
  weeklyDigest: boolean;
  promotionalEmails: boolean;
}

export interface PrivacySettings {
  showEmail: boolean;
  showPhone: boolean;
  showCollege: boolean;
  showSocialLinks: boolean;
  showOnLeaderboard: boolean;
  profileVisibility: 'public' | 'ambassadors' | 'private';
}
