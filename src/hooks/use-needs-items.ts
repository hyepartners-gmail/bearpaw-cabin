import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface NeedsItem {
  id: string;
  description: string;
  price: number | null;
  quantity: number; // Added quantity field
  created_at: string;
}

const fetchNeedsItems = async (): Promise<NeedsItem[]> => {
  const { data, error } = await supabase
    .from('needs_items')
    .select('id, description, price, quantity, created_at') // Select the new quantity column
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching needs items:", error);
    throw error;
  }
  return data || [];
};

export const useNeedsItems = () => {
  return useQuery<NeedsItem[], Error>({
    queryKey: ['needsItems'],
    queryFn: fetchNeedsItems,
  });
};