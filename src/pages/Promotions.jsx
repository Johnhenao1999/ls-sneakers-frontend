import React, { useState } from 'react';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';
import BrandFilter from '../components/BrandFilter';
import { BRANDS } from '../constans.js';
import Footer from '../components/Footer';

function ProductsPromotions() {
    const [selectedBrand, setSelectedBrand] = useState('');

    return (
        <div className="app-container">
            <Header />

            {/* Filtro de Marca */}
            <div className='section-container section-gender'>
                <div>
                    <p className='heading-title'>Promociones</p>
                    <p className='subtitle-section-gender'>Promociones exclusivas, tiempo limitado.</p>
                </div>
                <BrandFilter brands={BRANDS} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
            </div>
            <ProductsGrid category="promotion" selectedBrand={selectedBrand} />
            <Footer />
        </div>
    );
}

export default ProductsPromotions;
