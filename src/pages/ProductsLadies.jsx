import React, { useState } from 'react';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';
import { BRANDS } from '../constans.js';
import BrandFilter from '../components/BrandFilter';

function ProducstLadies() {
    const [selectedBrand, setSelectedBrand] = useState('');
    return (
        <div className="app-container">
            <Header />
            <div className='section-container section-gender'>
                <div>
                    <p className='heading-title'>ZAPATOS PARA MUJER</p>
                    <p className='subtitle-section-gender'>Amplio catalogo de zapatos de diferentes marcas con los mejores diseños.</p>
                </div>
                <BrandFilter brands={BRANDS} selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} />
            </div>
            <ProductsGrid category="damas" selectedBrand={selectedBrand}/>
        </div>
    );
}

export default ProducstLadies;
