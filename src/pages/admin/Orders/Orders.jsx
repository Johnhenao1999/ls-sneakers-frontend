import React, { useEffect, useState } from "react";
import "./orders.css";
import AdminNavbar from "../../../components/admin/Sidebar/AdminSidebar";
import OrderDetailModal from "../Orders/OrderDetailModal";


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("Todos");

  // Cargar las órdenes desde el backend
  useEffect(() => {
    fetch("https://ls-sneakers-backend.vercel.app/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.ordenes || []);
        setFilteredOrders(data.ordenes || []);
      })
      .catch((err) => console.error("❌ Error al cargar órdenes:", err));
  }, []);

  // Filtrar por estado
  useEffect(() => {
    if (filter === "Todos") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.estado === filter));
  }, [filter, orders]);

  // Cambiar estado de la orden
  const handleChangeEstado = async (id, nuevoEstado) => {
    try {
      const response = await fetch(
        `https://ls-sneakers-backend.vercel.app/api/orders/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === id ? { ...o, estado: nuevoEstado } : o))
        );
      } else {
        console.error("Error al actualizar estado:", data);
      }
    } catch (error) {
      console.error("⚠️ Error al conectar con el backend:", error);
    }
  };

  // Función para abrir WhatsApp con el cliente
  const handleWhatsApp = (telefono, nombre) => {
    const mensaje = `Hola ${nombre}, te saludamos desde LSneakers 👟. Queremos confirmarte el estado de tu pedido.`;
    window.open(
      `https://wa.me/57${telefono}?text=${encodeURIComponent(mensaje)}`,
      "_blank"
    );
  };

  return (
    <>
      <div className="admin-panel">
        <AdminNavbar />
        <div className="orders-page">
          <h2>📦 Órdenes Realizadas</h2>

          {/* Filtro por estado */}
          <div className="filter-bar">
            <label>Filtrar por estado:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option>Todos</option>
              <option>Recibido</option>
              <option>En preparación</option>
              <option>En camino</option>
              <option>Entregado</option>
              <option>Cancelado</option>
            </select>
          </div>

          {/* Tabla de órdenes */}
          <table className="orders-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cliente</th>
                <th>Contacto</th>
                <th>Ciudad</th>
                <th>Forma de Pago</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.cliente.nombre}</td>
                  <td>{order.cliente.celular}</td>
                  <td>
                    {order.cliente.ciudad}, {order.cliente.departamento}
                  </td>
                  <td>{order.cliente.formaPago}</td>
                  <td>${order.total.toLocaleString("es-CO")}</td>
                  <td>
                    <select
                      value={order.estado}
                      onChange={(e) =>
                        handleChangeEstado(order._id, e.target.value)
                      }
                      className={`estado-select ${order.estado
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      <option>Recibido</option>
                      <option>En preparación</option>
                      <option>En camino</option>
                      <option>Entregado</option>
                      <option>Cancelado</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className="btn-detail"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Detalle
                    </button>
                    <button
                      className="btn-wpp"
                      onClick={() =>
                        handleWhatsApp(
                          order.cliente.celular,
                          order.cliente.nombre
                        )
                      }
                    >
                      💬
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Modal de Detalle */}
          {selectedOrder && (
            <OrderDetailModal
              order={selectedOrder}
              onClose={() => setSelectedOrder(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
