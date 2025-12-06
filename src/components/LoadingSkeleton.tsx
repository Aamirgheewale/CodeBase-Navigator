import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle' | 'graph';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  variant = 'text' 
}) => {
  if (variant === 'graph') {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <div className="relative w-64 h-64">
          {/* Central node */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full skeleton-shimmer" />
          
          {/* Orbiting nodes */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full skeleton-shimmer"
              style={{
                top: `${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`,
                left: `${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20">
            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1="50%"
                y1="50%"
                x2={`${50 + 40 * Math.cos((i * Math.PI * 2) / 6)}%`}
                y2={`${50 + 40 * Math.sin((i * Math.PI * 2) / 6)}%`}
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-lg p-4 space-y-3', className)}>
        <div className="h-4 skeleton-shimmer rounded w-3/4" />
        <div className="h-3 skeleton-shimmer rounded w-full" />
        <div className="h-3 skeleton-shimmer rounded w-5/6" />
      </div>
    );
  }

  if (variant === 'circle') {
    return (
      <div className={cn('rounded-full skeleton-shimmer', className)} />
    );
  }

  return (
    <div className={cn('h-4 skeleton-shimmer rounded', className)} />
  );
};
