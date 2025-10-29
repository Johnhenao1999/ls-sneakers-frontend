import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../AuthContext";
import "../Sidebar/adminSidebar.css";
import {
  Boxes,
  Tags,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta si es móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // En móvil el sidebar inicia cerrado
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [isMobile]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Botón hamburguesa visible solo cuando está cerrado en mobile */}
      {isMobile && !isOpen && (
        <button className="mobile-hamburger-btn" onClick={toggleSidebar}>
          <Menu size={26} />
        </button>
      )}

      {/* Overlay para cerrar al tocar fuera */}
      {isMobile && isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside
        className={`admin-sidebar ${isOpen ? "open" : "collapsed"} ${
          isMobile ? "mobile" : ""
        }`}
      >
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{isOpen ? "Lsneakers Admin" : "LS"}</h2>

          {/* Botón de cierre visible solo en mobile cuando está abierto */}
          {isMobile && isOpen && (
            <button className="sidebar-close-btn" onClick={toggleSidebar}>
              <X size={22} />
            </button>
          )}
        </div>

        <nav className="sidebar-menu">
          <Link
            to="/admin"
            className={`sidebar-link ${
              location.pathname === "/admin" ? "active" : ""
            }`}
            onClick={() => isMobile && toggleSidebar()}
          >
            <Boxes size={20} />
            {isOpen && <span>Productos</span>}
          </Link>

          <Link
            to="/categories"
            className={`sidebar-link ${
              location.pathname === "/categories" ? "active" : ""
            }`}
            onClick={() => isMobile && toggleSidebar()}
          >
            <Tags size={20} />
            {isOpen && <span>Categorías</span>}
          </Link>

          <Link
            to="/admin/orders"
            className={`sidebar-link ${
              location.pathname === "/admin/orders" ? "active" : ""
            }`}
            onClick={() => isMobile && toggleSidebar()}
          >
            <ShoppingBag size={20} />
            {isOpen && <span>Órdenes</span>}
          </Link>

          <button className="sidebar-link logout" onClick={handleLogout}>
            <LogOut size={20} />
            {isOpen && <span>Cerrar sesión</span>}
          </button>
        </nav>

        {isOpen && user && (
          <div className="sidebar-footer">
            <p>👤 {user.nombre}</p>
            <small>{user.email}</small>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
