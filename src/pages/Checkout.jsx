import { useState } from "react";

import { Link } from "react-router-dom";

import {
  CheckCircle,
  Phone,
  MapPin,
  Banknote,
} from "lucide-react";

import { useCart } from "../store/cart";

import { useToast } from "../context/ToastContext";

import api from "../services/api";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();

  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);

  const [orderSuccess, setOrderSuccess] = useState(false);

  const [orderId, setOrderId] = useState("");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.qty || 0),
    0
  );

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (field, value) => {
    setAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // PLACE ORDER
  // --------------------------------------------------

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    const {
      name,
      phone,
      address: deliveryAddress,
      city,
    } = address;

    // ----------------------------------------------
    // REQUIRED FIELD VALIDATION
    // ----------------------------------------------

    if (
      !name.trim() ||
      !phone.trim() ||
      !deliveryAddress.trim() ||
      !city.trim()
    ) {
      showToast(
        "Please provide your name, phone and complete delivery address.",
        "error"
      );

      return;
    }

    // ----------------------------------------------
    // PHONE VALIDATION
    // ----------------------------------------------

    const phoneDigits = phone.replace(/\D/g, "");

    if (phoneDigits.length < 10) {
      showToast(
        "Please enter a valid phone number.",
        "error"
      );

      return;
    }

    // ----------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // ----------------------------------------------

    if (submitting) return;

    try {
      setSubmitting(true);

      // --------------------------------------------
      // CREATE ORDER
      // --------------------------------------------

      const { data } = await api.post("/orders", {
        items: cartItems.map((item) => ({
          product: item._id,
          qty: Number(item.qty || 1),
        })),

        customerName: name.trim(),

        customerPhone: phone.trim(),

        deliveryAddress: {
          name: name.trim(),
          phone: phone.trim(),
          address: deliveryAddress.trim(),
          city: city.trim(),
        },

        totalAmount,

        paymentMethod: "cod",
      });

      // --------------------------------------------
      // GET ORDER ID
      // --------------------------------------------

      const createdOrderId =
        data?.order?._id ||
        data?.order?.id ||
        data?.orderId ||
        data?._id ||
        "";

      setOrderId(createdOrderId);

      // --------------------------------------------
      // CLEAR CART
      // --------------------------------------------

      clearCart();

      // --------------------------------------------
      // SUCCESS
      // --------------------------------------------

      showToast(
        "Order placed successfully 🎉",
        "success"
      );

      setOrderSuccess(true);
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      showToast(
        error?.response?.data?.message ||
          "Order failed. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (!orderSuccess && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Add some products before proceeding to checkout.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  // ==================================================
  // ORDER SUCCESS
  // ==================================================

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg text-center">
          {/* SUCCESS ICON */}

          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle
              size={42}
              className="text-green-600 dark:text-green-400"
            />
          </div>

          {/* TITLE */}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Order Placed Successfully!
          </h1>

          {/* MESSAGE */}

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Thank you for your order. Our representative
            will call you shortly to confirm your order.
          </p>

          {/* ORDER ID */}

          {orderId && (
            <div className="mt-5 inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Order ID:{" "}
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                #{orderId.slice(-8).toUpperCase()}
              </span>
            </div>
          )}

          {/* NEXT STEPS */}

          <div className="mt-6 rounded-xl border border-gray-200 dark:border-gray-800 p-5 text-left bg-white dark:bg-gray-900">
            {/* PHONE */}

            <div className="flex items-start gap-3">
              <Phone
                size={20}
                className="mt-0.5 text-gray-700 dark:text-gray-300"
              />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Order Confirmation
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Our team will contact you at the phone
                  number provided during checkout to
                  confirm your order.
                </p>
              </div>
            </div>

            {/* DELIVERY */}

            <div className="mt-4 flex items-start gap-3">
              <MapPin
                size={20}
                className="mt-0.5 text-gray-700 dark:text-gray-300"
              />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Home Delivery
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your product will be delivered to the
                  address you provided.
                </p>
              </div>
            </div>

            {/* COD */}

            <div className="mt-4 flex items-start gap-3">
              <Banknote
                size={20}
                className="mt-0.5 text-gray-700 dark:text-gray-300"
              />

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Cash on Delivery
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You will pay when the product is
                  delivered.
                </p>
              </div>
            </div>
          </div>

          {/* CONTINUE SHOPPING */}

          <Link
            to="/products"
            className="inline-flex mt-7 px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ==================================================
  // CHECKOUT
  // ==================================================

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Checkout
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter your delivery information to place your
          order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="lg:col-span-3 space-y-6">
          {/* CUSTOMER INFORMATION */}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Phone size={18} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Customer Information
                </h2>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  We will contact you to confirm your
                  order.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* NAME */}

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Full Name
                </label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={address.name}
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 disabled:opacity-60"
                />
              </div>

              {/* PHONE */}

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Phone Number
                </label>

                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="01XXXXXXXXX"
                  value={address.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 disabled:opacity-60"
                />

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Please provide an active phone number.
                </p>
              </div>

              {/* ADDRESS */}

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  Delivery Address
                </label>

                <textarea
                  rows="3"
                  placeholder="House, road, village/area..."
                  value={address.address}
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 disabled:opacity-60"
                />
              </div>

              {/* CITY / AREA */}

              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                  City / Area
                </label>

                <input
                  type="text"
                  placeholder="Enter city or area"
                  value={address.city}
                  onChange={(e) =>
                    handleChange(
                      "city",
                      e.target.value
                    )
                  }
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-4 py-3 outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-700 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          {/* DELIVERY INFORMATION */}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Delivery Information
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your order will be delivered to the
                  address provided above.
                </p>
              </div>
            </div>
          </div>

          {/* PAYMENT */}

          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Payment Method
            </h2>

            <div className="flex items-center gap-3 rounded-xl border-2 border-gray-900 dark:border-gray-100 p-4">
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Banknote size={20} />
              </div>

              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  Cash on Delivery
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Pay when your order is delivered.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================
            RIGHT - ORDER SUMMARY
        ================================================== */}

        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">
              Order Summary
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.title}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Qty: {item.qty}
                    </p>
                  </div>

                  <p className="text-sm font-medium whitespace-nowrap">
                    ৳{" "}
                    {(
                      Number(item.price || 0) *
                      Number(item.qty || 0)
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTAL */}

            <div className="border-t border-gray-200 dark:border-gray-800 mt-5 pt-5">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>

                <span>
                  ৳ {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* PLACE ORDER */}

            <button
              type="button"
              onClick={placeOrder}
              disabled={submitting}
              className="w-full mt-6 bg-black text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Placing Order..."
                : "Place Order — Cash on Delivery"}
            </button>

            <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
              After placing the order, our representative
              will call you for confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
