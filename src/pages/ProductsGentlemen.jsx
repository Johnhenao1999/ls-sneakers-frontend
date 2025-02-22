import React, { useState } from 'react';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';
import BrandFilter from '../components/BrandFilter';
import { BRANDS } from '../constans.js';

function ProducstGentlemen() {
    const [selectedBrand, setSelectedBrand] = useState('');

    return (
        <div className="app-container">
            <Header />

            {/* Filtro de Marca */}
            <div className='section-container section-gender'>
                <div>
                    <p className='heading-title'>ZAPATOS PARA HOMBRE</p>
                    <p className='subtitle-section-gender'>Amplio catalogo de zapatos de diferentes marcas con los mejores diseños.</p>
                </div>
                <BrandFilter brands={BRANDS} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
            </div>
            <ProductsGrid category="caballeros" selectedBrand={selectedBrand} />
        </div>
    );
}

export default ProducstGentlemen;
