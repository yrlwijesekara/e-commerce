import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import AddProduct from "./addproduct";

export default function ProductsAdmin() {
    return (
        <div className="w-full h-full flex  items-center">
            <Link to="/admin/Add-Product" className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 mb-5 fixed bottom-5 right-5 shadow-2xl">
                <FaPlus /> </Link>

        </div>
    );
}