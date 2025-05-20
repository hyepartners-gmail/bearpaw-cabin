import { useState } from "react";
import { useBudgetItems, BudgetItem } from "@/hooks/use-budget-items"; // Import BudgetItem type
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
import AddBudgetItemForm from "@/components/AddBudgetItemForm";
import EditBudgetItemForm from "@/components/EditBudgetItemForm"; // Import the new edit form
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import mutation hooks
import { supabase } from "@/lib/supabase"; // Import supabase client
import { showSuccess, showError } from "@/utils/toast"; // Import toast utilities
import { Trash2, Pencil } from "lucide-react"; // Import icons

const Budget = () => {
  const { data: budgetItems, isLoading, error, refetch } = useBudgetItems();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);
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
        .from('budget_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error("Error deleting budget item:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetItems'] }); // Invalidate query to refetch
      showSuccess("Budget item deleted successfully!");
    },
    onError: (error) => {
      showError(`Failed to delete budget item: ${error.message}`);
    },
  });

  const handleDelete = (item: BudgetItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleEdit = (item: BudgetItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Budget Tracker</h1>
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Budget Tracker</h1>
        <p className="text-red-500">Error loading budget: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cabin Budget Tracker</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Budget Item</DialogTitle>
            </DialogHeader>
            <AddBudgetItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      {selectedItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Budget Item</DialogTitle>
            </DialogHeader>
            <EditBudgetItemForm item={selectedItem} onSuccess={handleItemEdited} />
          </DialogContent>
        </Dialog>
      )}

      {budgetItems && budgetItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="text-right">Actions</TableHead> {/* Added Actions column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>${item.cost.toFixed(2)}</TableCell>
                <TableCell className="text-right flex justify-end space-x-2"> {/* Use flex and space-x for buttons */}
                  <Button
                    variant="outline" // Use outline variant for edit
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
        <p>No budget items found. Add some!</p>
      )}
    </div>
  );
};

export default Budget;