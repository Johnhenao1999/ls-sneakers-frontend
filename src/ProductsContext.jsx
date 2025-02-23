import { createContext, useContext, useState, useEffect } from "react";

const ProductsContext = createContext(null);

const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://ls-sneakers-backend.vercel.app/api/products");
        if (!response.ok) throw new Error("Error al obtener los productos");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

// Asegurar exportaciones consistentes
const useProducts = () => useContext(ProductsContext);

export { ProductsProvider, useProducts };
 