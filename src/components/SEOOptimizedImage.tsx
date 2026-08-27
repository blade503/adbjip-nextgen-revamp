import { useState } from 'react';

interface SEOOptimizedImageProps {
  src: string;
  alt: string;
  /** Jeu de largeurs, quand plusieurs variantes du même visuel existent. */
  srcSet?: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  fetchpriority?: 'high' | 'low' | 'auto';
  sizes?: string;
}

const SEOOptimizedImage = ({ 
  src, 
  alt,
  srcSet,
  className = "", 
  width,
  height,
  loading = "lazy",
  fetchpriority = "auto",
  sizes
}: SEOOptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse rounded-lg"></div>
      )}
      
      <img
        src={src}
        srcSet={srcSet}
        alt={alt}
        className={`${className} transition-opacity duration-3 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        width={width}
        height={height}
        loading={loading}
        fetchpriority={fetchpriority}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        decoding="async"
      />
      
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center rounded-lg">
          <span className="text-muted-foreground text-sm">Image non disponible</span>
        </div>
      )}
    </div>
  );
};

export default SEOOptimizedImage;