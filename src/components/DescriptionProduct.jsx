import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import "../css/descriptionProduct.css";
import { useCart } from "../context/CartContext";
import { useProducts } from "../ProductsContext";

function DescriptionProduct() {
  const location = useLocation();
  const { category, productName } = useParams();
  const { products } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(location.state?.product || null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  // ✅ Hook 1: Buscar producto si no viene del state
  useEffect(() => {
    if (!product && products.length > 0) {
      const found = products.find(
        (p) =>
          p.slug === productName ||
          p.name.toLowerCase() ===
            decodeURIComponent(productName.toLowerCase())
      );
      if (found) {
        setProduct(found);
      }
    }
  }, [product, products, productName]);

  // ✅ Hook 2: Inicializar talla e imagen al tener producto
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedImage(product.imageUrls?.[0] || "");
    }
  }, [product]);

  // 🪙 Formato de precios
  const formattedPrice =
    product &&
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(product.price);

  const formattedDiscountPrice =
    product && product.discountPrice
      ? new Intl.NumberFormat("es-CO", {
          style: "currency",
          currency: "COP",
          minimumFractionDigits: 0,
        }).format(product.discountPrice)
      : null;

  // 🛒 Agregar al carrito
  const handleAddToCart = () => {
    if (!product || !selectedSize) {
      alert("Por favor selecciona una talla antes de agregar al carrito.");
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
      imageSelected: selectedImage,
      quantity: 1,
    });

    setIsCartOpen(true);
  };

  // 💬 WhatsApp
  const handleWhatsAppClick = () => {
    if (!product || !selectedSize) {
      alert("Por favor, selecciona una talla antes de continuar.");
      return;
    }

    const phoneNumber = "3162372548";
    const message = `Hola, estoy interesado en el modelo ${product.name} en la talla ${selectedSize}. ¿Podrías brindarme más información sobre disponibilidad y detalles del producto? Quedo atento. ¡Gracias!`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappURL, "_blank");
  };

  // ⚠️ Ahora el return está después de todos los hooks (seguro)
  if (!product) {
    return <p>Producto no encontrado</p>;
  }

  return (
    <div className="description-product">
      <div className="product-details">
        {/* 🖼 Imagen principal */}
        <div className="product-image">
          <img src={selectedImage} alt={product.name} className="main-image" />

          {/* Miniaturas */}
          <div className="image-thumbnails">
            {product.imageUrls?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Vista ${index + 1}`}
                className={`thumbnail ${
                  selectedImage === img ? "active" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* 📋 Información del producto */}
        <div className="product-info">
          <div>
            <h1>{product.name}</h1>
            <p>
              {product.branch} | {product.gender}
            </p>
          </div>

          <div>
            {product.onSale && formattedDiscountPrice ? (
              <p className="product-discount-price">{formattedDiscountPrice}</p>
            ) : null}
            <p
              className={`product-price ${
                product.onSale ? "price-strikethrough" : ""
              }`}
            >
              {formattedPrice}
            </p>
          </div>

          {/* 👟 Tallas */}
          <div className="product-sizes">
            <p>Tallas disponibles:</p>
            <div className="sizes-container">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={`size-button ${
                    selectedSize === size ? "selected" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 🛍 Botones */}
          <div className="action-buttons">
            <button className="add-to-cart" onClick={handleAddToCart}>
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DescriptionProduct;
