import { useState } from "react";
import { useBudgetItems } from "@/hooks/use-budget-items";
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
import AddBudgetItemForm from "@/components/AddBudgetItemForm"; // We will create this next

const Budget = () => {
  const { data: budgetItems, isLoading, error, refetch } = useBudgetItems();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemAdded = () => {
    refetch(); // Refresh the list after adding an item
    setIsDialogOpen(false); // Close the dialog
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

      {budgetItems && budgetItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>${item.cost.toFixed(2)}</TableCell>
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