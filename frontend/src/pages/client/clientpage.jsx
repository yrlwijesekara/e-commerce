import { Routes, Route } from "react-router-dom";
import Header from "../../components/header";
import Product from "./product";
import ProductOverviewPage from "./productoverviewPage";
import CartPage from "./cartpage";

export default function ClientPage() {
    return (
        <div className="w-full h-screen mx-h-screen  ">
            <Header />
            <div className="w-full h-[calc(100%-100px)] ">
                <Routes>
                    <Route path="/home" element={<h1>Client Home Page</h1>} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<h1>About Us Page</h1>} />
                    <Route path="/contact" element={<h1>Contact Us Page</h1>} />
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                    <Route path="/overview/:id" element={<ProductOverviewPage />} />
                </Routes>
            </div>
        </div>
    );
}
     