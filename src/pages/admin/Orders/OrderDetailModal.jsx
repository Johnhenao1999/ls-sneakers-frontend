import React from "react";
import "./orderDetailModal.css";

const OrderDetailModal = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <>
      <div className="modal-overlay active" onClick={onClose}></div>

      <div className="order-modal-detail">
        <div className="modal-header-detail">
          <h3>Detalle del Pedido</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body-detail">
          {/* Datos del cliente */}
          <section className="order-section">
            <h4>Cliente</h4>
            <div className="order-info">
              <p><strong>Nombre:</strong> {order.cliente.nombre}</p>
              <p><strong>Celular:</strong> {order.cliente.celular}</p>
              <p><strong>Dirección:</strong> {order.cliente.direccion}</p>
              <p>
                <strong>Ciudad:</strong> {order.cliente.ciudad},{" "}
                {order.cliente.departamento}
              </p>
              <p><strong>Forma de pago:</strong> {order.cliente.formaPago}</p>
              <p><strong>Estado actual:</strong> {order.estado}</p>
              <p>
                <strong>Fecha de pedido:</strong>{" "}
                {new Date(order.fecha).toLocaleString("es-CO", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </section>

          {/* Productos */}
          <section className="order-section">
            <h4>Productos</h4>

            {/* 🖥️ Tabla (solo en desktop) */}
            <div className="products-table-wrapper">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Talla</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.productos.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img src={p.imagen} alt={p.nombre} className="product-thumb" />
                      </td>
                      <td>{p.nombre}</td>
                      <td>{p.talla}</td>
                      <td>{p.cantidad}</td>
                      <td>${p.precio.toLocaleString("es-CO")}</td>
                      <td>${(p.precio * p.cantidad).toLocaleString("es-CO")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 Cards (solo en mobile) */}
            <div className="products-list">
              {order.productos.map((p) => (
                <div key={p._id} className="product-card">
                  <img src={p.imagen} alt={p.nombre} className="product-img" />
                  <div className="product-info">
                    <h5>{p.nombre}</h5>
                    <p><strong>Talla:</strong> {p.talla}</p>
                    <p><strong>Cantidad:</strong> {p.cantidad}</p>
                    <p><strong>Precio:</strong> ${p.precio.toLocaleString("es-CO")}</p>
                    <p className="subtotal">
                      <strong>Subtotal:</strong>{" "}
                      ${(p.precio * p.cantidad).toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="total-box">
              <strong>Total:</strong> ${order.total.toLocaleString("es-CO")}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;
