import { useEffect, useState } from "react";
import { useProducts } from "../ProductsContext";
import "../css/editProduct.css";
import { sizesByGender, genders } from "../constans.js";
import { useBrands } from "../BrandsContext.jsx"; // 👈 Importa el contexto

function EditProduct({ productId }) {
  const { products, updateProduct } = useProducts();
  const { brands, loadingBrands, error } = useBrands(); // 👈 Hook de marcas
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

  // 🧠 Formatear precios
  const formatCurrency = (value) => {
    if (!value) return "";
    const numericValue = value.toString().replace(/\D/g, "");
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  // 🧩 Cargar producto
  useEffect(() => {
    const foundProduct = products.find((p) => p._id === productId);
    if (foundProduct) {
      setProductData({
        ...foundProduct,
        sizes: foundProduct.sizes || [],
        priceFormatted: formatCurrency(foundProduct.price),
        discountPriceFormatted: foundProduct.discountPrice
          ? formatCurrency(foundProduct.discountPrice)
          : "",
      });
    }
  }, [productId, products]);

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setProductData((prev) => ({
      ...prev,
      [name]: numericValue,
      [`${name}Formatted`]: formatCurrency(numericValue),
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProductData((prev) => {
      const newSizes = checked
        ? [...prev.sizes, value]
        : prev.sizes.filter((size) => size !== value);
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
      price: productData.price,
      discountPrice: productData.discountPrice,
      imageUrls: productData.imageUrls.filter(
        (img) => !deletedImages.includes(img)
      ),
    };

    try {
      const response = await fetch(
        `https://ls-sneakers-backend.vercel.app/api/products/${productId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedProductData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el producto");

      alert("✅ Producto actualizado con éxito");
      updateProduct(updatedProductData);
      setDeletedImages([]);
    } catch (error) {
      console.error(error);
      alert("❌ Hubo un error al actualizar el producto");
    }
  };

  if (!productData.name) return <p>Cargando producto...</p>;

  return (
    <div className="edit-product-container">
      <h2>Editar Producto</h2>

      {/* ⚠️ Mostrar error si las marcas no cargaron */}
      {error && <p className="error-text">{error}</p>}

      <form className="edit-product-form" onSubmit={handleSubmit}>
        {/* 🏷 Nombre */}
        <label>
          Nombre:
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
          />
        </label>

        {/* 💰 Precio */}
        <label>
          Precio:
          <input
            type="text"
            name="price"
            value={productData.priceFormatted || ""}
            onChange={handlePriceChange}
          />
        </label>

        {/* 🔖 Promoción */}
        <div>
          <label>¿En promoción?</label>
          <label className="switch">
            <input
              type="checkbox"
              name="onSale"
              checked={productData.onSale}
              onChange={handleChange}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* 💸 Precio con descuento */}
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

        {/* 🏷 Marca */}
        <label>
          Marca:
          <select
            name="branch"
            value={productData.branch}
            onChange={handleChange}
            disabled={loadingBrands}
          >
            <option value="">
              {loadingBrands ? "Cargando marcas..." : "Seleccione una marca"}
            </option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        {/* 👟 Género */}
        <label>
          Género:
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
          >
            <option value="">Seleccione el género</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </label>

        {/* 📏 Tallas */}
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

        {/* 🖼 Imágenes */}
        <label>
          Imágenes actuales:
          <div className="image-preview-container">
            {productData.imageUrls.map((img, index) => (
              <div
                key={index}
                className={`image-item ${
                  deletedImages.includes(img) ? "marked-for-deletion" : ""
                }`}
              >
                <img src={img} alt={`Imagen ${index + 1}`} />
                <button
                  className="delete-button"
                  type="button"
                  onClick={() =>
                    setDeletedImages([...deletedImages, img])
                  }
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </label>

        {/* ✅ Guardar */}
        <button type="submit" className="submit-button">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}

export default EditProduct;
