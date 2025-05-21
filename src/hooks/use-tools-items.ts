import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

export interface ToolItem {
  id: string;
  name: string;
  quantity: number;
  electric: boolean;
  consumable: boolean;
  created_at: string;
}

const fetchToolItems = async (): Promise<ToolItem[]> => {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching tools items:", error);
    throw error;
  }
  return data || [];
};

const addToolItem = async (item: Omit<ToolItem, 'id' | 'created_at'>): Promise<ToolItem> => {
  const { data, error } = await supabase
    .from('tools')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Error adding tool item:", error);
    throw error;
  }
  return data;
};

const updateToolItem = async (item: Omit<ToolItem, 'created_at'>): Promise<ToolItem> => {
  const { data, error } = await supabase
    .from('tools')
    .update(item)
    .eq('id', item.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating tool item:", error);
    throw error;
  }
  return data;
};

const deleteToolItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('tools')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting tool item:", error);
    throw error;
  }
};

export const useToolItems = () => {
  return useQuery<ToolItem[], Error>({
    queryKey: ['toolItems'],
    queryFn: fetchToolItems,
  });
};

export const useAddToolItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ToolItem, Error, Omit<ToolItem, 'id' | 'created_at'>>({
    mutationFn: addToolItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolItems'] });
      showSuccess("Tool item added successfully!");
    },
    onError: (error) => {
      showError(`Failed to add item: ${error.message}`);
    },
  });
};

export const useUpdateToolItem = () => {
  const queryClient = useQueryClient();
  return useMutation<ToolItem, Error, Omit<ToolItem, 'created_at'>>({
    mutationFn: updateToolItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolItems'] });
      showSuccess("Tool item updated successfully!");
    },
    onError: (error) => {
      showError(`Failed to update item: ${error.message}`);
    },
  });
};

export const useDeleteToolItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteToolItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['toolItems'] });
      showSuccess("Tool item deleted successfully!");
    },
    onError: (error) => {
      showError(`Failed to delete item: ${error.message}`);
    },
  });
};