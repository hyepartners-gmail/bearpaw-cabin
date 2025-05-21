import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";
import { IdeasItem } from "@/hooks/use-ideas-items"; // Import the type

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
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  price: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.nullable(z.number().positive("Price must be a positive number.")).optional()
  ),
  notes: z.string().nullable().optional(), // Added optional notes field to schema
});

interface EditIdeasItemFormProps {
  item: IdeasItem;
  onSuccess: () => void;
}

const EditIdeasItemForm: React.FC<EditIdeasItemFormProps> = ({ item, onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: item.description,
      price: item.price,
      notes: item.notes, // Set default notes from item
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('ideas_items')
        .update(values) // values now includes price and notes
        .eq('id', item.id); // Update the specific item by ID

      if (error) {
        console.error("Error updating ideas item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideasItems'] });
      showSuccess("Idea item updated successfully!");
      onSuccess(); // Call the onSuccess prop to close dialog and refetch
    },
    onError: (error) => {
      showError(`Failed to update idea item: ${error.message}`);
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Add a fire pit" {...field} />
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
                <Input type="number" step="0.01" placeholder="e.g., 500.00" {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField // Added notes textarea field
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Add any relevant notes here..." {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={updateItemMutation.isPending}>
          {updateItemMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};

export default EditIdeasItemForm;