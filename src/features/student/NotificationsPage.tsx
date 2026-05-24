import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, BookOpen, Award, Tag, CheckCheck } from 'lucide-react';
import { formatRelativeTime } from '@/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'course',
    icon: BookOpen,
    title: 'New lecture available',
    message: '"Advanced React Patterns" has been updated with 3 new lectures.',
    time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isRead: false,
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    id: '2',
    type: 'achievement',
    icon: Award,
    title: 'Certificate earned!',
    message: 'Congratulations! You completed "Python Basics" and earned a certificate.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    isRead: false,
    color: 'text-yellow-500 bg-yellow-500/10',
  },
  {
    id: '3',
    type: 'promo',
    icon: Tag,
    title: 'Limited time offer',
    message: 'Machine Learning courses are 60% off this week only. Don\'t miss out!',
    time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isRead: true,
    color: 'text-green-500 bg-green-500/10',
  },
  {
    id: '4',
    type: 'course',
    icon: BookOpen,
    title: 'Course update',
    message: '"Complete React Developer" has been updated with new content for 2025.',
    time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true,
    color: 'text-blue-500 bg-blue-500/10',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
        action={
          unreadCount > 0 ? (
            <Button variant="ghost" size="sm" onClick={markAllRead}>
              <CheckCheck className="size-4" />
              Mark all read
            </Button>
          ) : undefined
        }
      />

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up! Check back later."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notification, i) => {
            const Icon = notification.icon;
            return (
              <motion.button
                key={notification.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => markRead(notification.id)}
                className={cn(
                  'w-full text-left flex items-start gap-4 p-4 rounded-xl border transition-all duration-150',
                  'hover:shadow-sm',
                  notification.isRead
                    ? 'bg-background border-border/50'
                    : 'bg-card border-border shadow-sm'
                )}
              >
                <div className={cn('size-9 rounded-xl flex items-center justify-center shrink-0', notification.color)}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn('text-sm font-medium', notification.isRead && 'text-muted-foreground')}>
                      {notification.title}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(notification.time)}
                      </span>
                      {!notification.isRead && (
                        <span className="size-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
