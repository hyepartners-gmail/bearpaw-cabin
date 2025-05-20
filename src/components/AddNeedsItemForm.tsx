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

const formSchema = z.object({
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  price: z.preprocess(
    (val) => (val === "" ? null : Number(val)),
    z.nullable(z.number().positive("Price must be a positive number.")).optional()
  ),
});

interface AddNeedsItemFormProps {
  onSuccess: () => void;
}

const AddNeedsItemForm: React.FC<AddNeedsItemFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      price: null,
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('needs_items')
        .insert([values]);

      if (error) {
        console.error("Error inserting needs item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['needsItems'] });
      showSuccess("Need item added successfully!");
      onSuccess(); // Call the onSuccess prop to close dialog and refetch
    },
    onError: (error) => {
      showError(`Failed to add need item: ${error.message}`);
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Roof repair" {...field} />
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
                <Input type="number" step="0.01" placeholder="e.g., 4000.00" {...field} value={field.value ?? ''} />
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

export default AddNeedsItemForm;