import { type LucideIcon } from 'lucide-react';
import { cn } from '@/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center py-16 px-8 text-center rounded-xl border border-dashed bg-muted/20',
      className
    )}>
      {Icon && (
        <div className="size-12 rounded-xl bg-muted flex items-center justify-center mb-4">
          <Icon className="size-6 text-muted-foreground/60" />
        </div>
      )}
      <h3 className="font-semibold text-base mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
