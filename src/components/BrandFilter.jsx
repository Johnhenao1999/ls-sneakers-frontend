import React from 'react';
import '../css/brandFilter.css'

function BrandFilter({ brands, selectedBrand, setSelectedBrand }) {
  return (
    <section className="filter-container">
      <div>
        <label className='filter-label'>Filtrar por:</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Todas</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default BrandFilter;
