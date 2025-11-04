import React from 'react';
import '../css/loader.css';
import loaderImage from '../assets/logo-lsneackers.jpg';
function Loader({ text = 'Cargando...' }) {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <img src={loaderImage} alt="Loading" className="loader-image" />
        <p className="loader-text">{text}</p>
      </div>
    </div>
  );
}

export default Loader;
