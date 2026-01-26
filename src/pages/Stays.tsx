import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, Loader2 } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { SearchBar } from '@/components/search/SearchBar';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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

const allAmenities = [
  'Wi-Fi',
  'Kitchen',
  'Parking',
  'Fireplace',
  'Pool Access',
  'Garden View',
  'Mountain View',
  'Air Conditioning',
  'Heating',
];

export default function Stays() {
  const { data: properties = [], isLoading, error } = useProperties();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [maxGuests, setMaxGuests] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredProperties = useMemo(() => {
    let result = properties.filter(property => {
      // Price filter
      if (property.nightlyPrice < priceRange[0] || property.nightlyPrice > priceRange[1]) {
        return false;
      }

      // Guests filter
      if (maxGuests && property.maxGuests < maxGuests) {
        return false;
      }

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
  }, [properties, priceRange, maxGuests, selectedAmenities, sortBy]);

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setMaxGuests(null);
    setSelectedAmenities([]);
    setSortBy('recommended');
  };

  const hasActiveFilters = 
    priceRange[0] !== 0 || 
    priceRange[1] !== 50000 || 
    maxGuests !== null || 
    selectedAmenities.length > 0;

  const filterContent = (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h4 className="font-semibold mb-4">Price Range</h4>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={50000}
          step={1000}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Max Guests */}
      <div>
        <h4 className="font-semibold mb-4">Minimum Guests</h4>
        <div className="flex flex-wrap gap-2">
          {[null, 2, 4, 6, 8].map((num) => (
            <Button
              key={num ?? 'any'}
              variant={maxGuests === num ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMaxGuests(num)}
            >
              {num ?? 'Any'}
            </Button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h4 className="font-semibold mb-4">Amenities</h4>
        <div className="space-y-3">
          {allAmenities.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-3">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAmenities([...selectedAmenities, amenity]);
                  } else {
                    setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                  }
                }}
              />
              <label htmlFor={amenity} className="text-sm cursor-pointer">
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
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
      {/* Header */}
      <section className="relative py-12 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
              All Stays
            </h1>
            <p className="text-muted-foreground mb-6">
              {isLoading ? 'Loading...' : `${filteredProperties.length} home${filteredProperties.length !== 1 ? 's' : ''} in Nanyuki, Kenya`}
            </p>
            <SearchBar variant="compact" />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-1">
                        {selectedAmenities.length + (maxGuests ? 1 : 0) + (priceRange[0] !== 0 || priceRange[1] !== 50000 ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    {filterContent}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters */}
              {selectedAmenities.map((amenity) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="hidden sm:flex gap-1 cursor-pointer"
                  onClick={() => setSelectedAmenities(selectedAmenities.filter(a => a !== amenity))}
                >
                  {amenity}
                  <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
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
          <div className="flex gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 bg-card rounded-xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold mb-6">Filters</h3>
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
                  className="text-center py-16"
                >
                  <p className="text-lg text-muted-foreground mb-4">
                    No properties match your filters
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
