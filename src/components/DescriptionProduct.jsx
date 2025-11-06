import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/descriptionProduct.css";
import { useCart } from "../context/CartContext";
import { useProducts } from "../ProductsContext";
import FAQAccordion from "./Accordion/FAQAccordion";

function DescriptionProduct() {
  const { productName } = useParams();
  const { addToCart, setIsCartOpen } = useCart();
  const { products } = useProducts();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const sliderRef = useRef(null);

  // 🧭 Detectar si está en mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ⏳ Cargar productos del contexto
  useEffect(() => {
    if (products.length > 0) setIsLoadingContext(false);
  }, [products]);

  // 🔍 Buscar producto por slug o fetch
  useEffect(() => {
    if (isLoadingContext) return;
    const found = products.find((p) => p.slug === productName);
    if (found) setProduct(found);
    else {
      (async () => {
        try {
          const res = await fetch(`https://ls-sneakers-backend.vercel.app/api/product/${productName}`);
          const data = await res.json();
          if (res.ok) setProduct(data);
        } catch (error) {
          console.error("Error al obtener el producto:", error);
        }
      })();
    }
  }, [isLoadingContext, products, productName]);

  // Inicializar talla e imagen
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

  // 📱 Slider scroll con sincronización automática
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !product) return;

    const handleScroll = () => {
      const index = Math.round(slider.scrollLeft / slider.clientWidth);
      const newImg = product.imageUrls[index];
      if (newImg && newImg !== selectedImage) {
        setSelectedImage(newImg);
      }
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [product, selectedImage]);

  if (isLoadingContext) return <p className="loading-product">Cargando productos...</p>;
  if (!product) return <p className="loading-product">Producto no encontrado</p>;

  return (
    <div className="description-product">
      <div className="product-details">
        {/* === Imagen principal / slider === */}
        <div className="product-image">
          {isMobile ? (
            <div className="mobile-slider" ref={sliderRef}>
              {product.imageUrls?.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Vista ${index + 1}`}
                  className={`slider-image ${selectedImage === img ? "fade-in-active" : ""}`}
                />
              ))}
            </div>
          ) : (
            <img
              src={selectedImage}
              alt={product.name}
              className="main-image fade-in-active"
              key={selectedImage}
            />
          )}

          {/* Thumbnails sincronizados */}
          <div className="image-thumbnails">
            {product.imageUrls?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Vista ${index + 1}`}
                className={`thumbnail ${selectedImage === img ? "active" : ""}`}
                onClick={() => {
                  setSelectedImage(img);
                  if (sliderRef.current && isMobile) {
                    sliderRef.current.scrollTo({
                      left: index * sliderRef.current.clientWidth,
                      behavior: "smooth",
                    });
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* === Info del producto === */}
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.branch} | {product.gender}</p>

          <div>
            {product.onSale && product.discountPrice && (
              <p className="product-discount-price">{formatPrice(product.discountPrice)}</p>
            )}
            <p className={`product-price ${product.onSale ? "price-strikethrough" : ""}`}>
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="product-sizes">
            <p>Tallas disponibles:</p>
            <div className="sizes-container">
              {product.sizes?.map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? "selected" : ""}`}
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
      {/* === FAQ Accordion === */}
      <FAQAccordion />
    </div>
  );
}

export default DescriptionProduct;
