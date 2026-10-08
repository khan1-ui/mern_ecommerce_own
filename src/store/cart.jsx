/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product, quantity = 1) => {
    const requestedQuantity = Math.max(1, Number(quantity) || 1);
    const stock = Number(product.stock ?? 0);

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      const existingQty = existing ? Number(existing.qty || 0) : 0;
      const nextQty = existingQty + requestedQuantity;
      const finalQty = stock > 0 ? Math.min(nextQty, stock) : nextQty;

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, qty: finalQty }
            : item
        );
      }

      return [...prev, { ...product, qty: stock > 0 ? Math.min(requestedQuantity, stock) : requestedQuantity }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
