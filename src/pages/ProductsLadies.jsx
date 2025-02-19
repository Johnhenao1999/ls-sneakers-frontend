import React from 'react';
import Header from '../components/Header';
import ProductsGrid from '../components/ProductsGrid';

function ProducstLadies() {
    return (
        <div className="app-container">
            <Header />
            <ProductsGrid category="damas" />
        </div>
    );
}

export default ProducstLadies;
