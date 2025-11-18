import { cn } from '../lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  lines?: number;
  height?: string;
}

export function SkeletonLoader({ className, lines = 1, height = 'h-4' }: SkeletonLoaderProps) {
  if (lines === 1) {
    return (
      <div
        className={cn(
          'animate-pulse bg-gray-200 rounded',
          height,
          className
        )}
      />
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse bg-gray-200 rounded',
            height,
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

// Specific skeleton components for different UI elements
export function CardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-lg animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-16 h-3 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="w-full h-4 bg-gray-200 rounded" />
        <div className="w-3/4 h-4 bg-gray-200 rounded" />
        <div className="w-1/2 h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="text-center p-4 border border-gray-200 rounded-lg animate-pulse">
          <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="w-16 h-6 bg-gray-200 rounded mx-auto mb-2" />
          <div className="w-20 h-4 bg-gray-200 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}
