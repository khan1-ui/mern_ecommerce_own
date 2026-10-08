import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  Plus,
  Upload,
  Settings,
  ArrowRight,
} from "lucide-react";
import api from "../services/api";
import AdminCharts from "../components/AdminCharts";
import RevenueChart from "../components/RevenueChart";
import Loader from "../components/Loader";
import { cardStyle } from "../styles";

const AdminHome = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [statsResponse, revenueResponse] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/revenue"),
      ]);

      setStats(statsResponse.data?.stats || statsResponse.data || null);
      setRevenueData(
        Array.isArray(revenueResponse.data)
          ? revenueResponse.data
          : revenueResponse.data?.data || revenueResponse.data?.revenue || []
      );
    } catch (error) {
      console.error("Admin dashboard error:", error);
      setError(
        error?.response?.data?.message ||
          "Failed to load admin dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No dashboard data available.
        </p>
      </div>
    );
  }

  const statCards = [
    { title: "Total Users", value: stats.usersCount ?? stats.users?.total ?? 0, icon: Users },
    { title: "Total Products", value: stats.products?.total ?? 0, icon: Package },
    { title: "Total Orders", value: stats.orders?.total ?? 0, icon: ShoppingCart },
    { title: "Revenue", value: `৳${Number(stats.revenue || 0).toLocaleString()}`, icon: DollarSign },
  ];

  const summaryCards = [
    { title: "In Stock", value: stats.products?.inStock ?? stats.products?.available ?? 0 },
    { title: "Pending Orders", value: stats.orders?.pending ?? 0 },
    { title: "Delivered Orders", value: stats.orders?.delivered ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Overview of your store performance.
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/products/new"
          className={`${cardStyle} p-5 flex items-center justify-between hover:shadow-md transition group`}
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center">
              <Plus size={21} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Add Product
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Create a new physical product
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/products"
          className={`${cardStyle} p-5 flex items-center justify-between hover:shadow-md transition group`}
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Package size={21} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Manage Products
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Edit, delete and manage stock
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition" />
        </Link>

        <Link
          to="/admin/import"
          className={`${cardStyle} p-5 flex items-center justify-between hover:shadow-md transition group`}
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Upload size={21} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                Import Products
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Import physical products from JSON
              </p>
            </div>
          </div>
          <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/orders"
          className={`${cardStyle} p-4 flex items-center gap-3 hover:shadow-md transition`}
        >
          <ShoppingCart size={19} />
          <span className="font-medium">Manage Orders</span>
          <ArrowRight size={17} className="ml-auto text-gray-400" />
        </Link>

        <Link
          to="/admin/users"
          className={`${cardStyle} p-4 flex items-center gap-3 hover:shadow-md transition`}
        >
          <Users size={19} />
          <span className="font-medium">Customers</span>
          <ArrowRight size={17} className="ml-auto text-gray-400" />
        </Link>

        <Link
          to="/admin/store-settings"
          className={`${cardStyle} p-4 flex items-center gap-3 hover:shadow-md transition`}
        >
          <Settings size={19} />
          <span className="font-medium">Store Settings</span>
          <ArrowRight size={17} className="ml-auto text-gray-400" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`${cardStyle} p-5 flex items-center justify-between`}>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h2>
              </div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Icon size={21} className="text-gray-700 dark:text-gray-200" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className={`${cardStyle} p-5`}>
            <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{card.value}</h3>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <AdminCharts stats={stats} />
        <RevenueChart data={revenueData} />
      </div>
    </div>
  );
};

export default AdminHome;
