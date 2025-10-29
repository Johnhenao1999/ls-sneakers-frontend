import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || null);
  const [user, setUser] = useState(
    localStorage.getItem("adminUser")
      ? JSON.parse(localStorage.getItem("adminUser"))
      : null
  );

  const login = async (email, password) => {
    try {
      const response = await fetch("https://ls-sneakers-backend.vercel.app/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        setUser(data.usuario);
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.usuario));
        return true; // ✅ indica que fue exitoso
      } else {
        throw new Error(data.error || "Error en las credenciales");
      }
    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  // Mantener sesión activa al recargar la página
  useEffect(() => {
    const savedToken = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
