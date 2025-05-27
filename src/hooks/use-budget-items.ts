// src/hooks/useBudgetItems.ts
import { useQuery } from '@tanstack/react-query'
import { useApi } from '@/hooks/useApi'

export interface BudgetItem {
  id: string
  name: string
  type: 'monthly' | 'one-time'
  cost: number
  payment_date: string | null
  created_at: string
}

/**
 * Fetch and cache budget items via the centralized API
 */
export const useBudgetItems = () => {
  const { getBudgetItems } = useApi()
  return useQuery<BudgetItem[], Error>({
    queryKey: ['budgetItems'],
    queryFn: getBudgetItems,
  })
}

// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';

// export interface BudgetItem {
//   id: string;
//   name: string;
//   type: 'monthly' | 'one-time';
//   cost: number;
//   payment_date: string | null; // Added optional payment_date field
//   created_at: string;
// }

// const fetchBudgetItems = async (): Promise<BudgetItem[]> => {
//   const { data, error } = await supabase
//     .from('budget_items')
//     .select('id, name, type, cost, payment_date, created_at') // Select the new payment_date column
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error("Error fetching budget items:", error);
//     throw error;
//   }
//   return data || [];
// };

// export const useBudgetItems = () => {
//   return useQuery<BudgetItem[], Error>({
//     queryKey: ['budgetItems'],
//     queryFn: fetchBudgetItems,
//   });
// };