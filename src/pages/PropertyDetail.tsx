import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Star, Users, Bed, Bath, 
  Wifi, Car, UtensilsCrossed, Flame, Check, Share, Heart, Loader2 
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { BookingWidget } from '@/components/booking/BookingWidget';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProperty } from '@/hooks/useProperties';
import { ImageGallery } from '@/components/properties/ImageGallery';

const amenityIcons: Record<string, React.ElementType> = {
  'Wi-Fi': Wifi,
  'Kitchen': UtensilsCrossed,
  'Parking': Car,
  'Fireplace': Flame,
};

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: property, isLoading, error } = useProperty(slug || '');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/stays">Browse All Stays</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Navigation */}
      <div className="bg-muted/50 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/stays" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all stays
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge className="mb-2">{property.homeType}</Badge>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  {property.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  {property.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium text-foreground">{property.rating}</span>
                      <span>({property.reviewCount} reviews)</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location.city}, {property.location.country}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Save
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 relative"
          >
            <ImageGallery images={property.imageUrls} propertyName={property.name} />
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Quick Facts */}
              <div className="flex flex-wrap gap-6 py-6 border-b border-border">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{property.maxGuests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{property.beds} bedroom{property.beds !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{property.baths} bathroom{property.baths !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">About this space</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Located in the heart of Rafiki House Nanyuki property, {property.name} offers a unique 
                  blend of comfort and adventure. Wake up to stunning views of Mount Kenya, 
                  explore the beautifully landscaped gardens, or simply relax on your private 
                  terrace. Our dedicated team is always on hand to make your stay unforgettable.
                </p>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Check;
                    return (
                      <div key={amenity} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <Icon className="h-5 w-5 text-foreground" />
                        </div>
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div>
                <h2 className="font-display text-2xl font-semibold mb-4">Location</h2>
                <a 
                  href="https://maps.app.goo.gl/fm7SAxX6SYrVyz8D9?g_st=aw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative rounded-xl h-64 overflow-hidden group block"
                >
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7606!2d37.0731!3d-0.0167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMDEnMDAuMSJTIDM3wrAwNCcyMy4yIkU!5e0!3m2!1sen!2ske!4v1700000000000!5m2!1sen!2ske"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Rafiki House Nanyuki Location"
                    className="pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-primary/10 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium">View on Google Maps</span>
                    </div>
                  </div>
                </a>
                <p className="text-muted-foreground mt-4">
                  Nanyuki is a charming town at the foot of Mount Kenya. The area offers 
                  incredible wildlife experiences, hiking opportunities, and a chance to 
                  experience authentic Kenyan highland culture.
                </p>
              </div>
            </motion.div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <BookingWidget property={property} />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
