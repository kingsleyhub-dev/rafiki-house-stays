import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AboutContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
}

export function useAboutContent() {
  return useQuery({
    queryKey: ['about-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .order('section_key');

      if (error) throw error;
      return data as AboutContent[];
    },
  });
}

export function useAboutContentByKey(sectionKey: string) {
  const { data: allContent, ...rest } = useAboutContent();
  
  return {
    ...rest,
    data: allContent?.find(item => item.section_key === sectionKey),
  };
}

export function useUpdateAboutContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title?: string; content: string }) => {
      const { data, error } = await supabase
        .from('about_content')
        .update({ title, content })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about-content'] });
      toast.success('Content updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update content: ' + error.message);
    },
  });
}
