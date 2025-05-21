import { useBudgetItems } from "@/hooks/use-budget-items";
import { format, subMonths, getMonth, getYear } from "date-fns";
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

const BudgetChart = () => {
  const { data: budgetItems, isLoading, error } = useBudgetItems();

  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-md mt-8" />;
  }

  if (error) {
    return <p className="text-red-500 mt-8">Error loading budget data for chart: {error.message}</p>;
  }

  // Calculate data for the last 12 months
  const monthlyData: { [key: string]: number } = {};
  const today = new Date();
  const monthNames = Array.from({ length: 12 }).map((_, i) => {
    const date = subMonths(today, 11 - i);
    const monthYear = format(date, 'MMM yy');
    monthlyData[monthYear] = 0; // Initialize total for each month
    return monthYear;
  });

  if (budgetItems) {
    budgetItems.forEach(item => {
      if (item.type === 'monthly') {
        // Add monthly cost to every month in the range
        monthNames.forEach(monthYear => {
          monthlyData[monthYear] += item.cost;
        });
      } else if (item.type === 'one-time' && item.payment_date) {
        // Add one-time cost to the specific payment month
        try {
          const paymentDate = new Date(item.payment_date);
          const paymentMonthYear = format(paymentDate, 'MMM yy');
          if (monthlyData.hasOwnProperty(paymentMonthYear)) {
            monthlyData[paymentMonthYear] += item.cost;
          }
        } catch (e) {
          console.error("Invalid payment_date format:", item.payment_date, e);
          // Optionally show a toast or log for invalid dates
        }
      }
    });
  }

  // Convert the monthlyData object into an array for Recharts
  const chartData = monthNames.map(monthYear => ({
    month: monthYear,
    total: monthlyData[monthYear],
  }));

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Monthly Spending Overview (Last 12 Months)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
          <Legend />
          <Bar dataKey="total" fill="#047857" name="Total Spending" /> {/* Changed fill color to emerald-600 hex */}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;