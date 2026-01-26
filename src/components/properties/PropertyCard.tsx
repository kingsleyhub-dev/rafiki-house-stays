import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Bed, Bath, MapPin } from 'lucide-react';
import { Property } from '@/types';
import { Badge } from '@/components/ui/badge';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/stays/${property.slug}`} className="block group">
        <motion.div
          className="bg-card rounded-xl overflow-hidden shadow-card transition-shadow duration-300 group-hover:shadow-card-hover"
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent z-10"
            />
            <img
              src={property.imageUrls[0] || '/placeholder.svg'}
              alt={property.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <Badge className="absolute top-3 left-3 z-20 bg-accent text-accent-foreground">
              {property.homeType}
            </Badge>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title and Rating */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {property.name}
                </h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{property.location.city}, {property.location.country}</span>
                </div>
              </div>
              {property.rating && (
                <div className="flex items-center gap-1 bg-accent/20 px-2 py-1 rounded-md">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="text-sm font-medium">{property.rating}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm line-clamp-2">
              {property.description}
            </p>

            {/* Features */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{property.maxGuests} guests</span>
              </div>
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{property.beds} beds</span>
              </div>
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{property.baths} bath</span>
              </div>
            </div>

            {/* Price */}
            <div className="pt-2 border-t border-border">
              <div className="flex items-baseline gap-1">
                <span className="font-display text-xl font-semibold text-foreground">
                  {formatPrice(property.nightlyPrice)}
                </span>
                <span className="text-sm text-muted-foreground">/ night</span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
