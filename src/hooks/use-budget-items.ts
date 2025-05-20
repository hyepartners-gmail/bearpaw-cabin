import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface BudgetItem {
  id: string;
  name: string;
  type: 'monthly' | 'one-time';
  cost: number;
  created_at: string;
}

const fetchBudgetItems = async (): Promise<BudgetItem[]> => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching budget items:", error);
    throw error;
  }
  return data || [];
};

export const useBudgetItems = () => {
  return useQuery<BudgetItem[], Error>({
    queryKey: ['budgetItems'],
    queryFn: fetchBudgetItems,
  });
};