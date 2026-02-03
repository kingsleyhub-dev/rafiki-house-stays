import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Amenity {
  id: string;
  name: string;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// Fetch all active amenities (for public display)
export function useAmenities() {
  return useQuery({
    queryKey: ['amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data as Amenity[];
    },
  });
}

// Fetch ALL amenities (including inactive) for admin
export function useAllAmenities() {
  return useQuery({
    queryKey: ['admin', 'amenities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('sort_order');

      if (error) throw error;
      return data as Amenity[];
    },
  });
}

// Create new amenity
export function useCreateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amenity: { name: string; icon?: string; sort_order?: number }) => {
      const { data, error } = await supabase
        .from('amenities')
        .insert(amenity)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'amenities'] });
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}

// Update amenity
export function useUpdateAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amenity: Partial<Amenity> & { id: string }) => {
      const { id, ...updateData } = amenity;
      const { data, error } = await supabase
        .from('amenities')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'amenities'] });
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}

// Delete amenity
export function useDeleteAmenity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('amenities')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'amenities'] });
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}

// Toggle amenity active status
export function useToggleAmenityStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('amenities')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'amenities'] });
      queryClient.invalidateQueries({ queryKey: ['amenities'] });
    },
  });
}
