import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useApi } from '@/hooks/useApi'
import { showSuccess, showError } from '@/utils/toast'

export interface IdeasItem {
  id: string
  description: string
  price: number | null
  notes: string | null
  created_at: string
}

export const useIdeasItems = () => {
  const { getIdeasItems } = useApi()
  return useQuery<IdeasItem[], Error>({
    queryKey: ['ideasItems'],
    queryFn: getIdeasItems,
  })
}

export const useAddIdeasItem = () => {
  const { createIdeasItem } = useApi()
  const qc = useQueryClient()

  return useMutation<
    { id: string },                       // TData
    Error,                                 // TError
    Omit<IdeasItem, 'id' | 'created_at'>   // TVariables
  >({
    mutationFn: createIdeasItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ideasItems'] })
      showSuccess('Idea item added!')
    },
    onError: (err) => {
      showError(`Failed to add idea: ${err.message}`)
    },
  })
}

export const useUpdateIdeasItem = () => {
  const { updateIdeasItem } = useApi()
  const qc = useQueryClient()

  return useMutation<
    void,                                                   // TData
    Error,                                                  // TError
    { id: string; data: Partial<Omit<IdeasItem, 'id'|'created_at'>> } // TVariables
  >({
    mutationFn: ({ id, data }) => updateIdeasItem(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ideasItems'] })
      showSuccess('Idea item updated!')
    },
    onError: (err) => {
      showError(`Failed to update idea: ${err.message}`)
    },
  })
}

export const useDeleteIdeasItem = () => {
  const { deleteIdeasItem } = useApi()
  const qc = useQueryClient()

  return useMutation<
    void,       // TData
    Error,      // TError
    string      // TVariables
  >({
    mutationFn: deleteIdeasItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['ideasItems'] })
      showSuccess('Idea item deleted!')
    },
    onError: (err) => {
      showError(`Failed to delete idea: ${err.message}`)
    },
  })
}


// // src/hooks/use-ideas-items.ts
// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useApi } from '@/hooks/useApi'
// import { showSuccess, showError } from '@/utils/toast'

// export interface IdeasItem {
//   id: string
//   description: string
//   price: number | null
//   notes: string | null
//   created_at: string
// }

// export const useAddIdeasItem = () => {
//   const { createIdeasItem } = useApi()
//   const qc = useQueryClient()

//   return useMutation<
//     { id: string },                         // TData
//     Error,                                  // TError
//     Omit<IdeasItem, 'id' | 'created_at'>    // TVariables
//   >({
//     mutationFn: createIdeasItem,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['ideasItems'] })
//       showSuccess('Idea item added!')
//     },
//     onError: (err) => {
//       showError(`Failed to add idea: ${err.message}`)
//     },
//   })
// }

// export const useUpdateIdeasItem = () => {
//   const { updateIdeasItem } = useApi()
//   const qc = useQueryClient()

//   return useMutation<
//     void,                                   // TData
//     Error,                                  // TError
//     { id: string; data: Partial<Omit<IdeasItem, 'id'|'created_at'>> } 
//   >({
//     mutationFn: ({ id, data }) => updateIdeasItem(id, data),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['ideasItems'] })
//       showSuccess('Idea item updated!')
//     },
//     onError: (err) => {
//       showError(`Failed to update idea: ${err.message}`)
//     },
//   })
// }

// export const useDeleteIdeasItem = () => {
//   const { deleteIdeasItem } = useApi()
//   const qc = useQueryClient()

//   return useMutation<
//     void,       // TData
//     Error,      // TError
//     string      // TVariables
//   >({
//     mutationFn: deleteIdeasItem,
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['ideasItems'] })
//       showSuccess('Idea item deleted!')
//     },
//     onError: (err) => {
//       showError(`Failed to delete idea: ${err.message}`)
//     },
//   })
// }


// // import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// // import { useApi } from '@/hooks/useApi'
// // import { showSuccess, showError } from '@/utils/toast'

// // export interface IdeasItem {
// //   id: string
// //   description: string
// //   price: number | null
// //   notes: string | null
// //   created_at: string
// // }

// // /** Fetch list */
// // export const useIdeasItems = () => {
// //   const { getIdeasItems } = useApi()
// //   return useQuery<IdeasItem[], Error>({
// //     queryKey: ['ideasItems'],
// //     queryFn: getIdeasItems,
// //   })
// // }

// // /** Create */
// // export const useAddIdeasItem = () => {
// //   const { createIdeasItem } = useApi()
// //   const qc = useQueryClient()
// //   return useMutation(createIdeasItem, {
// //     onSuccess: () => {
// //       qc.invalidateQueries(['ideasItems'])
// //       showSuccess('Idea item added!')
// //     },
// //     onError: (err: Error) => {
// //       showError(`Failed to add idea: ${err.message}`)
// //     },
// //   })
// // }

// // /** Update */
// // export const useUpdateIdeasItem = () => {
// //   const { updateIdeasItem } = useApi()
// //   const qc = useQueryClient()
// //   return useMutation(
// //     ({ id, data }: { id: string; data: Partial<Omit<IdeasItem, 'id'|'created_at'>> }) =>
// //       updateIdeasItem(id, data),
// //     {
// //       onSuccess: () => {
// //         qc.invalidateQueries(['ideasItems'])
// //         showSuccess('Idea item updated!')
// //       },
// //       onError: (err: Error) => {
// //         showError(`Failed to update idea: ${err.message}`)
// //       },
// //     }
// //   )
// // }

// // /** Delete */
// // export const useDeleteIdeasItem = () => {
// //   const { deleteIdeasItem } = useApi()
// //   const qc = useQueryClient()
// //   return useMutation(deleteIdeasItem, {
// //     onSuccess: () => {
// //       qc.invalidateQueries(['ideasItems'])
// //       showSuccess('Idea item deleted!')
// //     },
// //     onError: (err: Error) => {
// //       showError(`Failed to delete idea: ${err.message}`)
// //     },
// //   })
// // }



// // // // src/hooks/useIdeasItems.ts
// // // import { useQuery } from '@tanstack/react-query'
// // // import { useApi } from '@/hooks/useApi'

// // // export interface IdeasItem {
// // //   id: string
// // //   description: string
// // //   price: number | null
// // //   notes: string | null
// // //   created_at: string
// // // }

// // // /**
// // //  * Fetch and cache ideas items via the centralized API
// // //  */
// // // export const useIdeasItems = () => {
// // //   const { getIdeasItems } = useApi()
// // //   return useQuery<IdeasItem[], Error>({
// // //     queryKey: ['ideasItems'],
// // //     queryFn: getIdeasItems,
// // //   })
// // // }
