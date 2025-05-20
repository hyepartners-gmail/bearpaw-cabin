import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface IdeasItem {
  id: string;
  description: string;
  created_at: string;
}

const fetchIdeasItems = async (): Promise<IdeasItem[]> => {
  const { data, error } = await supabase
    .from('ideas_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching ideas items:", error);
    throw error;
  }
  return data || [];
};

export const useIdeasItems = () => {
  return useQuery<IdeasItem[], Error>({
    queryKey: ['ideasItems'],
    queryFn: fetchIdeasItems,
  });
};