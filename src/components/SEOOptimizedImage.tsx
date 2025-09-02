import { useState } from 'react';

interface SEOOptimizedImageProps {
  src: string;
  alt: string;
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
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        width={width}
        height={height}
        loading={loading}
        fetchPriority={fetchpriority}
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