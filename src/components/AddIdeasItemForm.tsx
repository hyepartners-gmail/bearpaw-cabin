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
});

interface AddIdeasItemFormProps {
  onSuccess: () => void;
}

const AddIdeasItemForm: React.FC<AddIdeasItemFormProps> = ({ onSuccess }) => {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('ideas_items')
        .insert([values]);

      if (error) {
        console.error("Error inserting ideas item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideasItems'] });
      showSuccess("Idea item added successfully!");
      onSuccess(); // Call the onSuccess prop to close dialog and refetch
    },
    onError: (error) => {
      showError(`Failed to add idea item: ${error.message}`);
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
                <Input placeholder="e.g., Add a fire pit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={addItemMutation.isPending}>
          {addItemMutation.isPending ? "Adding..." : "Add Idea"}
        </Button>
      </form>
    </Form>
  );
};

export default AddIdeasItemForm;