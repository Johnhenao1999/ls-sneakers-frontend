import React from 'react';
import '../css/skeleton.css'; // Importar estilos del skeleton

function SkeletonProductCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-text title"></div>
      <div className="skeleton-text price"></div>
      <div className="skeleton-text discount"></div>
    </div>
  );
}

export default SkeletonProductCard;
