import { useState } from "react";
import { useNeedsItems } from "@/hooks/use-needs-items";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
}
from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AddNeedsItemForm from "@/components/AddNeedsItemForm"; // We will create this next

const Needs = () => {
  const { data: needsItems, isLoading, error, refetch } = useNeedsItems();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemAdded = () => {
    refetch(); // Refresh the list after adding an item
    setIsDialogOpen(false); // Close the dialog
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Needs List</h1>
        <Skeleton className="w-full h-[300px] rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Cabin Needs List</h1>
        <p className="text-red-500">Error loading needs: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cabin Needs List</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Need Item</DialogTitle>
            </DialogHeader>
            <AddNeedsItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {needsItems && needsItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {needsItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell>{item.price !== null ? `$${item.price.toFixed(2)}` : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No needs items found. Add some!</p>
      )}
    </div>
  );
};

export default Needs;