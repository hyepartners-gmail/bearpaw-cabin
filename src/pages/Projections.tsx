import { useProjectedItems } from "@/hooks/use-projected-items";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectedCostByCategoryChart from "@/components/ProjectedCostByCategoryChart"; // Import the chart component
import { format, parseISO } from "date-fns"; // Import date functions

const Projections = () => {
  const { data: projectedItems, isLoading, error } = useProjectedItems();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Projections</h1>
        <Skeleton className="w-full h-[300px] rounded-md mb-8" /> {/* Skeleton for chart */}
        <Skeleton className="w-full h-[300px] rounded-md" /> {/* Skeleton for table */}
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Projections</h1>
        <p className="text-red-500">Error loading projections: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-emerald-600">Bear Paw Projections</h1>

      {/* Charts */}
      <ProjectedCostByCategoryChart />

      {/* Projected Items Table */}
      <h2 className="text-xl font-semibold mt-8 mb-2">Projected Items List</h2>
      {projectedItems && projectedItems.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Cost/Price</TableHead>
              <TableHead>Relevant Date</TableHead> {/* Added Relevant Date column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectedItems.map((item) => (
              <TableRow key={`${item.source}-${item.id}`}> {/* Use a composite key */}
                <TableCell className="font-medium">{item.source}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity ?? '-'}</TableCell>
                <TableCell>{item.cost !== null ? `$${item.cost.toFixed(2)}` : '-'}</TableCell>
                 <TableCell>
                  {item.date
                    ? format(parseISO(item.date), 'PPP') // Format the date
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No projected items found based on current criteria.</p>
      )}
    </div>
  );
};

export default Projections;