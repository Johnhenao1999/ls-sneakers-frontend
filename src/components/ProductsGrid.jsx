import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import '../css/productsGrid.css';

function ProductsGrid({ category = 'all' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para obtener los datos de la API
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ls-sneakers-backend.vercel.app/api/products');
        if (!response.ok) {
          throw new Error('Error al obtener los productos');
        }
        const data = await response.json();
        const filteredProducts = category === "caballeros"
        ? data.filter(product => product.gender === "Hombre")
        : category === "damas"
        ? data.filter(product => product.gender === "Mujer")
        : data;
        setProducts(filteredProducts);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toSlug = (name) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <section className="product-grid">
      <div className="grid-container">
        {products.map((product) => (
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
        ))}
      </div>
    </section>
  );
}

function ProductInView({ product }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const formattedPrice = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0, // Sin decimales
  }).format(product.price);

  return (
    <div
      ref={ref}
      className={`product-card-inner ${inView ? 'visible' : ''}`}
    >
      <img src={product.imageUrl} alt={product.name} />
      <p className="product-price">{formattedPrice}</p>
      <h3>{product.name}</h3>
      <h3>{product.gender}</h3>
    </div>
  );
}

export default ProductsGrid;
