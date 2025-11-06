import React, { useState } from "react";
import "../css/header.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo-lsneackers.jpg";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import CheckoutModal from "../components/CheckoutModal/CheckoutModal";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();
  const location = useLocation();

  // 👇 Cierra el menú automáticamente al navegar en mobile
  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar">
      <div className="navbar-top">
        Created by <strong>Luisa Solarte</strong> —{" "}
        <a
          href="https://www.instagram.com/lsneakers__/?igsh=MThkajEzdGdxZmNqZA%3D%3D"
          target="_blank"
          rel="noreferrer"
        >
          @lsneakers__
        </a>
      </div>

      <div className={isMenuOpen ? "active-header" : "navbar-content"}>
        <button
          className={isMenuOpen ? "menu-toggle-active-header" : "menu-toggle"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>

        <Link to="/" className="logo">
          <img src={logo} alt="LS Sneakers Logo" />
        </Link>

        <nav className={isMenuOpen ? "show" : ""}>
          <Link to="/">
            <span className="icon"></span>INICIO
          </Link>
          <Link to="/collections/mujer">
            <span className="icon">{/* 👩 */}</span>MUJER
          </Link>
          <Link to="/collections/hombre">
            <span className="icon">{/* 👨 */}</span>HOMBRE
          </Link>
          <Link to="/collections/guayos">
            <span className="icon">{/* ⚽ */}</span>GUAYOS
          </Link>
          <Link to="/collections/ninos">
            <span className="icon">{/* 👦 */}</span>NIÑOS
          </Link>
          <Link to="/collections/promociones" className="promotions">
            <span className="icon">{/* 🏷️ */}</span>SALE
          </Link>
        </nav>

        {/* 🛒 Carrito */}
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          <ShoppingBag size={26} />
          {cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length}</span>
          )}
        </div>
      </div>

      {isCartOpen && (
        <CartSidebar onCheckout={() => setShowCheckout(true)} />
      )}
      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </header>
  );
}

export default Header;
