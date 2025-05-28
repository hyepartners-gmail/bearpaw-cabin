// src/components/AddIdeasItemForm.tsx
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAddIdeasItem } from "@/hooks/use-ideas-items"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IdeasItem } from '@/hooks/use-ideas-items'

interface AddIdeasItemFormProps {
  onSuccess: () => void
}

const formSchema = z.object({
  description: z
    .string()
    .min(2, "Description must be at least 2 characters."),
  price: z
    .preprocess(
      (v) => (v === "" ? null : Number(v)),
      z.number().positive("Price must be positive").nullable()
    )
    .optional(),
  notes: z.string().nullable().optional(),
})

export default function AddIdeasItemForm({
  onSuccess,
}: AddIdeasItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { description: "", price: null, notes: null },
  })

  const add = useAddIdeasItem()

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   add.mutate(values, { onSuccess })
  // }

  function onSubmit(vals: z.infer<typeof formSchema>) {
  const payload: Omit<IdeasItem, 'id' | 'created_at'> = {
    description: vals.description,
    price:       vals.price  ?? null,
    notes:       vals.notes  ?? null,
  }
  add.mutate(payload, { onSuccess })
}
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Add a fire pit"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="e.g., 500.00"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any relevant notes here..."
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={add.isLoading}>
          {add.isLoading ? "Adding…" : "Add Idea"}
        </Button>
      </form>
    </Form>
  )
}


// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { showSuccess, showError } from "@/utils/toast";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea"; // Import Textarea


// interface AddIdeasItemFormProps {
//   onSuccess: () => void;
// }
// const schema = z.object({
//   description: z.string().min(2),
//   price: z.preprocess(v => v===''?null:Number(v), z.number().positive().nullable()).optional(),
//   notes: z.string().nullable().optional(),
// })

// export default function AddIdeasItemForm({ onSuccess }: { onSuccess: ()=>void }) {
//   const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues: { description:'', price:null, notes:null },
//   })
//   const add = useAddIdeasItem()

//   function onSubmit(vals: z.infer<typeof schema>) {
//     add.mutate(vals, { onSuccess })
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         {/* description / price / notes fields */}
//         <Button type="submit" disabled={add.isLoading}>
//           {add.isLoading ? 'Adding…' : 'Add Idea'}
//         </Button>
//       </form>
//     </Form>
//   )
// }

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log("Form submitted with values:", values);
//     addItemMutation.mutate(values);
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="description"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Description</FormLabel>
//               <FormControl>
//                 <Input placeholder="e.g., Add a fire pit" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="price"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Price (Optional)</FormLabel>
//               <FormControl>
//                 <Input type="number" step="0.01" placeholder="e.g., 500.00" {...field} value={field.value ?? ''} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField // Added notes textarea field
//           control={form.control}
//           name="notes"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Notes (Optional)</FormLabel>
//               <FormControl>
//                 <Textarea placeholder="Add any relevant notes here..." {...field} value={field.value ?? ''} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <Button type="submit" disabled={addItemMutation.isPending}>
//           {addItemMutation.isPending ? "Adding..." : "Add Idea"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default AddIdeasItemForm;