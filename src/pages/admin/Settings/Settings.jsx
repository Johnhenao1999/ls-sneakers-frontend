import React, { useState, useEffect } from "react";
import "./settings.css";
import AdminSidebar from "../../../components/admin/Sidebar/AdminSidebar";
import { Settings as SettingsIcon, Percent, Save, Info } from "lucide-react";

const API_URL = "https://ls-sneakers-backend.vercel.app/api";

const Settings = () => {
  const [percentage, setPercentage] = useState("");
  const [currentPercentage, setCurrentPercentage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [productsUpdated, setProductsUpdated] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Cargar porcentaje guardado localmente (referencia)
  useEffect(() => {
    const savedPercentage = localStorage.getItem("storePercentage") || 0;
    setCurrentPercentage(Number(savedPercentage));
    setPercentage(savedPercentage);
  }, []);

  // Aplicar descuento global
  const handleSave = async (e) => {
    e.preventDefault();

    const value = parseFloat(percentage);

    if (isNaN(value) || value < 0 || value > 100) {
      setMessage({ text: "Por favor ingresa un porcentaje válido (0-100)", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_URL}/products/apply-sale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discountPercentage: value }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al aplicar el descuento");
      }

      // Guardar localmente como referencia
      localStorage.setItem("storePercentage", value);
      setCurrentPercentage(value);
      setProductsUpdated(data.totalUpdated || 0);
      setMessage({ 
        text: `✅ Descuento del ${value}% aplicado a ${data.totalUpdated} productos`, 
        type: "success" 
      });
    } catch (error) {
      console.error("Error al aplicar descuento:", error);
      setMessage({ text: `❌ ${error.message}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Limpiar mensaje después de 3 segundos
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="settings-container">
          <div className="settings-header">
            <SettingsIcon size={28} />
            <h1>Ajustes de la Tienda</h1>
          </div>

          {message.text && (
            <div className={`settings-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="settings-card">
            <div className="card-header">
              <Percent size={22} />
              <h2>Descuento Global</h2>
            </div>

            <div className="card-description">
              <Info size={16} />
              <p>
                Este porcentaje de descuento se aplicará a todos los productos de la tienda.
                Los productos se marcarán en promoción con el nuevo precio calculado.
              </p>
            </div>

            <div className="current-value">
              <span>Descuento actual:</span>
              <strong>{currentPercentage}%</strong>
            </div>

            <form onSubmit={handleSave} className="settings-form">
              <div className="input-group">
                <label htmlFor="percentage">Nuevo porcentaje de descuento</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="percentage"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    placeholder="Ej: 10"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>

              <button
                type="submit"
                className="save-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-loading"></span>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Aplicar Descuento</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="settings-info">
            <h3>Información</h3>
            <ul>
              <li>El descuento se aplicará automáticamente a todos los productos.</li>
              <li>Se calcula sobre el precio original de cada producto.</li>
              <li>Usa 0% para quitar todos los descuentos.</li>
              {productsUpdated > 0 && (
                <li><strong>Última actualización:</strong> {productsUpdated} productos modificados.</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
