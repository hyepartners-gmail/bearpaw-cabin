import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface IdeasItem {
  id: string;
  description: string;
  price: number | null; // Added optional price field
  created_at: string;
}

const fetchIdeasItems = async (): Promise<IdeasItem[]> => {
  const { data, error } = await supabase
    .from('ideas_items')
    .select('id, description, price, created_at') // Select the new price column
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