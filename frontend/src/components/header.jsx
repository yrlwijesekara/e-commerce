import { Link } from "react-router-dom";
import { BiCart } from "react-icons/bi";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
       <header className="w-full h-auto sm:h-[100px] md:h-[120px] lg:h-[150px] bg-primary text-secondary shadow-md relative z-50">
           <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0">
               {/* Logo or Brand (optional - can add later) */}
               <div className="flex items-center lg:hidden">
                   <button 
                       onClick={() => setIsMenuOpen(!isMenuOpen)}
                       className="text-secondary hover:text-white transition-colors"
                   >
                       {isMenuOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
                   </button>
               </div>

               {/* Desktop Navigation */}
               <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
                   <Link to="/home" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Home
                   </Link>
                   <Link to="/products" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Products
                   </Link>
                   <Link to="/about" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       About
                   </Link>
                   <Link to="/contact" className="text-base xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Contact
                   </Link>
               </nav>

               {/* Right Side - Cart and Auth */}
               <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto">
                   <Link to="/cart" className="hover:text-white hover:scale-110 transition-transform duration-200">
                       <BiCart className="text-2xl sm:text-3xl" />
                   </Link>
                   <Link to="/login" className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Login
                   </Link>
                   <Link to="/register" className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                       Register
                   </Link>
               </div>
           </div>

           {/* Mobile Menu */}
           {isMenuOpen && (
               <nav className="lg:hidden bg-primary border-t border-secondary/20 py-4 absolute w-full z-40 shadow-lg">
                   <div className="flex flex-col gap-3 px-6">
                       <Link 
                           to="/home" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           Home
                       </Link>
                       <Link 
                           to="/products" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           Products
                       </Link>
                       <Link 
                           to="/about" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           About
                       </Link>
                       <Link 
                           to="/contact" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           Contact
                       </Link>
                   </div>
               </nav>
           )}
       </header>
    );
}