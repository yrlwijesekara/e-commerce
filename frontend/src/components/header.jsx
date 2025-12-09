import { Link } from "react-router-dom";
import { BiCart } from "react-icons/bi";

export default function Header() {
    return (
       <header className="w-full h-[150px] bg-blue-600 flex items-center justify-center px-4 text-white shadow-md">
              <Link to="/home" className="ml-10 text-xl font-semibold hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               Home
           </Link>
           <Link to="/products" className="ml-10 text-xl font-semibold hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               Products
           </Link>
           
           <Link to="/about" className="ml-10 text-xl font-semibold hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               About
           </Link>
           <Link to="/contact" className="ml-10 text-xl font-semibold hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               Contact
           </Link>
           <Link to="/cart" className="mr-4 ml-auto hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               <BiCart className="text-3xl" ></BiCart>
           </Link>
           <Link to="/login" className="mr-4 text-xl font-semibold hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               Login
           </Link>
           <Link to="/register" className="mr-4 text-xl font-semibold hover:text-gray-300 hover:scale-110 transition-transform duration-200">
               Register
           </Link>
       </header>
    );
}