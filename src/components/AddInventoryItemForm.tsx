import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["consumable", "non-consumable"], {
    required_error: "Please select an item type.",
  }),
  quantity: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.nullable(z.number().int().positive("Quantity must be a positive integer.")).optional()
  ),
  state: z.string().nullable().optional(),
  replacement_date: z.date().nullable().optional(), // Added replacement_date field
});

interface AddInventoryItemFormProps {
  onSuccess: () => void;
}

const AddInventoryItemForm: React.FC<AddInventoryItemFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: undefined, // Use undefined for initial state of select
      quantity: null,
      state: null,
      replacement_date: null, // Default to null
    },
  });

  const { type } = form.watch(); // Watch the type field to conditionally render quantity/state/date

  const addItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .insert([
          {
            name: values.name,
            type: values.type,
            quantity: values.type === 'consumable' ? values.quantity : null,
            state: values.type === 'non-consumable' ? values.state : null,
            replacement_date: values.type === 'consumable' && values.replacement_date ? format(values.replacement_date, 'yyyy-MM-dd') : null, // Format date for Supabase
          },
        ]);

      if (error) {
        console.error("Error inserting inventory item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      showSuccess("Inventory item added successfully!");
      onSuccess(); // Call the onSuccess prop to close dialog and refetch
    },
    onError: (error) => {
      showError(`Failed to add inventory item: ${error.message}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    addItemMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Canned Beans" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="consumable">Consumable</SelectItem>
                  <SelectItem value="non-consumable">Non-Consumable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {type === 'consumable' && (
          <>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 5" {...field} value={field.value ?? ''} />
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
                  <FormLabel>Replacement Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
        {type === 'non-consumable' && (
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Clean, Dirty, Good, Broken" {...field} value={field.value ?? ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={addItemMutation.isPending}>
          {addItemMutation.isPending ? "Adding..." : "Add Item"}
        </Button>
      </form>
    </Form>
  );
};

export default AddInventoryItemForm;