export type NotificationType = 'achievement' | 'event' | 'referral' | 'system' | 'task' | 'ambassador';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  icon?: string;
}

export interface NotificationGroup {
  type: NotificationType;
  label: string;
  notifications: Notification[];
}
