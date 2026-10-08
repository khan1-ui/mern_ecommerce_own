import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import InvoicePreview from "../components/InvoicePreview";
import { useToast } from "../context/ToastContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get("/orders/my");
        setOrders(Array.isArray(data) ? data : data?.orders || []);
      } catch (error) {
        showToast(
          error?.response?.data?.message || "Failed to load orders",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [showToast]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">
          You have not placed any orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-4 text-sm">
                <span>
                  Order ID: <span className="font-mono">{order._id?.slice(-8)}</span>
                </span>

                <span className="capitalize font-semibold">
                  Status: {order.status || order.orderStatus || "pending"}
                </span>
              </div>

              <div className="space-y-3">
                {(order.items || []).map((item, index) => (
                  <div key={`${item.product?._id || item.product || index}`} className="flex justify-between gap-4 text-sm">
                    <div>
                      <p className="font-medium">
                        {item.product?.title || item.name || "Product"}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        Quantity: {item.qty || item.quantity || 1}
                      </p>
                    </div>

                    <span className="font-medium whitespace-nowrap">
                      ৳ {Number(item.price || 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3 flex flex-col sm:flex-row sm:justify-between gap-3 text-sm">
                <div>
                  <span className="font-semibold">
                    Total: ৳ {Number(order.totalAmount || 0).toLocaleString()}
                  </span>
                  <span className="ml-3 text-gray-500 dark:text-gray-400">
                    Cash on Delivery
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="underline cursor-pointer"
                  >
                    View Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedOrder && (
        <InvoicePreview
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default Orders;
