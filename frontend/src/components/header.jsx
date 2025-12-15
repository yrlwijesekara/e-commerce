import { Link, useNavigate } from "react-router-dom";
import { BiCart } from "react-icons/bi";
import { useState, useEffect } from "react";
import { HiMenu, HiX, HiHome, HiShoppingBag, HiInformationCircle, HiMail } from "react-icons/hi";
import { IoLogOut } from "react-icons/io5";
import toast from "react-hot-toast";

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            toast.success("Logged out successfully");
            navigate("/login");
        }
    };

    return (
       <header className="w-full h-auto sm:h-[100px] md:h-[120px] lg:h-[150px] bg-primary text-secondary shadow-md relative z-50 lg:p-8">
           <div className="w-full h-full flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-10 py-4 sm:py-0">
               {/* Mobile Menu Button - Left */}
               <div className="flex items-center lg:hidden">
                   <button 
                       onClick={() => setIsMenuOpen(!isMenuOpen)}
                       className="text-secondary hover:text-white transition-colors"
                   >
                       {isMenuOpen ? <HiX className="text-3xl" /> : <HiMenu className="text-3xl" />}
                   </button>
               </div>

               {/* Logo - Centered on mobile, left on desktop */}
               <Link to="/home" className="absolute left-1/2 -translate-x-1/2 lg:static lg:transform-none flex items-center gap-2 hover:opacity-80 transition-opacity">
                   <img src="/logo.png" alt="Logo" className="w-20 h-20 sm:w-25 sm:h-25 md:w-40 md:h-40 lg:w-60 lg:h-60 xl:pl-20 md:ml-10" />
               </Link>

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
               <div className="flex items-center gap-2 sm:gap-3 md:gap-4 ml-auto lg:ml-0">
                   <Link to="/cart" className="hover:text-white hover:scale-110 transition-transform duration-200">
                       <BiCart className="text-2xl sm:text-3xl" />
                   </Link>
                   {isLoggedIn ? (
                       <button
                           onClick={handleLogout}
                           className="flex items-center gap-2 text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200"
                       >
                           <IoLogOut className="text-xl sm:text-2xl" />
                           <span className="hidden sm:inline">Logout</span>
                       </button>
                   ) : (
                       <>
                           <Link to="/login" className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                               Login
                           </Link>
                           <Link to="/register" className="text-sm sm:text-base md:text-lg xl:text-xl font-semibold hover:text-white hover:scale-110 transition-transform duration-200">
                               Register
                           </Link>
                       </>
                   )}
               </div>
           </div>

           {/* Mobile Menu */}
           {isMenuOpen && (
               <nav className="lg:hidden bg-primary border-t border-secondary/20 py-4 absolute w-full z-40 shadow-lg">
                   <div className="flex flex-col gap-3 px-6">
                       <Link 
                           to="/home" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiHome className="text-2xl" />
                           Home
                       </Link>
                       <Link 
                           to="/products" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiShoppingBag className="text-2xl" />
                           Products
                       </Link>
                       <Link 
                           to="/about" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiInformationCircle className="text-2xl" />
                           About
                       </Link>
                       <Link 
                           to="/contact" 
                           className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3"
                           onClick={() => setIsMenuOpen(false)}
                       >
                           <HiMail className="text-2xl" />
                           Contact
                       </Link>
                       {isLoggedIn && (
                           <button
                               onClick={() => {
                                   handleLogout();
                                   setIsMenuOpen(false);
                               }}
                               className="text-lg font-semibold hover:text-white transition-colors py-2 flex items-center gap-3 text-left border-t border-secondary/20 mt-2 pt-4"
                           >
                               <IoLogOut className="text-2xl" />
                               Logout
                           </button>
                       )}
                   </div>
               </nav>
           )}
       </header>
    );
}