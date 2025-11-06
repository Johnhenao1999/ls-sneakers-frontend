import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const BrandsContext = createContext(null);

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  // 🔄 Cargar las marcas desde el backend
  const fetchBrands = async () => {
    try {
      setLoadingBrands(true);
      const response = await fetch("https://ls-sneakers-backend.vercel.app/api/brands");

      if (!response.ok) throw new Error("Error al obtener marcas");

      const data = await response.json();
      setBrands(data.map((b) => b.name));
      setError(null);
    } catch (error) {
      console.error("❌ Error cargando marcas:", error);
      setError("No se pudieron cargar las marcas");
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  // 🚀 Solo carga marcas en rutas /admin
  useEffect(() => {
    const isAdminRoute = location.pathname.startsWith("/admin");
    if (isAdminRoute) {
      fetchBrands();
    }
  }, [location.pathname]);

  return (
    <BrandsContext.Provider value={{ brands, loadingBrands, error, fetchBrands }}>
      {children}
    </BrandsContext.Provider>
  );
};

// 🔹 Hook personalizado
export const useBrands = () => useContext(BrandsContext);
