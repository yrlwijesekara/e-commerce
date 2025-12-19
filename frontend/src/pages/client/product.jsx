import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";
import { HiSearch } from "react-icons/hi";

export default function Product() {

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);
const [searchQuery, setSearchQuery] = useState("");
const [filteredProducts, setFilteredProducts] = useState([]);
const [searching, setSearching] = useState(false);


useEffect(() => {
    
    if (loading) {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/')
            .then(response => {
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                    setFilteredProducts(response.data.products);
                } else {
                    setProducts([]);
                    setFilteredProducts([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }
}, [loading]);

useEffect(() => {
    if (searchQuery.trim() === "") {
        setFilteredProducts(products);
        setSearching(false);
        return;
    }

    const debounceTimer = setTimeout(() => {
        setSearching(true);
        axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/search/${encodeURIComponent(searchQuery)}`)
            .then(response => {
                if (response.data && Array.isArray(response.data.products)) {
                    setFilteredProducts(response.data.products);
                } else {
                    setFilteredProducts([]);
                }
                setSearching(false);
            })
            .catch(error => {
                console.error("Error searching products:", error);
                setFilteredProducts([]);
                setSearching(false);
            });
    }, 300);

    return () => clearTimeout(debounceTimer);
}, [searchQuery, products]);

    return (
        loading ? (
            <Loader />
        ) : (
            <div className="w-full min-h-screen bg-gradient-to-br from-[color-mix(in_srgb,var(--color-secondary)_30%,white)] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 md:py-8 lg:py-10">
                {/* Search Bar */}
                <div className="max-w-7xl mx-auto mb-4 sm:mb-6 md:mb-8">
                    <div className="relative">
                        <HiSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl md:text-2xl text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 sm:pl-12 md:pl-14 pr-10 sm:pr-12 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none shadow-sm hover:shadow-md transition-all duration-300"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold text-lg sm:text-xl"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2 ml-1 sm:ml-2">
                        {searching ? (
                            <span className="text-blue-600">Searching...</span>
                        ) : (
                            <>{filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found</>
                        )}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
                        {filteredProducts.length === 0 ? (
                            <div className="col-span-full text-center py-8 sm:py-10 md:py-12">
                                <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-2">
                                    {searching ? 'Searching...' : 'No products found.'}
                                </p>
                                {searchQuery && !searching && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="text-sm sm:text-base text-blue-600 hover:text-blue-700 underline mt-2"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        )
    );
}