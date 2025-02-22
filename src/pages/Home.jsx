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
    </div>
  );
}

export default HomePage;
