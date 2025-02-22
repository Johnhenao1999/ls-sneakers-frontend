import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsGentlemen from "./pages/ProductsGentlemen";
import PageDescriptionProduct from "./pages/PageDescriptionProduct";
import ProductsLadies from "./pages/ProductsLadies";
import AdminPanel from "./pages/AdminPanel";
import ProductsPromotions from "./pages/Promotions";

function App() { 
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AdminPanel />} />
                <Route path="/collections/hombre" element={<ProductsGentlemen />} />
                <Route path="/collections/mujer" element={<ProductsLadies />} />
                <Route path="/collections/promociones" element={<ProductsPromotions />} />
                <Route
                    path="/collections/:category/:productName"
                    element={<PageDescriptionProduct />}
                />
            </Routes>
        </Router>
    );
}

export default App;
