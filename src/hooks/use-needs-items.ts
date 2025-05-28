// src/hooks/useNeedsItems.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/hooks/useApi'
import { showSuccess, showError } from '@/utils/toast'
import { useQuery } from '@tanstack/react-query'


export interface NeedsItem {
  id: string
  description: string
  price: number | null
  quantity: number
  created_at: string
}


/** Fetch & cache all needs items */
export const useNeedsItems = () => {
  const { getNeedsItems } = useApi()
  return useQuery<NeedsItem[], Error>({
    queryKey: ['needsItems'],
    queryFn: getNeedsItems,
  })
}

export const useAddNeedsItem = () => {
  const { createNeedsItem } = useApi()
  const qc = useQueryClient()
  return useMutation<
    { id: string },                            // TData
    Error,                                      // TError
    Omit<NeedsItem, 'id' | 'created_at'>        // TVariables
  >({
    mutationFn: createNeedsItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['needsItems'] })
      showSuccess('Need item added successfully!')
    },
    onError: (err) => {
      showError(`Failed to add need: ${err.message}`)
    },
  })
}

export const useUpdateNeedsItem = () => {
  const { updateNeedsItem } = useApi()
  const qc = useQueryClient()
  return useMutation<
    void,                                                   // TData
    Error,                                                  // TError
    { id: string; data: Partial<Omit<NeedsItem, 'id' | 'created_at'>> } // TVariables
  >({
    mutationFn: ({ id, data }) => updateNeedsItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['needsItems'] })
      showSuccess('Need item updated successfully!')
    },
    onError: (err) => {
      showError(`Failed to update need: ${err.message}`)
    },
  })
}

export const useDeleteNeedsItem = () => {
  const { deleteNeedsItem } = useApi()
  const qc = useQueryClient()
  return useMutation<
    void,    // TData
    Error,   // TError
    string   // TVariables = id
  >({
    mutationFn: (id) => deleteNeedsItem(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['needsItems'] })
      showSuccess('Need item deleted successfully!')
    },
    onError: (err) => {
      showError(`Failed to delete need: ${err.message}`)
    },
  })
}



// import { useQuery } from '@tanstack/react-query';
// import { supabase } from '@/lib/supabase';

// export interface NeedsItem {
//   id: string;
//   description: string;
//   price: number | null;
//   quantity: number; // Added quantity field
//   created_at: string;
// }

// const fetchNeedsItems = async (): Promise<NeedsItem[]> => {
//   const { data, error } = await supabase
//     .from('needs_items')
//     .select('id, description, price, quantity, created_at') // Select the new quantity column
//     .order('created_at', { ascending: false });

//   if (error) {
//     console.error("Error fetching needs items:", error);
//     throw error;
//   }
//   return data || [];
// };

// export const useNeedsItems = () => {
//   return useQuery<NeedsItem[], Error>({
//     queryKey: ['needsItems'],
//     queryFn: fetchNeedsItems,
//   });
// };