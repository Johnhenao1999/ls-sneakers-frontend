import React, { useState } from 'react';
import '../css/Header.css';
import { Link } from "react-router-dom";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-content">
        <button className="menu-toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className="logo">
          <span role="img" aria-label="sneaker">👟</span> LSNEAKERS
        </div>

        {/* Navigation Menu */}
        <nav className={isMenuOpen ? "show" : ""}>
          <Link to="/">INICIO</Link>
          <Link to="/collections/damas">DAMAS</Link>
          <Link to="/collections/caballeros">CABALLEROS</Link>
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
