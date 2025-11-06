import React, { useState } from "react";
import "./faqAccordion.css";

const FAQAccordion = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      title: "Métodos de entrega",
      content: (
        <>
          <p>
            En <strong>LSneakers 👟</strong> ofrecemos envíos gratuitos a todo
            Colombia 🇨🇴.
          </p>
          <ul>
            <li>
              🚚 <strong>Guadalajara de Buga</strong> y <strong>Cali</strong>: el
              pago es <strong>contra entrega</strong> y el envío es totalmente{" "}
              <strong>gratis</strong>.
            </li>
            <li>
              📦 En las demás ciudades de Colombia, no aplica el pago contra
              entrega, pero el <strong>envío continúa siendo gratuito</strong>.
            </li>
          </ul>
          <p>
            Los tiempos de entrega varían según la ciudad y disponibilidad del
            producto, pero normalmente tu pedido llega entre{" "}
            <strong>2 y 5 días hábiles</strong>.
          </p>
        </>
      ),
    },
    {
      title: "Cambios y garantías",
      content: (
        <>
          <p>
            Todos nuestros productos cuentan con una{" "}
            <strong>garantía de 1 mes</strong> a partir del día en que recibes
            tu pedido.
          </p>
          <p>
            ✅ Los <strong>cambios o reposiciones</strong> aplican únicamente por:
          </p>
          <ul>
            <li>Despegue del material o suela 🩴</li>
            <li>Defectos de fábrica visibles 👟</li>
            <li>Daños estructurales que impidan el uso normal del calzado</li>
          </ul>
          <p>
            La garantía <strong>no cubre daños por mal uso</strong>, contacto con
            químicos o desgaste natural del zapato.  
            Para gestionar un cambio, contáctanos por WhatsApp al número
            <strong> 3162372548</strong> 📞.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="faq-container">
      <h2 className="faq-title">Preguntas frecuentes</h2>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div className="faq-item" key={index}>
            <button
              className={`faq-header ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => toggleAccordion(index)}
            >
              {faq.title}
              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </button>
            <div
              className={`faq-content ${
                activeIndex === index ? "open" : ""
              }`}
            >
              {faq.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQAccordion;
