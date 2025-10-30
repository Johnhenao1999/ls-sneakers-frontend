import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useProducts } from '../ProductsContext';
import '../css/productsGrid.css';

function ProductsGrid({ category = 'all', selectedBrand, maxItems, customProducts }) {
  const { products } = useProducts();

  // 🔎 Filtrar productos según categoría o lista personalizada
  const filteredProducts = (customProducts || products.filter(product =>
    (category === "promotion" ? product.onSale === true : product.onSale !== true) &&
    (category === "promotion" ||
      (Array.isArray(category)
        ? category.includes(product.gender)
        : product.gender === category))
  )).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // 💡 Filtrar por marca si se seleccionó alguna
  const finalProducts = selectedBrand
    ? filteredProducts.filter(product => product.branch === selectedBrand)
    : filteredProducts;

  // 🔢 Limitar cantidad si se pasó maxItems
  const displayedProducts = maxItems ? finalProducts.slice(0, maxItems) : finalProducts;

  // 🧠 Determinar la categoría para el link (mantiene compatibilidad)
  const getProductCategory = (product, category) => {
    if (Array.isArray(category)) {
      const matchedCategory = category.find(cat => cat === product.gender) || category[0];
      return matchedCategory.toLowerCase();
    }
    return category.toLowerCase();
  };

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
    </section>
  );
}

function ProductInView({ product }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const [currentImage, setCurrentImage] = useState(product.imageUrls[0]);
  const imageIndexRef = useRef(0);
  const intervalRef = useRef(null);

  // 💰 Formatos de precio
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

  // 🎞️ Cambio automático de imágenes al hover
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
