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
      <ProductsGrid category="all" />
      <footer className="stats">
        <div>
          <h2>50K</h2>
          <p>Modelos Inspiradores</p>
        </div>
        <div>
          <h2>10K+</h2>
          <p>Colecciones Exclusivas</p>
        </div>
        <div>
          <h2>500+</h2>
          <p>Marcas Creativas</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
