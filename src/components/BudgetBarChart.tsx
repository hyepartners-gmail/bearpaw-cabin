import { useBudgetItems } from "@/hooks/use-budget-items";
import { format, startOfYear, endOfYear, eachMonthOfInterval, isWithinInterval } from "date-fns"; // Import necessary date-fns functions
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

const BudgetBarChart = () => {
  const { data: budgetItems, isLoading, error } = useBudgetItems();

  if (isLoading) {
    return <Skeleton className="w-full h-[300px] rounded-md mt-8" />;
  }

  if (error) {
    return <p className="text-red-500 mt-8">Error loading budget data for chart: {error.message}</p>;
  }

  // Calculate data for the current calendar year (Jan-Dec)
  const today = new Date();
  const startOfCurrentYear = startOfYear(today);
  const endOfCurrentYear = endOfYear(today);

  // Get all months within the current year
  const monthsInYear = eachMonthOfInterval({
    start: startOfCurrentYear,
    end: endOfCurrentYear,
  });

  const monthlyData: { [key: string]: number } = {};
  const monthLabels = monthsInYear.map(date => {
    const monthYear = format(date, 'MMM yy');
    monthlyData[monthYear] = 0; // Initialize total for each month
    return monthYear;
  });

  if (budgetItems) {
    budgetItems.forEach(item => {
      if (item.type === 'monthly') {
        // Add monthly cost to every month in the current year
        monthLabels.forEach(monthYear => {
          monthlyData[monthYear] += item.cost;
        });
      } else if (item.type === 'one-time' && item.payment_date) {
        // Add one-time cost to the specific payment month if it's within the current calendar year
        try {
          const paymentDate = new Date(item.payment_date);
          // Check if the payment date is within the current calendar year
          if (isWithinInterval(paymentDate, { start: startOfCurrentYear, end: endOfCurrentYear })) {
             const paymentMonthYear = format(paymentDate, 'MMM yy');
             if (monthlyData.hasOwnProperty(paymentMonthYear)) {
               monthlyData[paymentMonthYear] += item.cost;
             } else {
               // This case should ideally not happen if monthLabels covers the year,
               // but adding a log for debugging if needed.
               console.warn(`Payment date ${paymentMonthYear} is within current year but not in monthLabels keys.`);
             }
          }
        } catch (e) {
          console.error("Invalid payment_date format:", item.payment_date, e);
          // Optionally show a toast or log for invalid dates
        }
      }
    });
  }

  // Convert the monthlyData object into an array for Recharts
  const chartData = monthLabels.map(monthYear => ({
    month: monthYear,
    total: monthlyData[monthYear],
  }));

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Monthly Spending Overview (Current Calendar Year)</h2> {/* Updated title */}
      <ResponsiveContainer width="100%" height={300}>
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
          <Bar dataKey="total" fill="#047857" name="Total Spending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetBarChart;