import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/DescriptionProduct.css';

function DescriptionProduct() {
    const location = useLocation();
    const { product } = location.state || {}; // Recupera el producto desde el state
    console.log(product);

    const [selectedSize, setSelectedSize] = useState(null);

    if (!product) {
        return <p>Producto no encontrado</p>;
    }

    const handleWhatsAppClick = () => {
        if (!selectedSize) {
            alert('Por favor, selecciona una talla antes de continuar.');
            return;
        }

        const phoneNumber = '3126818082';
        const message = `Hola, me interesa el ${product.name} con la talla ${selectedSize}, me podrías regalar más información?`;
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');
    };

    return (
        <div className="description-product">
            <div className="product-details">
                <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                </div>
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="product-price">{product.price}</p>
                    <div className="product-sizes">
                        <label htmlFor="size-select">Tallas disponibles:</label>
                        <select
                            id="size-select"
                            value={selectedSize || ''}
                            onChange={(e) => setSelectedSize(e.target.value)}
                        >
                            <option value="" disabled>Selecciona tu talla</option>
                            {product.sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="add-to-cart"
                        onClick={handleWhatsAppClick}
                    >
                        Me interesa
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DescriptionProduct;
