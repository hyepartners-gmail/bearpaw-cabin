import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { showSuccess, showError } from '@/utils/toast';

export interface MovieGameItem {
  id: string;
  name: string;
  type: 'VHS' | 'DVD';
  players: string | null;
  created_at: string;
}

const fetchMovieGameItems = async (): Promise<MovieGameItem[]> => {
  const { data, error } = await supabase
    .from('movies_games')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching movies & games items:", error);
    throw error;
  }
  return data || [];
};

const addMovieGameItem = async (item: Omit<MovieGameItem, 'id' | 'created_at'>): Promise<MovieGameItem> => {
  const { data, error } = await supabase
    .from('movies_games')
    .insert([item])
    .select()
    .single();

  if (error) {
    console.error("Error adding movies & games item:", error);
    throw error;
  }
  return data;
};

const updateMovieGameItem = async (item: Omit<MovieGameItem, 'created_at'>): Promise<MovieGameItem> => {
  const { data, error } = await supabase
    .from('movies_games')
    .update(item)
    .eq('id', item.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating movies & games item:", error);
    throw error;
  }
  return data;
};

const deleteMovieGameItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('movies_games')
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting movies & games item:", error);
    throw error;
  }
};

export const useMovieGameItems = () => {
  return useQuery<MovieGameItem[], Error>({
    queryKey: ['movieGameItems'],
    queryFn: fetchMovieGameItems,
  });
};

export const useAddMovieGameItem = () => {
  const queryClient = useQueryClient();
  return useMutation<MovieGameItem, Error, Omit<MovieGameItem, 'id' | 'created_at'>>({
    mutationFn: addMovieGameItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movieGameItems'] });
      showSuccess("Movie/Game item added successfully!");
    },
    onError: (error) => {
      showError(`Failed to add item: ${error.message}`);
    },
  });
};

export const useUpdateMovieGameItem = () => {
  const queryClient = useQueryClient();
  return useMutation<MovieGameItem, Error, Omit<MovieGameItem, 'created_at'>>({
    mutationFn: updateMovieGameItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movieGameItems'] });
      showSuccess("Movie/Game item updated successfully!");
    },
    onError: (error) => {
      showError(`Failed to update item: ${error.message}`);
    },
  });
};

export const useDeleteMovieGameItem = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteMovieGameItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movieGameItems'] });
      showSuccess("Movie/Game item deleted successfully!");
    },
    onError: (error) => {
      showError(`Failed to delete item: ${error.message}`);
    },
  });
};