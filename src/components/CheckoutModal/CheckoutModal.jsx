import React, { useState } from "react";
import "./checkoutModal.css";
import { useCart } from "../../context/CartContext";

const CheckoutModal = ({ onClose }) => {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    nombre: "",
    celular: "",
    departamento: "",
    ciudad: "",
    direccion: "",
    formaPago: "Contra entrega",
    observaciones: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  // Mapeamos los productos del carrito y usamos la imagen seleccionada (si existe)
  const productosSimplificados = cartItems.map((item) => ({
    id: item._id,
    nombre: item.name,
    talla: item.size,
    cantidad: item.quantity,
    precio: item.price,
    imagen: item.imageSelected || item.imageUrls[0], // 👈 prioriza la imagen elegida
  }));

  const pedido = {
    cliente: formData,
    productos: productosSimplificados,
  };

  try {
    const response = await fetch("https://ls-sneakers-backend.vercel.app/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pedido),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("🧾 Pedido guardado en backend:", data);
      alert("✅ Pedido enviado correctamente. Te contactaremos pronto.");

      clearCart();
      onClose();
    } else {
      console.error("❌ Error al enviar pedido:", data);
      alert("❌ No se pudo enviar el pedido. Intenta nuevamente.");
    }
  } catch (error) {
    console.error("⚠️ Error de conexión con el servidor:", error);
    alert("⚠️ No se pudo conectar con el servidor. Verifica tu conexión o inténtalo más tarde.");
  }
};

  return (
    <>
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
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Celular</label>
            <input
              type="tel"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Departamento</label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Ciudad</label>
            <input
              type="text"
              name="ciudad"
              value={formData.ciudad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Forma de pago</label>
            <select
              name="formaPago"
              value={formData.formaPago}
              onChange={handleChange}
            >
              <option>Contra entrega</option>
              <option>Transferencia</option>
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
    </>
  );
};

export default CheckoutModal;
