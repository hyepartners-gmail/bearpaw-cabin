import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";
import { InventoryItem } from "@/hooks/use-inventory-items"; // Import the type
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
  // Updated state validation to be an enum or null
  state: z.enum(["Clean", "Dirty", "Good", "Broken"]).nullable().optional(),
  replacement_date: z.date().nullable().optional(),
});

interface EditInventoryItemFormProps {
  item: InventoryItem;
  onSuccess: () => void;
}

const EditInventoryItemForm: React.FC<EditInventoryItemFormProps> = ({ item, onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      type: item.type,
      quantity: item.quantity,
      state: item.state, // Use existing state value
      replacement_date: item.replacement_date ? new Date(item.replacement_date) : null,
    },
  });

  const { type } = form.watch(); // Watch the type field

  const updateItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('inventory_items')
        .update({
          name: values.name,
          type: values.type,
          quantity: values.type === 'consumable' ? values.quantity : null,
          state: values.type === 'non-consumable' ? values.state : null, // Only save state for non-consumable
          replacement_date: values.type === 'consumable' && values.replacement_date ? format(values.replacement_date, 'yyyy-MM-dd') : null,
        })
        .eq('id', item.id); // Update the specific item by ID

      if (error) {
        console.error("Error updating inventory item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      showSuccess("Inventory item updated successfully!");
      onSuccess();
    },
    onError: (error) => {
      showError(`Failed to update inventory item: ${error.message}`);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
    updateItemMutation.mutate(values);
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
              <Select onValueChange={field.onChange} value={field.value}> {/* Changed defaultValue to value */}
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
                <Select onValueChange={field.onChange} value={field.value ?? ''}> {/* Changed defaultValue to value and handle null */}
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Clean">Clean</SelectItem>
                    <SelectItem value="Dirty">Dirty</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Broken">Broken</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={updateItemMutation.isPending}>
          {updateItemMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditInventoryItemForm;