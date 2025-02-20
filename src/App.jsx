import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import ProductsGentlemen from "./pages/ProductsGentlemen";
import PageDescriptionProduct from "./pages/PageDescriptionProduct";
import ProductsLadies from "./pages/ProductsLadies";
import AddProducts from "./pages/AdminPanel";

function App() { 
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-products" element={<AddProducts />} />
                <Route path="/collections/caballeros" element={<ProductsGentlemen />} />
                <Route path="/collections/damas" element={<ProductsLadies />} />
                {/* Ruta dinámica para descripción */}
                <Route
                    path="/collections/:category/:productName"
                    element={<PageDescriptionProduct />}
                />
            </Routes>
        </Router>
    );
}

export default App;
