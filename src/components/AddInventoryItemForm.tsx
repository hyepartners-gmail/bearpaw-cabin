// src/components/AddInventoryItemForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useApi } from "@/hooks/useApi"
import { showSuccess, showError } from "@/utils/toast"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// 1) Your schema
const formSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["consumable", "non-consumable"]),
  quantity: z
    .preprocess(val => (val === "" ? null : Number(val)), z
      .nullable(z.number().int().positive())
      .optional()),
  state: z.enum(["Clean", "Dirty", "Good", "Broken"]).nullable().optional(),
  replacement_date: z.date().nullable().optional(),
})

// 2) Extract the TS type for your form values
type FormValues = z.infer<typeof formSchema>

interface Props {
  onSuccess: () => void
}

export default function AddInventoryItemForm({ onSuccess }: Props) {
  const queryClient = useQueryClient()
  const { createInventoryItem } = useApi()

  // 3) Set up your form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "consumable",
      quantity: null,
      state: null,
      replacement_date: null,
    },
  })
  const { type } = form.watch()

  // 4) Two-arg useMutation with explicit generics
  const qc = useQueryClient()

  const addItemMutation = useMutation<
    { id: string },              // TData
    Error,                        // TError
    FormValues                    // TVariables
  >({
    mutationFn: (values) =>
      createInventoryItem({
        name: values.name,
        type: values.type,
        quantity:
          values.type === 'consumable' ? values.quantity : null,
        state:
          values.type === 'non-consumable' ? values.state : null,
        replacement_date:
          values.type === 'consumable' && values.replacement_date
            ? format(values.replacement_date, 'yyyy-MM-dd')
            : null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventoryItems'] })
      showSuccess('Inventory item added!')
      onSuccess()
    },
    onError: (err) => {
      showError(`Failed to add inventory item: ${err.message}`)
    },
  })

    const onSubmit = (values: FormValues) => {
      if (form.formState.isValid) {
        addItemMutation.mutate(values)
      }
    }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* Name field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Canned Beans" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type selector */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consumable">
                      Consumable
                    </SelectItem>
                    <SelectItem value="non-consumable">
                      Non-Consumable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Conditional fields */}
        {type === "consumable" && (
          <>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="replacement_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Replacement Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full text-left",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? format(field.value, "PPP")
                          : "Pick a date"}
                        <CalendarIcon className="ml-auto h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {type === "non-consumable" && (
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clean">Clean</SelectItem>
                      <SelectItem value="Dirty">Dirty</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Broken">Broken</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={addItemMutation.isPending}>
          {addItemMutation.isPending
            ? "Adding…"
            : "Add Item"}
        </Button>
      </form>
    </Form>
  )
}


// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useApi } from '@/hooks/useApi'
// import { showSuccess, showError } from "@/utils/toast";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";

// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const formSchema = z.object({
//   name: z.string().min(2, {
//     message: "Name must be at least 2 characters.",
//   }),
//   type: z.enum(["consumable", "non-consumable"], {
//     required_error: "Please select an item type.",
//   }),
//   quantity: z.preprocess(
//     (val) => (val === "" ? null : Number(val)),
//     z.nullable(z.number().int().positive("Quantity must be a positive integer.")).optional()
//   ),
//   state: z.enum(["Clean", "Dirty", "Good", "Broken"]).nullable().optional(),
//   replacement_date: z.date().nullable().optional(),
// });

// interface AddInventoryItemFormProps {
//   onSuccess: () => void;
// }

// const AddInventoryItemForm: React.FC<AddInventoryItemFormProps> = ({ onSuccess }) => {
//   const queryClient = useQueryClient();

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       type: "consumable",
//       quantity: null,
//       state: null, // Default state is null
//       replacement_date: null,
//     },
//   });

//   const { type } = form.watch();

