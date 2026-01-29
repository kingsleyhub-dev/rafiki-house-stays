import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCategoryImage {
  id: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'game_drive';
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ServiceCategory = ServiceCategoryImage['category'];

// Fetch all category images
export function useServiceCategoryImages() {
  return useQuery({
    queryKey: ['service-category-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_category_images')
        .select('*')
        .order('category');

      if (error) throw error;
      return data as ServiceCategoryImage[];
    },
  });
}

// Update category image
export function useUpdateServiceCategoryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, image_url }: { category: ServiceCategory; image_url: string | null }) => {
      const { data, error } = await supabase
        .from('service_category_images')
        .update({ image_url })
        .eq('category', category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-category-images'] });
    },
  });
}

// Upload image to storage and update category
export function useUploadServiceCategoryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, file }: { category: ServiceCategory; file: File }) => {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${category}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('service-images')
        .getPublicUrl(fileName);

      // Update database
      const { data, error } = await supabase
        .from('service_category_images')
        .update({ image_url: urlData.publicUrl })
        .eq('category', category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-category-images'] });
    },
  });
}

// Delete image from storage and clear category
export function useDeleteServiceCategoryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ category, imageUrl }: { category: ServiceCategory; imageUrl: string }) => {
      // Extract filename from URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('service-images')
        .remove([fileName]);

      if (deleteError) throw deleteError;

      // Clear database entry
      const { data, error } = await supabase
        .from('service_category_images')
        .update({ image_url: null })
        .eq('category', category)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['service-category-images'] });
    },
  });
}
