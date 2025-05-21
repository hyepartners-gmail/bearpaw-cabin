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
import EditIdeasItemForm from "@/components/EditIdeasItemForm"; // Import the new edit form
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import mutation hooks
import { supabase } from "@/lib/supabase"; // Import supabase client
import { showSuccess, showError } from "@/utils/toast"; // Import toast utilities
import { Trash2, Pencil } from "lucide-react"; // Import icons

const Ideas = () => {
  const { data: ideasItems, isLoading, error, refetch } = useIdeasItems();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IdeasItem | null>(null);
  const queryClient = useQueryClient(); // Get query client

  const handleItemAdded = () => {
    refetch(); // Refresh the list after adding an item
    setIsAddDialogOpen(false); // Close the add dialog
  };

  const handleItemEdited = () => {
    refetch(); // Refresh the list after editing an item
    setIsEditDialogOpen(false); // Close the edit dialog
    setSelectedItem(null); // Clear selected item
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

  const handleEdit = (item: IdeasItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Ideas List</h1>{/* Updated title and added color */}
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Ideas List</h1>{/* Updated title and added color */}
        <p className="text-red-500">Error loading ideas: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-emerald-600">Bear Paw Ideas List</h1>{/* Updated title and added color */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-800 hover:bg-amber-900 text-primary-foreground">Add Idea</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Idea Item</DialogTitle>
            </DialogHeader>
            <AddIdeasItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      {selectedItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Idea Item</DialogTitle>
            </DialogHeader>
            <EditIdeasItemForm item={selectedItem} onSuccess={handleItemEdited} />
          </DialogContent>
        </Dialog>
      )}

      {ideasItems && ideasItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Notes</TableHead> {/* Added Notes column header */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideasItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>{item.price !== null ? `$${item.price.toFixed(2)}` : '-'}</TableCell>
                <TableCell>{item.notes ?? '-'}</TableCell> {/* Display notes */}
                {/* Ensure no extra whitespace between TableCell tags */}
                <TableCell className="text-right flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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