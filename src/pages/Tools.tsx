import { useState } from "react";
import { useToolItems, useDeleteToolItem, ToolItem } from "@/hooks/use-tools-items";
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
import AddToolItemForm from "@/components/AddToolItemForm";
import EditToolItemForm from "@/components/EditToolItemForm";
import { Trash2, Pencil } from "lucide-react";

const Tools = () => {
  const { data: toolItems, isLoading, error, refetch } = useToolItems();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ToolItem | null>(null);

  const handleItemAdded = () => {
    refetch();
    setIsAddDialogOpen(false);
  };

  const handleItemEdited = () => {
    refetch();
    setIsEditDialogOpen(false);
    setSelectedItem(null);
  };

  const deleteItemMutation = useDeleteToolItem();

  const handleDelete = (item: ToolItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  const handleEdit = (item: ToolItem) => {
    setSelectedItem(item);
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Tools</h1>
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Tools</h1>
        <p className="text-red-500">Error loading items: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-emerald-600">Bear Paw Tools</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-800 hover:bg-amber-900 text-primary-foreground">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Tool Item</DialogTitle>
            </DialogHeader>
            <AddToolItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      {selectedItem && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Tool Item</DialogTitle>
            </DialogHeader>
            <EditToolItemForm item={selectedItem} onSuccess={handleItemEdited} />
          </DialogContent>
        </Dialog>
      )}

      {toolItems && toolItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Electric</TableHead>
              <TableHead>Consumable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {toolItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.electric ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.consumable ? 'Yes' : 'No'}</TableCell>
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
        <p>No tools found. Add some!</p>
      )}
    </div>
  );
};

export default Tools;