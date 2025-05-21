import { useProjectedItems } from "@/hooks/use-projected-items";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectedCostByCategoryChart = () => {
  const { data: projectedItems, isLoading, error } = useProjectedItems();

  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-md mt-8" />;
  }

  if (error) {
    return <p className="text-red-500 mt-8">Error loading projection data for chart: {error.message}</p>;
  }

  // Calculate total cost/value by source category
  const categoryTotals: { [key: string]: number } = {
    'Needs': 0,
    'Consumable Inventory': 0, // Inventory doesn't have cost, maybe count items? Let's stick to cost for now, will be 0
    'Consumable Tools': 0, // Tools don't have cost, will be 0
    'Future One-Time Budget': 0,
  };

  if (projectedItems) {
    projectedItems.forEach(item => {
      if (item.cost !== null && item.cost !== undefined) {
        categoryTotals[item.source] += item.cost;
      }
      // Note: Inventory and Tools consumables don't have a cost field in their source tables,
      // so their total will remain 0 unless we decide to add a value field or count items instead.
      // For now, the chart will only show costs for Needs and Future Budget items.
    });
  }

  // Convert the totals object into an array for Recharts
  const chartData = Object.keys(categoryTotals).map(source => ({
    source,
    total: categoryTotals[source],
  }));

  // Filter out categories with zero total if desired, or show them as 0
  const filteredChartData = chartData.filter(data => data.total > 0);


  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Projected Cost by Category</h2>
      {filteredChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={filteredChartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis formatter={(value: number) => `$${value.toFixed(0)}`} />
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="total" fill="#047857" name="Total Projected Cost" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p>No projected costs found to display in the chart.</p>
      )}
    </div>
  );
};

export default ProjectedCostByCategoryChart;