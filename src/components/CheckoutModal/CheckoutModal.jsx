import React, { useState, useEffect } from "react";
import "./checkoutModal.css";
import { useCart } from "../../context/CartContext";
import departamentosData from "../../data/departamentosColombia.json"; // 🔹 Ajusta la ruta

const CheckoutModal = ({ onClose }) => {
  const { cartItems, clearCart } = useCart();
  const [departamentos, setDepartamentos] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [searchDepto, setSearchDepto] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [showDeptos, setShowDeptos] = useState(false);
  const [showCities, setShowCities] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    formaPago: "Contra entrega (Cali - Buga)",
    observaciones: "",
  });

  // 🟢 Cargar departamentos al montar el componente
  useEffect(() => {
    setDepartamentos(departamentosData);
  }, []);

  // 🔄 Actualizar ciudades cuando cambia el departamento
  useEffect(() => {
    const deptoSeleccionado = departamentos.find(
      (d) => d.departamento === formData.departamento
    );
    if (deptoSeleccionado) {
      setCiudades(deptoSeleccionado.ciudades);
    } else {
      setCiudades([]);
    }
  }, [formData.departamento, departamentos]);

  // ✏️ Manejar cambios del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 📦 Enviar pedido
  const handleSubmit = async (e) => {
    e.preventDefault();

    const productosSimplificados = cartItems.map((item) => ({
      id: item._id,
      nombre: item.name,
      talla: item.size,
      cantidad: item.quantity,
      precio: item.price,
      imagen: item.imageSelected || item.imageUrls[0],
    }));

    const pedido = {
      cliente: formData,
      productos: productosSimplificados,
    };

    try {
      const response = await fetch("https://ls-sneakers-backend.vercel.app/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Pedido enviado correctamente. Te contactaremos pronto.");
        clearCart();
        onClose();
      } else {
        console.error("❌ Error al enviar pedido:", data);
        alert("❌ No se pudo enviar el pedido. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("⚠️ Error de conexión con el servidor:", error);
      alert("⚠️ No se pudo conectar con el servidor. Intenta más tarde.");
    }
  };

  return (
    <div className="checkout-modal">
      <div className="modal-header-checkout">
        <h2>Finalizar compra</h2>
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>

      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label>Nombre completo</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Celular</label>
          <input type="tel" name="celular" value={formData.celular} onChange={handleChange} required />
        </div>

        {/* 🏙 Departamento */}
        <div className="form-group relative">
          <label>Departamento</label>
          <input
            type="text"
            placeholder="Escribe o selecciona..."
            value={searchDepto || formData.departamento}
            onChange={(e) => {
              const value = e.target.value;
              setSearchDepto(value);
              setFormData({ ...formData, departamento: value, ciudad: "" });
            }}
            onFocus={() => setShowDeptos(true)}   // ✅ abre al enfocar
            onClick={() => setShowDeptos(true)}   // ✅ abre al hacer clic
            onBlur={() => setTimeout(() => setShowDeptos(false), 150)} // 🔹 cierra después del click
            required
          />

          {showDeptos && (
            <ul className="custom-list">
              {departamentos
                .filter((d) =>
                  d.departamento.toLowerCase().includes(searchDepto.toLowerCase())
                )
                .map((d) => (
                  <li
                    key={d.id}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        departamento: d.departamento,
                        ciudad: "",
                      });
                      setSearchDepto(d.departamento);
                      setShowDeptos(false);
                      setCiudades(d.ciudades); // 🔹 carga las ciudades del depto
                    }}
                  >
                    {d.departamento}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* 🌆 Ciudad */}
        <div className="form-group relative">
          <label>Ciudad</label>
          <input
            type="text"
            placeholder={
              formData.departamento
                ? "Escribe o selecciona ciudad..."
                : "Primero selecciona un departamento"
            }
            value={searchCity || formData.ciudad}
            onChange={(e) => {
              const value = e.target.value;
              setSearchCity(value);
              setFormData({ ...formData, ciudad: value });
            }}
            onFocus={() => setShowCities(true)}   // ✅ abre al enfocar
            onClick={() => setShowCities(true)}   // ✅ abre al clic
            onBlur={() => setTimeout(() => setShowCities(false), 150)}
            required
            disabled={!formData.departamento}
          />

          {showCities && formData.departamento && (
            <ul className="custom-list">
              {ciudades
                .filter((c) =>
                  c.toLowerCase().includes(searchCity.toLowerCase())
                )
                .map((c, idx) => (
                  <li
                    key={idx}
                    onClick={() => {
                      setFormData({ ...formData, ciudad: c });
                      setSearchCity(c);
                      setShowCities(false);
                    }}
                  >
                    {c}
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>Dirección</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Forma de pago</label>
          <select name="formaPago" value={formData.formaPago} onChange={handleChange}>
            <option>Contra entrega (Cali - Buga)</option>
            <option>Bancolombia</option>
            <option>Nequi / Daviplata</option>
          </select>
        </div>

        <div className="form-group">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="confirm-btn">
          Confirmar pedido
        </button>
      </form>
    </div>
  );
};

export default CheckoutModal;
