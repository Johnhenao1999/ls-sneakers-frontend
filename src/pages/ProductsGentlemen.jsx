import React from 'react';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';

function ProducstGentlemen() {
    return (
        <div className="app-container">
            <Header />
            <ProductsGrid category="caballeros" />
        </div>
    );
}

export default ProducstGentlemen;
