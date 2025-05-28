import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateToolItem, ToolItem } from "@/hooks/use-tools-items";

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
import { Switch } from "@/components/ui/switch"; // Import Switch

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().positive("Quantity must be a positive integer.")
  ),
  electric: z.boolean(),
  consumable: z.boolean(),
});

interface EditToolItemFormProps {
  item: ToolItem;
  onSuccess: () => void;
}

const EditToolItemForm: React.FC<EditToolItemFormProps> = ({ item, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      quantity: item.quantity,
      electric: item.electric,
      consumable: item.consumable,
    },
  });

  const updateItemMutation = useUpdateToolItem();

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
     updateItemMutation.mutate(
   { 
     id: item.id, 
     data: {
       name:        values.name,
       quantity:    values.quantity,
       electric:    values.electric,
       consumable:  values.consumable,
     }
   },
   { onSuccess }
 )
    // updateItemMutation.mutate({ ...values, id: item.id }, {
    //   onSuccess: onSuccess,
    // });
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
                <Input placeholder="e.g., Hammer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 1" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="electric"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Electric</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consumable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Consumable</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
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

export default EditToolItemForm;