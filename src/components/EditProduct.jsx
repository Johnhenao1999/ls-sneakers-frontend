import { useEffect, useState } from "react";
import { useProducts } from "../ProductsContext";
import "../css/editProduct.css";

function EditProduct({ productId }) {
  const { products, updateProduct } = useProducts();
  const preset_name = 'lsneakersuploadassets';
  const cloud_name = 'dj2v5y8li';
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

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === productId);
    if (foundProduct) {
      setProductData({ ...foundProduct, sizes: foundProduct.sizes || [] });
    }
  }, [productId, products]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      sizes: checked ? [...prev.sizes, value] : prev.sizes.filter((size) => size !== value),
    }));
  };

  const uploadImages = async (e) => {
    const files = e.target.files;
    const uploadedImages = [];

    setLoading(true);
    for (const file of files) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', preset_name);

      try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
          method: 'POST',
          body: data,
        });

        const fileData = await response.json();
        uploadedImages.push(fileData.secure_url);
      } catch (error) {
        console.error('Error al subir la imagen:', error);
      }
    }
    setProductData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...uploadedImages] }));
    setLoading(false);
  };

  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://ls-sneakers-backend.vercel.app/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Error al actualizar el producto");

      alert("Producto actualizado con éxito");
      updateProduct(productData);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el producto");
    }
  };

  if (!productData.name) return <p>Cargando producto...</p>;

  const sizesByGender = {
    Hombre: ["36 HOMBRE", "37 HOMBRE", "38 HOMBRE", "39 HOMBRE", "40 HOMBRE", "41 HOMBRE"],
    Mujer: ["36 MUJER", "37 MUJER", "38 MUJER"],
    Unisex: ["36 MUJER", "37 MUJER", "38 MUJER", "36 HOMBRE", "37 HOMBRE", "38 HOMBRE"],
  };

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
          <input type="number" name="price" value={productData.price} onChange={handleChange} />
        </label>

        <label>
          En Oferta:
          <input
            type="checkbox"
            name="onSale"
            checked={productData.onSale}
            onChange={handleChange}
          />
        </label>

        <label>
          Precio con descuento:
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            disabled={!productData.onSale}
          />
        </label>

        <label>
          Marca:
          <input type="text" name="branch" value={productData.branch} onChange={handleChange} />
        </label>

        <label>
          Género:
          <select name="gender" value={productData.gender} onChange={handleChange}>
            <option value="">Seleccione el género</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
            <option value="Unisex">Unisex</option>
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
              <div key={index} className="image-item">
                <img src={img} alt={`Imagen ${index + 1}`} />
                <button className="delete-button" onClick={() => removeImage(index)}>X</button>
              </div>
            ))}
          </div>
        </label>

        <label>
          Subir nuevas imágenes:
          <input type="file" multiple onChange={uploadImages} />
          {loading && <p>Subiendo imágenes...</p>}
        </label>

        <button type="submit" className="submit-button">Guardar Cambios</button>
      </form>
    </div>
  );
}

export default EditProduct;
