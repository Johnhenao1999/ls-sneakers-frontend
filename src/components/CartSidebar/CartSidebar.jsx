// CartSidebar.jsx
import React from "react";
import { useCart } from "../../context/CartContext";
import "./cartSidebar.css";

const CartSidebar = ({ onCheckout }) => {
  const {
    cartItems,
    removeFromCart,
    setIsCartOpen,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

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
            <div>
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}`} className="cart-item">
                <img src={item.imageUrls[0]} alt={item.name} />
                <div className="cart-item-info">
                  <p className="name">{item.name}</p>
                  <p className="size">Talla: {item.size}</p>
                  <p className="price">
                    ${Number(item.price).toLocaleString("es-CO")}
                  </p>

                  {/* 👇 Controles de cantidad */}
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => decreaseQuantity(item._id, item.size)}
                    >
                      −
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      readOnly
                      className="qty-input"
                    />
                    <button
                      className="qty-btn"
                      onClick={() => increaseQuantity(item._id, item.size)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item._id, item.size)}
                  aria-label="Eliminar producto"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M5 6l1-3h12l1 3" />
                  </svg>
                </button>

              </div>
            ))}
            </div>

            <div className="cart-total">
              <p>Total: ${total.toLocaleString("es-CO")}</p>

              <button
                className="checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  setTimeout(() => onCheckout(), 300);
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
