import { useState } from "react";
import { useProducts } from "../../ProductsContext";
import { Link, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/admin/Sidebar/AdminSidebar";
import "../../css/viewProducts.css";

function AdminHome() {
  const { products, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBrand, setFilterBrand] = useState("Marcas");
  const [filterGender, setFilterGender] = useState("Genero");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const productsPerPage = 8;
  const navigate = useNavigate();

  // --- Filtrado dinámico ---
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand =
      filterBrand === "Marcas" || product.branch === filterBrand;
    const matchesGender =
      filterGender === "Genero" || product.gender === filterGender;

    return matchesSearch && matchesBrand && matchesGender;
  });

  // --- Paginación ---
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // --- Eliminar producto ---
  const handleDelete = async () => {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(selectedProduct._id);
      setStatusMessage("✅ Producto eliminado con éxito.");
    } catch (error) {
      setStatusMessage("❌ Error al eliminar el producto.");
    }
    setIsDeleting(false);
    setTimeout(() => {
      setSelectedProduct(null);
      setStatusMessage("");
    }, 2000);
  };

  // --- Obtener marcas únicas para el filtro ---
  const uniqueBrands = ["Marcas", ...new Set(products.map((p) => p.branch))];
  const uniqueGenders = ["Genero", ...new Set(products.map((p) => p.gender))];

  return (
    <>
      <AdminNavbar />
      <div className="panel-container">
        <div className="panel-header">
          <h2>Gestión de Productos</h2>
          <button
            className="add-product-btn"
            onClick={() => navigate("/add-product")}
          >
            ➕ Agregar Producto
          </button>
        </div>

        <div className="filters-container">
          <input
            type="text"
            placeholder="Buscar por nombre o marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="filter-select"
          >
            {uniqueBrands.map((brand, index) => (
              <option key={index} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="filter-select"
          >
            {uniqueGenders.map((gender, index) => (
              <option key={index} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        <div className="product-grid-view">
          {currentProducts.length > 0 ? (
            currentProducts.map((product) => (
              <div key={product._id} className="product-card-view">
                <img src={product.imageUrls[0]} alt={product.name} />
                <h3>{product.name}</h3>
                <p>Precio: ${product.price}</p>
                <p className="category">Marca: {product.branch}</p>
                <p className="category">Género: {product.gender}</p>
                <div className="button-group">
                  <Link to={`/update-product/${product._id}`}>
                    <button className="edit-btn">Editar</button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay productos que coincidan con los filtros</p>
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

        {/* Modal de confirmación */}
        {selectedProduct && (
          <div className="modal-delete-overlay">
            <div className="modal-delete">
              <p>
                ¿Eliminar <strong>{selectedProduct.name}</strong>?
              </p>
              {statusMessage ? (
                <p className="status-message">{statusMessage}</p>
              ) : (
                <div className="modal-delete-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="confirm-btn"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default AdminHome;
