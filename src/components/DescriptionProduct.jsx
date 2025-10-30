import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/descriptionProduct.css";
import { useCart } from "../context/CartContext";
import { useProducts } from "../ProductsContext";

function DescriptionProduct() {
  const { productName } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { products } = useProducts();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(true);

  // ⏳ Esperar a que el contexto termine de cargar (ya sea desde caché o backend)
  useEffect(() => {
    if (products.length > 0) {
      setIsLoadingContext(false);
    }
  }, [products]);

  useEffect(() => {
    // Si aún está cargando el contexto, no hacer nada
    if (isLoadingContext) return;

    const found = products.find((p) => p.slug === productName);

    if (found) {
      setProduct(found);
    } else {
      // Solo hacer fetch si realmente no está en el contexto
      const fetchProductBySlug = async () => {
        try {
          const res = await fetch(`https://ls-sneakers-backend.vercel.app/api/product/${productName}`);
          const data = await res.json();
          if (res.ok) setProduct(data);
        } catch (error) {
          console.error("Error al obtener el producto:", error);
        }
      };
      fetchProductBySlug();
    }
  }, [isLoadingContext, products, productName]);

  // 🎯 Inicializar talla e imagen
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || null);
      setSelectedImage(product.imageUrls?.[0] || "");
    }
  }, [product]);

  const formatPrice = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

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

  if (isLoadingContext) return <p className="loading-product">Cargando productos...</p>;
  if (!product) return <p className="loading-product">Producto no encontrado</p>;

  return (
    <div className="description-product">
      <div className="product-details">
        <div className="product-image">
          <img src={selectedImage} alt={product.name} className="main-image" />
          <div className="image-thumbnails">
            {product.imageUrls?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Vista ${index + 1}`}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.branch} | {product.gender}</p>

          <div>
            {product.onSale && product.discountPrice && (
              <p className="product-discount-price">{formatPrice(product.discountPrice)}</p>
            )}
            <p
              className={`product-price ${
                product.onSale ? "price-strikethrough" : ""
              }`}
            >
              {formatPrice(product.price)}
            </p>
          </div>

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
