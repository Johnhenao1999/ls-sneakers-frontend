import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext(null);

const CACHE_KEY = "cachedProducts";
const CACHE_TIME = 30 * 60 * 1000;
const API_URL = "https://ls-sneakers-backend.vercel.app/api/products";

// Obtener productos de la caché
const getCachedProducts = () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { products, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_TIME) {
      console.log("✅ Usando datos en caché");
      return products;
    }
  }
  return null;
};

// Guardar productos en la caché
const saveProductsToCache = (products) => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ products, timestamp: Date.now() }));
};

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const cachedProducts = getCachedProducts();
      if (cachedProducts) {
        setProducts(cachedProducts);
        return;
      }

      console.log("🔄 Obteniendo productos del backend...");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los productos");

      const data = await response.json();
      setProducts(data);
      saveProductsToCache(data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => {
      const updatedProducts = [newProduct, ...prevProducts];
      saveProductsToCache(updatedProducts);
      return updatedProducts;
    });
  };

  const updateProduct = (updatedProduct) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product._id === updatedProduct._id ? updatedProduct : product
      );
      saveProductsToCache(updatedProducts);
      return updatedProducts;
    });
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      // Actualizar estado y caché eliminando el producto
      setProducts((prevProducts) => {
        const updatedProducts = prevProducts.filter((product) => product._id !== productId);
        saveProductsToCache(updatedProducts);
        return updatedProducts;
      });

      console.log("✅ Producto eliminado y caché actualizada");
    } catch (error) {
      console.error("❌ Error al eliminar el producto:", error);
    }
  };

  return (
    <ProductsContext.Provider value={{ products, fetchProducts, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => useContext(ProductsContext);
export { ProductsProvider, useProducts };
