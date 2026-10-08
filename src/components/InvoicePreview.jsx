import logo from "../assets/logo.png";

const InvoicePreview = ({ order, onClose }) => {
  const deliveryAddress = order?.deliveryAddress || order?.shippingAddress || {};
  const customerName = order?.customerName || deliveryAddress.name || "Customer";
  const customerPhone = order?.customerPhone || deliveryAddress.phone || "";
  const addressText = [deliveryAddress.address, deliveryAddress.city]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded space-y-4 relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-sm"
          aria-label="Close invoice"
        >
          ✕
        </button>

        <div className="text-center space-y-2">
          <img src={logo} alt="Company Logo" className="h-12 mx-auto" />
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm text-gray-500">Order ID: {order?._id}</p>
          <p className="text-sm">
            Date: {order?.createdAt ? new Date(order.createdAt).toDateString() : "-"}
          </p>
        </div>

        <hr />

        <div>
          <p className="font-medium">Customer</p>
          <p>{customerName}</p>
          {customerPhone && <p>{customerPhone}</p>}
          {addressText && <p>{addressText}</p>}
        </div>

        <hr />

        <div>
          <p className="font-medium mb-2">Items</p>
          {(order?.items || []).map((item, index) => (
            <div key={`${item.product?._id || item.product || index}`} className="flex justify-between text-sm gap-4">
              <span>
                {item.product?.title || item.name || "Product"} × {item.qty || item.quantity || 1}
              </span>
              <span>৳ {Number(item.price || 0).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <hr />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>৳ {Number(order?.totalAmount || 0).toLocaleString()}</span>
        </div>

        <div className="text-sm">
          <p>Payment Method: Cash on Delivery</p>
          <p>
            Payment Status: <span className="font-medium capitalize">{order?.paymentStatus || "unpaid"}</span>
          </p>
        </div>

        <a
          href={`${import.meta.env.VITE_API_URL}/orders/${order?._id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center bg-black text-white py-2 rounded"
        >
          Download PDF Invoice
        </a>
      </div>
    </div>
  );
};

export default InvoicePreview;