//   // const addItemMutation = useMutation({
//   //   mutationFn: async (values: z.infer<typeof formSchema>) => {
//   //     console.log("Attempting to insert item with values:", values);
//   //     const { data, error } = await supabase
//   //       .from('inventory_items')
//   //       .insert([
//   //         {
//   //           name: values.name,
//   //           type: values.type,
//   //           quantity: values.type === 'consumable' ? values.quantity : null,
//   //           state: values.type === 'non-consumable' ? values.state : null,
//   //           replacement_date: values.type === 'consumable' && values.replacement_date ? format(values.replacement_date, 'yyyy-MM-dd') : null,
//   //         },
//   //       ]);

//   //     if (error) {
//   //       console.error("Supabase insert error:", error);
//   //       throw error;
//   //     }
//   //     console.log("Supabase insert successful:", data);
//   //     return data;
//   //   },
//   //   onSuccess: () => {
//   //     console.log("Mutation onSuccess triggered.");
//   //     queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
//   //     showSuccess("Inventory item added successfully!");
//   //     onSuccess();
//   //   },
//   //   onError: (error) => {
//   //     console.error("Mutation onError triggered:", error);
//   //     showError(`Failed to add inventory item: ${error.message}`);
//   //   },
//   // });

//   const { createInventoryItem } = useApi()
//   const addItemMutation = useMutation(
//     (values: FormValues) =>
//       createInventoryItem({
//         name: values.name,
//         type: values.type,
//         quantity: values.type === 'consumable' ? values.quantity : null,
//         state: values.type === 'non-consumable' ? values.state : null,
//         replacement_date:
//           values.type === 'consumable' && values.replacement_date
//             ? format(values.replacement_date, 'yyyy-MM-dd')
//             : null,
//       }),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ['inventoryItems'] })
//         showSuccess("Inventory item added successfully!")
//         onSuccess()
//       },
//       onError: err => showError(`Failed to add inventory item: ${err.message}`)
//     }
//   )
//   function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log("Form onSubmit triggered.");
//     console.log("Form values:", values);
//     console.log("Form errors:", form.formState.errors);
//     console.log("Form isValid:", form.formState.isValid); // Log validity

//     if (form.formState.isValid) {
//       addItemMutation.mutate(values);
//     } else {
//       console.warn("Form is invalid, not submitting.");
//     }
//   }

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Name</FormLabel>
//               <FormControl>
//                 <Input placeholder="e.g., Canned Beans" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="type"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Type</FormLabel>
//               <Select onValueChange={field.onChange} value={field.value}>
//                 <FormControl>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select item type" />
//                   </SelectTrigger>
//                 </FormControl>
//                 <SelectContent>
//                   <SelectItem value="consumable">Consumable</SelectItem>
//                   <SelectItem value="non-consumable">Non-Consumable</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         {type === 'consumable' && (
//           <>
//             <FormField
//               control={form.control}
//               name="quantity"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Quantity</FormLabel>
//                   <FormControl>
//                     <Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="replacement_date"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel>Replacement Date (Optional)</FormLabel>
//                   <Popover>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant={"outline"}
//                           className={cn(
//                             "w-full pl-3 text-left font-normal",
//                             !field.value && "text-muted-foreground"
//                           )}
//                         >
//                           {field.value ? (
//                             format(field.value, "PPP")
//                           ) : (
//                             <span>Pick a date</span>
//                           )}
//                           <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-auto p-0" align="start">
//                       <Calendar
//                         mode="single"
//                         selected={field.value ?? undefined}
//                         onSelect={field.onChange}
//                         initialFocus
//                       />
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </>
//         )}
//         {type === 'non-consumable' && (
//           <FormField
//             control={form.control}
//             name="state"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>State</FormLabel>
//                 <Select onValueChange={field.onChange} value={field.value === null ? undefined : field.value}> {/* Handle null as undefined for Select component */}
//                   <FormControl>
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select state" />
//                     </SelectTrigger>
//                   </FormControl>
//                   <SelectContent>
//                     <SelectItem value="Clean">Clean</SelectItem>
//                     <SelectItem value="Dirty">Dirty</SelectItem>
//                     <SelectItem value="Good">Good</SelectItem>
//                     <SelectItem value="Broken">Broken</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//         )}
//         <Button type="submit" disabled={addItemMutation.isPending}>
//           {addItemMutation.isPending ? "Adding..." : "Add Item"}
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default AddInventoryItemForm;