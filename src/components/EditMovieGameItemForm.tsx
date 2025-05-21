import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateMovieGameItem, MovieGameItem } from "@/hooks/use-movies-games";

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

// Define the schema based on the updated hook interface
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["VHS", "DVD", "Game"], { // Updated enum
    required_error: "Please select a type.",
  }),
  players: z.string().nullable().optional(), // Players is optional
});

interface EditMovieGameItemFormProps {
  item: MovieGameItem;
  onSuccess: () => void;
}

const EditMovieGameItemForm: React.FC<EditMovieGameItemFormProps> = ({ item, onSuccess }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item.name,
      type: item.type,
      players: item.players,
    },
  });

  const updateItemMutation = useUpdateMovieGameItem();
  const selectedType = form.watch("type"); // Watch the selected type

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted with values:", values);
     // Adjust values based on type before sending
    const itemToSubmit = {
      id: item.id, // Include the item ID for update
      name: values.name,
      type: values.type,
      players: values.type === 'Game' ? values.players : null, // Only include players if type is 'Game'
    };

    updateItemMutation.mutate(itemToSubmit, {
      onSuccess: onSuccess,
    });
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
                <Input placeholder="e.g., Star Wars / Monopoly" {...field} />
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
              <Select onValueChange={field.onChange} value={field.value}> {/* Use value prop */}
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type (Movie or Game)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="VHS">Movie (VHS)</SelectItem>
                  <SelectItem value="DVD">Movie (DVD)</SelectItem>
                  <SelectItem value="Game">Game</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
         {selectedType === 'Game' && ( // Conditionally render players field for Games
           <FormField
            control={form.control}
            name="players"
            render={({ field }) => (
              <FormItem>
                <FormLabel># of Players (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2-4" {...field} value={field.value ?? ''} />
                </FormControl>
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

export default EditMovieGameItemForm;