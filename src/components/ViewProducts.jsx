import { useState } from "react";
import { useProducts } from "../ProductsContext";
import { Link } from "react-router-dom";
import '../css/viewProducts.css';

function ViewProducts() {
  const { products, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const productsPerPage = 8;

  // Filtrar productos por nombre o categoría
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginación
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Manejo de eliminación con modal-delete
  const handleDelete = async () => {
    if (!selectedProduct) return;

    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct._id);
      setStatusMessage("✅ Producto eliminado con éxito.");
    } catch (error) {
      setStatusMessage("❌ Ha ocurrido un error al eliminar el producto.");
    }
    setIsDeleting(false);

    // Cierra el modal-delete después de 2 segundos
    setTimeout(() => {
      setSelectedProduct(null);
      setStatusMessage("");
    }, 2000);
  };

  return (
    <div className="panel-container">
      <h2>Gestión de Productos</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o categoría..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="product-grid-view">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product._id} className="product-card-view">
              <img src={product.imageUrls[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <p className="category">Marca: {product.branch}</p>
              <div className="button-group">
                <Link to={`/update-product/${product._id}`}>
                  <button className="edit-btn">Editar</button>
                </Link>
                <button className="delete-btn" onClick={() => setSelectedProduct(product)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>

      {/* Paginación */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* modal-delete de confirmación */}
      {selectedProduct && (
        <div className="modal-delete-overlay">
          <div className="modal-delete">
            <p>¿Estás seguro de que deseas eliminar <strong>{selectedProduct.name}</strong>?</p>
            
            {statusMessage ? (
              <p className="status-message">{statusMessage}</p>
            ) : (
              <div className="modal-delete-buttons">
                <button className="cancel-btn" onClick={() => setSelectedProduct(null)}>Cancelar</button>
                <button className="confirm-btn" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewProducts;
