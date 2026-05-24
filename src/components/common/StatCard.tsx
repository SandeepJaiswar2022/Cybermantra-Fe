import { type LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: 'blue' | 'violet' | 'green' | 'orange' | 'pink';
  className?: string;
}

const colorMap = {
  blue: { icon: 'text-blue-500 bg-blue-500/10', trend: 'text-blue-600 bg-blue-50 dark:bg-blue-500/10' },
  violet: { icon: 'text-violet-500 bg-violet-500/10', trend: 'text-violet-600 bg-violet-50 dark:bg-violet-500/10' },
  green: { icon: 'text-green-500 bg-green-500/10', trend: 'text-green-600 bg-green-50 dark:bg-green-500/10' },
  orange: { icon: 'text-orange-500 bg-orange-500/10', trend: 'text-orange-600 bg-orange-50 dark:bg-orange-500/10' },
  pink: { icon: 'text-pink-500 bg-pink-500/10', trend: 'text-pink-600 bg-pink-50 dark:bg-pink-500/10' },
};

export function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'blue', className }: StatCardProps) {
  const colors = colorMap[color];
  const isPositive = (trend?.value ?? 0) >= 0;

  return (
    <div className={cn('rounded-xl border bg-card p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 min-w-0">
          <p className="text-sm text-muted-foreground font-medium truncate">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-xl shrink-0', colors.icon)}>
          <Icon className="size-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={cn(
            'inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-md',
            colors.trend
          )}>
            <svg viewBox="0 0 16 16" className="size-3" fill="currentColor">
              {isPositive
                ? <path d="M8 3.293L14.354 9.646a.5.5 0 0 1-.707.707L8 4.707 2.354 10.354a.5.5 0 1 1-.707-.707L8 3.293z" />
                : <path d="M8 12.707L1.646 6.354a.5.5 0 0 1 .707-.707L8 11.293l5.646-5.646a.5.5 0 0 1 .707.707L8 12.707z" />
              }
            </svg>
            {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
