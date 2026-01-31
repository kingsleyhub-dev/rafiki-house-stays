import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SafariDestination {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  experience: string;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface SafariExperienceImage {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  destination_id: string | null;
  sort_order: number;
  is_active: boolean;
}

export function useSafariDestinations() {
  return useQuery({
    queryKey: ['safari-destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safari_destinations')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as SafariDestination[];
    },
  });
}

export function useSafariExperienceImages() {
  return useQuery({
    queryKey: ['safari-experience-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safari_experience_images')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data as SafariExperienceImage[];
    },
  });
}

export function useAdminSafariDestinations() {
  return useQuery({
    queryKey: ['admin-safari-destinations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safari_destinations')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data as SafariDestination[];
    },
  });
}

export function useAdminSafariExperienceImages() {
  return useQuery({
    queryKey: ['admin-safari-experience-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('safari_experience_images')
        .select('*')
        .order('sort_order');
      
      if (error) throw error;
      return data as SafariExperienceImage[];
    },
  });
}

export function useUploadSafariImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, type, destinationId }: { file: File; type: 'destination' | 'experience'; destinationId?: string }) => {
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${type}/${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('safari-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('safari-images')
        .getPublicUrl(fileName);

      if (type === 'experience') {
        const { error: insertError } = await supabase
          .from('safari_experience_images')
          .insert({
            image_url: publicUrl,
            destination_id: destinationId || null,
            title: null,
            description: null,
          });

        if (insertError) throw insertError;
      }

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safari-experience-images'] });
      queryClient.invalidateQueries({ queryKey: ['admin-safari-experience-images'] });
      queryClient.invalidateQueries({ queryKey: ['safari-destinations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-safari-destinations'] });
    },
  });
}

export function useUpdateDestinationImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ destinationId, imageUrl }: { destinationId: string; imageUrl: string }) => {
      const { error } = await supabase
        .from('safari_destinations')
        .update({ image_url: imageUrl })
        .eq('id', destinationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safari-destinations'] });
      queryClient.invalidateQueries({ queryKey: ['admin-safari-destinations'] });
    },
  });
}

export function useDeleteSafariExperienceImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (imageId: string) => {
      // Get image URL first to delete from storage
      const { data: image } = await supabase
        .from('safari_experience_images')
        .select('image_url')
        .eq('id', imageId)
        .single();

      if (image?.image_url) {
        const urlParts = image.image_url.split('/safari-images/');
        if (urlParts[1]) {
          await supabase.storage.from('safari-images').remove([urlParts[1]]);
        }
      }

      const { error } = await supabase
        .from('safari_experience_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['safari-experience-images'] });
      queryClient.invalidateQueries({ queryKey: ['admin-safari-experience-images'] });
    },
  });
}
