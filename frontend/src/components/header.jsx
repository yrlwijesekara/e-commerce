import { Link } from "react-router-dom";
import { BiCart } from "react-icons/bi";

export default function Header() {
    return (
       <header className="w-full h-[100px] bg-blue-600 flex items-center justify-center px-4 text-white shadow-md">
              <Link to="/home" className="ml-10 hover:text-gray-300">
               Home
           </Link>
           <Link to="/products" className="ml-10 hover:text-gray-300">
               Products
           </Link>
           
           <Link to="/about" className="ml-10 hover:text-gray-300">
               About
           </Link>
           <Link to="/contact" className="ml-10 hover:text-gray-300">
               Contact
           </Link>
           <Link to="/cart" className="mr-4 ml-auto hover:text-gray-300">
               <BiCart className="text-2xl" ></BiCart>
           </Link>
           <Link to="/login" className="mr-4 hover:text-gray-300">
               Login
           </Link>
           <Link to="/register" className="hover:text-gray-300">
               Register
           </Link>
       </header>
    );
}