import { useInventoryItems } from "@/hooks/use-inventory-items";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const Inventory = () => {
  const { data: inventoryItems, isLoading, error } = useInventoryItems();

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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cabin Inventory</h1>
      {inventoryItems && inventoryItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.quantity ?? '-'}</TableCell>
                <TableCell>{item.state ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No inventory items found. Add some!</p>
      )}
    </div>
  );
};

export default Inventory;