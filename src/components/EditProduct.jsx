import { useEffect, useState } from "react";
import { useProducts } from "../ProductsContext";

function EditProduct({ productId }) {
  const { products, fetchProducts } = useProducts();
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === productId);
    if (foundProduct) {
      setProductData({ ...foundProduct });
    }
  }, [productId, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://ls-sneakers-backend.vercel.app/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) throw new Error("Error al actualizar el producto");

      alert("Producto actualizado con éxito");
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar el producto");
    }
  };

  if (!productData) return <p>Cargando producto...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input type="text" name="name" value={productData.name} onChange={handleChange} />
      </label>
      <label>
        Precio:
        <input type="text" name="price" value={productData.price} onChange={handleChange} />
      </label>
      <label>
        Imagen:
        <input type="text" name="imageUrl" value={productData.imageUrl} onChange={handleChange} />
      </label>
      <label>
        Marca:
        <input type="text" name="branch" value={productData.branch} onChange={handleChange} />
      </label>
      <label>
        Género:
        <input type="text" name="gender" value={productData.gender} onChange={handleChange} />
      </label>
      <label>
        En Oferta:
        <input
          type="checkbox"
          name="onSale"
          checked={productData.onSale}
          onChange={(e) => setProductData((prev) => ({ ...prev, onSale: e.target.checked }))}
        />
      </label>
      <button type="submit">Guardar Cambios</button>
    </form>
  );
}

export default EditProduct;
