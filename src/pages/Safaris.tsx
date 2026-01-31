import { motion } from 'framer-motion';
import { MapPin, Compass, Mountain, Trees, Camera, Navigation } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { useSafariDestinations, useSafariExperienceImages } from '@/hooks/useSafaris';
import { useGeolocation, calculateDistance, RAFIKI_HOUSE_COORDS } from '@/hooks/useGeolocation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExperienceGallery } from '@/components/safari/ExperienceGallery';
// Placeholder images for destinations that don't have custom images yet
const placeholderImages: Record<string, string> = {
  'ol-pejeta': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
  'ngare-ndare': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
  'mt-ololokwe': 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=800&q=80',
  'mt-kenya': 'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80',
  'ol-jogi': 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80',
  'mau-mau-caves': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'samburu': 'https://images.unsplash.com/photo-1612276529731-4b21494e6d71?w=800&q=80',
  'aberdare': 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=800&q=80',
  'mt-kenya-orphanage': 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800&q=80',
};

const iconMap: Record<string, React.ElementType> = {
  'ol-pejeta': Compass,
  'ngare-ndare': Trees,
  'mt-ololokwe': Mountain,
  'mt-kenya': Mountain,
  'ol-jogi': Camera,
  'mau-mau-caves': Compass,
  'samburu': Compass,
  'aberdare': Trees,
  'mt-kenya-orphanage': Camera,
};

export default function Safaris() {
  const { data: destinations, isLoading: loadingDestinations } = useSafariDestinations();
  const { data: experienceImages, isLoading: loadingImages } = useSafariExperienceImages();
  const { latitude, longitude, city, country, loading: loadingLocation } = useGeolocation();

  const distanceToRafiki = latitude && longitude
    ? calculateDistance(latitude, longitude, RAFIKI_HOUSE_COORDS.lat, RAFIKI_HOUSE_COORDS.lng)
    : null;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80"
            alt="African Safari"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/50" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-4 bg-accent/20 text-accent border-0">
              <Compass className="w-3 h-3 mr-1" />
              Safaris & Game Drives
            </Badge>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
              Discover Our Premier{' '}
              <span className="text-accent">Destinations</span>
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-6 leading-relaxed">
              Explore the heart of Kenya through our curated selection of wildlife conservancies, 
              historical landmarks, and breathtaking landscapes.
            </p>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full">
                <Navigation className="w-4 h-4 text-primary" />
                {loadingLocation ? (
                  <span className="text-sm text-muted-foreground">Detecting location...</span>
                ) : city && country ? (
                  <span className="text-sm font-medium">
                    Your location: {city}, {country}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">Location unavailable</span>
                )}
              </div>
              
              {distanceToRafiki && (
                <div className="flex items-center gap-2 bg-accent/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">
                    {Math.round(distanceToRafiki)} km to Rafiki House
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {loadingDestinations ? (
            <div className="grid gap-8">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-12">
              {destinations?.map((destination, index) => {
                const Icon = iconMap[destination.slug] || Compass;
                const imageUrl = destination.image_url || placeholderImages[destination.slug] || placeholderImages['ol-pejeta'];
                
                return (
                  <motion.div
                    key={destination.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-elevated">
                      <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
                        {/* Image */}
                        <div className={`relative h-64 md:h-96 ${index % 2 === 1 ? 'md:col-start-2' : ''}`}>
                          <img
                            src={imageUrl}
                            alt={destination.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-primary text-primary-foreground">
                              <Icon className="w-3 h-3 mr-1" />
                              {index + 1}. {destination.name}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <CardContent className="p-6 md:p-8 flex flex-col justify-center">
                          <h3 className="font-display text-xl md:text-2xl font-bold mb-2 text-foreground">
                            {destination.name}
                          </h3>
                          <p className="text-accent font-medium mb-4 text-sm md:text-base">
                            {destination.tagline}
                          </p>
                          <p className="text-muted-foreground mb-4 leading-relaxed text-sm md:text-base">
                            {destination.description}
                          </p>
                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm font-medium text-foreground mb-1">The Experience:</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {destination.experience}
                            </p>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Experience Gallery */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="secondary" className="mb-4">
              <Camera className="w-3 h-3 mr-1" />
              Our Adventures
            </Badge>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
              Past Safari Experiences
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Glimpses from our previous safaris and game drives. These memories showcase 
              the incredible experiences awaiting you. Click any image to view it full-size.
            </p>
          </motion.div>

          <ExperienceGallery 
            images={experienceImages || []} 
            isLoading={loadingImages} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-navy text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-accent font-medium mb-2">You dream it, we'll drive it</p>
            <h2 className="font-display text-2xl md:text-4xl font-bold mb-4">
              Ready for Your Safari Adventure?
            </h2>
            <p className="text-primary-foreground/70 max-w-xl mx-auto mb-8">
              Let's uncover the hidden gems of this beautiful country together. 
              Contact us to plan your personalized safari experience.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Compass className="w-4 h-4" />
              Plan Your Safari
            </a>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
