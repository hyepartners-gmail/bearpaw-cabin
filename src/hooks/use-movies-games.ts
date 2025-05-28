// src/hooks/useMovieGameItems.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/hooks/useApi'
import { showSuccess, showError } from '@/utils/toast'

export interface MovieGameItem {
  id: string
  name: string
  type: 'VHS' | 'DVD' | 'Game'
  players: string | null
  created_at: string
}

/**
 * Fetch and cache movies & games items via the centralized API
 */
export const useMovieGameItems = () => {
  const { getMovieGameItems } = useApi()
  return useQuery<MovieGameItem[], Error>({
    queryKey: ['movieGameItems'],
    queryFn: getMovieGameItems,
  })
}

export const useAddMovieGameItem = () => {
  const { createMovieGameItem } = useApi()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: createMovieGameItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movieGameItems'] })
      showSuccess('Item added successfully!')
    },
    onError: (error: Error) => {
      showError(`Failed to add item: ${error.message}`)
    },
  })
}

export const useUpdateMovieGameItem = () => {
  const { updateMovieGameItem } = useApi()
  const qc = useQueryClient()

  return useMutation<
    void,                                         // TData
    Error,                                        // TError
    {                                           // TVariables
      id: string
      name: string
      type: 'VHS' | 'DVD' | 'Game'
      players: string | null
    }
  >({
    mutationFn: ({ id, name, type, players }) =>
      updateMovieGameItem(id, {
        name,
        type,
        players: type === 'Game' ? players : null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movieGameItems'] })
      showSuccess('Item updated successfully!')
    },
    onError: (err) => {
      showError(`Failed to update item: ${err.message}`)
    },
  })
}

export const useDeleteMovieGameItem = () => {
  const { deleteMovieGameItem } = useApi()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: deleteMovieGameItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['movieGameItems'] })
      showSuccess('Item deleted successfully!')
    },
    onError: (error: Error) => {
      showError(`Failed to delete item: ${error.message}`)
    },
  })
}



// // src/hooks/useMovieGameItems.ts
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import { useApi } from '@/hooks/useApi'
// import { showSuccess, showError } from '@/utils/toast'

// export interface MovieGameItem {
//   id: string
//   name: string
//   type: 'VHS' | 'DVD' | 'Game'
//   players: string | null
//   created_at: string
// }

// /**
//  * Fetch and cache movies & games items via the centralized API
//  */
// export const useMovieGameItems = () => {
//   const { getMovieGameItems } = useApi()
//   return useQuery<MovieGameItem[], Error>({
//     queryKey: ['movieGameItems'],
//     queryFn: getMovieGameItems,
//   })
// }

// export const useAddMovieGameItem = () => {
//   const { createMovieGameItem } = useApi()
//   const qc = useQueryClient()
//   return useMutation(createMovieGameItem, {
//     onSuccess: () => {
//       qc.invalidateQueries(['movieGameItems'])
//       showSuccess('Item added successfully!')
//     },
//     onError: (error: Error) => {
//       showError(`Failed to add item: ${error.message}`)
//     },
//   })
// }

// export const useUpdateMovieGameItem = () => {
//   const { updateMovieGameItem } = useApi()
//   const qc = useQueryClient()
//   return useMutation(updateMovieGameItem, {
//     onSuccess: () => {
//       qc.invalidateQueries(['movieGameItems'])
//       showSuccess('Item updated successfully!')
//     },
//     onError: (error: Error) => {
//       showError(`Failed to update item: ${error.message}`)
//     },
//   })
// }

// export const useDeleteMovieGameItem = () => {
//   const { deleteMovieGameItem } = useApi()
//   const qc = useQueryClient()
//   return useMutation(deleteMovieGameItem, {
//     onSuccess: () => {
//       qc.invalidateQueries(['movieGameItems'])
//       showSuccess('Item deleted successfully!')
//     },
//     onError: (error: Error) => {
//       showError(`Failed to delete item: ${error.message}`)
//     },
//   })
// }
