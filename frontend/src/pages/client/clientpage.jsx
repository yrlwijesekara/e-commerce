import { Routes, Route } from "react-router-dom";
import Header from "../../components/header";
import Product from "./product";
import ProductOverviewPage from "./productoverviewPage";
import CartPage from "./cartpage";
import CheckoutPage from "./checkoutpage";
import Home from "../home";
import NotFound from "./404";


export default function ClientPage() {
    return (
        <div className="w-full h-screen">
            <Header />
            <div className="w-full h-[calc(100%-100px)] ">
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/about" element={<h1>About Us Page</h1>} />
                    <Route path="/contact" element={<h1>Contact Us Page</h1>} />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/overview/:id" element={<ProductOverviewPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    
                </Routes>
            </div>
        </div>
    );
}
     