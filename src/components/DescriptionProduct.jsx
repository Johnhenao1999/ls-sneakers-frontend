import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/descriptionProduct.css';

function DescriptionProduct() {
    const location = useLocation();
    const { product } = location.state || {}; // Recupera el producto desde el state

    const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || null);
    const [selectedImage, setSelectedImage] = useState(product?.imageUrls[0] || '');

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

    const formattedPrice = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(product.price);

    const formattedDiscountPrice = product.discountPrice
        ? new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
        }).format(product.discountPrice)
        : null;

    return (
        <div className="description-product">
            <div className="product-details">
                {/* Imagen principal */}
                <div className="product-image">
                    <img src={selectedImage} alt={product.name} className="main-image" />
                    {/* Miniaturas */}
                    <div className="image-thumbnails">
                        {product.imageUrls.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Vista ${index + 1}`}
                                className={`thumbnail ${selectedImage === img ? 'active' : ''}`}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Información del producto */}
                <div className="product-info">
                    <h1>{product.name}</h1>
                    {product.onSale && formattedDiscountPrice ? (
                        <p className="product-discount-price">{formattedDiscountPrice}</p>
                    ) : null}
                    <p className={`product-price ${product.onSale ? 'price-strikethrough' : ''}`}>
                        {formattedPrice}
                    </p>

                    {/* Tallas en botones */}
                    <div className="product-sizes">
                        <p>Tallas disponibles:</p>
                        <div className="sizes-container">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button className="add-to-cart" onClick={handleWhatsAppClick}>
                        Me interesa
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DescriptionProduct;
