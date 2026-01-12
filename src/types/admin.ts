export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  college: string;
  degree: string;
  state: string;
  city: string;
  level: number;
  points: number;
  status: 'active' | 'inactive' | 'suspended';
  isAmbassador: boolean;
  referralsCount: number;
  joinedAt: Date;
  lastActiveAt: Date;
  profileCompletion: number;
  initiativesCompleted: number;
  eventsAttended: number;
  tasksCompleted: number;
  phone?: string;
  bio?: string;
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  points: number;
  type: 'referral' | 'event' | 'social' | 'content' | 'community';
  status: 'active' | 'inactive' | 'completed';
  targetAudience: 'all' | 'ambassadors' | 'level_5_plus';
  deadline?: Date;
  createdAt: Date;
  completions: number;
  totalAssigned: number;
}

export interface AdminResource {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'video' | 'article' | 'course' | 'tool' | 'template';
  url: string;
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminEvent {
  id: string;
  title: string;
  description?: string;
  type: 'workshop' | 'hackathon' | 'webinar' | 'meetup' | 'conference';
  mode: 'virtual' | 'in-person' | 'hybrid';
  date: Date;
  endDate?: Date;
  location?: string;
  registrations: number;
  attendees: number;
  maxCapacity?: number;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured?: boolean;
  imageUrl?: string;
}

export interface AdminHackathon {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  mode: 'virtual' | 'in-person' | 'hybrid';
  location?: string;
  prizePool: string;
  registrations: number;
  teams: number;
  maxTeamSize: number;
  status: 'draft' | 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  featured?: boolean;
  imageUrl?: string;
}

export interface AdminSurvey {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  responses: number;
  createdAt: Date;
  expiresAt?: Date;
  questions: number;
  featured?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  college: string;
  registeredAt: Date;
  attended: boolean;
  checkInTime?: Date;
}

export interface AnalyticsData {
  date: string;
  signups: number;
  activeUsers: number;
  eventsRegistrations: number;
  initiativesStarted: number;
  pointsEarned: number;
}

export interface DemographicData {
  name: string;
  value: number;
  percentage: number;
}

export interface EngagementData {
  hour: number;
  day: string;
  value: number;
}

export interface FunnelData {
  stage: string;
  value: number;
  percentage: number;
}

export interface CohortData {
  cohort: string;
  week1: number;
  week2: number;
  week3: number;
  week4: number;
}

export interface GeographicData {
  state: string;
  users: number;
  activeUsers: number;
  events: number;
}

export interface AdminOverviewStats {
  totalStudents: number;
  activeToday: number;
  newSignupsWeek: number;
  newSignupsMonth: number;
  totalAmbassadors: number;
  activeInitiatives: number;
  totalEvents: number;
  totalPoints: number;
  averageLevel: number;
  totalReferrals: number;
}

export interface TaskReport {
  taskId: string;
  taskTitle: string;
  totalAssigned: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
  avgCompletionTime: number;
}

export interface StudentActivity {
  id: string;
  studentId: string;
  studentName: string;
  action: string;
  timestamp: Date;
  points?: number;
  details?: string;
}

export type AdminSortField = 'name' | 'email' | 'points' | 'level' | 'joinedAt' | 'lastActiveAt';
export type SortDirection = 'asc' | 'desc';

export interface AdminFilters {
  search: string;
  state: string;
  levelMin: number;
  levelMax: number;
  isAmbassador: 'all' | 'yes' | 'no';
  status: 'all' | 'active' | 'inactive' | 'suspended';
  dateFrom?: Date;
  dateTo?: Date;
}
