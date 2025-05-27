
// src/hooks/useInventoryItems.ts
import { useQuery } from '@tanstack/react-query'
import { useApi } from '@/hooks/useApi'

export interface InventoryItem {
  id: string
  name: string
  type: 'consumable' | 'non-consumable'
  quantity: number | null
  state: string | null
  replacement_date: string | null
  created_at: string
}

/**
 * Fetch and cache inventory items via the centralized API
 */
export const useInventoryItems = () => {
  const { getInventoryItems } = useApi()
  return useQuery<InventoryItem[], Error>({
    queryKey: ['inventoryItems'],
    queryFn: getInventoryItems,
  })
}

// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';

// export interface InventoryItem {
//   id: string;
//   name: string;
//   type: 'consumable' | 'non-consumable';
//   quantity: number | null;
//   state: string | null;
//   replacement_date: string | null; // Added replacement_date field
//   created_at: string;
// }

// const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
//   const { data, error } = await supabase
//     .from('inventory_items')
//     .select('*')
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error("Error fetching inventory items:", error);
//     throw error;
//   }
//   return data || [];
// };

// export const useInventoryItems = () => {
//   return useQuery<InventoryItem[], Error>({
//     queryKey: ['inventoryItems'],
//     queryFn: fetchInventoryItems,
//   });
// };