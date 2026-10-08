import { Link, useNavigate } from "react-router-dom";

import { ShoppingBag, Trash2, ArrowRight, Banknote } from "lucide-react";

import { useCart } from "../store/cart";

import { useToast } from "../context/ToastContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const { showToast } = useToast();

  // --------------------------------------------------
  // TOTAL
  // --------------------------------------------------

  const total = cartItems.reduce(
    (sum, item) =>
      sum +
      Number(item.price || 0) *
        Number(item.qty || 0),
    0
  );

  // --------------------------------------------------
  // CHECKOUT
  // --------------------------------------------------

  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      showToast("Cart is empty", "error");
      return;
    }

    navigate("/checkout");
  };

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ShoppingBag
              size={34}
              className="text-gray-500 dark:text-gray-400"
            />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Cart is Empty
          </h1>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Looks like you haven't added any products
            to your cart yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition"
          >
            Browse Products

            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  // ==================================================
  // CART
  // ==================================================

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Your Cart
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Review your products before checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ==================================================
            CART ITEMS
        ================================================== */}

        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const itemPrice = Number(item.price || 0);

            const itemQty = Number(item.qty || 0);

            const itemTotal = itemPrice * itemQty;

            return (
              <div
                key={item._id}
                className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* PRODUCT INFO */}

                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      ৳ {itemPrice.toLocaleString()} ×{" "}
                      {itemQty}
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                      Subtotal: ৳{" "}
                      {itemTotal.toLocaleString()}
                    </p>
                  </div>

                  {/* REMOVE */}

                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item._id)
                    }
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />

                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ==================================================
            ORDER SUMMARY
        ================================================== */}

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-5">
              Order Summary
            </h2>

            {/* ITEM COUNT */}

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>Products</span>

              <span>
                {cartItems.reduce(
                  (sum, item) =>
                    sum + Number(item.qty || 0),
                  0
                )}
              </span>
            </div>

            {/* TOTAL */}

            <div className="border-t border-gray-200 dark:border-gray-800 mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ৳ {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* PAYMENT */}

            <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800/60 p-4">
              <Banknote
                size={20}
                className="mt-0.5 text-gray-700 dark:text-gray-300"
              />

              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Cash on Delivery
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Pay when your order is delivered.
                </p>
              </div>
            </div>

            {/* CHECKOUT */}

            <button
              type="button"
              onClick={checkoutHandler}
              className="w-full mt-5 inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition"
            >
              Proceed to Checkout

              <ArrowRight size={18} />
            </button>

            {/* CLEAR CART */}

            <button
              type="button"
              onClick={clearCart}
              className="w-full mt-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              Clear Cart
            </button>

            {/* NOTE */}

            <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
              Delivery address and phone number will be
              required at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
