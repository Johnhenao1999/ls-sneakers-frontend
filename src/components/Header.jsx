import React, { useState } from 'react';
import '../css/header.css';
import { Link } from "react-router-dom";
import logo from "../assets/logo-lsneackers.jpg";
import contact from "../assets/apoyo.gif";
import iconHombre from "../assets/hombre.png";
import iconMujer from "../assets/mujer.png";
import promotion from "../assets/etiqueta-de-descuento.png";
import home from "../assets/home.png";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className={isMenuOpen ? "active" : "navbar-content"}>
        <button className={isMenuOpen ? "menu-toggle-active" : "menu-toggle"} onClick={toggleMenu}>
          {isMenuOpen ? '✖' : '☰'}
        </button>
        <Link to="/" className="logo">
         <img src={logo} alt="" />
        </Link>
        {/* Navigation Menu */}
        <nav className={isMenuOpen ? "show" : ""}>
          <Link to="/"><img className='icons-menu' src={home} alt="" /> INICIO</Link>
          <Link to="/collections/mujer"><img className='icons-menu' src={iconMujer} alt="" />MUJER</Link>
          <Link to="/collections/hombre"><img className='icons-menu'src={iconHombre} alt="" />HOMBRE</Link>
          <Link to="/collections/promociones"><img className='icons-menu' src={promotion} alt="" />PROMOCIONES</Link>
        </nav>

        {/* Call-to-Action Button - Hidden when menu is open */}
        {!isMenuOpen && (
          <Link to="/" className="actions">
            <img src={contact} alt="" />
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
