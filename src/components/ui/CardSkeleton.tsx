import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  className?: string;
  variant?: 'default' | 'event' | 'project' | 'resource';
}

export const CardSkeleton = ({ className, variant = 'default' }: CardSkeletonProps) => {
  if (variant === 'event') {
    return (
      <div className={cn("rounded-xl border border-border/50 bg-card overflow-hidden", className)}>
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="p-5 space-y-4">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'project') {
    return (
      <div className={cn("rounded-xl border border-border/50 bg-card overflow-hidden", className)}>
        <Skeleton className="h-56 w-full rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-14 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'resource') {
    return (
      <div className={cn("rounded-xl border border-border/50 bg-card p-5 space-y-4", className)}>
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-border/50 bg-card p-5 space-y-4", className)}>
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
};

export const ContentSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={cn("h-4", i === lines - 1 ? "w-2/3" : "w-full")} />
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="py-16 space-y-6">
    <Skeleton className="h-6 w-32 rounded-full mx-auto" />
    <Skeleton className="h-12 w-2/3 mx-auto" />
    <Skeleton className="h-6 w-1/2 mx-auto" />
    <div className="flex gap-4 justify-center pt-4">
      <Skeleton className="h-11 w-32 rounded-lg" />
      <Skeleton className="h-11 w-32 rounded-lg" />
    </div>
  </div>
);

export const GridSkeleton = ({ count = 6, variant = 'default' }: { count?: number; variant?: CardSkeletonProps['variant'] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} variant={variant} />
    ))}
  </div>
);
