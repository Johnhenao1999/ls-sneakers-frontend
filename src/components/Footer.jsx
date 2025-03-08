import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/footer.css";
import logo from "../assets/logo-lsneackers.jpg";

const Footer = () => {
  const [openSection, setOpenSection] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Detectar si el usuario está en móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSection = (index) => {
    if (isMobile) {
      setOpenSection(openSection === index ? null : index);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <img className="footer-logo" src={logo} alt="" />
          <p className="footer-description">
            Tu tienda de confianza para encontrar los mejores zapatos para toda la familia.
          </p>
        </div>

        {[
          { title: "Categorías", links: ["/collections/hombre", "/collections/mujer", "/collections/niños", "/promociones"], labels: ["Hombre", "Mujer", "Niños", "Promociones"] },
          { title: "Información", links: ["/sobre-nosotros", "/contacto", "/preguntas-frecuentes"], labels: ["Sobre Nosotros", "Contacto", "Preguntas Frecuentes"] },
          { title: "Legal", links: ["/terminos-condiciones", "/politica-privacidad", "/politica-devoluciones"], labels: ["Términos y Condiciones", "Política de Privacidad", "Política de Devoluciones"] }
        ].map((section, index) => (
          <div key={index} className="footer-section">
            <h3 className="accordion-title" onClick={() => toggleSection(index)}>
              {section.title}
              {isMobile && <span className={`arrow ${openSection === index ? "open" : ""}`}>&#9660;</span>}
            </h3>
            <ul className={`accordion-content ${openSection === index || !isMobile ? "open" : ""}`}>
              {section.links.map((link, i) => (
                <li key={i}>
                  <Link to={link}>{section.labels[i]}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <p>© 2025 LSNEAKERS. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
