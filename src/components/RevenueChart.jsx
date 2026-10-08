import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueChart = ({ data = [] }) => {
  const chartData = Array.isArray(data) ? data : [];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Revenue Overview
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Revenue performance over time.
        </p>
      </div>

      <div className="h-[320px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No revenue data available.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="date"
                tickFormatter={(value) => {
                  if (!value) return "";

                  const date = new Date(value);

                  if (Number.isNaN(date.getTime())) {
                    return value;
                  }

                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />

              <YAxis />

              <Tooltip />

              <Area
                type="monotone"
                dataKey="revenue"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RevenueChart;
