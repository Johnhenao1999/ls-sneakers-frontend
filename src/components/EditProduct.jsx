import { useEffect, useState } from "react";
import { useProducts } from "../ProductsContext";
import "../css/editProduct.css";
import { BRANDS, sizesByGender, genders } from '../constans.js';

function EditProduct({ productId }) {
  const { products, updateProduct } = useProducts();
  const preset_name = "lsneakersuploadassets";
  const cloud_name = "dj2v5y8li";

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    discountPrice: "",
    branch: "",
    gender: "",
    sizes: [],
    onSale: false,
    imageUrls: [],
  });

  const [loading, setLoading] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === productId);
    if (foundProduct) {
      setProductData({
        ...foundProduct,
        sizes: foundProduct.sizes || [],
        priceFormatted: formatCurrency(foundProduct.price),  // Agregar formato
        discountPriceFormatted: foundProduct.discountPrice ? formatCurrency(foundProduct.discountPrice) : "", 
      });
    }
  }, [productId, products]);
  

  const formatCurrency = (value) => {
    if (!value) return "";
    const numericValue = value.toString().replace(/\D/g, ""); // Quita caracteres no numéricos
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, ""); // Solo números
    setProductData((prev) => ({
      ...prev,
      [name]: numericValue, // Guardar sin formato
      [`${name}Formatted`]: formatCurrency(numericValue), // Mostrar formateado
    }));    
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProductData((prev) => {
      const newSizes = checked
        ? [...prev.sizes, value] // Agregar talla si está seleccionada
        : prev.sizes.filter((size) => size !== value); // Quitar talla si se deselecciona
  
      return { ...prev, sizes: newSizes };
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedProductData = {
      ...productData,
      price: productData.price, // Sin formato
      discountPrice: productData.discountPrice, // Sin formato
      imageUrls: productData.imageUrls.filter((img) => !deletedImages.includes(img)),
    };

    try {
      const response = await fetch(`https://ls-sneakers-backend.vercel.app/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProductData),
      });

      if (!response.ok) throw new Error("Error al actualizar el producto");

      alert("Producto actualizado con éxito");
      updateProduct(updatedProductData);
      setDeletedImages([]);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el producto");
    }
  };

  if (!productData.name) return <p>Cargando producto...</p>;

  return (
    <div className="edit-product-container">
      <h2>Editar Producto</h2>
      <form className="edit-product-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="name" value={productData.name} onChange={handleChange} />
        </label>

        <label>
          Precio:
          <input
            type="text"
            name="price"
            value={productData.priceFormatted || ""}
            onChange={handlePriceChange}
          />
        </label>
        
        <div>
          <label>¿En promoción?</label>
          <label className="switch">
            <input type="checkbox" name="onSale" checked={productData.onSale} onChange={handleChange} />
            <span className="slider round"></span>
          </label>
        </div>        

        <label>
          Precio con descuento:
          <input
            type="text"
            name="discountPrice"
            value={productData.discountPriceFormatted || ""}
            onChange={handlePriceChange}
            disabled={!productData.onSale}
          />
        </label>

        <label>
          Marca:
          <select name="branch" value={productData.branch} onChange={handleChange}>
            <option value="">Seleccione una marca</option>
            {BRANDS.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </label>

        <label>
          Género:
          <select name="gender" value={productData.gender} onChange={handleChange}>
            <option value="">Seleccione el género</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </label>

        {productData.gender && (
          <fieldset>
            <legend>Tallas Disponibles:</legend>
            <div className="checkbox-group">
              {sizesByGender[productData.gender].map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    value={size}
                    checked={productData.sizes.includes(size)}
                    onChange={handleSizeChange}
                  />
                  {size}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <label>
          Imágenes actuales:
          <div className="image-preview-container">
            {productData.imageUrls.map((img, index) => (
              <div
                key={index}
                className={`image-item ${deletedImages.includes(img) ? "marked-for-deletion" : ""}`}
              >
                <img src={img} alt={`Imagen ${index + 1}`} />
                <button className="delete-button" type="button" onClick={() => setDeletedImages([...deletedImages, img])}>
                  X
                </button>
              </div>
            ))}
          </div>
        </label>

        <button type="submit" className="submit-button">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
