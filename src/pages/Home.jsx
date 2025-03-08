import React from 'react';
import zapatosHome from '../assets/banner-hero-home.webp';
import '../App.css';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';
import BannerHero from '../components/BannerHero';
import Footer from '../components/Footer';
import { useProducts } from '../ProductsContext';

function HomePage() {
  const { products } = useProducts(); // Obtener los productos desde el contexto

  // Filtrar productos en promoción y asegurarnos de que discountPrice es un número
  const promotionProducts = products
    .filter(product => product.onSale && product.discountPrice) // Solo los que tienen descuento
    .map(product => ({
      ...product,
      discountPrice: Number(product.discountPrice) // Convertir discountPrice a número
    }))
    .sort((a, b) => a.discountPrice - b.discountPrice); // Ordenar por menor precio

  console.log('Productos en promoción:', promotionProducts); 

  return (
    <div className="app-container">
      <Header />
      <BannerHero />
      <div>
        <h1 className='title-principal'>Nuestros productos</h1>
        <ProductsGrid category="all" maxItems={8} />
      </div>
      
      {promotionProducts.length > 0 && (
        <div>
          <h1 className='title-principal'>Promociones destacadas</h1>
          <ProductsGrid customProducts={promotionProducts.slice(0, 4)} />
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default HomePage;
