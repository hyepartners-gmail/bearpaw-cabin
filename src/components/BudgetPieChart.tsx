import { useBudgetItems } from "@/hooks/use-budget-items";
import { getYear } from "date-fns";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['#047857', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5', '#f0fdf4']; // Shades of green/emerald

const BudgetPieChart = () => {
  const { data: budgetItems, isLoading, error } = useBudgetItems();

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-md mt-8" />;
  }

  if (error) {
    return <p className="text-red-500 mt-8">Error loading budget data for pie chart: {error.message}</p>;
  }

  const chartDataMap: { [key: string]: number } = {};
  let oneTimeTotal = 0;
  const currentYear = getYear(new Date());

  if (budgetItems) {
    budgetItems.forEach(item => {
      if (item.type === 'monthly') {
        // Add annual cost for monthly items
        chartDataMap[`${item.name} (Monthly)`] = (chartDataMap[`${item.name} (Monthly)`] || 0) + item.cost * 12;
      } else if (item.type === 'one-time' && item.payment_date) {
        // Add one-time cost if it falls within the current year
        try {
          const paymentDate = new Date(item.payment_date);
          const paymentYear = getYear(paymentDate);
          if (paymentYear === currentYear) {
            oneTimeTotal += item.cost;
          }
        } catch (e) {
          console.error("Invalid payment_date format for pie chart:", item.payment_date, e);
        }
      }
    });
  }

  // Convert the map into an array for Recharts
  const chartData = Object.keys(chartDataMap).map(name => ({
    name,
    value: chartDataMap[name],
  }));

  // Add the one-time expenses slice if there are any
  if (oneTimeTotal > 0) {
    chartData.push({ name: 'One-Time Expenses', value: oneTimeTotal });
  }

  // Filter out items with zero value if necessary (optional, Recharts handles it)
  const filteredChartData = chartData.filter(data => data.value > 0);


  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Expense Breakdown ({currentYear})</h2>
      {filteredChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={filteredChartData}
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8" // Default fill, overridden by Cells
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {filteredChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p>No budget data available for the current year to display in the pie chart.</p>
      )}
    </div>
  );
};

export default BudgetPieChart;