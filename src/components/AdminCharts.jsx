import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminCharts = ({ stats }) => {
  const data = [
    {
      name: "Products",
      value: stats?.products?.total ?? 0,
    },
    {
      name: "Users",
      value: stats?.usersCount ?? 0,
    },
    {
      name: "Orders",
      value: stats?.orders?.total ?? 0,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Store Overview
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Products, users and orders overview.
        </p>
      </div>

      <div className="h-[320px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;