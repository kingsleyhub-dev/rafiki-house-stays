import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Service {
  id: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'drinks' | 'game_drive';
  name: string;
  description: string;
  price: string;
  duration?: string;
  time_slot?: string;
  includes?: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type ServiceCategory = Service['category'];

// Fetch all active services (for public display)
export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data as Service[];
    },
  });
}

// Fetch services by category
export function useServicesByCategory(category: ServiceCategory) {
  return useQuery({
    queryKey: ['services', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data as Service[];
    },
    enabled: !!category,
  });
}

// Fetch ALL services (including inactive) for admin
export function useAllServices() {
  return useQuery({
    queryKey: ['admin', 'services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category')
        .order('sort_order');

      if (error) throw error;
      return data as Service[];
    },
  });
}

// Create new service
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Update service
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Partial<Service> & { id: string }) => {
      const { id, ...updateData } = service;
      const { data, error } = await supabase
        .from('services')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Delete service
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

// Toggle service active status
export function useToggleServiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data, error } = await supabase
        .from('services')
        .update({ is_active: isActive })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
