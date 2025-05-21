import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { InventoryItem } from './use-inventory-items';
import { ToolItem } from './use-tools-items';
import { BudgetItem } from './use-budget-items';
import { NeedsItem } from './use-needs-items';
import { isFuture, parseISO } from 'date-fns'; // Import date functions

// Define a union type for the source items
type SourceItem = InventoryItem | ToolItem | BudgetItem | NeedsItem;

// Define the structure for the combined projected items
export interface ProjectedItem {
  id: string;
  source: 'Needs' | 'Consumable Inventory' | 'Consumable Tools' | 'Future One-Time Budget';
  description: string;
  quantity: number | null; // Quantity might not apply to all types
  cost: number | null; // Cost/Price might not apply to all types
  date: string | null; // Relevant date (replacement, payment)
  notes?: string | null; // Notes from Ideas (if we decide to include them later, currently not requested)
  created_at: string;
}

const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*');
  if (error) throw error;
  return data || [];
};

const fetchToolItems = async (): Promise<ToolItem[]> => {
  const { data, error } = await supabase
    .from('tools')
    .select('*');
  if (error) throw error;
  return data || [];
};

const fetchBudgetItems = async (): Promise<BudgetItem[]> => {
  const { data, error } = await supabase
    .from('budget_items')
    .select('*');
  if (error) throw error;
  return data || [];
};

const fetchNeedsItems = async (): Promise<NeedsItem[]> => {
  const { data, error } = await supabase
    .from('needs_items')
    .select('*');
  if (error) throw error;
  return data || [];
};

export const useProjectedItems = () => {
  const results = useQueries({
    queries: [
      { queryKey: ['inventoryItems'], queryFn: fetchInventoryItems },
      { queryKey: ['toolItems'], queryFn: fetchToolItems },
      { queryKey: ['budgetItems'], queryFn: fetchBudgetItems },
      { queryKey: ['needsItems'], queryFn: fetchNeedsItems },
    ],
  });

  const isLoading = results.some(result => result.isLoading);
  const error = results.find(result => result.error)?.error;

  const combinedData: ProjectedItem[] = [];

  if (!isLoading && !error) {
    const inventoryItems = results[0].data || [];
    const toolItems = results[1].data || [];
    const budgetItems = results[2].data || [];
    const needsItems = results[3].data || [];

    // Add Needs items
    needsItems.forEach(item => {
      combinedData.push({
        id: item.id,
        source: 'Needs',
        description: item.description,
        quantity: item.quantity,
        cost: item.price, // Use price as cost for Needs
        date: null, // Needs don't have a specific date in the current schema
        created_at: item.created_at,
      });
    });

    // Add Consumable Inventory items
    inventoryItems.filter(item => item.type === 'consumable').forEach(item => {
      combinedData.push({
        id: item.id,
        source: 'Consumable Inventory',
        description: item.name,
        quantity: item.quantity,
        cost: null, // Inventory doesn't have a cost in the current schema
        date: item.replacement_date, // Use replacement_date as the relevant date
        created_at: item.created_at,
      });
    });

    // Add Consumable Tools items
    toolItems.filter(item => item.consumable === true).forEach(item => {
      combinedData.push({
        id: item.id,
        source: 'Consumable Tools',
        description: item.name,
        quantity: item.quantity,
        cost: null, // Tools don't have a cost in the current schema
        date: null, // Tools don't have a specific date in the current schema
        created_at: item.created_at,
      });
    });

    // Add Future One-Time Budget items
    budgetItems.filter(item =>
      item.type === 'one-time' && item.payment_date && isFuture(parseISO(item.payment_date)) // Filter for future one-time items
    ).forEach(item => {
      combinedData.push({
        id: item.id,
        source: 'Future One-Time Budget',
        description: item.name,
        quantity: null, // Budget items don't have quantity in the current schema
        cost: item.cost,
        date: item.payment_date, // Use payment_date as the relevant date
        created_at: item.created_at,
      });
    });
  }

  // Sort combined data by date if available, otherwise by created_at
  combinedData.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : new Date(a.created_at).getTime();
    const dateB = b.date ? new Date(b.date).getTime() : new Date(b.created_at).getTime();
    return dateA - dateB;
  });


  return {
    data: combinedData,
    isLoading,
    error,
    refetch: () => results.forEach(result => result.refetch()),
  };
};