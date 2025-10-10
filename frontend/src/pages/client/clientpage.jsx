import { Routes, Route } from "react-router-dom";
import Header from "../../components/header";
export default function ClientPage() {    
    return (
        <div className="w-full h-screen mx-h-screen bg-yellow-100 ">
            <Header />
            <div className="w-full h-[calc(100%-100px)] flex justify-center items-center">
                <Routes>
                    <Route path="/home" element={<h1>Client Home Page</h1>} />
                    <Route path="/products" element={<h1>Products Page</h1>} />
                    <Route path="/cart" element={<h1>Cart Page</h1>} />
                    <Route path="/about" element={<h1>About Us Page</h1>} />
                    <Route path="/contact" element={<h1>Contact Us Page</h1>} />
                    <Route path="*" element={<h1>404 - Page Not Found</h1>} />
                </Routes>
            </div>
        </div>
    );
}
     