import React from 'react';
import zapatosHome from '../assets/banner-hero-home.webp';
import '../App.css';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';
import BannerHero from '../components/BannerHero';

function HomePage() {
  return (
    <div className="app-container">
      <Header />
      <BannerHero />
      <div>
        <h1 className='title-principal'>Nuestros productos</h1>
        <ProductsGrid category="all" maxItems={8} />
      </div>
      <div>
        <h1 className='title-principal'>Promociones destacadas</h1>
        <ProductsGrid category="promotion" maxItems={4} />
      </div>
    </div>
  );
}

export default HomePage;
