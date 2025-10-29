import React, { useState } from "react";
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
} from "lucide-react"; // iconos elegantes y livianos

const AdminSidebar = () => {
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">{isOpen ? "Lsneakers Admin" : "LS"}</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav className="sidebar-menu">
          <Link
            to="/admin"
            className={`sidebar-link ${
              location.pathname === "/admin" ? "active" : ""
            }`}
          >
            <Boxes size={20} />
            {isOpen && <span>Productos</span>}
          </Link>

          <Link
            to="/categories"
            className={`sidebar-link ${
              location.pathname === "/categories" ? "active" : ""
            }`}
          >
            <Tags size={20} />
            {isOpen && <span>Categorías</span>}
          </Link>

          <Link
            to="/orders"
            className={`sidebar-link ${
              location.pathname === "/orders" ? "active" : ""
            }`}
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
