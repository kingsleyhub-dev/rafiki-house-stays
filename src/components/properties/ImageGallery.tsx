import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Grid3X3, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageGalleryProps {
  images: string[];
  propertyName: string;
}

export function ImageGallery({ images, propertyName }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);

  // Ensure we have at least one image
  const galleryImages = images.length > 0 ? images : ['/placeholder.svg'];

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setShowAllImages(false);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'Escape') setLightboxOpen(false);
  };

  return (
    <>
      {/* Desktop Grid Gallery */}
      <div className="hidden md:grid grid-cols-4 gap-2 rounded-xl overflow-hidden">
        {/* Main large image */}
        <div 
          className="col-span-2 row-span-2 relative group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <AspectRatio ratio={4/3}>
            <img
              src={galleryImages[0]}
              alt={propertyName}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </AspectRatio>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="secondary" className="gap-2">
              <Expand className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>

        {/* Smaller images */}
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="relative group cursor-pointer overflow-hidden"
            onClick={() => galleryImages[i] && openLightbox(i)}
          >
            <AspectRatio ratio={4/3}>
              <img
                src={galleryImages[i] || '/placeholder.svg'}
                alt={`${propertyName} ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {/* Show all photos button on last visible image */}
            {i === 4 && galleryImages.length > 5 && (
              <div 
                className="absolute inset-0 bg-black/40 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAllImages(true);
                  setLightboxOpen(true);
                }}
              >
                <Button variant="secondary" size="sm" className="gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  +{galleryImages.length - 5} more
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* Show all photos button */}
        {galleryImages.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 right-4 gap-2 bg-background/90 backdrop-blur-sm"
            onClick={() => {
              setShowAllImages(true);
              setLightboxOpen(true);
            }}
            style={{ position: 'absolute', bottom: '1rem', right: '1rem' }}
          >
            <Grid3X3 className="h-4 w-4" />
            Show all photos
          </Button>
        )}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <Carousel className="w-full">
          <CarouselContent>
            {galleryImages.map((image, index) => (
              <CarouselItem key={index}>
                <div 
                  className="relative cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  <AspectRatio ratio={16/9}>
                    <img
                      src={image}
                      alt={`${propertyName} ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </AspectRatio>
                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {index + 1} / {galleryImages.length}
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {galleryImages.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent 
          className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <AnimatePresence mode="wait">
            {showAllImages ? (
              /* All Images Grid View */
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-xl font-semibold">
                    All photos ({galleryImages.length})
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {galleryImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="cursor-pointer rounded-lg overflow-hidden"
                      onClick={() => {
                        setCurrentIndex(index);
                        setShowAllImages(false);
                      }}
                    >
                      <AspectRatio ratio={4/3}>
                        <img
                          src={image}
                          alt={`${propertyName} ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </AspectRatio>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Single Image View with Navigation */
              <motion.div
                key="single"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative flex items-center justify-center h-[90vh]"
              >
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
                  onClick={() => setLightboxOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>

                {/* Grid view button */}
                {galleryImages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 left-4 z-50 text-white hover:bg-white/20"
                    onClick={() => setShowAllImages(true)}
                  >
                    <Grid3X3 className="h-6 w-6" />
                  </Button>
                )}

                {/* Previous button */}
                {galleryImages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={() => navigateLightbox('prev')}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                )}

                {/* Main image */}
                <motion.img
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  src={galleryImages[currentIndex]}
                  alt={`${propertyName} ${currentIndex + 1}`}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg"
                />

                {/* Next button */}
                {galleryImages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 h-12 w-12"
                    onClick={() => navigateLightbox('next')}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                )}

                {/* Image counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {currentIndex + 1} / {galleryImages.length}
                </div>

                {/* Thumbnail strip */}
                {galleryImages.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2">
                    {galleryImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentIndex 
                            ? 'border-white opacity-100' 
                            : 'border-transparent opacity-50 hover:opacity-75'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}
