import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext(null);

// 🗃️ Configuración de caché
const CACHE_KEY = "cachedProducts";
const CACHE_TIME = 30 * 60 * 1000; // 30 minutos
const API_URL = "https://ls-sneakers-backend.vercel.app/api/products";

// 📦 Obtener productos de la caché (si sigue vigente)
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

// 💾 Guardar productos en la caché
const saveProductsToCache = (products) => {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ products, timestamp: Date.now() })
  );
};

// 🧹 Limpiar la caché completamente
const clearProductsCache = () => {
  localStorage.removeItem(CACHE_KEY);
  console.log("🧹 Caché de productos limpiada");
};

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔄 Obtener productos desde backend o caché
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const cachedProducts = getCachedProducts();
      if (cachedProducts) {
        setProducts(cachedProducts);
        setLoading(false);
        return;
      }

      console.log("🔄 Obteniendo productos del backend...");
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al obtener los productos");

      const data = await response.json();
      console.log("✅ Productos obtenidos:", data);
      setProducts(data);
      saveProductsToCache(data);
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  // ➕ Agregar producto (limpia cache y recarga)
  const addProduct = async (newProduct) => {
    try {
      clearProductsCache();
      await fetchProducts();
      console.log("✅ Producto agregado y caché actualizada");
    } catch (error) {
      console.error("❌ Error al actualizar productos tras agregar:", error);
    }
  };

  // ✏️ Actualizar producto (limpia cache y recarga)
  const updateProduct = async (updatedProduct) => {
    try {
      clearProductsCache();
      await fetchProducts();
      console.log("✅ Producto actualizado y caché refrescada");
    } catch (error) {
      console.error("❌ Error al actualizar productos:", error);
    }
  };

  // ❌ Eliminar producto (limpia cache y recarga)
  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar el producto");

      clearProductsCache();
      await fetchProducts();
      console.log("✅ Producto eliminado y caché actualizada");
    } catch (error) {
      console.error("❌ Error al eliminar el producto:", error);
    }
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        loading,
        fetchProducts,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

// 🪄 Hook para usar el contexto
const useProducts = () => useContext(ProductsContext);

export { ProductsProvider, useProducts };
