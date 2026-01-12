import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Trophy, 
  Calendar, 
  Users, 
  Settings, 
  CheckCircle2,
  Circle,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockNotifications, getUnreadCount, getTimeAgo } from '@/data/notifications';
import { Notification, NotificationType } from '@/types/notifications';

const typeIcons: Record<NotificationType, React.ElementType> = {
  achievement: Trophy,
  event: Calendar,
  referral: Users,
  system: Settings,
  task: CheckCircle2,
  ambassador: Users,
};

const typeColors: Record<NotificationType, string> = {
  achievement: 'text-amber-500 bg-amber-500/10',
  event: 'text-blue-500 bg-blue-500/10',
  referral: 'text-green-500 bg-green-500/10',
  system: 'text-gray-500 bg-gray-500/10',
  task: 'text-purple-500 bg-purple-500/10',
  ambassador: 'text-accent bg-accent/10',
};

export const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = getUnreadCount(notifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-secondary transition-colors"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-accent text-white rounded-full px-1"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50"
            >
              {/* Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/30">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-muted-foreground hover:text-accent transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.slice(0, 8).map((notification) => {
                      const Icon = typeIcons[notification.type];
                      const colorClass = typeColors[notification.type];
                      
                      return (
                        <Link
                          key={notification.id}
                          to={notification.link || '#'}
                          onClick={() => {
                            markAsRead(notification.id);
                            setIsOpen(false);
                          }}
                          className={cn(
                            'flex items-start gap-3 p-4 hover:bg-secondary/50 transition-colors',
                            !notification.read && 'bg-accent/5'
                          )}
                        >
                          {/* Icon */}
                          <div className={cn('p-2 rounded-lg flex-shrink-0', colorClass)}>
                            <Icon size={16} />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className={cn(
                                'text-sm',
                                !notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                              )}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <Circle className="w-2 h-2 fill-accent text-accent flex-shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              {getTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-border bg-secondary/20">
                  <Link
                    to="/dashboard/notifications"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    <span>View all notifications</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
