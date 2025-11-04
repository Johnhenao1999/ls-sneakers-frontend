import React, { useState } from 'react';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';
import BrandFilter from '../components/BrandFilter';
import { BRANDS } from '../constans.js';
import Footer from '../components/Footer';

function ProductsByGender({ title, subtitle, category }) {
  const [selectedBrand, setSelectedBrand] = useState('');

  return (
    <div className="app-container">
      <Header />
      <div className="section-container section-gender">
        <div>
          <p className="heading-title">{title}</p>
          <p className="subtitle-section-gender">{subtitle}</p>
        </div>
        <BrandFilter
          brands={BRANDS}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
      </div>
      <ProductsGrid category={category} selectedBrand={selectedBrand} />
      <Footer />
    </div>
  );
}

export default ProductsByGender;
