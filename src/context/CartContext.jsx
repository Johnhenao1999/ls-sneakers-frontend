import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false); // 👈 nuevo estado

  // 🧠 Cargar carrito desde localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error al cargar el carrito:", error);
      }
    }
    setIsInitialized(true); // 👈 marca que ya cargó
  }, []);

  // 💾 Guardar carrito solo después de haber cargado
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // ➕ Agregar producto
  const addToCart = (newItem) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item._id === newItem._id && item.size === newItem.size
      );
      if (existing) {
        return prev.map((item) =>
          item._id === newItem._id && item.size === newItem.size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...newItem, quantity: 1 }];
      }
    });
  };

  // ❌ Eliminar producto
  const removeFromCart = (productId, size) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  // 🧹 Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cartItems");
  };

  // 🔼 Aumentar cantidad
  const increaseQuantity = (productId, size) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // 🔽 Disminuir cantidad
  const decreaseQuantity = (productId, size) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId && item.size === size
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
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
