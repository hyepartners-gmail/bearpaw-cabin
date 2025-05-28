import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

type FormValues = z.infer<typeof formSchema>

interface EditIdeasItemFormProps {
  item: IdeasItem;
  onSuccess: () => void;
}

export default function EditIdeasItemForm({
  item,
  onSuccess,
}: EditIdeasItemFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: item.description,
      price: item.price,
      notes: item.notes,
    },
  })

  const update = useUpdateIdeasItem()

  function onSubmit(values: FormValues) {
    update.mutate(
      { id: item.id, data: values },
      {
        onSuccess: () => {
          showSuccess("Idea item updated successfully!")
          onSuccess()
        },
        onError: (err) => {
          showError(`Failed to update idea: ${err.message}`)
        },
      }
    )
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
                <Input {...field} placeholder="e.g., Add a fire pit" />
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
                  {...field}
                  type="number"
                  step="0.01"
                  placeholder="e.g., 500.00"
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
                <Textarea {...field} placeholder="Any notes…" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={update.isLoading}>
          {update.isLoading ? "Saving…" : "Save Changes"}
        </Button>
      </form>
    </Form>
  )
}