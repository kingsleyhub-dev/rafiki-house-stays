import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  created_at: string;
  updated_at: string;
}

interface DbBooking {
  id: string;
  property_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  nightly_price: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

function mapDbToProperty(db: DbProperty): Property {
  // Use database images if they exist, otherwise fall back to local images
  const hasDbImages = db.image_urls && db.image_urls.length > 0 && db.image_urls.some(url => url.startsWith('http'));
  const localImage = propertyImages[db.slug];
  const imageUrls = hasDbImages 
    ? db.image_urls.filter(url => url.startsWith('http'))
    : (localImage ? [localImage] : db.image_urls || []);

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

// Fetch ALL properties (including inactive) for admin
export function useAllProperties() {
  return useQuery({
    queryKey: ['admin', 'properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('name');

      if (error) throw error;
      return (data as DbProperty[]).map(mapDbToProperty);
    },
  });
}

// Fetch ALL bookings for admin
export function useAllBookings() {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DbBooking[];
    },
  });
}

// Update booking status
export function useAdminUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Update property active status
export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('properties')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Update property details
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: Partial<DbProperty> & { id: string }) => {
      const { id, ...updateData } = property;
      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Create new property
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (property: Omit<DbProperty, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('properties')
        .insert(property)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Delete property
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

// Delete booking
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}

// Get all registered users (from bookings, since we don't have a profiles table)
export function useBookingUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('user_id')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get unique user IDs
      const uniqueUserIds = [...new Set(data.map(b => b.user_id))];
      return uniqueUserIds;
    },
  });
}
