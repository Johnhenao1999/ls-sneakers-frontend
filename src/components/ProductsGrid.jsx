import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useProducts } from '../ProductsContext';
import Loader from '../components/Loader';
import '../css/productsGrid.css';

function ProductsGrid({ category = 'all', selectedBrand, maxItems, customProducts }) {
  const { products } = useProducts();
  const [loading, setLoading] = useState(true);

  // ⚙️ Configuración de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // ✅ número de productos por página

  // 🔄 Detectar carga de productos
  useEffect(() => {
    if (products && products.length > 0) {
      setLoading(false);
    }
  }, [products]);

  if (loading) return <Loader text="Cargando productos..." />;

  // 🔎 Filtrado base
  const filteredProducts = (customProducts || products.filter(product =>
    (category === "promotion" ? product.onSale === true : product.onSale !== true) &&
    (category === "promotion" ||
      (Array.isArray(category)
        ? category.includes(product.gender)
        : product.gender === category))
  )).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 💡 Filtro por marca
  const finalProducts = selectedBrand
    ? filteredProducts.filter(product => product.branch === selectedBrand)
    : filteredProducts;

  // 🔢 Paginación
  const totalPages = Math.ceil(finalProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = finalProducts.slice(startIndex, startIndex + itemsPerPage);

  // 🧭 Determinar categoría para el link
  const getProductCategory = (product, category) => {
    if (Array.isArray(category)) {
      const matchedCategory = category.find(cat => cat === product.gender) || category[0];
      return matchedCategory.toLowerCase();
    }
    return category.toLowerCase();
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <section className="product-grid">
      <div className="grid-container">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <Link
              key={product._id}
              to={`/collections/${getProductCategory(product, category)}/${product.slug}`}
              className="product-card-link"
            >
              <div className="product-card">
                <ProductInView product={product} />
              </div>
            </Link>
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>

      {/* 🔘 Paginador */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}

// 💡 Subcomponente: mantiene tu lógica de animación de imágenes
function ProductInView({ product }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [currentImage, setCurrentImage] = useState(product.imageUrls[0]);
  const imageIndexRef = useRef(0);
  const intervalRef = useRef(null);

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(product.price);

  const formattedDiscountPrice = product.discountPrice
    ? new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(product.discountPrice)
    : null;

  const startImageRotation = () => {
    if (product.imageUrls.length > 1) {
      clearInterval(intervalRef.current);
      imageIndexRef.current = 1;
      setCurrentImage(product.imageUrls[1]);
      intervalRef.current = setInterval(() => {
        imageIndexRef.current =
          (imageIndexRef.current + 1) % product.imageUrls.length;
        setCurrentImage(product.imageUrls[imageIndexRef.current]);
      }, 1000);
    }
  };

  const stopImageRotation = () => {
    clearInterval(intervalRef.current);
    imageIndexRef.current = 0;
    setCurrentImage(product.imageUrls[0]);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      ref={ref}
      className={`product-card-inner ${inView ? 'visible' : ''}`}
      onMouseEnter={startImageRotation}
      onMouseLeave={stopImageRotation}
      onTouchStart={startImageRotation}
      onTouchEnd={stopImageRotation}
    >
      <div className="product-card-image">
        {product.onSale && <div className="offer-badge">Oferta</div>}
        <img src={currentImage} alt={product.name} />
      </div>

      <div className="product-card-price-container">
        {product.onSale && formattedDiscountPrice && (
          <p className="product-discount-price-grid">{formattedDiscountPrice}</p>
        )}
        <p
          className={`product-price-grid ${
            product.onSale ? 'price-strikethrough-grid' : ''
          }`}
        >
          {formattedPrice}
        </p>
      </div>

      <div className="product-card-content">
        <h3>{product.name}</h3>
        <h3 className="product-card-branch">{product.branch}</h3>
      </div>
    </div>
  );
}

export default ProductsGrid;
