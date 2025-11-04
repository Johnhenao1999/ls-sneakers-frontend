import React, { useState } from "react";
import { sizesByGender, genders } from "../constans.js";
import "../css/adminpanel.css";
import { useProducts } from "../ProductsContext.jsx";
import { useBrands } from "../BrandsContext.jsx"; // 👈 importamos el hook del contexto
import Select from "react-select";

const AddProducts = () => {
  const preset_name = "lsneakersuploadassets";
  const cloud_name = "dj2v5y8li";
  const { addProduct } = useProducts();

  // 🟢 Marcas desde el contexto global
  const { brands, loadingBrands, error } = useBrands();

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priceFormatted: "",
    discountPrice: "",
    discountPriceFormatted: "",
    branch: "",
    gender: "",
    sizes: [],
    onSale: false,
  });

  // 🔹 Convertimos las marcas del contexto en opciones del Select
  const brandOptions = brands.map((brand) => ({
    label: brand,
    value: brand,
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // 💰 Si es un campo de precio, formatearlo con el signo $
    if (name === "price" || name === "discountPrice") {
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue
        ? `$ ${new Intl.NumberFormat("es-CO").format(numericValue)}`
        : "";

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
        [`${name}Formatted`]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        sizes: name === "gender" ? [] : prev.sizes,
      }));
    }
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      sizes: checked
        ? [...prev.sizes, value]
        : prev.sizes.filter((size) => size !== value),
    }));
  };

  const handleSelectAllSizes = (e) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sizes: checked ? sizesByGender[formData.gender] || [] : [],
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({
      ...prev,
      onSale: !prev.onSale,
      discountPrice: prev.onSale ? "" : prev.discountPrice,
      discountPriceFormatted: prev.onSale ? "" : prev.discountPriceFormatted,
    }));
  };

  // 📸 Subir imágenes a Cloudinary
  const uploadImages = async (e) => {
    const files = e.target.files;
    const uploadedImages = [];
    setLoading(true);

    for (const file of files) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", preset_name);

      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );

        const fileData = await response.json();
        uploadedImages.push(fileData.secure_url);
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }

    setImages((prev) => [...prev, ...uploadedImages]);
    setLoading(false);
  };

  // 📤 Envío del producto al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      alert("Por favor, sube al menos una imagen antes de enviar.");
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.onSale
        ? Number(formData.discountPrice)
        : null,
      imageUrls: images,
    };

    try {
      const response = await fetch(
        "https://ls-sneakers-backend.vercel.app/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(`Error al crear el producto: ${error.message}`);
        return;
      }

      const newProduct = await response.json();
      addProduct(newProduct);

      // 🧹 Reiniciar el formulario
      setShowModal(true);
      setFormData({
        name: "",
        price: "",
        priceFormatted: "",
        discountPrice: "",
        discountPriceFormatted: "",
        branch: "",
        gender: "",
        sizes: [],
        onSale: false,
      });
      setImages([]);
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al enviar los datos.");
    }
  };

  return (
    <div className="form-container">
      <h1>Subir Producto</h1>

      {/* ⚠️ Si hay error al cargar las marcas */}
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        {/* 🏷 Nombre */}
        <div className="form-group">
          <label>Nombre del producto:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 🏷 Marca */}
        <div className="form-group">
          <label>Marca:</label>
          <Select
            options={brandOptions}
            value={brandOptions.find(
              (option) => option.value === formData.branch
            )}
            onChange={(selectedOption) =>
              handleInputChange({
                target: { name: "branch", value: selectedOption.value },
              })
            }
            isSearchable
            placeholder={
              loadingBrands ? "Cargando marcas..." : "Seleccione una marca..."
            }
            isDisabled={loadingBrands}
          />
        </div>

        {/* 💰 Precio */}
        <div className="form-group">
          <label>Precio:</label>
          <input
            type="text"
            name="price"
            value={formData.priceFormatted || ""}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 🔖 Promoción */}
        <div className="form-group">
          <label>¿En promoción?</label>
          <label className="switch">
            <input
              type="checkbox"
              checked={formData.onSale}
              onChange={handleCheckboxChange}
            />
            <span className="slider round"></span>
          </label>
        </div>

        {/* 💸 Precio con descuento */}
        {formData.onSale && (
          <div className="form-group">
            <label>Precio con descuento:</label>
            <input
              type="text"
              name="discountPrice"
              value={formData.discountPriceFormatted || ""}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {/* 👟 Género */}
        <div className="form-group">
          <label>Género:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione el género</option>
            {genders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>

        {/* 📏 Tallas */}
        {formData.gender && (
          <div className="form-group">
            <label>Tallas disponibles:</label>
            <div className="checkbox-group">
              {sizesByGender[formData.gender].map((size) => (
                <label key={size}>
                  <input
                    type="checkbox"
                    value={size}
                    checked={formData.sizes.includes(size)}
                    onChange={handleSizeChange}
                  />
                  {size}
                </label>
              ))}
            </div>
            <label>
              <input type="checkbox" onChange={handleSelectAllSizes} />{" "}
              Seleccionar todas
            </label>
          </div>
        )}

        {/* 🖼 Imágenes */}
        <div className="form-group">
          <label>Imágenes del producto:</label>
          <input
            type="file"
            name="files"
            onChange={uploadImages}
            multiple
            required
          />
          {loading ? (
            <div className="loader"></div>
          ) : (
            images.length > 0 &&
            images.map((img, index) => (
              <p key={index}>Imagen {index + 1} subida.</p>
            ))
          )}
        </div>

        {/* ✅ Botón de envío */}
        <button type="submit" className="submit-button">
          Crear Producto
        </button>
      </form>

      {/* 🔔 Modal de confirmación */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Producto creado exitosamente.</p>
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProducts;
