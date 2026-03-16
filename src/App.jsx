import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsGentlemen from "./pages/ProductsGentlemen";
import PageDescriptionProduct from "./pages/PageDescriptionProduct";
import ProductsLadies from "./pages/ProductsLadies";
import AdminPanel from "./pages/AdminPanel";
import ProductsChildren from "./pages/ProductsChildren";
import ProductsPromotions from "./pages/Promotions";
import { ProductsProvider } from "./ProductsContext";
import PageEditProduct from "./pages/PageEditProduct";
import { Analytics } from "@vercel/analytics/react";
import AdminHome from "./pages/admin/AdminHome";
import AdminLogin from "./pages/admin/AdminLogin";
import ProductsByGender from "./components/ProductsByGender";
import Orders from "./pages/admin/Orders/Orders";
import { AuthProvider, useAuth } from "./AuthContext";
import { CartProvider } from "./context/CartContext";
import { BrandsProvider } from "./BrandsContext";
import BrandsManager from "./pages/admin/Brands/BrandsManager";
import Settings from "./pages/admin/Settings/Settings";

// 🔒 Rutas protegidas
const PrivateRoute = () => {
  const { user } = useAuth();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

const ConditionalAnalytics = () => {
  const location = useLocation();
  const { pathname } = location;

  // rutas a excluir
  const isExcluded =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/add-product") ||
    pathname.startsWith("/update-product") ||
    pathname.startsWith("/login");

  if (isExcluded) return null;
  return <Analytics />;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductsProvider>
          <Router>
            <BrandsProvider>
              <Routes>
                {/* 🏠 Rutas públicas */}
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/collections/hombre"
                  element={
                    <ProductsByGender
                      title="ZAPATOS PARA HOMBRE"
                      subtitle="Amplio catálogo de zapatos de diferentes marcas con los mejores diseños."
                      category={["Hombre", "Unisex"]}
                    />
                  }
                />

                <Route
                  path="/collections/mujer"
                  element={
                    <ProductsByGender
                      title="ZAPATOS PARA MUJER"
                      subtitle="Amplio catálogo de zapatos de diferentes marcas con los mejores diseños."
                      category={["Mujer", "Unisex"]}
                    />
                  }
                />

                <Route
                  path="/collections/guayos"
                  element={
                    <ProductsByGender
                      title="GUAYOS"
                      subtitle="Amplio catálogo de zapatos de diferentes marcas con los mejores diseños."
                      category={["Guayos"]}
                    />
                  }
                />

                <Route
                  path="/collections/ninos"
                  element={
                    <ProductsByGender
                      title="ZAPATOS PARA NIÑOS"
                      subtitle="Amplio catálogo de zapatos de diferentes marcas con los mejores diseños."
                      category="Niños"
                    />
                  }
                />
                <Route path="/collections/promociones" element={<ProductsPromotions />} />
                <Route
                  path="/collections/:category/:productName"
                  element={<PageDescriptionProduct />}
                />
                <Route path="/login" element={<AdminLogin />} />

                {/* 🔒 Rutas protegidas */}
                <Route element={<PrivateRoute />}>
                  <Route path="/add-product" element={<AdminPanel />} />
                  <Route path="/admin" element={<AdminHome />} />
                  <Route path="/admin/orders" element={<Orders />} />
                  <Route path="/update-product/:id" element={<PageEditProduct />} />
                  <Route path="/admin/brands" element={<BrandsManager />} />
                  <Route path="/admin/settings" element={<Settings />} />
                </Route>
              </Routes>

              {/* 📊 Analytics solo en rutas públicas */}
              <ConditionalAnalytics />
            </BrandsProvider>
          </Router>
        </ProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
