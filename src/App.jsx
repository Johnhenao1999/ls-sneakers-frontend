import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsGentlemen from "./pages/ProductsGentlemen";
import PageDescriptionProduct from "./pages/PageDescriptionProduct";
import ProductsLadies from "./pages/ProductsLadies";
import AdminPanel from "./pages/AdminPanel";
import ProductsPromotions from "./pages/Promotions";
import PageViewProducts from "./pages/PageViewProducts";
import { ProductsProvider } from "../src/ProductsContext"; // Importa el contexto
import PageEditProduct from "./pages/PageEditProduct";
import { Analytics } from "@vercel/analytics/react"; // Importa Analytics

function App() {
    return (
        <ProductsProvider> {/* Envolver todo el Router con el contexto */}
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/add" element={<AdminPanel />} />
                    <Route path="/collections/hombre" element={<ProductsGentlemen />} />
                    <Route path="/collections/mujer" element={<ProductsLadies />} />
                    <Route path="/collections/promociones" element={<ProductsPromotions />} />
                    <Route path="/update-products" element={<PageViewProducts />} />
                    <Route path="/update-product/:id" element={<PageEditProduct />} />
                    <Route
                        path="/collections/:category/:productName"
                        element={<PageDescriptionProduct />}
                    />
                </Routes>
            </Router>
            <Analytics /> {/* Agregar aquí para que cubra toda la app */}
        </ProductsProvider>
    );
}

export default App;
