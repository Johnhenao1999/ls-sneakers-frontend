// CartContext.jsx
import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (newItem) => {
    const existing = cartItems.find(
      (item) => item._id === newItem._id && item.size === newItem.size
    );

    if (existing) {
      setCartItems((prev) =>
        prev.map((item) =>
          item._id === newItem._id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems((prev) => [...prev, { ...newItem, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  const clearCart = () => setCartItems([]);

  // 👇 Nueva función para aumentar cantidad
  const increaseQuantity = (productId, size) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // 👇 Nueva función para disminuir cantidad
  const decreaseQuantity = (productId, size) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId && item.size === size
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) } // nunca baja de 1
            : item
        )
        .filter((item) => item.quantity > 0) // elimina si llega a 0 (opcional)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
