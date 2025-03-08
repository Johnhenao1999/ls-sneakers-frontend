import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsGentlemen from "./pages/ProductsGentlemen";
import PageDescriptionProduct from "./pages/PageDescriptionProduct";
import ProductsLadies from "./pages/ProductsLadies";
import AdminPanel from "./pages/AdminPanel";
import ProductsPromotions from "./pages/Promotions";
import PageViewProducts from "./pages/PageViewProducts";
import { ProductsProvider } from "./ProductsContext"; // Importa el contexto
import PageEditProduct from "./pages/PageEditProduct";
import { Analytics } from "@vercel/analytics/react"; // Importa Analytics
import AdminHome from "./pages/AdminHome";
import AdminLogin from "./pages/AdminLogin";
import { AuthProvider, useAuth } from "./AuthContext"; // Importa autenticación

// 🔒 Componente para proteger rutas privadas
const PrivateRoute = () => {
    const { token } = useAuth();
    return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

function App() {
    return (
        <AuthProvider> {/* Envuelve toda la app con el AuthProvider */}
            <ProductsProvider> {/* Envolver también con el contexto de productos */}
                <Router>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/collections/hombre" element={<ProductsGentlemen />} />
                        <Route path="/collections/mujer" element={<ProductsLadies />} />
                        <Route path="/collections/promociones" element={<ProductsPromotions />} />
                        <Route
                            path="/collections/:category/:productName"
                            element={<PageDescriptionProduct />}
                        />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* 🔒 Rutas protegidas por autenticación */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/admin" element={<AdminHome />} />
                            <Route path="/add-product" element={<AdminPanel />} />
                            <Route path="/update-products" element={<PageViewProducts />} />
                            <Route path="/update-product/:id" element={<PageEditProduct />} />
                        </Route>
                    </Routes>
                </Router>
                <Analytics /> {/* Mantén Analytics en toda la app */}
            </ProductsProvider>
        </AuthProvider>
    );
}

export default App;
