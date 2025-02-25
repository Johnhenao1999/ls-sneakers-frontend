import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useProducts } from '../ProductsContext'; // Importar el contexto
import '../css/productsGrid.css';

function ProductsGrid({ category = 'all', selectedBrand }) {
  const { products } = useProducts(); // Obtener productos desde el contexto

  const filteredProducts = products.filter(product =>
    (category === "promotion" ? product.onSale === true : product.onSale !== true) &&
    (category === "caballeros" ? product.gender === "Hombre" :
      category === "mujer" ? product.gender === "Mujer" :
        true)
  );

  const finalProducts = selectedBrand
    ? filteredProducts.filter(product => product.branch === selectedBrand)
    : filteredProducts;

  const toSlug = (name) => name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');

  return (
    <section className="product-grid">
      <div className="grid-container">
        {finalProducts.length > 0 ? (
          finalProducts.map((product) => (
            <Link
              key={product._id}
              to={`/collections/${category}/${toSlug(product.name)}`}
              state={{ product }}
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
  const [currentImage, setCurrentImage] = useState(product.imageUrls[0]); // Imagen inicial
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

  // Cambia la imagen automáticamente en hover o touch
  const startImageRotation = () => {
    if (product.imageUrls.length > 1) {
      intervalRef.current = setInterval(() => {
        imageIndexRef.current = (imageIndexRef.current + 1) % product.imageUrls.length;
        setCurrentImage(product.imageUrls[imageIndexRef.current]);
      }, 1000);
    }
  };

  const stopImageRotation = () => {
    clearInterval(intervalRef.current);
    setCurrentImage(product.imageUrls[0]); // Vuelve a la imagen principal
  };

  const handleTouchStart = () => {
    clearInterval(intervalRef.current); // Detiene cualquier intervalo anterior
    imageIndexRef.current = 0; // Reinicia la imagen a la primera
    setCurrentImage(product.imageUrls[0]);
    startImageRotation();
  };

  const handleTouchEnd = () => {
    stopImageRotation();
  };

  // Limpieza del intervalo cuando el componente se desmonta
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div
      ref={ref}
      className={`product-card-inner ${inView ? 'visible' : ''}`}
      onMouseEnter={startImageRotation}
      onMouseLeave={stopImageRotation}
      onTouchStart={handleTouchStart} // Inicia el cambio de imagen en mobile
      onTouchEnd={handleTouchEnd}
    >
      <div className="product-card-image">
        <img src={currentImage} alt={product.name} />
      </div>

      {product.onSale && formattedDiscountPrice ? (
        <p className="product-discount-price">{formattedDiscountPrice}</p>
      ) : null}
      <p className={`product-price ${product.onSale ? 'price-strikethrough' : ''}`}>
        {formattedPrice}
      </p>
      <h3>{product.name}</h3>
      <h3>{product.gender}</h3>
    </div>
  );
}

export default ProductsGrid;
