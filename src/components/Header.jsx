import React, { useState } from 'react';
import '../css/header.css';
import { Link } from "react-router-dom";

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
          <span role="img" aria-label="sneaker">👟</span> LSNEAKERS
        </Link>
        {/* Navigation Menu */}
        <nav className={isMenuOpen ? "show" : ""}>
          <Link to="/">INICIO</Link>
          <Link to="/collections/damas"><span class="icon-mujer">👩🏻</span>MUJER</Link>
          <Link to="/collections/caballeros"><span class="icon-hombre">👱🏻‍♂️</span>HOMBRE</Link>
        </nav>

        {/* Call-to-Action Button */}
        <div className="actions">
          <a href="#contactenos" className="primary-button">Contáctenos</a>
        </div>
      </div>
    </header>
  );
}

export default Header;