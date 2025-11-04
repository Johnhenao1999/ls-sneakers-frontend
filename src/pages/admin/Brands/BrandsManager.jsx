import React, { useState, useEffect } from "react";
import "./brandsManager.css";

const BrandsManager = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBrand, setNewBrand] = useState("");
  const [message, setMessage] = useState("");

  // 🔄 Cargar marcas
  const fetchBrands = async () => {
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
    fetchBrands();
  }, []);

  // ➕ Crear marca
  const handleAddBrand = async (e) => {
    e.preventDefault(); // ✅ evita recargar la página

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

      // ✅ Marca creada correctamente
      setMessage("✅ Marca agregada correctamente");
      setNewBrand("");
      setShowModal(false);
      fetchBrands();
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
            onClick={(e) => e.stopPropagation()} // evita cerrar al hacer click dentro
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
