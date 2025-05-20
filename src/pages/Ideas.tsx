import { useState } from "react";
import { useIdeasItems, IdeasItem } from "@/hooks/use-ideas-items"; // Import IdeasItem type
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddIdeasItemForm from "@/components/AddIdeasItemForm";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import mutation hooks
import { supabase } from "@/lib/supabase"; // Import supabase client
import { showSuccess, showError } from "@/utils/toast"; // Import toast utilities
import { Trash2 } from "lucide-react"; // Import icon

const Ideas = () => {
  const { data: ideasItems, isLoading, error, refetch } = useIdeasItems();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient(); // Get query client

  const handleItemAdded = () => {
    refetch(); // Refresh the list after adding an item
    setIsDialogOpen(false); // Close the dialog
  };

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('ideas_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error("Error deleting ideas item:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideasItems'] }); // Invalidate query to refetch
      showSuccess("Idea item deleted successfully!");
    },
    onError: (error) => {
      showError(`Failed to delete idea item: ${error.message}`);
    },
  });

  const handleDelete = (item: IdeasItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.description}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Ideas List</h1>
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Ideas List</h1>
        <p className="text-red-500">Error loading ideas: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cabin Ideas List</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Idea</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Idea Item</DialogTitle>
            </DialogHeader>
            <AddIdeasItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {ideasItems && ideasItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead> {/* Added Actions column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideasItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(item)}
                    disabled={deleteItemMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No ideas items found. Add some!</p>
      )}
    </div>
  );
};

export default Ideas;