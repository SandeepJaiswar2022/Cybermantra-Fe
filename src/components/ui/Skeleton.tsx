import { cn } from '@/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'circle' | 'text';
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 w-full rounded',
        variant === 'default' && 'h-full w-full rounded-lg',
        className
      )}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card p-4 space-y-4">
      <Skeleton className="h-40 w-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton variant="circle" className="size-8" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonText };
