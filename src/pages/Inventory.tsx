import { useState } from "react";
import { useInventoryItems, InventoryItem } from "@/hooks/use-inventory-items";
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
import AddInventoryItemForm from "@/components/AddInventoryItemForm";
import EditInventoryItemForm from "@/components/EditInventoryItemForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError } from "@/utils/toast";
import { Trash2, Pencil } from "lucide-react";
import { format } from "date-fns";

const Inventory = () => {
  const { data: inventoryItems, isLoading, error, refetch } = useInventoryItems();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const queryClient = useQueryClient();

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
        .from('inventory_items')
        .delete()
        .eq('id', itemId);

      if (error) {
        console.error("Error deleting inventory item:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventoryItems'] });
      showSuccess("Inventory item deleted successfully!");
    },
    onError: (error) => {
      showError(`Failed to delete inventory item: ${error.message}`);
    },
  });

  const handleDelete = (item: InventoryItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Inventory</h1>
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Inventory</h1>
        <p className="text-red-500">Error loading inventory: {error.message}</p>
      </div>
    );
  }

  const consumableItems = inventoryItems?.filter(item => item.type === 'consumable') || [];
  const nonConsumableItems = inventoryItems?.filter(item => item.type === 'non-consumable') || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cabin Inventory</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-800 hover:bg-amber-900 text-primary-foreground">Add Item</Button> {/* Added brown color classes */}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <AddInventoryItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      {selectedItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Inventory Item</DialogTitle>
            </DialogHeader>
            <EditInventoryItemForm item={selectedItem} onSuccess={handleItemEdited} />
          </DialogContent>
        </Dialog>
      )}

      {/* Consumable Items Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Consumable Items</h2>
      {consumableItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Replacement Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consumableItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity ?? '-'}</TableCell>
                <TableCell>
                  {item.replacement_date
                    ? format(new Date(item.replacement_date), 'PPP')
                    : '-'}
                </TableCell>
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
        <p>No consumable items found. Add some!</p>
      )}

      {/* Non-Consumable Items Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Non-Consumable Items</h2>
      {nonConsumableItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>State</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nonConsumableItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.state ?? '-'}</TableCell>
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
        <p>No non-consumable items found. Add some!</p>
      )}
    </div>
  );
};

export default Inventory;