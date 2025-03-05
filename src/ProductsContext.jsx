import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext(null);

const CACHE_KEY = "cachedProducts";
const CACHE_TIME = 30 * 60 * 1000;
const API_URL = "https://ls-sneakers-backend.vercel.app/api/products";

const getCachedProducts = () => {
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const { products, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < CACHE_TIME) {
      console.log("✅ Usando datos en caché");
      console.log("🕒 Tiempo restante:", (CACHE_TIME - (Date.now() - timestamp)) / 1000, "segundos");
      console.log("📦 Productos en caché:", products);
      return products;
    }
  }
  return null;
};

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

  return (
    <ProductsContext.Provider value={{ products, fetchProducts, addProduct, updateProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => useContext(ProductsContext);
export { ProductsProvider, useProducts };
