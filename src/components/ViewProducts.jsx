import { useState } from "react";
import { useProducts } from "../ProductsContext";
import { Link } from "react-router-dom";
import '../css/viewProducts.css';

function ViewProducts() {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

      <div className="product-grid">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.imageUrls[0]} alt={product.name} />
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <p className="category">Categoría: {product.branch}</p>
              <div className="button-group">
                <Link to={`/update-product/${product._id}`}>
                  <button className="edit-btn">Editar</button>
                </Link>
                <button className="delete-btn" onClick={() => console.log("Eliminar", product._id)}>
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
    </div>
  );
}

export default ViewProducts;
