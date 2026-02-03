import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProperties } from '@/hooks/useProperties';
import { useAmenities } from '@/hooks/useAmenities';
import heroStays from '@/assets/hero-stays.jpg';

export default function Stays() {
  const { data: properties = [], isLoading, error } = useProperties();
  const { data: amenities = [] } = useAmenities();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProperties = useMemo(() => {
    let result = properties.filter(property => {
      // Amenities filter
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(amenity =>
          property.amenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-low':
        result = result.sort((a, b) => a.nightlyPrice - b.nightlyPrice);
        break;
      case 'price-high':
        result = result.sort((a, b) => b.nightlyPrice - a.nightlyPrice);
        break;
      case 'rating':
        result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'guests':
        result = result.sort((a, b) => b.maxGuests - a.maxGuests);
        break;
      default:
        // 'recommended' - keep original order
        break;
    }

    return result;
  }, [properties, selectedAmenities, sortBy]);

  const clearFilters = () => {
    setSelectedAmenities([]);
    setSortBy('recommended');
  };

  const hasActiveFilters = selectedAmenities.length > 0;

  const filterContent = (
    <div className="space-y-6">
      {/* Amenities */}
      <div>
        <h4 className="font-semibold mb-4 text-sm sm:text-base">Available Amenities</h4>
        <div className="space-y-3">
          {amenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-3 min-h-[44px]">
              <Checkbox
                id={amenity.id}
                checked={selectedAmenities.includes(amenity.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAmenities([...selectedAmenities, amenity.name]);
                  } else {
                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity.name));
                  }
                }}
                className="h-5 w-5"
              />
              <label htmlFor={amenity.id} className="text-sm cursor-pointer">
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full min-h-[44px]">
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-destructive">Error loading properties. Please try again later.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[40vh] md:min-h-[50vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroStays}
            alt="Kenyan highlands with boutique cottages"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy/80 via-navy/60 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10 py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1.5 bg-accent/20 text-accent rounded-full text-xs sm:text-sm font-medium mb-3">
              8 Unique Homes
            </span>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 leading-tight">
              All Stays
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-primary-foreground/80 mb-6 max-w-lg">
              {isLoading ? 'Loading...' : `${filteredProperties.length} home${filteredProperties.length !== 1 ? 's' : ''} in Nanyuki, Kenya`}
            </p>
            <div className="max-w-xl">
              <SearchBar variant="compact" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4 mb-6">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2 min-h-[44px]">
                    <Filter className="h-4 w-4" />
                    <span className="hidden xs:inline">Amenities</span>
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedAmenities.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                  <SheetHeader>
                    <SheetTitle>Filter by Amenities</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {filterContent}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters - Hidden on mobile */}
              <div className="hidden md:flex gap-2 flex-wrap">
                {selectedAmenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="secondary"
                    className="flex gap-1 cursor-pointer min-h-[32px]"
                    onClick={() => setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))}
                  >
                    {amenity}
                    <X className="h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px] sm:w-[180px] min-h-[44px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="guests">Most Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid Layout */}
          <div className="flex gap-6 lg:gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold mb-6">Amenities</h3>
                {filterContent}
              </div>
            </aside>

            {/* Properties Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredProperties.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 md:py-16"
                >
                  <p className="text-base md:text-lg text-muted-foreground mb-4">
                    No properties match your filters
                  </p>
                  <Button variant="outline" onClick={clearFilters} className="min-h-[44px]">
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard key={property.id} property={property} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
