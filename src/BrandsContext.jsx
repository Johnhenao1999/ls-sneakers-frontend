import { createContext, useContext, useState, useEffect } from "react";

const BrandsContext = createContext(null);

export const BrandsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Cargar las marcas desde el backend o desde cache
  const fetchBrands = async (force = false) => {
    try {
      // Si ya hay marcas guardadas y no forzamos recarga → usa cache
      if (!force) {
        const cachedBrands = localStorage.getItem("brands");
        if (cachedBrands) {
          setBrands(JSON.parse(cachedBrands));
          setLoadingBrands(false);
          return;
        }
      }

      // Si no hay cache, obtenemos desde el backend
      setLoadingBrands(true);
      const response = await fetch("https://ls-sneakers-backend.vercel.app/api/brands");

      if (!response.ok) throw new Error("Error al obtener marcas");

      const data = await response.json();
      const brandNames = data.map((b) => b.name);

      // Guardamos en estado y en cache local
      setBrands(brandNames);
      localStorage.setItem("brands", JSON.stringify(brandNames));

      setError(null);
    } catch (error) {
      console.error("❌ Error cargando marcas:", error);
      setError("No se pudieron cargar las marcas");
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  };

  // 🚀 Carga inicial
  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <BrandsContext.Provider value={{ brands, loadingBrands, error, fetchBrands }}>
      {children}
    </BrandsContext.Provider>
  );
};

// 🔹 Hook personalizado
export const useBrands = () => useContext(BrandsContext);
