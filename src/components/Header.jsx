import React, { useState } from "react";
import "../css/header.css";
import { Link } from "react-router-dom";
import logo from "../assets/logo-lsneackers.jpg";
import contact from "../assets/apoyo.gif";
import iconHombre from "../assets/hombre.png";
import iconMujer from "../assets/mujer.png";
import promotion from "../assets/etiqueta-de-descuento.png";
import home from "../assets/home.png";
import iconNino from "../assets/estudiante.png";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import CartSidebar from "../components/CartSidebar/CartSidebar";
import CheckoutModal from "../components/CheckoutModal/CheckoutModal";


function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();

  return (
    <header className="navbar">
      <div className="navbar-top">
        Created by <strong>Luisa Solarte</strong> — <a href="https://www.instagram.com/lsneakers__/?igsh=MThkajEzdGdxZmNqZA%3D%3D" target="_blank">@lsneakers__</a>
      </div>

      <div className={isMenuOpen ? "active-header" : "navbar-content"}>
        <button
          className={isMenuOpen ? "menu-toggle-active-header" : "menu-toggle"}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>

        <Link to="/" className="logo">
          <img src={logo} alt="" />
        </Link>

        <nav className={isMenuOpen ? "show" : ""}>
          <Link to="/"><img className="icons-menu" src={home} alt="" />INICIO</Link>
          <Link to="/collections/mujer"><img className="icons-menu" src={iconMujer} alt="" />MUJER</Link>
          <Link to="/collections/hombre"><img className="icons-menu" src={iconHombre} alt="" />HOMBRE</Link>
          <Link to="/collections/guayos"><img className="icons-menu" src={iconNino} alt="" />GUAYOS</Link>
          <Link to="/collections/ninos"><img className="icons-menu" src={iconNino} alt="" />NIÑOS</Link>
          <Link to="/collections/promociones" className="promotions"><img className="icons-menu" src={promotion} alt="" />SALE</Link>
        </nav>

        {/* 🛒 Ícono del carrito */}
        <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          <ShoppingBag size={26} />
          {cartItems.length > 0 && (
            <span className="cart-count">{cartItems.length}</span>
          )}
        </div>
      </div>

      {/* 🧺 Sidebar del carrito */}
      {isCartOpen && (
        <CartSidebar
          onCheckout={() => setShowCheckout(true)} // 👈 abre el modal
        />
      )}

      {/* 🧾 Modal de checkout */}
      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)} // 👈 cierra el modal
        />
      )}
    </header>
  );
}

export default Header;
