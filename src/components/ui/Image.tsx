import { useState, useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── TYPES ─────────────────────────────────────────────────────────────────────────
export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  blurRadius?: number;
  loading?: 'lazy' | 'eager';
}

// ─── COMPONENTS ────────────────────────────────────────────────────────────────────

/**
 * Lazy Loading Image Component with placeholder and error handling
 */
export function LazyImage({
  src,
  alt,
  fallback = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image',
  className,
  containerClassName,
  width,
  height,
  loading = 'lazy',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blurHash, setBlurHash] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle image load success
  const handleLoad = () => {
    setIsLoaded(true);
    setBlurHash(null);
  };

  // Handle image load error
  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Load blur placeholder (simplified)
  useEffect(() => {
    if (src && !hasError) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        // You could implement a blur hash library here for better UX
        setBlurHash(null);
      };
    }
  }, [src, hasError]);

  // Calculate aspect ratio
  const aspectRatio = width && height ? width / height : 1;
  const containerStyle = containerClassName
    ? undefined
    : { paddingBottom: `${(1 / aspectRatio) * 100}%` };

  return (
    <div
      className={cn('relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800', containerClassName)}
      style={containerStyle}
    >
      {/* Loading Spinner */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">No image</span>
        </div>
      )}

      {/* Image */}
      <img
        ref={imgRef}
        src={hasError ? fallback : src}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-all duration-300 ease-in-out',
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
          className
        )}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
}

/**
 * Avatar Component - Specialized image for user/profile avatars
 */
export interface AvatarProps extends Omit<LazyImageProps, 'loading'> {
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue';
}

export function Avatar({
  name,
  src,
  alt,
  size = 'md',
  showStatus,
  statusColor = 'green',
  className,
  ...props
}: AvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-16 w-16 text-base',
    xl: 'h-24 w-24 text-lg',
  };

  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
  };

  // Generate initials if no image
  const initials = name
    ? name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
    : '';

  return (
    <div className="relative">
      {src ? (
        <LazyImage
          src={src}
          alt={alt || name || 'Avatar'}
          className={cn('rounded-full', className)}
          containerClassName="rounded-full"
          {...props}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white',
            sizeClasses[size],
            className
          )}
        >
          {initials}
        </div>
      )}

      {/* Online Status Indicator */}
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900',
            statusColors[statusColor]
          )}
        />
      )}
    </div>
  );
}

// ─── EXPORTS ───────────────────────────────────────────────────────────────────────
export { LazyImage, Avatar };
