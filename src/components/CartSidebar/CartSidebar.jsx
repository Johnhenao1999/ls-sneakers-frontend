import React from "react";
import { useCart } from "../../context/CartContext";
import "./cartSidebar.css";

const CartSidebar = ({ onCheckout }) => {
  const { cartItems, removeFromCart, setIsCartOpen } = useCart();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>

      <div className="cart-sidebar">
        <div className="cart-header">
          <h3>Tu carrito</h3>
          <button onClick={() => setIsCartOpen(false)}>✖</button>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty">Tu carrito está vacío</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}`} className="cart-item">
                <img src={item.imageUrls[0]} alt={item.name} />
                <div>
                  <p className="name">{item.name}</p>
                  <p className="size">Talla: {item.size}</p>
                  <p className="price">${item.price}</p>
                </div>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id, item.size)}
                >
                  🗑️
                </button>
              </div>
            ))}

            <div className="cart-total">
              <p>Total: ${total.toLocaleString("es-CO")}</p>

              <button
                className="checkout-btn"
                onClick={() => {
                  setIsCartOpen(false); // cierra el carrito
                  setTimeout(() => onCheckout(), 300); // llama al modal desde el Header
                }}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
