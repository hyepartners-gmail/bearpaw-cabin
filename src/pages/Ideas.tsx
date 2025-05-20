import { useState } from "react";
import { useIdeasItems } from "@/hooks/use-ideas-items";
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
import AddIdeasItemForm from "@/components/AddIdeasItemForm"; // We will create this next

const Ideas = () => {
  const { data: ideasItems, isLoading, error, refetch } = useIdeasItems();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemAdded = () => {
    refetch(); // Refresh the list after adding an item
    setIsDialogOpen(false); // Close the dialog
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {ideasItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.description}</TableCell>
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