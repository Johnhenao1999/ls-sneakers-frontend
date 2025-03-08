import { Link } from "react-router-dom";
import "../css/adminhome.css";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import Header from "../components/Header";

function AdminHome() {
  return (
    // Agregar el componente Header
    <div>
      <div className="admin-container">
        <h1 className="admin-title">Panel de Administración</h1>
        <p className="admin-subtitle">Selecciona una opción para gestionar los productos.</p>

        <div className="admin-card-container">
          {/* Card para Agregar Producto */}
          <div className="admin-card">
            <PlusCircle size={50} color="#e11d48" />
            <h3 className="admin-card-title">Agregar Producto</h3>
            <p className="admin-card-text">Añade nuevos productos a la tienda.</p>
            <Link to="/add-product">
              <button className="admin-card-btn">Agregar</button>
            </Link>
          </div>

          {/* Card para Editar Producto */}
          <div className="admin-card">
            <Edit size={50} color="#e11d48" />
            <h3 className="admin-card-title">Editar Producto</h3>
            <p className="admin-card-text">Modifica o elimina productos de la tienda.</p>
            <Link to="/update-products">
              <button className="admin-card-btn">Editar</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
