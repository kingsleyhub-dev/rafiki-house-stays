import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types';

// Import local images for properties
import propertyAmaranth from '@/assets/property-amaranth.jpg';
import propertyCitronella from '@/assets/property-citronella.jpg';
import propertyPaprika from '@/assets/property-paprika.jpg';
import propertyRosmarino from '@/assets/property-rosmarino.jpg';
import propertyOregano from '@/assets/property-oregano.jpg';
import propertySage from '@/assets/property-sage.jpg';
import propertyGinger from '@/assets/property-ginger.jpg';
import propertyThyme from '@/assets/property-thyme.jpg';

const propertyImages: Record<string, string> = {
  amaranth: propertyAmaranth,
  citronella: propertyCitronella,
  paprika: propertyPaprika,
  rosmarino: propertyRosmarino,
  oregano: propertyOregano,
  sage: propertySage,
  ginger: propertyGinger,
  thyme: propertyThyme,
};

interface DbProperty {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  nightly_price: number;
  max_guests: number;
  beds: number;
  baths: number;
  amenities: string[];
  image_urls: string[];
  home_type: string;
  city: string;
  country: string;
  rating: number | null;
  review_count: number | null;
  is_active: boolean;
}

function mapDbToProperty(db: DbProperty): Property {
  // If admin has uploaded images to the DB, use those exclusively (first = main image).
  // Only fall back to local assets when no DB images exist.
  const localImage = propertyImages[db.slug];
  const dbImages = (db.image_urls ?? []).filter(Boolean);

  const imageUrls = dbImages.length > 0 ? dbImages : (localImage ? [localImage] : []);

  return {
    id: db.id,
    slug: db.slug,
    name: db.name,
    title: db.title,
    description: db.description,
    nightlyPrice: db.nightly_price,
    maxGuests: db.max_guests,
    beds: db.beds,
    baths: db.baths,
    amenities: db.amenities || [],
    imageUrls: imageUrls,
    homeType: db.home_type,
    location: {
      city: db.city,
      country: db.country,
    },
    rating: db.rating ?? undefined,
    reviewCount: db.review_count ?? undefined,
    isActive: db.is_active,
  };
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return (data as DbProperty[]).map(mapDbToProperty);
    },
  });
}

export function useProperty(slug: string) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapDbToProperty(data as DbProperty);
    },
    enabled: !!slug,
  });
}

export function usePropertyById(id: string) {
  return useQuery({
    queryKey: ['property', 'id', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapDbToProperty(data as DbProperty);
    },
    enabled: !!id,
  });
}
