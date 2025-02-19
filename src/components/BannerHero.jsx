import React from "react";
import zapatosHome from "../assets/banner-hero-home.webp";
import "../css/bannerHero.css";

const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay"></div>
      <img
        src={zapatosHome}
        alt="Zapatillas Blancas"
        className="hero-image"
      />

      <div className="hero-content">
        <h1 className="fade-in">Descubre el mundo de LSNEAKERS</h1>
        <p className="fade-in delay-1">
          Bienvenido a nuestra tienda, donde cada paso es una declaración de estilo.
          Explora las últimas tendencias en zapatos para cada ocasión.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;