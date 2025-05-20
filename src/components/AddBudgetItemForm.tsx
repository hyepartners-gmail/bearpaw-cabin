import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["monthly", "one-time"], {
    required_error: "Please select an item type.",
  }),
  cost: z.preprocess(
    (val) => Number(val),
    z.number().positive("Cost must be a positive number.")
  ),
});

interface AddBudgetItemFormProps {
  onSuccess: () => void;
}

const AddBudgetItemForm: React.FC<AddBudgetItemFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: undefined, // Use undefined for initial state of select
      cost: undefined, // Use undefined for initial state of number input
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('budget_items')
        .insert([values]);

      if (error) {
        console.error("Error inserting budget item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetItems'] });
      showSuccess("Budget item added successfully!");
      onSuccess(); // Call the onSuccess prop to close dialog and refetch
    },
    onError: (error) => {
      showError(`Failed to add budget item: ${error.message}`);
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
                <Input placeholder="e.g., Electricity Bill" {...field} />
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
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="one-time">One-Time</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cost</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="e.g., 75.50" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={addItemMutation.isPending}>
          {addItemMutation.isPending ? "Adding..." : "Add Item"}
        </Button>
      </form>
    </Form>
  );
};

export default AddBudgetItemForm;