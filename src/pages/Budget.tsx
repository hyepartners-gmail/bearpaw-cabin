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
import BudgetBarChart from "@/components/BudgetBarChart"; // Import BudgetBarChart (renamed)
import BudgetPieChart from "@/components/BudgetPieChart"; // Import BudgetPieChart
import { format, getQuarter, getYear } from "date-fns"; // Import date-fns functions

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

  // Calculate summaries
  const currentYear = getYear(new Date());
  const yearlyTotal = budgetItems?.reduce((total, item) => {
    if (item.type === 'monthly') {
      // Add monthly cost for 12 months
      return total + item.cost * 12;
    } else if (item.type === 'one-time' && item.payment_date) {
      // Add one-time cost if it falls within the current year
      try {
        const paymentYear = getYear(new Date(item.payment_date));
        if (paymentYear === currentYear) {
          return total + item.cost;
        }
      } catch (e) {
        console.error("Invalid payment_date format for summary:", item.payment_date, e);
      }
    }
    return total;
  }, 0) || 0;

  const quarterlyTotals: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0 };
   if (budgetItems) {
    budgetItems.forEach(item => {
      if (item.type === 'monthly') {
        // Add monthly cost to each quarter
        quarterlyTotals[1] += item.cost * 3;
        quarterlyTotals[2] += item.cost * 3;
        quarterlyTotals[3] += item.cost * 3;
        quarterlyTotals[4] += item.cost * 3;
      } else if (item.type === 'one-time' && item.payment_date) {
        // Add one-time cost to the specific quarter if it falls within the current year
        try {
          const paymentDate = new Date(item.payment_date);
          const paymentYear = getYear(paymentDate);
          const paymentQuarter = getQuarter(paymentDate);
          if (paymentYear === currentYear && quarterlyTotals.hasOwnProperty(paymentQuarter)) {
             quarterlyTotals[paymentQuarter] += item.cost;
          }
        } catch (e) {
          console.error("Invalid payment_date format for quarterly summary:", item.payment_date, e);
        }
      }
    });
  }


  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Budget Tracker</h1>{/* Updated title and added color */}
        <Skeleton className="w-full h-[100px] rounded-md mb-4" /> {/* Skeleton for summaries */}
        <Skeleton className="w-full h-[400px] rounded-md" /> {/* Skeleton for chart */}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Budget Tracker</h1>{/* Updated title and added color */}
        <p className="text-red-500">Error loading budget: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-emerald-600">Bear Paw Budget Tracker</h1>{/* Updated title and added color */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-800 hover:bg-amber-900 text-primary-foreground">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Budget Item</DialogTitle>
            </DialogHeader>
            <AddBudgetItemForm onSuccess={handleItemAdded} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Budget Summaries */}
      <div className="mb-8"> {/* Container for summaries */}
        {/* Yearly Total */}
        <div className="bg-gray-100 p-4 rounded-md shadow w-full mb-4"> {/* Full width and margin bottom */}
          <h3 className="text-lg font-semibold">Yearly Total ({currentYear})</h3>
          <p className="text-2xl font-bold text-emerald-600">${yearlyTotal.toFixed(2)}</p> {/* Changed text color */}
        </div>

        {/* Quarterly Totals - 4 in a row on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Grid with 1 column on small, 2 on medium, 4 on large */}
          <div className="bg-gray-100 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold">Q1 Total</h3>
            <p className="text-2xl font-bold text-emerald-600">${quarterlyTotals[1].toFixed(2)}</p> {/* Changed text color */}
          </div>
          <div className="bg-gray-100 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold">Q2 Total</h3>
            <p className="text-2xl font-bold text-emerald-600">${quarterlyTotals[2].toFixed(2)}</p> {/* Changed text color */}
          </div>
          <div className="bg-gray-100 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold">Q3 Total</h3>
            <p className="text-2xl font-bold text-emerald-600">${quarterlyTotals[3].toFixed(2)}</p> {/* Changed text color */}
          </div>
          <div className="bg-gray-100 p-4 rounded-md shadow">
            <h3 className="text-lg font-semibold">Q4 Total</h3>
            <p className="text-2xl font-bold text-emerald-600">${quarterlyTotals[4].toFixed(2)}</p> {/* Changed text color */}
          </div>
        </div>
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

      {/* Budget Charts */}
      <BudgetPieChart /> {/* Added the new pie chart */}
      <BudgetBarChart /> {/* Kept the existing bar chart */}


      {/* Budget Items Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Budget Items List</h2>
      {budgetItems && budgetItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Payment Date</TableHead> {/* Added Payment Date column */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {budgetItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>${item.cost.toFixed(2)}</TableCell>
                <TableCell>{item.payment_date ? format(new Date(item.payment_date), 'PPP') : '-'}</TableCell> {/* Display payment date */}
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
        <p>No budget items found. Add some!</p>
      )}
    </div>
  );
};

export default Budget;