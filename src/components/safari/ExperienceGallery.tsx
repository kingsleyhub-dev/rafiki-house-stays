import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Camera } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import useEmblaCarousel from 'embla-carousel-react';

interface ExperienceImage {
  id: string;
  image_url: string;
  title?: string | null;
  description?: string | null;
  destination_id?: string | null;
}

interface ExperienceGalleryProps {
  images: ExperienceImage[];
  isLoading?: boolean;
}

// Optimized image component with lazy loading and blur placeholder
function OptimizedImage({ 
  src, 
  alt, 
  className,
  priority = false,
  onLoad
}: { 
  src: string; 
  alt: string; 
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority && imgRef.current) {
      // Preload priority images
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-muted">
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/20 animate-pulse" />
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Camera className="h-8 w-8 text-muted-foreground/50" />
        </div>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => {
            setIsLoaded(true);
            onLoad?.();
          }}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export function ExperienceGallery({ images, isLoading }: ExperienceGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    skipSnaps: false,
  });
  
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Preload first few images for faster initial render
  useEffect(() => {
    if (images.length > 0) {
      const preloadCount = Math.min(6, images.length);
      images.slice(0, preloadCount).forEach(image => {
        const img = new Image();
        img.src = image.image_url;
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, image.id]));
        };
      });
    }
  }, [images]);

  // Auto-scroll effect
  useEffect(() => {
    if (!emblaApi || images.length <= 1) return;
    
    const autoScroll = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(autoScroll);
  }, [emblaApi, images.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedIndex(null);
      if (e.key === 'ArrowLeft') setSelectedIndex(prev => 
        prev !== null ? (prev - 1 + images.length) % images.length : null
      );
      if (e.key === 'ArrowRight') setSelectedIndex(prev => 
        prev !== null ? (prev + 1) % images.length : null
      );
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, images.length]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedIndex]);

  // Preload adjacent images when lightbox is open
  useEffect(() => {
    if (selectedIndex !== null && images.length > 0) {
      const preloadIndexes = [
        (selectedIndex - 1 + images.length) % images.length,
        (selectedIndex + 1) % images.length
      ];
      preloadIndexes.forEach(index => {
        const img = new Image();
        img.src = images[index].image_url;
      });
    }
  }, [selectedIndex, images]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No experience images available yet.</p>
        <p className="text-sm">Check back soon for photos from our safari adventures!</p>
      </div>
    );
  }

  return (
    <>
      {/* Carousel View */}
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background hidden md:flex"
          onClick={scrollPrev}
          disabled={!canScrollPrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm hover:bg-background hidden md:flex"
          onClick={scrollNext}
          disabled={!canScrollNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="flex-[0_0_45%] sm:flex-[0_0_33.333%] md:flex-[0_0_25%] lg:flex-[0_0_20%] min-w-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(index * 0.03, 0.3) }}
              >
                <div
                  className="relative aspect-square rounded-xl overflow-hidden shadow-card cursor-pointer group"
                  onClick={() => setSelectedIndex(index)}
                >
                  <OptimizedImage
                    src={image.image_url}
                    alt={image.title || 'Safari experience'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    priority={index < 6}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-background/90 backdrop-blur-sm rounded-full p-3">
                      <Camera className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  {image.title && (
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium line-clamp-2">{image.title}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Dots Indicator - Mobile */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          {images.slice(0, Math.min(7, images.length)).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === 0 ? 'bg-primary' : 'bg-muted'
              }`}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
          {images.length > 7 && (
            <span className="text-xs text-muted-foreground">+{images.length - 7}</span>
          )}
        </div>
      </div>

      {/* Grid View for Click-to-View */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-8">
        {images.map((image, index) => (
          <motion.button
            key={`thumb-${image.id}`}
            className="relative aspect-square rounded-lg overflow-hidden group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={() => setSelectedIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <OptimizedImage
              src={image.image_url}
              alt={image.title || 'Safari experience thumbnail'}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-xs font-medium">View</span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Navigation */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
              }}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndex((selectedIndex + 1) % images.length);
              }}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-[90vw] max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <OptimizedImage
                src={images[selectedIndex].image_url}
                alt={images[selectedIndex].title || 'Safari experience'}
                className="max-w-full max-h-[85vh] object-contain rounded-lg"
                priority
              />
              {(images[selectedIndex].title || images[selectedIndex].description) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                  {images[selectedIndex].title && (
                    <h3 className="text-white text-lg font-medium">{images[selectedIndex].title}</h3>
                  )}
                  {images[selectedIndex].description && (
                    <p className="text-white/80 text-sm mt-1">{images[selectedIndex].description}</p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedIndex + 1} / {images.length}
            </div>

            {/* Thumbnails Strip */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={`lightbox-thumb-${image.id}`}
                  className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden transition-all ${
                    index === selectedIndex ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-80'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex(index);
                  }}
                >
                  <OptimizedImage
                    src={image.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
