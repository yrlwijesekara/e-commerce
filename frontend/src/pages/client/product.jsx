import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../components/loader";
import ProductCard from "../../components/productCard";
export default function Product() {

const [products, setProducts] = useState([]);
const [loading, setLoading] = useState(true);


useEffect(() => {
    
    if (loading) {
        axios.get(import.meta.env.VITE_BACKEND_URL + '/api/products/')
            .then(response => {
                if (response.data && Array.isArray(response.data.products)) {
                    setProducts(response.data.products);
                } else {
                    setProducts([]);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
    }
}, [loading]);
    return (
        loading ? (
            <Loader />
        ) : (
            <div className="w-full h-auto flex justify-center items-center mt-18">
            <div className=" grid grid-cols-4 gap-6">
                {products.length === 0 ? (
                    <p className="text-lg text-gray-500 col-span-4 text-center">No products found.</p>
                ) : (
                    products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))
                )}
            </div>
            </div>
        )
    );
}