import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface IdeasItem {
  id: string;
  description: string;
  price: number | null;
  notes: string | null; // Added optional notes field
  created_at: string;
}

const fetchIdeasItems = async (): Promise<IdeasItem[]> => {
  const { data, error } = await supabase
    .from('ideas_items')
    .select('id, description, price, notes, created_at') // Select the new notes column
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