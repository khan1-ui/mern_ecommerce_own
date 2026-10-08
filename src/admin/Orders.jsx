import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { cardStyle } from "../styles";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await api.get("/admin/orders");

      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Orders fetch error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);

      await api.put(`/admin/orders/${orderId}/status`, {
        status,
      });

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status,
              }
            : order
        )
      );
    } catch (err) {
      console.error("Order status update error:", err);

      setError(
        err?.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage and update customer orders.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 dark:border-red-900 dark:bg-red-950/30">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p>{error}</p>

            <button
              onClick={fetchOrders}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Orders */}
      <div className={`${cardStyle} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Total
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Payment
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Status
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName =
                    order.user?.name ||
                    order.shippingAddress?.name ||
                    "Customer";

                  const customerPhone =
                    order.user?.phone ||
                    order.shippingAddress?.phone ||
                    order.user?.email ||
                    "N/A";

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-gray-100 last:border-0 dark:border-gray-800"
                    >
                      {/* Order */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          #{order._id?.slice(-8).toUpperCase()}
                        </div>

                        {order.items?.length > 0 && (
                          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {order.items.length} item
                            {order.items.length > 1 ? "s" : ""}
                          </div>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {customerName}
                        </div>

                        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {customerPhone}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">
                        ৳{Number(order.total || 0).toLocaleString()}
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}
                        >
                          {order.paymentStatus || "pending"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <select
                          value={order.status || "pending"}
                          disabled={updatingId === order._id}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-gray-600 dark:text-gray-400">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
