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
  // ✅ Mensaje profesional con datos del pedido y previsualización
  const handleWhatsApp = (telefono, nombre, order) => {
    const productos = order?.productos || [];
    const primerProducto = productos[0];

    const nombreProducto = primerProducto?.nombre || "tu pedido";
    const talla = primerProducto?.talla || "No especificada";
    const imagen = primerProducto?.imagen || "";
    const total = order?.total?.toLocaleString("es-CO") || "0";
    const formaPago = order?.cliente?.formaPago || "No especificada";

    const listaProductos = productos
      .map(
        (p, i) =>
          `  ${i + 1}. ${p.nombre} - Talla ${p.talla} - $${p.precio.toLocaleString(
            "es-CO"
          )}`
      )
      .join("\n");

    // 🧾 Mensaje con la imagen en la primera línea (preview en WhatsApp)
    const mensaje = `
${imagen}

Hola *${nombre}*, 👋  

Te saludamos desde *LSneakers 👟*.  
Queremos confirmarte que hemos recibido correctamente tu orden.  

🧾 *Detalle del pedido:*  
${listaProductos}

💵 *Total:* $${total} COP  
💳 *Forma de pago:* ${formaPago}  

💰 *Métodos de pago:*  
- Nequi: 3162372548  
- Daviplata: 3162372548  
- Bancolombia (Ahorros): 848-000052-79  
👤 A nombre de *Luisa Solarte*

Por favor envíanos el comprobante por este mismo medio para proceder con la preparación de tu pedido 📦  
¡Gracias por confiar en *LSneakers*! 🙌  
`;

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
                          order.cliente.nombre,
                          order // 👈 importante pasar toda la orden
                        )
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 .5C5.65.5.5 5.65.5 12c0 2.09.55 4.05 1.51 5.77L.5 23.5l5.93-1.54A11.45 11.45 0 0 0 12 23.5c6.35 0 11.5-5.15 11.5-11.5S18.35.5 12 .5zm6.22 16.45c-.27.76-1.61 1.46-2.25 1.55-.58.09-1.29.13-2.09-.13-.48-.16-1.1-.36-1.89-.7-3.32-1.43-5.47-4.77-5.64-5-.16-.23-1.34-1.79-1.34-3.43 0-1.63.83-2.43 1.12-2.76.29-.34.63-.43.84-.43.21 0 .42 0 .6.01.19.01.45-.07.7.54.27.63.9 2.19.98 2.35.08.16.13.34.03.55-.09.21-.13.34-.27.53-.13.18-.29.41-.41.55-.13.14-.27.3-.12.58.14.29.63 1.03 1.35 1.68.93.83 1.71 1.1 2 .12.25-.79.48-1.02.88-1.16.41-.13.66-.07 1.12.35.45.42 1.57 1.32 1.84 1.56.27.23.45.35.52.54.06.19.06 1.11-.21 1.87z" />
                      </svg>
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
