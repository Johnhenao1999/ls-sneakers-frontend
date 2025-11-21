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

  const promotionProducts = products
    .filter(product => product.onSale && product.discountPrice)
    .map(product => ({
      ...product,
      discountPrice: Number(product.discountPrice)
    }))
    .sort((a, b) => a.discountPrice - b.discountPrice);

  return (
    <div className="app-container">
      <Header />
      <BannerHero />
      {/* <div>
        <h1 className='title-principal'>Nuestros productos</h1>
        <ProductsGrid category={["Hombre", "Unisex", "Mujer", "Niños", "Guayos"]} maxItems={8} />
      </div> */}
      {promotionProducts.length > 0 && (
        <div>
          <h1 className='title-principal'>Promociones destacadas</h1>
          <ProductsGrid customProducts={promotionProducts} />
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default HomePage;
