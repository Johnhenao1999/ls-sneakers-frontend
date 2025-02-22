import React, { useState } from 'react';
import '../css/header.css';
import { Link } from "react-router-dom";
import logo from "../assets/logo-lsneackers.jpg";
import prueba from "../assets/apoyo.gif";

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
          <Link to="/">INICIO</Link>
          <Link to="/collections/damas"><span class="icon-mujer">👩🏻</span>MUJER</Link>
          <Link to="/collections/caballeros"><span class="icon-hombre">👱🏻‍♂️</span>HOMBRE</Link>
          <Link to="/collections/caballeros"><span class="icon-hombre">👱🏻‍♂️</span>PROMOCIONES</Link>
        </nav>

        {/* Call-to-Action Button */}
        <Link to="/" className="actions">
          <img src={prueba} alt="" />
        </Link>
      </div>
    </header>
  );
}

export default Header;