import React, { useState, useEffect } from "react";
import "./brandsManager.css";
import { useBrands } from "../../../BrandsContext"; // 👈 importa el contexto

const BrandsManager = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [message, setMessage] = useState("");

  const { fetchBrands } = useBrands(); // 👈 lo obtenemos del contexto

  // 🔄 Cargar marcas
  const loadBrands = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://ls-sneakers-backend.vercel.app/api/brands");
      const data = await res.json();
      setBrands(data);
    } catch (error) {
      console.error("Error al cargar marcas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  // ➕ Crear marca
  const handleAddBrand = async (e) => {
    e.preventDefault();

    if (!newBrand.trim()) {
      setMessage("Por favor ingresa un nombre válido.");
      return;
    }

    try {
      const res = await fetch("https://ls-sneakers-backend.vercel.app/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBrand.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error al crear la marca");
        return;
      }

      setMessage("✅ Marca agregada correctamente");
      setNewBrand("");
      setShowModal(false);

      await loadBrands(); // 🔄 actualiza la vista del admin
      await fetchBrands(true); // 🧹 limpia la cache y actualiza el contexto global
    } catch (error) {
      console.error("Error al agregar marca:", error);
      setMessage("❌ Error de servidor");
    }
  };

  // ❌ Eliminar marca
  const handleDeleteBrand = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta marca?")) return;

    try {
      const res = await fetch(`https://ls-sneakers-backend.vercel.app/api/brands/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      setBrands((prev) => prev.filter((b) => b._id !== id));

      await fetchBrands(true); // 🧹 limpia la cache global
    } catch (error) {
      console.error("Error al eliminar marca:", error);
    }
  };

  return (
    <div className="brands-container">
      <h1>Gestión de Marcas</h1>

      {message && <p className="brand-message">{message}</p>}

      <button className="add-brand-btn" onClick={() => setShowModal(true)}>
        + Agregar Marca
      </button>

      {loading ? (
        <div className="loader"></div>
      ) : (
        <div className="brands-list">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand._id} className="brand-item">
                <span>{brand.name}</span>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteBrand(brand._id)}
                >
                  🗑
                </button>
              </div>
            ))
          ) : (
            <p className="no-brands">No hay marcas registradas.</p>
          )}
        </div>
      )}

      {/* 🟢 Modal para agregar marca */}
      {showModal && (
        <div className="modal-overlay-brand" onClick={() => setShowModal(false)}>
          <div
            className="modal-content-brand"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Agregar Nueva Marca</h2>
            <form onSubmit={handleAddBrand}>
              <input
                type="text"
                placeholder="Nombre de la marca"
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                autoFocus
              />
              <div className="modal-actions">
                <button type="submit" className="submit-btn">
                  Guardar
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandsManager;
