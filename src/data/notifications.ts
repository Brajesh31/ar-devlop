import { Notification } from '@/types/notifications';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Level Up! 🎉',
    message: 'Congratulations! You reached Level 5 and unlocked new privileges.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    read: false,
    link: '/dashboard/profile',
  },
  {
    id: '2',
    type: 'event',
    title: 'Event Starting Soon',
    message: 'XR Workshop: Building Your First AR App starts in 2 hours.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    link: '/events/xr-workshop-2024',
  },
  {
    id: '3',
    type: 'referral',
    title: 'New Referral Success!',
    message: 'Priya Sharma joined using your referral code. You earned 50 points!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: false,
    link: '/dashboard/ambassador',
  },
  {
    id: '4',
    type: 'task',
    title: 'Task Completed',
    message: 'You completed "Share on LinkedIn" task and earned 25 points.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    link: '/dashboard/ambassador',
  },
  {
    id: '5',
    type: 'system',
    title: 'Profile Update Required',
    message: 'Complete your profile to unlock ambassador program eligibility.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
    link: '/dashboard/profile',
  },
  {
    id: '6',
    type: 'ambassador',
    title: 'Ambassador Task Available',
    message: 'New task: "Host a Campus Session" is now available. Earn 200 points!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
    link: '/dashboard/ambassador',
  },
  {
    id: '7',
    type: 'event',
    title: 'Registration Confirmed',
    message: 'You are registered for Bharat XR Summit 2024. See you there!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
    read: true,
    link: '/events/bharatxr-summit-2024',
  },
  {
    id: '8',
    type: 'achievement',
    title: 'New Badge Unlocked',
    message: 'You earned the "Early Adopter" badge for joining in the first month.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 1 week ago
    read: true,
    link: '/dashboard/profile',
  },
];

export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter(n => !n.read).length;
};

export const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
