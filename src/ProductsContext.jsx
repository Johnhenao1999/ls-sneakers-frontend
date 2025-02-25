import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext(null);

const CACHE_KEY = "cachedProducts";
const CACHE_TIME = 30 * 60 * 1000;
const API_URL = "https://ls-sneakers-backend.vercel.app/api/products";

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { products: cachedProducts, timestamp } = JSON.parse(cachedData);
          
          if (Date.now() - timestamp < CACHE_TIME) {
            setProducts(cachedProducts);
            console.log("✅ Usando datos en caché");
            return;
          }
        }

        console.log("🔄 Obteniendo productos del backend...");
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Error al obtener los productos");

        const data = await response.json();
        setProducts(data);

        localStorage.setItem(CACHE_KEY, JSON.stringify({ products: data, timestamp: Date.now() }));
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  const addProduct = (newProduct) => {
    setProducts((prevProducts) => {
      const updatedProducts = [newProduct, ...prevProducts];
      localStorage.setItem(CACHE_KEY, JSON.stringify({ products: updatedProducts, timestamp: Date.now() }));
      return updatedProducts;
    });
  };

  return (
    <ProductsContext.Provider value={{ products, setProducts, addProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

const useProducts = () => useContext(ProductsContext);
export { ProductsProvider, useProducts };
